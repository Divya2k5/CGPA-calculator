export function gradeToPoints(grade) {
  switch (grade) {
    case "O":
      return 10;
    case "A+":
      return 9;
    case "A":
      return 8;
    case "B+":
      return 7;
    case "B":
      return 6;
    case "C":
      return 5;
    case "RA":
      return 0;
    case "U/A":
      return 0;
    default:
      return 0;
  }
}

export function calculateGPA(subjects) {
  const totalCredits = subjects.reduce(
    (sum, subject) => sum + (Number(subject.credits) || 0),
    0
  );

  const gradedSubjects = subjects.filter(
    (subject) =>
      subject.grade !== null &&
      subject.grade !== undefined &&
      subject.grade !== ""
  );

  const gradedCredits = gradedSubjects.reduce(
    (sum, subject) => sum + (Number(subject.credits) || 0),
    0
  );

  const totalPoints = gradedSubjects.reduce(
    (sum, subject) =>
      sum + (Number(subject.credits) || 0) * gradeToPoints(subject.grade),
    0
  );

  const gpa =
    gradedCredits === 0 ? 0 : Number((totalPoints / gradedCredits).toFixed(2));
  const isComplete = subjects.every(
    (subject) =>
      subject.grade !== null &&
      subject.grade !== undefined &&
      subject.grade !== ""
  );

  return {
    gpa,
    totalCredits,
    gradedCredits,
    isComplete
  };
}

export function calculateCGPA(semesters) {
  const validSemesters = semesters.filter(
    (semester) => !(semester.gpa === 0 && semester.totalCredits === 0)
  );

  const totalCredits = validSemesters.reduce(
    (sum, semester) => sum + (Number(semester.totalCredits) || 0),
    0
  );

  if (totalCredits === 0) {
    return 0;
  }

  const totalWeightedGpa = validSemesters.reduce(
    (sum, semester) =>
      sum + (Number(semester.gpa) || 0) * (Number(semester.totalCredits) || 0),
    0
  );

  return Number((totalWeightedGpa / totalCredits).toFixed(2));
}
