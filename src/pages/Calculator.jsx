import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config.js";
import { SYLLABUS } from "../data/syllabus.js";
import { calculateGPA } from "../utils/gpaCalculator.js";
import { saveSemesterResult, saveCrowdsourcedSubject } from "../firebase/firestore.js";
import BottomNav from "../components/BottomNav.jsx";

const DEPARTMENTS = ["ECE", "CSE", "IT", "MECH", "CIVIL", "EEE"];
const DEPARTMENT_VALUE_MAP = {
  ECE: "ECE",
  CSE: "CSE",
  IT: "IT",
  MECH: "Mech",
  CIVIL: "Civil",
  EEE: "EEE"
};

function getGradeColor(grade) {
  if (grade === "O" || grade === "A+") return "text-[#64d8d8] border-[#64d8d8]/40";
  if (grade === "A" || grade === "B+") return "text-[#adc6ff] border-[#adc6ff]/40";
  if (grade === "B" || grade === "C") return "text-[#ffb2b7] border-[#ffb2b7]/40";
  if (grade === "RA" || grade === "U/A") return "text-[#ffb4ab] border-[#ff516a]/40";
  return "text-[#8c909f] border-[#424754]/40";
}

function getGpaColor(gpa) {
  if (gpa >= 8.5) return "text-[#64d8d8]";
  if (gpa >= 6.5) return "text-[#adc6ff]";
  if (gpa > 0) return "text-[#ffb2b7]";
  return "text-[#8c909f]";
}

