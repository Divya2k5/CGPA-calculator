const SUBJECTS_DATA_URL = "/subjects-data.js";

let subjectCatalogPromise = null;
let subjectCatalogCache = null;

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(value) {
  return normalizeText(value)
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s*&\s*/g, " & ");
}

function normalizeCode(value) {
  return normalizeText(value).toUpperCase().replace(/\s+/g, "");
}

function normalizeCredits(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeType(value) {
  const type = normalizeText(value).toLowerCase();
  if (type === "laboratory") return "lab";
  if (type === "project" || type === "elective" || type === "audit" || type === "lab") return type;
  return "theory";
}

function parseSemesterNumber(label) {
  const match = normalizeText(label).match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function normalizeSubject(subject) {
  if (!subject || typeof subject !== "object") {
    return null;
  }

  const code = normalizeCode(subject.code);
  const name = normalizeName(subject.name);

  if (!code && !name) {
    return null;
  }

  return {
    code,
    name,
    credits: normalizeCredits(subject.credits),
    type: normalizeType(subject.type),
  };
}

function normalizeSemester(departmentCode, departmentLabel, semesterLabel, subjects) {
  const semesterNumber = parseSemesterNumber(semesterLabel);
  const cleanSubjects = Array.isArray(subjects)
    ? subjects.map(normalizeSubject).filter(Boolean)
    : [];

  return {
    department: departmentCode,
    departmentLabel,
    semester: semesterNumber ?? normalizeText(semesterLabel),
    semesterLabel: normalizeText(semesterLabel),
    subjects: cleanSubjects,
  };
}

function normalizeDepartment(departmentCode, departmentData) {
  const label = normalizeName(departmentData?.label || departmentCode);
  const shortLabel = normalizeName(departmentData?.shortLabel || departmentCode);
  const semesterEntries = Object.entries(departmentData?.semesters || {})
    .map(([semesterLabel, subjects]) => normalizeSemester(departmentCode, label, semesterLabel, subjects))
    .sort((left, right) => {
      const leftValue = Number(left.semester);
      const rightValue = Number(right.semester);

      if (Number.isFinite(leftValue) && Number.isFinite(rightValue)) {
        return leftValue - rightValue;
      }

      return String(left.semester).localeCompare(String(right.semester));
    });

  return {
    department: departmentCode,
    label,
    shortLabel,
    semesterCount: semesterEntries.length || Number(departmentData?.semesterCount) || 0,
    semesters: Object.fromEntries(semesterEntries.map((entry) => [entry.semester, entry])),
    semesterList: semesterEntries,
    hasBundledSubjects: semesterEntries.some((entry) => entry.subjects.length > 0),
  };
}

export function normalizeSubjectCatalog(rawCatalog = {}) {
  const departments = Object.fromEntries(
    Object.entries(rawCatalog || {}).map(([departmentCode, departmentData]) => [
      departmentCode,
      normalizeDepartment(departmentCode, departmentData),
    ]),
  );

  return {
    source: SUBJECTS_DATA_URL,
    departments,
    semesterRecords: Object.values(departments).flatMap((department) => department.semesterList),
  };
}

function loadSubjectsScript(forceReload = false) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Subject data can only be loaded in the browser."));
      return;
    }

    if (window.MCE_SUBJECTS && !forceReload) {
      resolve(window.MCE_SUBJECTS);
      return;
    }

    const existingScript = document.querySelector('script[data-subjects-data="true"]');
    if (forceReload && existingScript) {
      existingScript.remove();
    }

    if (forceReload) {
      delete window.MCE_SUBJECTS;
    }

    const script = document.createElement("script");
    script.src = SUBJECTS_DATA_URL;
    script.async = true;
    script.dataset.subjectsData = "true";
    script.onload = () => {
      if (window.MCE_SUBJECTS) {
        resolve(window.MCE_SUBJECTS);
        return;
      }

      reject(new Error("Subject data loaded, but no curriculum was exposed."));
    };
    script.onerror = () => {
      reject(new Error("Failed to load subject data from /subjects-data.js."));
    };

    document.head.appendChild(script);
  });
}

export async function loadSubjectCatalog(options = {}) {
  const forceReload = Boolean(options.forceReload);

  if (subjectCatalogCache && !forceReload) {
    return subjectCatalogCache;
  }

  if (subjectCatalogPromise && !forceReload) {
    return subjectCatalogPromise;
  }

  subjectCatalogPromise = loadSubjectsScript(forceReload)
    .then((rawCatalog) => {
      subjectCatalogCache = normalizeSubjectCatalog(rawCatalog);
      return subjectCatalogCache;
    })
    .catch((error) => {
      subjectCatalogPromise = null;
      throw error;
    });

  return subjectCatalogPromise;
}

export function getDepartmentOptions(catalog, regulation) {
  if (regulation !== "2021") {
    return [];
  }

  return Object.values(catalog?.departments || {})
    .map((department) => ({
      value: department.department,
      label: department.label,
      shortLabel: department.shortLabel,
      semesterCount: department.semesterCount,
      hasBundledSubjects: department.hasBundledSubjects,
    }));
}

export function getDepartmentConfig(catalog, regulation, department) {
  if (regulation !== "2021") {
    return null;
  }

  return catalog?.departments?.[department] || null;
}

export function getSemesterOptions(catalog, regulation, department) {
  const semesterList = getDepartmentConfig(catalog, regulation, department)?.semesterList || [];
  return semesterList.map((entry) => entry.semester);
}

export function getSemesterSubjects(catalog, regulation, department, semester) {
  return getDepartmentConfig(catalog, regulation, department)?.semesters?.[semester]?.subjects || [];
}
