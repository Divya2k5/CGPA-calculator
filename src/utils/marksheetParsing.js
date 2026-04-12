export const VALID_GRADES = ["O", "A+", "A", "B+", "B", "C", "RA", "U/A", "WH", "SA", "AB"];

const GRADE_ALIASES = new Map([
  ["0", "O"],
  ["O", "O"],
  ["D", "O"],
  ["Q", "O"],
  ["A+", "A+"],
  ["A +", "A+"],
  ["A", "A"],
  ["B+", "B+"],
  ["B +", "B+"],
  ["B", "B"],
  ["C", "C"],
  ["RA", "RA"],
  ["R A", "RA"],
  ["R4", "RA"],
  ["U/A", "U/A"],
  ["UA", "U/A"],
  ["U A", "U/A"],
  ["WH", "WH"],
  ["SA", "SA"],
  ["AB", "AB"],
  ["A8", "AB"],
]);

const SUBJECT_CODE_PATTERN = /\b[A-Z]{2,4}\s*\d{3,4}[A-Z]?\b/g;
const GRADE_PATTERN = /(?<![A-Za-z0-9])(?:A\+|A\s*\+|B\+|B\s*\+|U\/A|U\s*\/\s*A|RA|R\s*A|WH|SA|AB|O|0|A|B|C)(?![A-Za-z0-9])/g;

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeGrade(value) {
  const raw = cleanString(value).toUpperCase();
  if (!raw) return "";

  const compact = raw.replace(/\s+/g, " ").trim();
  const collapsed = compact.replace(/\s+/g, "");

  return (
    GRADE_ALIASES.get(compact) ||
    GRADE_ALIASES.get(collapsed) ||
    GRADE_ALIASES.get(compact.replace(/[|]/g, "/")) ||
    ""
  );
}

export function normalizeSubjectCode(value) {
  const raw = cleanString(value).toUpperCase();
  if (!raw) return "";

  const compact = raw.replace(/[^A-Z0-9]/g, "");
  if (!compact) return "";

  return compact
    .replace(/([A-Z]{2,4})O(?=\d{3})/g, (_, prefix) => `${prefix}0`)
    .replace(/([A-Z]{2,4})(\d{2})O(?=\d)/g, (_, prefix, digits) => `${prefix}${digits}0`)
    .replace(/([A-Z]{2,4})(\d{3})O$/g, (_, prefix, digits) => `${prefix}${digits}0`);
}

