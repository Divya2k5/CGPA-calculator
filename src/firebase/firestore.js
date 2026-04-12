import { db } from "./config.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

function requireDb() {
  if (!db) {
    throw new Error("Firebase is not configured. Add your VITE_* values to a .env file.");
  }

  return db;
}

export async function saveSemesterResult(uid, semNum, gpa, totalCredits, subjects, metadata = {}) {
  const ref = doc(requireDb(), "users", uid, "semesters", "sem_" + semNum);
  await setDoc(
    ref,
    {
      semNum: semNum,
      gpa: gpa,
      totalCredits: totalCredits,
      subjects: subjects,
      department: metadata.department || null,
      departmentLabel: metadata.departmentLabel || null,
      regulation: metadata.regulation || null,
      savedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function getAllSemesters(uid) {
  const ref = collection(requireDb(), "users", uid, "semesters");
  const snapshot = await getDocs(ref);

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs
    .map((docItem) => docItem.data())
    .sort((a, b) => a.semNum - b.semNum);
}

export async function saveCrowdsourcedSubject(regulation, dept, sem, subject) {
  const ref = collection(requireDb(), "crowdsourced_subjects");
  await addDoc(ref, {
    regulation: regulation,
    department: dept,
    semester: sem,
    code: subject.code,
    name: subject.name,
    credits: subject.credits,
    type: subject.type,
    addedAt: serverTimestamp()
  });
}
