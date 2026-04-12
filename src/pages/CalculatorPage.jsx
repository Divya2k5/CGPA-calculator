import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config.js";
import {
  getDepartmentConfig,
  getDepartmentOptions,
  getSemesterOptions,
} from "../data/syllabus.js";
import { calculateGPA, calculateManualCGPA } from "../utils/gpaCalculator.js";
import { saveCrowdsourcedSubject, saveSemesterResult } from "../firebase/firestore.js";
import BottomNav from "../components/BottomNav.jsx";

const CALCULATOR_MODES = [
  { value: "gpa", label: "Semester GPA" },
  { value: "cgpa", label: "Manual CGPA" },
];

const GRADE_OPTIONS = ["", "O", "A+", "A", "B+", "B", "C", "RA", "U/A", "WH", "SA", "AB"];
const GPA_LIMITS = { min: 0, max: 10 };
const DEFAULT_MANUAL_CGPA_SEMESTERS = 8;

function getGradeColor(grade) {
  if (grade === "O" || grade === "A+") return "text-[#64d8d8] border-[#64d8d8]/40";
  if (grade === "A" || grade === "B+") return "text-[#adc6ff] border-[#adc6ff]/40";
  if (grade === "B" || grade === "C") return "text-[#ffb2b7] border-[#ffb2b7]/40";
  if (["RA", "U/A", "WH", "SA", "AB"].includes(grade)) return "text-[#ffb4ab] border-[#ff516a]/40";
  return "text-[#8c909f] border-[#424754]/40";
}

function getGpaColor(gpa) {
  if (gpa >= 8.5) return "text-[#64d8d8]";
  if (gpa >= 6.5) return "text-[#adc6ff]";
  if (gpa > 0) return "text-[#ffb2b7]";
  return "text-[#8c909f]";
}

function buildEmptyGpaInputs(count) {
  return Array.from({ length: count }, () => "");
}

