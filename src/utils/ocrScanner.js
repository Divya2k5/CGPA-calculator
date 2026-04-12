import { createWorker } from "tesseract.js";
import {
  extractSubjectsFromText,
  looksLikeMarksheet,
  normalizeMarksheetData,
} from "./marksheetParsing.js";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_DIMENSION = 2200;
const JPEG_QUALITY = 0.9;

function normalizeMimeType(type) {
  const normalized = String(type || "").toLowerCase().trim();
  if (normalized === "image/jpg") return "image/jpeg";
  if (["image/jpeg", "image/png"].includes(normalized)) {
    return normalized;
  }
  return "image/jpeg";
}

function emitProgress(onProgress, progress, stage) {
  if (typeof onProgress === "function") {
    onProgress({ progress, stage });
  }
}

function fileMatchesAllowedType(file) {
  if (!file) return false;
  if (ACCEPTED_TYPES.includes(file.type)) return true;

  const name = String(file.name || "").toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].some((ext) => name.endsWith(ext));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image preview could not be generated."));
    image.src = dataUrl;
  });
}

function dataUrlToBase64(dataUrl) {
  return String(dataUrl || "")
    .replace(/^data:[^;]+;base64,/i, "")
    .replace(/\s+/g, "");
}

async function preprocessImage(file) {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const largestSide = Math.max(image.width, image.height);
  const targetMimeType = normalizeMimeType(file.type);
  const shouldResize =
    largestSide > MAX_DIMENSION ||
    file.size > 4 * 1024 * 1024 ||
    targetMimeType !== String(file.type || "").toLowerCase().trim();

  if (!shouldResize) {
    return {
      dataUrl: originalDataUrl,
      mimeType: targetMimeType,
    };
  }

  const scale = Math.min(1, MAX_DIMENSION / largestSide);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    return {
      dataUrl: originalDataUrl,
      mimeType: targetMimeType,
    };
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return {
    dataUrl: canvas.toDataURL("image/jpeg", JPEG_QUALITY),
    mimeType: "image/jpeg",
  };
}

async function runTesseractOCR(imageSource, onProgress) {
  const worker = await createWorker("eng", 1, {
    logger: (message) => {
      if (message.status === "recognizing text") {
        emitProgress(onProgress, 15 + Math.round((message.progress || 0) * 45), "Reading text from the marksheet");
      }
    },
  });

  try {
    emitProgress(onProgress, 15, "Starting OCR");
    const { data } = await worker.recognize(imageSource);
    return String(data?.text || "").trim();
  } finally {
    await worker.terminate();
  }
}

export async function validateMarksheet(imageFile) {
  if (!imageFile) {
    return { valid: false, reason: "No file selected." };
  }

  if (!fileMatchesAllowedType(imageFile)) {
    return {
      valid: false,
      reason: "Unsupported image format. Upload a JPG, JPEG, PNG, WEBP, or screenshot image.",
    };
  }

  if (imageFile.size < 5000) {
    return {
      valid: false,
      reason: "Image too small. Upload a full screenshot or a clearer marksheet photo.",
    };
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      reason: "Image too large. Upload an image smaller than 12 MB.",
    };
  }

  return { valid: true, reason: null };
}

export function checkIfMarksheet(data) {
  if (!looksLikeMarksheet(data)) {
    return {
      valid: false,
      reason: "No valid subjects were detected from this image. Upload a clearer result screenshot with the full subject table visible.",
    };
  }

  return { valid: true, reason: null };
}

export async function scanMarksheet(imageFile, options = {}) {
  const { onProgress, expectedSubjects = [] } = options;

  emitProgress(onProgress, 5, "Preparing image");
  const prepared = await preprocessImage(imageFile);
  const previewUrl = prepared.dataUrl;

  const ocrText = await runTesseractOCR(prepared.dataUrl, onProgress);
  if (!ocrText) {
    throw new Error("EMPTY_OCR: No readable text was found in the image.");
  }

  emitProgress(onProgress, 70, "Structuring the OCR result");

  let response;
  const imageBase64 = dataUrlToBase64(prepared.dataUrl);
  try {
    response = await fetch("/api/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64,
        mimeType: normalizeMimeType(prepared.mimeType),
        ocrText,
        expectedSubjects,
      }),
    });
  } catch {
    throw new Error("NETWORK_ERROR: Could not reach the extraction service.");
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`API_ERROR: ${payload?.error || payload?.details || "Extraction request failed."}`);
  }

  const responseData = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  const data = normalizeMarksheetData(responseData, expectedSubjects);
  const fallbackSubjects = extractSubjectsFromText(ocrText, expectedSubjects);
  const finalData = looksLikeMarksheet(data)
    ? data
    : normalizeMarksheetData({ subjects: fallbackSubjects }, expectedSubjects);

  if (!looksLikeMarksheet(finalData)) {
    throw new Error("INVALID_RESPONSE: No valid subjects were extracted.");
  }

  emitProgress(onProgress, 100, "Extraction complete");

  return {
    data: finalData,
    ocrText,
    previewUrl,
    meta: payload?.meta || { source: "ocr-fallback" },
  };
}
