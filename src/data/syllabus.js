const ECE_2021_SUBJECTS = {
  1: [
    { code: "HS3151", name: "Professional English - I", credits: 4, type: "theory" },
    { code: "MA3151", name: "Matrices and Calculus", credits: 4, type: "theory" },
    { code: "PH3151", name: "Engineering Physics", credits: 3, type: "theory" },
    { code: "CY3151", name: "Engineering Chemistry", credits: 3, type: "theory" },
    { code: "GE3151", name: "Problem Solving and Python Programming", credits: 3, type: "theory" },
    { code: "GE3171", name: "Problem Solving and Python Programming Laboratory", credits: 1, type: "lab" },
    { code: "BS3171", name: "Physics and Chemistry Laboratory", credits: 1, type: "lab" },
  ],
  2: [
    { code: "HS3251", name: "Professional English - II", credits: 4, type: "theory" },
    { code: "MA3251", name: "Statistics and Numerical Methods", credits: 4, type: "theory" },
    { code: "PH3254", name: "Physics for Electronics Engineering", credits: 3, type: "theory" },
    { code: "BE3254", name: "Electrical and Instrumentation Engineering", credits: 3, type: "theory" },
    { code: "GE3271", name: "Engineering Practices Laboratory", credits: 1, type: "lab" },
    { code: "EC3271", name: "Circuits Analysis Laboratory", credits: 1, type: "lab" },
  ],
  3: [
    { code: "MA3355", name: "Random Processes and Linear Algebra", credits: 4, type: "theory" },
    { code: "CS3353", name: "C Programming and Data Structures", credits: 3, type: "theory" },
    { code: "EC3353", name: "Electronic Devices and Circuits", credits: 4, type: "theory" },
    { code: "GE3361", name: "Professional Development", credits: 3, type: "theory" },
    { code: "EC3361", name: "Electronic Devices and Circuits Laboratory", credits: 1, type: "lab" },
    { code: "CS3362", name: "C Programming and Data Structures Laboratory", credits: 1, type: "lab" },
  ],
  4: [
    { code: "EC3452", name: "Electromagnetic Fields", credits: 4, type: "theory" },
    { code: "EC3401", name: "Networks and Security", credits: 4, type: "theory" },
    { code: "EC3451", name: "Linear Integrated Circuits", credits: 4, type: "theory" },
    { code: "EC3492", name: "Digital Signal Processing", credits: 4, type: "theory" },
    { code: "EC3491", name: "Communication Systems", credits: 4, type: "theory" },
    { code: "GE3451", name: "Environmental Sciences and Sustainability", credits: 3, type: "theory" },
    { code: "EC3461", name: "Communication Systems Laboratory", credits: 1, type: "lab" },
    { code: "EC3462", name: "Linear Integrated Circuits Laboratory", credits: 1, type: "lab" },
  ],
  5: [
    { code: "EC3501", name: "Wireless Communication", credits: 3, type: "theory" },
    { code: "EC3552", name: "VLSI and Chip Design", credits: 3, type: "theory" },
    { code: "EC3551", name: "Transmission Lines and RF Systems", credits: 3, type: "theory" },
    { code: "PE1", name: "Professional Elective I", credits: 3, type: "theory" },
    { code: "OE1", name: "Open Elective I", credits: 3, type: "theory" },
    { code: "EC3561", name: "VLSI Laboratory", credits: 1, type: "lab" },
  ],
  6: [
    { code: "ET3491", name: "Embedded Systems and IoT Design", credits: 3, type: "theory" },
    { code: "CS3491", name: "Artificial Intelligence and Machine Learning", credits: 3, type: "theory" },
    { code: "PE2", name: "Professional Elective II", credits: 3, type: "theory" },
    { code: "PE3", name: "Professional Elective III", credits: 3, type: "theory" },
    { code: "OE2", name: "Open Elective II", credits: 3, type: "theory" },
  ],
  7: [
    { code: "GE3791", name: "Human Values and Ethics", credits: 2, type: "theory" },
    { code: "EC3711", name: "Summer Internship", credits: 1, type: "theory" },
    { code: "PE4", name: "Professional Elective IV", credits: 3, type: "theory" },
    { code: "PE5", name: "Professional Elective V", credits: 3, type: "theory" },
    { code: "PE6", name: "Professional Elective VI", credits: 3, type: "theory" },
    { code: "OE3", name: "Open Elective III", credits: 3, type: "theory" },
  ],
  8: [
    { code: "EC3811", name: "Project Work / Internship", credits: 10, type: "theory" },
  ],
};