export function normalizeSubjectName(value) {
  return cleanString(value)
    .replace(/[_|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeNameKey(value) {
  return normalizeSubjectName(value)
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\b(?:AND|OF|THE|LABORATORY|LAB)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value) {
  return new Set(normalizeNameKey(value).split(" ").filter(Boolean));
}

function scoreNameMatch(left, right) {
  const leftTokens = tokenSet(left);
  const rightTokens = tokenSet(right);

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      overlap += 1;
    }
  }

  return overlap / Math.max(leftTokens.size, rightTokens.size);
}

function tryParseJsonSegment(source, startChar, endChar) {
  const startIndex = source.indexOf(startChar);
  if (startIndex === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === startChar) {
      depth += 1;
    } else if (char === endChar) {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(source.slice(startIndex, index + 1));
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

export function extractJsonPayload(text) {
  const source = cleanString(text);
  if (!source) return null;

  const fenced = source.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(fenced);
  } catch {
    const firstBrace = fenced.indexOf("{");
    const firstBracket = fenced.indexOf("[");

    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      return tryParseJsonSegment(fenced, "[", "]") || tryParseJsonSegment(fenced, "{", "}") || null;
    }

    return tryParseJsonSegment(fenced, "{", "}") || tryParseJsonSegment(fenced, "[", "]") || null;
  }
}

function subjectFromExpected(code, expectedSubjects) {
  const normalizedCode = normalizeSubjectCode(code);
  if (!normalizedCode) return null;

  return expectedSubjects.find(
    (subject) => normalizeSubjectCode(subject.code) === normalizedCode
  ) || null;
}

export function normalizeExtractedSubject(subject, expectedSubjects = []) {
  if (!subject || typeof subject !== "object") {
    return null;
  }

  const code = normalizeSubjectCode(subject.code);
  const grade = normalizeGrade(subject.grade);
  const fallback = subjectFromExpected(code, expectedSubjects);
  const name = normalizeSubjectName(subject.name || fallback?.name || "");

  if (!grade || (!code && !name)) {
    return null;
  }

  return {
    code: code || normalizeSubjectCode(fallback?.code),
    name,
    grade,
  };
}

export function normalizeMarksheetData(input, expectedSubjects = []) {
  const payload = input && typeof input === "object" ? input : {};
  const rawSubjects = Array.isArray(payload.subjects) ? payload.subjects : [];
  const seen = new Set();

  const subjects = rawSubjects
    .map((subject) => normalizeExtractedSubject(subject, expectedSubjects))
    .filter(Boolean)
    .filter((subject) => {
      const key = `${subject.code}|${subject.name}|${subject.grade}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return {
    studentName: normalizeSubjectName(payload.studentName || ""),
    registerNumber: cleanString(payload.registerNumber || ""),
    semester: cleanString(payload.semester || ""),
    subjects,
  };
}

export function extractSubjectsFromText(text, expectedSubjects = []) {
  const lines = cleanString(text)
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const matches = [];
  const seen = new Set();

  const normalizedLines = lines.map((line) => ({
    raw: line,
    upper: line.toUpperCase(),
  }));

  for (let index = 0; index < normalizedLines.length; index += 1) {
    const current = normalizedLines[index];
    const codeMatch = current.upper.match(SUBJECT_CODE_PATTERN);

    if (!codeMatch?.length) {
      continue;
    }

    for (const matchedCode of codeMatch) {
      const code = normalizeSubjectCode(matchedCode);
      if (!code) {
        continue;
      }

      const windowLines = normalizedLines
        .slice(index, index + 3)
        .map((entry) => entry.raw);
      const windowText = windowLines.join(" ");
      const windowUpper = windowText.toUpperCase();
      const gradeMatches = windowUpper.match(GRADE_PATTERN) || [];
      const grade = normalizeGrade(gradeMatches[gradeMatches.length - 1] || "");
      const expectedSubject = subjectFromExpected(code, expectedSubjects);

      let name = normalizeSubjectName(
        windowText
          .replace(new RegExp(matchedCode, "ig"), " ")
          .replace(GRADE_PATTERN, " ")
          .replace(/\s+/g, " ")
          .trim()
      );

      if ((!name || name.length < 4) && expectedSubject?.name) {
        name = normalizeSubjectName(expectedSubject.name);
      }

      if (!grade) {
        continue;
      }

      const key = `${code}|${grade}`;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      matches.push({
        code,
        name,
        grade,
      });
    }
  }

  if (matches.length === 0 && expectedSubjects.length > 0) {
    const upperText = lines.join(" ").toUpperCase();
    for (const subject of expectedSubjects) {
      const code = normalizeSubjectCode(subject.code);
      if (!code || !upperText.includes(code)) {
        continue;
      }

      const subjectIndex = upperText.indexOf(code);
      const nearbyText = upperText.slice(subjectIndex, subjectIndex + 120);
      const gradeMatches = nearbyText.match(GRADE_PATTERN) || [];
      const grade = normalizeGrade(gradeMatches[gradeMatches.length - 1] || "");

      if (!grade) {
        continue;
      }

      const key = `${code}|${grade}`;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      matches.push({
        code,
        name: normalizeSubjectName(subject.name),
        grade,
      });
    }
  }

  return matches;
}

export function matchExtractedSubjectsToSemester(extractedSubjects, semesterSubjects) {
  const usedIndexes = new Set();
  const applied = semesterSubjects.map((subject) => ({ ...subject }));
  let matchedCount = 0;

  for (const extracted of extractedSubjects) {
    const normalized = normalizeExtractedSubject(extracted, semesterSubjects);
    if (!normalized?.grade) {
      continue;
    }

    let bestIndex = -1;

    if (normalized.code) {
      bestIndex = applied.findIndex(
        (subject, index) =>
          !usedIndexes.has(index) &&
          normalizeSubjectCode(subject.code) === normalized.code
      );
    }

    if (bestIndex === -1 && normalized.name) {
      let bestScore = 0;

      applied.forEach((subject, index) => {
        if (usedIndexes.has(index)) {
          return;
        }

        const score = scoreNameMatch(normalized.name, subject.name);
        if (score > bestScore) {
          bestScore = score;
          bestIndex = score >= 0.6 ? index : bestIndex;
        }
      });
    }

    if (bestIndex === -1) {
      continue;
    }

    usedIndexes.add(bestIndex);
    applied[bestIndex] = {
      ...applied[bestIndex],
      grade: normalized.grade,
    };
    matchedCount += 1;
  }

  return {
    subjects: applied,
    matchedCount,
    unmatchedCount: Math.max(applied.length - matchedCount, 0),
  };
}

export function looksLikeMarksheet(data) {
  return Array.isArray(data?.subjects) && data.subjects.length > 0;
}