function buildEmptyErrors(count) {
  return Array.from({ length: count }, () => "");
}

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [calculatorMode, setCalculatorMode] = useState("gpa");
  const [regulation, setRegulation] = useState("2021");
  const [department, setDepartment] = useState("ECE");
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [liveGPA, setLiveGPA] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ code: "", name: "", credits: "", type: "theory" });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [autoCalculated, setAutoCalculated] = useState(false);
  const [manualSemesterCount, setManualSemesterCount] = useState(DEFAULT_MANUAL_CGPA_SEMESTERS);
  const [manualSemesterGpas, setManualSemesterGpas] = useState(() => buildEmptyGpaInputs(DEFAULT_MANUAL_CGPA_SEMESTERS));
  const [manualGpaErrors, setManualGpaErrors] = useState(() => buildEmptyErrors(DEFAULT_MANUAL_CGPA_SEMESTERS));
  const [manualCgpa, setManualCgpa] = useState(null);
  const [lastSavedSignature, setLastSavedSignature] = useState("");

  const departmentOptions = getDepartmentOptions(regulation);
  const departmentConfig = getDepartmentConfig(regulation, department);
  const semesterOptions = getSemesterOptions(regulation, department);
  const gradedSubjects = subjects.filter((subject) => subject.grade).length;

  useEffect(() => {
    if (!departmentOptions.some((option) => option.value === department)) {
      setDepartment(departmentOptions[0]?.value || "ECE");
    }
  }, [departmentOptions, department]);

  useEffect(() => {
    if (!semesterOptions.includes(semester)) {
      setSemester(semesterOptions[0] || 1);
    }
  }, [semesterOptions, semester]);

  useEffect(() => {
    const data = departmentConfig?.semesters?.[semester];

    if (data) {
      setSubjects(data.map((subject) => ({ ...subject, grade: "" })));
    } else {
      setSubjects([]);
    }

    setLiveGPA(0);
    setSaveStatus("");
    setAutoCalculated(false);
    setLastSavedSignature("");
  }, [departmentConfig, semester]);

  useEffect(() => {
    if (subjects.length === 0) {
      setLiveGPA(0);
      return;
    }

    const result = calculateGPA(subjects);
    setLiveGPA(result.gpa);

    if (!result.isComplete) {
      setAutoCalculated(false);
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      return;
    }

    const signature = JSON.stringify({
      regulation,
      department,
      semester,
      gpa: result.gpa,
      totalCredits: result.totalCredits,
      subjects: subjects.map(({ code, grade, credits }) => ({ code, grade, credits })),
    });

    if (lastSavedSignature === signature) {
      setAutoCalculated(true);
      return;
    }

    let cancelled = false;

    saveSemesterResult(uid, semester, result.gpa, result.totalCredits, subjects, {
      regulation,
      department,
      departmentLabel: departmentConfig?.label || department,
    })
      .then(() => {
        if (cancelled) {
          return;
        }
        setLastSavedSignature(signature);
        setAutoCalculated(true);
        setSaveStatus("Saved to history automatically.");
      })
      .catch((err) => {
        if (!cancelled) {
          setSaveStatus(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [subjects, regulation, department, semester, lastSavedSignature, departmentConfig]);

  useEffect(() => {
    setManualSemesterGpas((previous) =>
      Array.from({ length: manualSemesterCount }, (_, index) => previous[index] ?? ""),
    );
    setManualGpaErrors(buildEmptyErrors(manualSemesterCount));
    setManualCgpa(null);
  }, [manualSemesterCount]);

  const handleGradeChange = (index, grade) => {
    const copy = [...subjects];
    copy[index] = { ...copy[index], grade };
    setSubjects(copy);
  };

  const handleManualGpaChange = (index, value) => {
    setManualSemesterGpas((previous) => previous.map((entry, currentIndex) => (
      currentIndex === index ? value : entry
    )));
    setManualGpaErrors((previous) => previous.map((entry, currentIndex) => (
      currentIndex === index ? "" : entry
    )));
    setManualCgpa(null);
  };

  const handleManualCgpaCalculate = () => {
    const nextErrors = manualSemesterGpas.map((value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return "Enter GPA";
      }

      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed)) {
        return "Enter a valid number";
      }

      if (parsed < GPA_LIMITS.min || parsed > GPA_LIMITS.max) {
        return `Use ${GPA_LIMITS.min.toFixed(2)} to ${GPA_LIMITS.max.toFixed(2)}`;
      }

      return "";
    });

    setManualGpaErrors(nextErrors);

    if (nextErrors.some(Boolean)) {
      setManualCgpa(null);
      return;
    }

    const result = calculateManualCGPA(manualSemesterGpas.map((value) => Number(value)));
    setManualCgpa(result);
  };

  const handleSave = () => {
    setSaving(true);
    const result = calculateGPA(subjects);
    const uid = auth?.currentUser?.uid;

    if (!uid) {
      alert("Not logged in");
      setSaving(false);
      return;
    }

    if (!result.isComplete) {
      alert("Enter grades for all subjects to save this semester.");
      setSaving(false);
      return;
    }

    const signature = JSON.stringify({
      regulation,
      department,
      semester,
      gpa: result.gpa,
      totalCredits: result.totalCredits,
      subjects: subjects.map(({ code, grade, credits }) => ({ code, grade, credits })),
    });

    saveSemesterResult(uid, semester, result.gpa, result.totalCredits, subjects, {
      regulation,
      department,
      departmentLabel: departmentConfig?.label || department,
    })
      .then(() => {
        setLastSavedSignature(signature);
        setAutoCalculated(true);
        setSaveStatus("Saved to history.");
        setSaving(false);
      })
      .catch((err) => {
        alert(err.message);
        setSaving(false);
      });
  };

  const addMissingSubject = () => {
    if (Object.values(newSubject).some((value) => value === "")) {
      alert("Fill all fields");
      return;
    }

    const subject = { ...newSubject, credits: Number(newSubject.credits) };
    setSubjects((previous) => [...previous, { ...subject, grade: "" }]);
    saveCrowdsourcedSubject(regulation, department, semester, subject);
    setNewSubject({ code: "", name: "", credits: "", type: "theory" });
    setShowModal(false);
  };

  const subjectSectionHeading = departmentConfig?.label || department;

  return (
    <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] pb-[18rem]">
      <div className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 h-16 max-w-2xl mx-auto w-full">
          <div className="flex items-center">
            <button type="button" onClick={() => navigate("/dashboard")} className="p-2 text-blue-200 hover:bg-white/10 rounded-full">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="text-lg font-bold text-blue-200 ml-2">GRADE CALCULATOR</span>
          </div>
          <span className="bg-[#adc6ff]/20 text-[#adc6ff] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {calculatorMode === "gpa" ? `SEM ${semester}` : "CGPA"}
          </span>
        </div>
      </div>

      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="mb-6 bg-[#171f33] rounded-xl p-2 border border-[#424754]/10 inline-flex gap-2">
          {CALCULATOR_MODES.map((mode) => {
            const active = calculatorMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setCalculatorMode(mode.value)}
                className={active
                  ? "px-4 py-2 rounded-xl text-sm font-semibold bg-[#adc6ff] text-[#002e6a]"
                  : "px-4 py-2 rounded-xl text-sm font-semibold text-[#c2c6d6] hover:text-[#adc6ff]"}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {calculatorMode === "gpa" ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#c2c6d6] mb-2">Regulation</p>
                <select
                  className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 focus:border-[#adc6ff]"
                  value={regulation}
                  onChange={(event) => setRegulation(event.target.value)}
                >
                  <option value="2021">2021</option>
                  <option value="2017">2017</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <p className="text-[10px] uppercase tracking-widest text-[#c2c6d6] mb-2">Department</p>
                <select
                  className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 focus:border-[#adc6ff]"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                >
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#c2c6d6] mb-2">Semester</p>
                <select
                  className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 focus:border-[#adc6ff]"
                  value={semester}
                  onChange={(event) => setSemester(Number(event.target.value))}
                >
                  {semesterOptions.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-[#8c909f] mb-1">Current Selection</p>
                <p className="text-sm font-semibold text-[#dae2fd]">{subjectSectionHeading}</p>
                <p className="text-xs text-[#c2c6d6] mt-1">
                  {departmentConfig?.hasBundledSubjects
                    ? "Bundled semester subject lists are available for this department."
                    : "Department and semester selection are available, but bundled subject lists are not added for this department yet."}
                </p>
              </div>
            </div>

            <div className="mb-6 bg-[#171f33] rounded-xl p-6 glass-card border border-[#424754]/10">
              {/* Smart Scan stays disabled until OCR/Gemini extraction is fixed. */}
              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <p className="text-sm font-bold text-[#dae2fd]">Smart Scan Unavailable</p>
                  <p className="text-xs text-[#c2c6d6] mt-1">
                    Image upload, camera capture, OCR, and Gemini extraction are temporarily disabled so users cannot trigger the broken extraction flow.
                  </p>
                </div>
                <div className="w-10 h-10 bg-[#ffb4ab]/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#ffb4ab]">visibility_off</span>
                </div>
              </div>
              <div className="border-t border-[#424754]/20 mb-4" />
              <p className="text-[11px] text-[#8c909f]">
                The OCR and extraction files remain in the repo for later restoration, but all related UI triggers are intentionally hidden from this page.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6]">Core Subjects ({subjectSectionHeading})</p>
                <button type="button" onClick={() => setSubjects(subjects.map((subject) => ({ ...subject, grade: "" })))} className="text-[10px] text-[#8c909f] hover:text-[#adc6ff]">CLEAR ALL</button>
              </div>

              {subjects.length === 0 ? (
                <div className="py-16 text-center bg-[#171f33] rounded-xl border border-[#424754]/10">
                  <span className="material-symbols-outlined text-[#424754] text-5xl mb-3">school</span>
                  <p className="text-[#8c909f] text-sm">No bundled subjects found</p>
                  <p className="text-[#424754] text-xs mt-1">
                    {departmentConfig?.hasBundledSubjects
                      ? "Try a different semester."
                      : "Use Add manually below until this department's subject list is added."}
                  </p>
                </div>
              ) : (
                <div>
                  {subjects.map((subject, index) => (
                    <div key={`${subject.code}-${index}`} className="bg-[#171f33] rounded-xl px-5 py-4 mb-2 flex justify-between items-center border border-[#424754]/10 gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#dae2fd]">{subject.name}</p>
                        <p className="text-[10px] text-[#8c909f] mt-0.5">{subject.code} - {subject.credits} credits</p>
                      </div>
                      <select
                        value={subject.grade}
                        onChange={(event) => handleGradeChange(index, event.target.value)}
                        className={`bg-[#0b1326] border rounded-xl px-3 py-2 text-sm font-bold min-w-[90px] focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 ${getGradeColor(subject.grade)}`}
                      >
                        {GRADE_OPTIONS.map((option) => (
                          <option key={option || "empty"} value={option}>
                            {option || "Grade"}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <button
                type="button"
                className="w-full border border-dashed border-[#424754]/40 rounded-xl py-4 flex items-center justify-center gap-2 hover:border-[#adc6ff]/40 hover:text-[#adc6ff] transition-all text-[#8c909f] text-xs font-medium"
                onClick={() => setShowModal(true)}
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Subject not listed? Add manually
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#171f33] rounded-xl p-6 border border-[#424754]/10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-[#dae2fd]">Manual CGPA Calculator</p>
                  <p className="text-xs text-[#c2c6d6] mt-1">Choose how many semesters to include, enter each GPA, and calculate the overall CGPA.</p>
                </div>
                <div className="w-10 h-10 bg-[#adc6ff]/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#adc6ff]">calculate</span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-widest text-[#c2c6d6] mb-2">Number of Semesters</p>
                <select
                  className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 focus:border-[#adc6ff]"
                  value={manualSemesterCount}
                  onChange={(event) => setManualSemesterCount(Number(event.target.value))}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {manualSemesterGpas.map((value, index) => (
                  <div key={`manual-sem-${index + 1}`}>
                    <label className="block text-[10px] uppercase tracking-widest text-[#c2c6d6] mb-2">
                      Semester {index + 1} GPA
                    </label>
                    <input
                      type="number"
                      min={GPA_LIMITS.min}
                      max={GPA_LIMITS.max}
                      step="0.01"
                      value={value}
                      onChange={(event) => handleManualGpaChange(index, event.target.value)}
                      placeholder="Enter GPA"
                      className={`w-full bg-[#131b2e] border rounded-xl px-4 py-3 text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 ${
                        manualGpaErrors[index] ? "border-[#ff516a]/40" : "border-[#424754]/40"
                      }`}
                    />
                    {manualGpaErrors[index] ? (
                      <p className="text-[11px] text-[#ffb4ab] mt-2">{manualGpaErrors[index]}</p>
                    ) : null}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleManualCgpaCalculate}
                className="w-full font-bold py-4 rounded-xl text-sm mt-5"
                style={{ background: "linear-gradient(to right, #adc6ff, #64d8d8)", color: "#002e6a" }}
              >
                Calculate CGPA
              </button>
            </div>

            <div className="bg-[#171f33] rounded-xl p-6 border border-[#424754]/10">
              <p className="text-[10px] uppercase tracking-widest text-[#8c909f] mb-2">Calculated CGPA</p>
              <p className={`text-5xl font-black ${getGpaColor(manualCgpa || 0)}`}>
                {manualCgpa !== null ? manualCgpa.toFixed(2) : "--"}
              </p>
              <p className="text-xs text-[#c2c6d6] mt-3">
                {manualCgpa !== null
                  ? "Computed from the semester GPA values you entered."
                  : "Enter all semester GPAs and calculate to view the final CGPA."}
              </p>
            </div>
          </div>
        )}
      </div>

      {calculatorMode === "gpa" ? (
        <>
          <div className="fixed bottom-[5rem] left-0 right-0 bg-[#0b1326]/90 backdrop-blur-xl border-t border-[#424754]/20 px-6 py-3 z-40">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#8c909f]">Live GPA</p>
                <p className="text-xs text-[#c2c6d6] mt-0.5">{gradedSubjects}/{subjects.length} subjects graded</p>
              </div>
              <span className={`text-3xl font-black text-white font-mono ${getGpaColor(liveGPA)}`}>{liveGPA.toFixed(2)}</span>
            </div>
          </div>

          <div className="fixed bottom-[5rem] left-0 right-0 px-6 pb-0 pt-0 z-40 translate-y-[4.75rem]">
            <div className="max-w-2xl mx-auto space-y-2">
              <button
                type="button"
                className="w-full font-bold py-4 rounded-xl text-sm active:scale-95 transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(to right, #adc6ff, #64d8d8)", color: "#002e6a" }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save to History"}
              </button>
              <p className="text-center text-[11px] text-[#8c909f]">
                {saveStatus || (autoCalculated ? "Completed GPA calculations are saved automatically." : "Completed GPA calculations are saved to history automatically.")}
              </p>
            </div>
          </div>
        </>
      ) : null}

      {showModal ? (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="bg-[#171f33] rounded-t-2xl px-6 pt-6 pb-10 border-t border-[#424754]/20 w-full">
            <div className="max-w-2xl mx-auto">
              <div className="w-10 h-1 bg-[#424754] rounded-full mx-auto mb-6" />
              <h2 className="text-base font-bold text-[#dae2fd] mb-5">Add Missing Subject</h2>
              <input
                className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm mb-3 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none placeholder:text-[#8c909f]"
                placeholder="Subject Code"
                value={newSubject.code}
                onChange={(event) => setNewSubject({ ...newSubject, code: event.target.value })}
              />
              <input
                className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm mb-3 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none placeholder:text-[#8c909f]"
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={(event) => setNewSubject({ ...newSubject, name: event.target.value })}
              />
              <input
                className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm mb-3 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none placeholder:text-[#8c909f]"
                placeholder="Credits"
                type="number"
                value={newSubject.credits}
                onChange={(event) => setNewSubject({ ...newSubject, credits: event.target.value })}
              />
              <select
                className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm mb-3 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none"
                value={newSubject.type}
                onChange={(event) => setNewSubject({ ...newSubject, type: event.target.value })}
              >
                <option value="theory">theory</option>
                <option value="Laboratory">Laboratory</option>
              </select>
              <button type="button" className="w-full bg-[#adc6ff] text-[#002e6a] font-bold rounded-xl py-3.5 text-sm mb-3" onClick={addMissingSubject}>Add Subject</button>
              <button type="button" className="w-full text-[#8c909f] text-sm text-center cursor-pointer py-2" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}

      <BottomNav />
    </div>
  );
}