function createDepartment({ label, shortLabel, semesterCount, semesters = {} }) {
  return {
    label,
    shortLabel,
    semesterCount,
    semesters,
    hasBundledSubjects: Object.keys(semesters).length > 0,
  };
}

export const CURRICULUM = {
  "2021": {
    CSE: createDepartment({
      label: "B.E. Computer Science and Engineering",
      shortLabel: "CSE",
      semesterCount: 8,
    }),
    AIML: createDepartment({
      label: "B.E. Artificial Intelligence and Machine Learning",
      shortLabel: "AI & ML",
      semesterCount: 8,
    }),
    IT: createDepartment({
      label: "B.Tech. Information Technology",
      shortLabel: "IT",
      semesterCount: 8,
    }),
    AIDS: createDepartment({
      label: "B.Tech. Artificial Intelligence and Data Science",
      shortLabel: "AI & DS",
      semesterCount: 8,
    }),
    ECE: createDepartment({
      label: "B.E. Electronics and Communication Engineering",
      shortLabel: "ECE",
      semesterCount: 8,
      semesters: ECE_2021_SUBJECTS,
    }),
    EEE: createDepartment({
      label: "B.E. Electrical and Electronics Engineering",
      shortLabel: "EEE",
      semesterCount: 8,
    }),
    EIE: createDepartment({
      label: "B.E. Electronics and Instrumentation Engineering",
      shortLabel: "EIE",
      semesterCount: 8,
    }),
    MECH: createDepartment({
      label: "B.E. Mechanical Engineering",
      shortLabel: "Mech",
      semesterCount: 8,
    }),
    CIVIL: createDepartment({
      label: "B.E. Civil Engineering",
      shortLabel: "Civil",
      semesterCount: 8,
    }),
    BARCH: createDepartment({
      label: "Bachelor of Architecture",
      shortLabel: "B.Arch",
      semesterCount: 10,
    }),
    ME_CSE: createDepartment({
      label: "M.E. Computer Science and Engineering",
      shortLabel: "M.E. CSE",
      semesterCount: 4,
    }),
    ME_PED: createDepartment({
      label: "M.E. Power Electronics and Drives",
      shortLabel: "M.E. PED",
      semesterCount: 4,
    }),
    ME_AE: createDepartment({
      label: "M.E. Applied Electronics",
      shortLabel: "M.E. AE",
      semesterCount: 4,
    }),
    MARCH: createDepartment({
      label: "M.Arch. General",
      shortLabel: "M.Arch",
      semesterCount: 4,
    }),
    MCA: createDepartment({
      label: "Master of Computer Applications",
      shortLabel: "MCA",
      semesterCount: 4,
    }),
    MBA: createDepartment({
      label: "Master of Business Administration",
      shortLabel: "MBA",
      semesterCount: 4,
    }),
  },
  "2017": {
    ECE: createDepartment({
      label: "B.E. Electronics and Communication Engineering",
      shortLabel: "ECE",
      semesterCount: 8,
    }),
  },
};

export const SYLLABUS = Object.fromEntries(
  Object.entries(CURRICULUM).map(([regulation, departments]) => [
    regulation,
    Object.fromEntries(
      Object.entries(departments).map(([departmentCode, config]) => [departmentCode, config.semesters]),
    ),
  ]),
);

export function getDepartmentOptions(regulation) {
  return Object.entries(CURRICULUM[regulation] || {}).map(([value, config]) => ({
    value,
    label: config.label,
    shortLabel: config.shortLabel,
    semesterCount: config.semesterCount,
    hasBundledSubjects: config.hasBundledSubjects,
  }));
}

export function getDepartmentConfig(regulation, department) {
  return CURRICULUM[regulation]?.[department] || null;
}

export function getSemesterOptions(regulation, department) {
  const semesterCount = getDepartmentConfig(regulation, department)?.semesterCount || 0;
  return Array.from({ length: semesterCount }, (_, index) => index + 1);
}
