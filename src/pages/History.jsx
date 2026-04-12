import { useEffect, useState } from "react"
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
  if (grade === "B" || grade === "C") return "bg-[#f9c97f]/12 text-[#f9c97f]"
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

  const latestSemester = semesters.length > 0 ? semesters[semesters.length - 1] : null

  if (loading) {
    return (
      <div className="app-shell app-shell--centered">
        <div className="loading-mark">
          <span className="material-symbols-outlined text-[32px] text-[#adc6ff]">school</span>
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-[#adc6ff] border-t-transparent animate-spin" />
        <p className="text-sm text-[#8c909f]">Loading your academic record...</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar__inner">
          <div>
            <p className="eyebrow">Home</p>
            <h1 className="page-title">Academic overview</h1>
          </div>
        </div>
      </header>

      <main className="app-content space-y-5">
        <section className="section-card section-card--hero">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Overall CGPA</p>
              <p className={`mt-2 text-5xl font-black tracking-tight ${getGpaColorClass(cgpa)}`}>{cgpa.toFixed(2)}</p>
              <p className="mt-3 text-sm text-[#a8b1c7]">
                {latestSemester
                  ? `Latest saved semester: ${latestSemester.semNum}`
                  : "No saved semesters yet. Start with your first GPA calculation."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#8c909f]">Saved</p>
              <p className="mt-1 text-2xl font-bold text-[#dae2fd]">{semesters.length}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => navigate("/calculator")} className="primary-button">
              Open Calculator
            </button>
            <button type="button" onClick={() => navigate("/profile")} className="secondary-button">
              View Profile
            </button>
          </div>
        </section>

        {semesters.length === 0 ? (
          <section className="section-card py-12 text-center">
            <span className="material-symbols-outlined text-5xl text-[#31394d]">history</span>
            <h2 className="mt-4 text-lg font-semibold text-[#dae2fd]">No semesters saved yet</h2>
            <p className="mt-2 text-sm text-[#8c909f]">Your semester results will appear here once you save a completed calculation.</p>
          </section>
        ) : (
          <section className="space-y-3">
            <div className="section-heading">
              <div>
                <p className="eyebrow">History</p>
                <h2 className="section-title">Saved semesters</h2>
              </div>
            </div>

            {semesters.map((semester) => (
              <article key={semester.semNum} className="section-card space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Semester {semester.semNum}</p>
                    <p className={`mt-2 text-3xl font-black tracking-tight ${getGpaColorClass(Number(semester.gpa) || 0)}`}>
                      {Number(semester.gpa || 0).toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-[#8c909f]">
                      {semester.totalCredits || 0} credits
                      {semester.departmentLabel ? ` - ${semester.departmentLabel}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#adc6ff]/10 px-3 py-1 text-[11px] font-semibold text-[#adc6ff]">
                    {semester.subjects?.length || 0} subjects
                  </span>
                </div>

                {semester.subjects && semester.subjects.length > 0 ? (
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    {semester.subjects.map((subject, index) => (
                      <div key={`${semester.semNum}-${subject.code || subject.name}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl bg-[#0e1629] px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#dae2fd]">{subject.name}</p>
                          <p className="mt-1 text-[11px] text-[#7f8aa3]">{subject.code || "Subject"}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getGradeBadgeClass(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