export default function Calculator() {
  const navigate = useNavigate();
  const [regulation, setRegulation] = useState("2021");
  const [department, setDepartment] = useState("ECE");
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [liveGPA, setLiveGPA] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ code: "", name: "", credits: "", type: "theory" });
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [autoCalculated, setAutoCalculated] = useState(false);
  const lastSavedSignatureRef = useRef("");

  useEffect(() => {
    const data = SYLLABUS[regulation]?.[department]?.[semester];
    if (data) {
      setSubjects(data.map((s) => ({ ...s, grade: "" })));
    } else {
      setSubjects([]);
    }
    setLiveGPA(0);
    setScanResults(null);
    setSaveStatus("");
    setAutoCalculated(false);
    lastSavedSignatureRef.current = "";
  }, [regulation, department, semester]);

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
      subjects: subjects.map(({ code, grade, credits }) => ({ code, grade, credits }))
    });

    if (lastSavedSignatureRef.current === signature) {
      setAutoCalculated(true);
      return;
    }

    let cancelled = false;

    saveSemesterResult(uid, semester, result.gpa, result.totalCredits, subjects)
      .then(() => {
        if (cancelled) {
          return;
        }
        lastSavedSignatureRef.current = signature;
        setAutoCalculated(true);
        setSaveStatus("Saved to history automatically.");
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        setSaveStatus(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [subjects, regulation, department, semester]);

  const GRADE_OPTIONS = ["", "O", "A+", "A", "B+", "B", "C", "RA", "U/A"];
  const gradedSubjects = subjects.filter((subject) => subject.grade).length;

  const handleGradeChange = (index, grade) => {
    const copy = [...subjects];
    copy[index] = { ...copy[index], grade };
    setSubjects(copy);
  };

  async function handleScan(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ""

    setScanResults(null)
    setAutoCalculated(false)

    const { validateMarksheet, scanMarksheet, checkIfMarksheet } = 
      await import("../utils/ocrScanner.js")

    // Validate file
    const fileCheck = await validateMarksheet(file)
    if (!fileCheck.valid) {
      setScanResults({
        matched: 0,
        unmatched: subjects.length,
        error: fileCheck.reason
      })
      return
    }

    setScanning(true)
    setScanProgress(0)

    try {
      const { matches, rawText } = await scanMarksheet(file, setScanProgress)
      
      // Check if it looks like a marksheet
      const contentCheck = checkIfMarksheet(matches)
      if (!contentCheck.valid) {
        setScanResults({
          matched: 0,
          unmatched: subjects.length,
          error: contentCheck.reason
        })
        return
      }

      // Apply matches to subjects
      const copy = [...subjects]
      let matchedCount = 0

      matches.forEach(({ code, grade }) => {
        const idx = copy.findIndex(s => 
          s.code && s.code.trim().toUpperCase() === code.trim().toUpperCase()
        )
        if (idx !== -1 && grade) {
          copy[idx] = { ...copy[idx], grade }
          matchedCount++
        }
      })

      setSubjects(copy)
      setScanResults({
        matched: matchedCount,
        unmatched: copy.length - matchedCount,
        error: null
      })

      // Auto-calculate GPA
      if (matchedCount > 0) {
        const result = calculateGPA(copy)
        setLiveGPA(result.gpa)
        setAutoCalculated(result.isComplete)
      }

    } catch (err) {
      console.error("Scan error:", err)
      
      let errorMessage = "Scan failed. Please try again."
      
      if (err.message?.includes("MISSING_KEY")) {
        errorMessage = "Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the server."
      } else if (err.message?.includes("API_ERROR")) {
        errorMessage = "API error: " + err.message.replace("API_ERROR: ", "")
      } else if (err.message?.includes("NETWORK_ERROR")) {
        errorMessage = "Cannot reach Gemini. Check your internet connection."
      } else if (err.message?.includes("PARSE_ERROR")) {
        errorMessage = "Could not read the response. Please try again."
      }
      
      setScanResults({
        matched: 0,
        unmatched: subjects.length,
        error: errorMessage
      })
    } finally {
      setScanning(false)
    }
  }

  const handleSave = () => {
    setScanning(false);
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
      subjects: subjects.map(({ code, grade, credits }) => ({ code, grade, credits }))
    });

    saveSemesterResult(uid, semester, result.gpa, result.totalCredits, subjects)
      .then(() => {
        lastSavedSignatureRef.current = signature;
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
    const sub = { ...newSubject, credits: Number(newSubject.credits) };
    setSubjects((prev) => [...prev, { ...sub, grade: "" }]);
    saveCrowdsourcedSubject(regulation, department, semester, sub);
    setNewSubject({ code: "", name: "", credits: "", type: "theory" });
    setShowModal(false);
  };

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
          <span className="bg-[#adc6ff]/20 text-[#adc6ff] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">SEM {semester}</span>
        </div>
      </div>

      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6] mb-3">Department</p>
          <div className="overflow-x-auto flex gap-2 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {DEPARTMENTS.map((pill) => {
              const value = DEPARTMENT_VALUE_MAP[pill];
              const active = department === value;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setDepartment(value)}
                  className={active
                    ? "px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer bg-[#adc6ff] text-[#002e6a] whitespace-nowrap"
                    : "px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer bg-[#171f33] text-[#c2c6d6] border border-[#424754]/30 hover:border-[#adc6ff]/40 hover:text-[#adc6ff] whitespace-nowrap"}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#c2c6d6] mb-2">Regulation</p>
            <select
              className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 focus:border-[#adc6ff]"
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
            >
              <option value="2021">2021</option>
              <option value="2017">2017</option>
            </select>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#c2c6d6] mb-2">Semester</p>
            <select
              className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm focus:outline-none focus:ring-2 focus:ring-[#adc6ff]/50 focus:border-[#adc6ff]"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          {scanResults && scanResults.error && !scanning ? (
            <div className="bg-[#93000a]/30 border border-[#ffb4ab]/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#ffb4ab]">warning</span>
                <p className="text-sm font-semibold text-[#ffb4ab]">Unable to read marksheet</p>
              </div>
              <p className="text-xs text-[#c2c6d6] mb-4">{scanResults.error}</p>
              <div className="border-t border-[#ffb4ab]/10 mb-3" />
              <p className="text-xs font-bold text-[#c2c6d6] mb-2">How to get the right image:</p>
              <div className="text-xs text-[#8c909f] leading-loose">
                <p>? Visit coe1.annauniv.edu</p>
                <p>? Login with your register number</p>
                <p>? Open your semester result page</p>
                <p>? Screenshot the full result table and upload</p>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => document.getElementById("uploadInput").click()} className="flex-1 bg-[#ffb4ab] text-[#690005] rounded-xl py-2.5 text-xs font-bold">Try Again</button>
                <button type="button" onClick={() => setScanResults(null)} className="flex-1 bg-[#171f33] border border-[#424754]/40 text-[#c2c6d6] rounded-xl py-2.5 text-xs">Enter Manually</button>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-[#171f33] rounded-xl p-6 glass-card border border-[#424754]/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-bold text-[#dae2fd]">Smart Scan</p>
                  <p className="text-xs text-[#c2c6d6] mt-1">Upload your marksheet to auto-fill all grades</p>
                </div>
                <div className="w-10 h-10 bg-[#adc6ff]/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#adc6ff]">photo_camera</span>
                </div>
              </div>

              <div className="border-t border-[#424754]/20 mb-4" />

              <input id="cameraInput" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScan} />
              <input id="uploadInput" type="file" accept="image/*" className="hidden" onChange={handleScan} />

              {scanning ? (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#adc6ff] border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-[#dae2fd]">Analysing marksheet...</p>
                  </div>
                  <div className="w-full h-1 bg-[#2d3449] rounded-full">
                    <div className="h-1 bg-gradient-to-r from-[#adc6ff] to-[#64d8d8] rounded-full transition-all" style={{ width: scanProgress + "%" }} />
                  </div>
                  <p className="text-[10px] text-[#8c909f] mt-2">{scanProgress}% complete</p>
                </div>
              ) : scanResults && !scanResults.error ? (
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#64d8d8]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#64d8d8] text-sm">check_circle</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#64d8d8]">{scanResults.matched} grades filled automatically</p>
                      <p className="text-xs text-[#c2c6d6] mt-1">{scanResults.unmatched} subjects need manual entry</p>
                      {autoCalculated ? <p className="text-xs text-[#adc6ff] mt-1 font-medium">GPA calculated and saved to your history.</p> : null}
                    </div>
                  </div>
                  <button type="button" onClick={() => setScanResults(null)} className="text-[10px] text-[#8c909f] mt-3 underline">Scan again</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById("cameraInput").click()}
                    className="flex items-center justify-center gap-2 bg-[#adc6ff] text-[#002e6a] rounded-xl py-3 text-xs font-bold hover:bg-[#c5d8ff] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    Open Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("uploadInput").click()}
                    className="flex items-center justify-center gap-2 bg-[#171f33] border border-[#424754]/40 text-[#c2c6d6] rounded-xl py-3 text-xs font-semibold hover:border-[#adc6ff]/40 hover:text-[#adc6ff]"
                  >
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Upload Photo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2c6d6]">Core Subjects ({department})</p>
            <button type="button" onClick={() => setSubjects(subjects.map((subject) => ({ ...subject, grade: "" })))} className="text-[10px] text-[#8c909f] hover:text-[#adc6ff]">CLEAR ALL</button>
          </div>

          {subjects.length === 0 ? (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-[#424754] text-5xl mb-3">school</span>
              <p className="text-[#8c909f] text-sm">No subjects found</p>
              <p className="text-[#424754] text-xs mt-1">Try a different department or semester</p>
            </div>
          ) : (
            <div>
              {subjects.map((subject, index) => (
                <div key={subject.code} className="bg-[#171f33] rounded-xl px-5 py-4 mb-2 flex justify-between items-center border border-[#424754]/10 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#dae2fd]">{subject.name}</p>
                    <p className="text-[10px] text-[#8c909f] mt-0.5">{subject.code} · {subject.credits} credits</p>
                  </div>
                  <select
                    value={subject.grade}
                    onChange={(e) => handleGradeChange(index, e.target.value)}
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
      </div>

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
            {saveStatus || "Completed GPA calculations are saved to history automatically."}
          </p>
        </div>
      </div>

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
                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
              />
              <input
                className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm mb-3 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none placeholder:text-[#8c909f]"
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              />
              <input
                className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm mb-3 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none placeholder:text-[#8c909f]"
                placeholder="Credits"
                type="number"
                value={newSubject.credits}
                onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
              />
              <select
                className="w-full bg-[#131b2e] border border-[#424754]/40 rounded-xl px-4 py-3 text-[#dae2fd] text-sm mb-3 focus:ring-2 focus:ring-[#adc6ff]/50 outline-none"
                value={newSubject.type}
                onChange={(e) => setNewSubject({ ...newSubject, type: e.target.value })}
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
