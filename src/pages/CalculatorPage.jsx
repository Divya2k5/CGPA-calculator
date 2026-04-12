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
  if (grade === "O" || grade === "A+") return "text-[#64d8d8] border-[#64d8d8]/25";
  if (grade === "A" || grade === "B+") return "text-[#adc6ff] border-[#adc6ff]/25";
  if (grade === "B" || grade === "C") return "text-[#f9c97f] border-[#f9c97f]/25";
  if (["RA", "U/A", "WH", "SA", "AB"].includes(grade)) return "text-[#ffb4ab] border-[#ffb4ab]/25";
  return "text-[#8c909f] border-white/10";
}

function getGpaColor(gpa) {
  if (gpa >= 8.5) return "text-[#64d8d8]";
  if (gpa >= 6.5) return "text-[#adc6ff]";
  if (gpa > 0) return "text-[#ffb4ab]";
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
  const [manualCgpaMessage, setManualCgpaMessage] = useState("");
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
        setSaveStatus("Saved automatically.");
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
    const nextSubjects = [...subjects];
    nextSubjects[index] = { ...nextSubjects[index], grade };
    setSubjects(nextSubjects);
  };

  const handleManualGpaChange = (index, value) => {
    setManualSemesterGpas((previous) => previous.map((entry, currentIndex) => (
      currentIndex === index ? value : entry
    )));
    setManualGpaErrors((previous) => previous.map((entry, currentIndex) => (
      currentIndex === index ? "" : entry
    )));
    setManualCgpa(null);
    setManualCgpaMessage("");
  };

  const handleManualCgpaCalculate = () => {
    const nextErrors = manualSemesterGpas.map((value) => {
      const trimmed = value.trim();

      if (!trimmed) return "Enter GPA";

      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed)) return "Enter a valid number";
      if (parsed < GPA_LIMITS.min || parsed > GPA_LIMITS.max) {
        return `Use ${GPA_LIMITS.min.toFixed(2)} to ${GPA_LIMITS.max.toFixed(2)}`;
      }

      return "";
    });

    setManualGpaErrors(nextErrors);

    if (nextErrors.some(Boolean)) {
      setManualCgpa(null);
      setManualCgpaMessage("Fill every semester GPA with a valid value before calculating.");
      return;
    }

    setManualCgpa(calculateManualCGPA(manualSemesterGpas.map((value) => Number(value))));
    setManualCgpaMessage("CGPA updated from the semester GPAs entered below.");
  };

  const resetManualCgpa = () => {
    setManualSemesterCount(DEFAULT_MANUAL_CGPA_SEMESTERS);
    setManualSemesterGpas(buildEmptyGpaInputs(DEFAULT_MANUAL_CGPA_SEMESTERS));
    setManualGpaErrors(buildEmptyErrors(DEFAULT_MANUAL_CGPA_SEMESTERS));
    setManualCgpa(null);
    setManualCgpaMessage("");
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
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar__inner">
          <button type="button" onClick={() => navigate("/")} className="icon-button">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Calculator</p>
            <h1 className="page-title">{calculatorMode === "gpa" ? "Semester GPA" : "Manual CGPA"}</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-[#adc6ff]">
            {calculatorMode === "gpa" ? `Sem ${semester}` : `${manualSemesterCount} sems`}
          </div>
        </div>
      </header>

      <main className="app-content space-y-5 pb-44">
        <section className="section-card">
          <div className="segmented-control">
            {CALCULATOR_MODES.map((mode) => {
              const active = calculatorMode === mode.value;
              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setCalculatorMode(mode.value)}
                  className={active ? "segmented-control__item segmented-control__item--active" : "segmented-control__item"}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </section>

        {calculatorMode === "gpa" ? (
          <>
            <section className="section-card">
              <p className="eyebrow">Result</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className={`text-5xl font-black tracking-tight ${getGpaColor(liveGPA)}`}>{liveGPA.toFixed(2)}</p>
                  <p className="mt-2 text-sm text-[#8c909f]">{gradedSubjects}/{subjects.length} subjects graded</p>
                </div>
                <button type="button" onClick={() => navigate("/")} className="secondary-button !w-auto whitespace-nowrap px-4">
                  View History
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#8c909f]">
                Select the department and semester, enter all grades, then save the result once your GPA is complete.
              </p>
            </section>

            <section className="section-card space-y-4">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Setup</p>
                  <h2 className="section-title">Choose your semester</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="input-group">
                  <span className="input-label">Regulation</span>
                  <select className="input-field" value={regulation} onChange={(event) => setRegulation(event.target.value)}>
                    <option value="2021">2021</option>
                    <option value="2017">2017</option>
                  </select>
                </label>

                <label className="input-group sm:col-span-2">
                  <span className="input-label">Department</span>
                  <select className="input-field" value={department} onChange={(event) => setDepartment(event.target.value)}>
                    {departmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="input-group">
                  <span className="input-label">Semester</span>
                  <select className="input-field" value={semester} onChange={(event) => setSemester(Number(event.target.value))}>
                    {semesterOptions.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </label>

                <div className="info-panel">
                  <p className="input-label">Subjects</p>
                  <p className="mt-2 text-sm font-medium text-[#dae2fd]">{subjectSectionHeading}</p>
                  <p className="mt-1 text-xs text-[#8c909f]">
                    {departmentConfig?.hasBundledSubjects
                      ? "Bundled semester subjects are ready for this department."
                      : "This department is selectable, but bundled subjects have not been added yet."}
                  </p>
                </div>
              </div>
            </section>

            <section className="section-card space-y-4">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Entry</p>
                  <h2 className="section-title">Subject grades</h2>
                </div>
                {subjects.length > 0 ? (
                  <button type="button" onClick={() => setSubjects(subjects.map((subject) => ({ ...subject, grade: "" })))} className="text-sm font-medium text-[#8c909f]">
                    Clear all
                  </button>
                ) : null}
              </div>

              <p className="text-sm leading-6 text-[#8c909f]">
                Each subject uses the Anna University grade scale. You can keep editing before saving the final semester result.
              </p>

              {subjects.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-[#0e1629] px-5 py-10 text-center">
                  <span className="material-symbols-outlined text-5xl text-[#31394d]">school</span>
                  <p className="mt-4 text-sm text-[#8c909f]">
                    {departmentConfig?.hasBundledSubjects ? "No subjects found for this semester." : "Add subjects manually for this department."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subjects.map((subject, index) => (
                    <div key={`${subject.code}-${index}`} className="rounded-3xl border border-white/5 bg-[#0e1629] p-4">
                      <div className="mb-3">
                        <p className="text-sm font-semibold leading-6 text-[#f3f6ff]">{subject.name}</p>
                        <p className="mt-1 text-[11px] text-[#7f8aa3]">{subject.code} - {subject.credits} credits</p>
                      </div>
                      <select
                        value={subject.grade}
                        onChange={(event) => handleGradeChange(index, event.target.value)}
                        className={`input-field !py-3 font-semibold ${getGradeColor(subject.grade)}`}
                      >
                        {GRADE_OPTIONS.map((option) => (
                          <option key={option || "empty"} value={option}>
                            {option || "Select grade"}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" className="secondary-button justify-center" onClick={() => setShowModal(true)}>
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Add Missing Subject
              </button>
            </section>
          </>
        ) : (
          <>
            <section className="section-card space-y-4">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Setup</p>
                  <h2 className="section-title">Manual CGPA</h2>
                </div>
              </div>

              <label className="input-group">
                <span className="input-label">Number of semesters</span>
                <select className="input-field" value={manualSemesterCount} onChange={(event) => setManualSemesterCount(Number(event.target.value))}>
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>

              <p className="text-sm leading-6 text-[#8c909f]">
                Enter each semester GPA in order. This mode is useful when you already know your semester GPAs and only need the final CGPA.
              </p>

              <div className="space-y-3">
                {manualSemesterGpas.map((value, index) => (
                  <label key={`manual-sem-${index + 1}`} className="input-group">
                    <span className="input-label">Semester {index + 1} GPA</span>
                    <input
                      type="number"
                      min={GPA_LIMITS.min}
                      max={GPA_LIMITS.max}
                      step="0.01"
                      value={value}
                      onChange={(event) => handleManualGpaChange(index, event.target.value)}
                      placeholder="Enter GPA"
                      className={manualGpaErrors[index] ? "input-field border-[#ffb4ab]/20 text-[#ffb4ab]" : "input-field"}
                    />
                    {manualGpaErrors[index] ? <span className="mt-2 text-xs text-[#ffb4ab]">{manualGpaErrors[index]}</span> : null}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" onClick={handleManualCgpaCalculate} className="primary-button justify-center">
                  Calculate CGPA
                </button>
                <button type="button" onClick={resetManualCgpa} className="secondary-button justify-center">
                  Reset Inputs
                </button>
              </div>
            </section>

            <section className="section-card">
              <p className="eyebrow">Result</p>
              <p className={`mt-3 text-5xl font-black tracking-tight ${getGpaColor(manualCgpa || 0)}`}>
                {manualCgpa !== null ? manualCgpa.toFixed(2) : "--"}
              </p>
              <p className="mt-3 text-sm text-[#8c909f]">
                {manualCgpa !== null
                  ? "Calculated from the semester GPAs entered above."
                  : "Enter all semester GPAs, then calculate to see the final CGPA."}
              </p>
              {manualCgpaMessage ? (
                <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  manualCgpa !== null
                    ? "border-[#64d8d8]/10 bg-[#64d8d8]/5 text-[#9fe4e4]"
                    : "border-[#ffb4ab]/10 bg-[#ffb4ab]/5 text-[#ffb4ab]"
                }`}>
                  {manualCgpaMessage}
                </p>
              ) : null}
            </section>
          </>
        )}
      </main>

      {calculatorMode === "gpa" ? (
        <div className="fixed inset-x-0 bottom-20 z-40 px-4 md:hidden">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 rounded-[28px] border border-white/10 bg-[#0d1427]/96 p-4 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              className="primary-button justify-center"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Semester"}
            </button>
            <p className="text-center text-xs text-[#7f8aa3]">
              {saveStatus || (autoCalculated ? "Saved automatically once all grades were complete." : "Complete all grades to save this semester.")}
            </p>
          </div>
        </div>
      ) : null}

      {showModal ? (
        <div className="fixed inset-0 z-50 bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto flex min-h-full max-w-lg items-end sm:items-center">
            <div className="w-full rounded-[32px] border border-white/10 bg-[#131b2e] p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Manual subject</p>
                  <h2 className="mt-2 text-xl font-semibold text-[#f3f6ff]">Add missing subject</h2>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="icon-button">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <label className="input-group">
                  <span className="input-label">Subject code</span>
                  <input className="input-field" value={newSubject.code} onChange={(event) => setNewSubject({ ...newSubject, code: event.target.value })} />
                </label>
                <label className="input-group">
                  <span className="input-label">Subject name</span>
                  <input className="input-field" value={newSubject.name} onChange={(event) => setNewSubject({ ...newSubject, name: event.target.value })} />
                </label>
                <label className="input-group">
                  <span className="input-label">Credits</span>
                  <input className="input-field" type="number" value={newSubject.credits} onChange={(event) => setNewSubject({ ...newSubject, credits: event.target.value })} />
                </label>
                <label className="input-group">
                  <span className="input-label">Type</span>
                  <select className="input-field" value={newSubject.type} onChange={(event) => setNewSubject({ ...newSubject, type: event.target.value })}>
                    <option value="theory">theory</option>
                    <option value="Laboratory">Laboratory</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" className="primary-button justify-center" onClick={addMissingSubject}>Add Subject</button>
                <button type="button" className="secondary-button justify-center" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <BottomNav />
    </div>
  );
}
