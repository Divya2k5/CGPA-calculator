import {
  extractJsonPayload,
  extractSubjectsFromText,
  looksLikeMarksheet,
  normalizeMarksheetData,
  VALID_GRADES,
} from "../src/utils/marksheetParsing.js";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const SUPPORTED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function getBody(req) {
  if (req.body && typeof req.body === "object") {
    return Promise.resolve(req.body);
  }

  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function extractGeminiText(responseJson) {
  const candidates = Array.isArray(responseJson?.candidates) ? responseJson.candidates : [];
  return candidates
    .flatMap((candidate) => (Array.isArray(candidate?.content?.parts) ? candidate.content.parts : []))
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("\n")
    .trim();
}

function parseGeminiPayload(text, expectedSubjects) {
  const parsed = extractJsonPayload(text);
  if (Array.isArray(parsed)) {
    return normalizeMarksheetData({ subjects: parsed }, expectedSubjects);
  }

  if (Array.isArray(parsed?.subjects)) {
    return normalizeMarksheetData({ subjects: parsed.subjects }, expectedSubjects);
  }

  return normalizeMarksheetData(parsed, expectedSubjects);
}

function normalizeMimeType(value) {
  const normalized = String(value || "").toLowerCase().trim();
  if (normalized === "image/jpg") return "image/jpeg";
  return normalized;
}

function sanitizeBase64(value) {
  return String(value || "")
    .replace(/^data:[^;]+;base64,/i, "")
    .replace(/\s+/g, "");
}

function isValidBase64(value) {
  if (!value || value.length % 4 !== 0) {
    return false;
  }

  return /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

function extractGeminiError(rawText) {
  try {
    const parsed = JSON.parse(rawText);
    const message = parsed?.error?.message;
    return typeof message === "string" && message.trim() ? message.trim() : rawText;
  } catch {
    return rawText;
  }
}

function buildPrompt({ ocrText, expectedSubjects }) {
  const expectedList = Array.isArray(expectedSubjects)
    ? expectedSubjects
        .map((subject) => `${subject.code}: ${subject.name}`)
        .join("\n")
    : "";

  return [
    "Extract Anna University marksheet subjects into strict JSON.",
    "Return only valid JSON with this shape:",
    '{"subjects":[{"code":"","name":"","grade":""}]}',
    `Allowed grades: ${VALID_GRADES.join(", ")}`,
    "Rules:",
    "- Do not include markdown or explanation.",
    "- Only include subjects with a confident final grade.",
    "- Correct common OCR mistakes in subject codes and grades.",
    "- Prefer the expected subject list when OCR is noisy.",
    "- If nothing is readable, return {\"subjects\":[]}.",
    expectedList ? `Expected subjects for this semester:\n${expectedList}` : "",
    `OCR text:\n${ocrText || ""}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function callGemini({ apiKey, imageBase64, mimeType, ocrText, expectedSubjects }) {
  const prompt = buildPrompt({ ocrText, expectedSubjects });
  const parts = [{ text: prompt }];

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: mimeType || "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(extractGeminiError(rawText) || `Gemini request failed with ${response.status}`);
  }

  const json = rawText ? JSON.parse(rawText) : {};
  const text = extractGeminiText(json);
  return {
    text,
    data: parseGeminiPayload(text, expectedSubjects),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const hint = process.env.VITE_GEMINI_API_KEY
      ? " Move the Gemini key from VITE_GEMINI_API_KEY to GEMINI_API_KEY."
      : "";
    return sendJson(res, 500, { error: `Server OCR is not configured.${hint}` });
  }

  let body;
  try {
    body = await getBody(req);
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON payload." });
  }

  const imageBase64 = sanitizeBase64(typeof body?.imageBase64 === "string" ? body.imageBase64 : "");
  const mimeType = normalizeMimeType(typeof body?.mimeType === "string" ? body.mimeType : "image/jpeg");
  const ocrText = typeof body?.ocrText === "string" ? body.ocrText : "";
  const expectedSubjects = Array.isArray(body?.expectedSubjects) ? body.expectedSubjects : [];

  if (!imageBase64 && !ocrText) {
    return sendJson(res, 400, { error: "Image or OCR text is required." });
  }

  if (imageBase64 && !SUPPORTED_MIME_TYPES.has(mimeType)) {
    return sendJson(res, 400, { error: "Unsupported image type. Use JPG, PNG, or WEBP." });
  }

  if (imageBase64 && !isValidBase64(imageBase64)) {
    return sendJson(res, 400, { error: "Image data is not valid base64." });
  }

  const fallbackData = normalizeMarksheetData(
    {
      subjects: extractSubjectsFromText(ocrText, expectedSubjects),
    },
    expectedSubjects
  );

  try {
    const gemini = await callGemini({
      apiKey,
      imageBase64,
      mimeType,
      ocrText,
      expectedSubjects,
    });

    const data = looksLikeMarksheet(gemini.data) ? gemini.data : fallbackData;
    if (!looksLikeMarksheet(data)) {
      return sendJson(res, 422, { error: "No valid subjects were extracted." });
    }

    return sendJson(res, 200, {
      data: {
        subjects: data.subjects,
      },
      meta: {
        source: looksLikeMarksheet(gemini.data) ? "gemini" : "ocr-fallback",
        model: DEFAULT_MODEL,
      },
    });
  } catch (error) {
    if (looksLikeMarksheet(fallbackData)) {
      return sendJson(res, 200, {
        data: {
          subjects: fallbackData.subjects,
        },
        meta: {
          source: "ocr-fallback",
          warning: "Gemini parsing failed; using OCR fallback.",
        },
      });
    }

    return sendJson(res, 502, {
      error: "Extraction request failed.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
