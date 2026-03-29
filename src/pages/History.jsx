import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/config.js"
import { getAllSemesters } from "../firebase/firestore.js"
import { calculateCGPA } from "../utils/gpaCalculator.js"
import BottomNav from "../components/BottomNav.jsx"

function getGpaColorClass(value) {
  if (value >= 8.5) return "text-[#64d8d8]"
  if (value >= 6.5) return "text-[#adc6ff]"
  if (value > 0) return "text-[#ffb2b7]"
  return "text-[#8c909f]"
}

function getGradeBadgeClass(grade) {
  if (grade === "O" || grade === "A+") return "bg-[#64d8d8]/10 text-[#64d8d8]"
  if (grade === "A" || grade === "B+") return "bg-[#adc6ff]/10 text-[#adc6ff]"
  if (grade === "B" || grade === "C") return "bg-yellow-500/10 text-yellow-400"
  return "bg-[#ffb4ab]/10 text-[#ffb4ab]"
}

export default function History() {
  const navigate = useNavigate()
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(true)
  const [cgpa, setCgpa] = useState(0)

  useEffect(() => {
    const uid = auth?.currentUser?.uid
    if (!uid) {
      navigate("/login")
      return
    }

    getAllSemesters(uid)
      .then((data) => {
        const sorted = [...data].sort((a, b) => Number(a.semNum) - Number(b.semNum))
        setSemesters(sorted)
        setCgpa(calculateCGPA(sorted))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div className="bg-[#0b1326] min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-[#222a3d] rounded-2xl flex items-center justify-center border border-[#adc6ff]/20">
          <span className="material-symbols-outlined text-[#adc6ff] text-3xl">school</span>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-[#adc6ff] border-t-transparent animate-spin" />
        <p className="text-[#8c909f] text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] pb-28">
      <div className="bg-slate-900/80 backdrop-blur-xl px-6 py-4 flex items-center gap-3 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto w-full flex items-center gap-3">
          <span className="material-symbols-outlined text-[#adc6ff]">history</span>
          <h1 className="text-lg font-bold text-blue-200">Academic History</h1>
        </div>
      </div>

      <div className="px-6 pt-6 max-w-2xl mx-auto">
        <div className="bg-[#171f33] rounded-2xl p-6 mb-6 border border-[#424754]/20 glass-card">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#8c909f] mb-1">Overall CGPA</p>
              <p className={`text-5xl font-black ${getGpaColorClass(cgpa)}`}>{cgpa.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[#8c909f] mb-1">Semesters</p>
              <p className="text-5xl font-black text-[#adc6ff]">{semesters.length}</p>
            </div>
          </div>
        </div>

        {semesters.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-[#424754] text-6xl">history</span>
            <p className="text-[#8c909f] text-sm mt-4">No history yet</p>
            <p className="text-[#424754] text-xs mt-1">Save your first semester to see it here</p>
            <button
              type="button"
              onClick={() => navigate("/calculator")}
              className="mt-6 bg-[#adc6ff] text-[#002e6a] px-6 py-3 rounded-xl text-sm font-bold"
            >
              Calculate First Semester
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-[#8c909f] font-bold mb-3">Semester Breakdown</p>
            {semesters.map((semester) => (
              <div key={semester.semNum} className="bg-[#171f33] rounded-2xl p-5 border border-[#424754]/10 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="bg-[#adc6ff]/10 text-[#adc6ff] text-[10px] font-bold px-3 py-1 rounded-full">SEMESTER {semester.semNum}</span>
                    <p className={`text-2xl font-black mt-2 ${getGpaColorClass(Number(semester.gpa) || 0)}`}>{Number(semester.gpa || 0).toFixed(2)}</p>
                    <p className="text-xs text-[#8c909f] mt-1">{semester.totalCredits || 0} credits</p>
                  </div>
                  <span className="bg-[#64d8d8]/10 text-[#64d8d8] text-xs font-bold px-3 py-1.5 rounded-full">PASSED</span>
                </div>

                {semester.subjects && semester.subjects.length > 0 ? (
                  <div className="border-t border-[#424754]/20 pt-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#8c909f] mb-2">Subjects</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {semester.subjects.map((subject, index) => (
                        <div key={`${semester.semNum}-${subject.code || subject.name}-${index}`} className="flex justify-between items-center py-1 gap-3">
                          <p className="text-xs text-[#c2c6d6] truncate">{subject.name}</p>
                          <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${getGradeBadgeClass(subject.grade)}`}>{subject.grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
