import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/config.js"
import { getAllSemesters } from "../firebase/firestore.js"
import { calculateCGPA } from "../utils/gpaCalculator.js"
import { toAppErrorMessage } from "../utils/appErrors.js"
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
  const [error, setError] = useState("")
  const [reloadToken, setReloadToken] = useState(0)

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
        setError("")
        setLoading(false)
      })
      .catch((err) => {
        setError(toAppErrorMessage(err, "Your saved semesters could not be loaded right now."))
        setLoading(false)
      })
  }, [navigate, reloadToken])

  const latestSemester = semesters.length > 0 ? semesters[semesters.length - 1] : null
  const savedSummary = semesters.length === 1 ? "1 saved calculation" : `${semesters.length} saved calculations`

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
        {error ? (
          <section className="status-banner status-banner--error flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" role="alert" aria-live="assertive">
            <span>{error}</span>
            <button type="button" className="secondary-button !min-h-0 !w-auto justify-center px-4 py-2 text-sm" onClick={() => {
              setLoading(true)
              setReloadToken((value) => value + 1)
            }}>
              Retry
            </button>
          </section>
        ) : null}

        <section className="section-card section-card--hero">
          <p className="eyebrow">Overall CGPA</p>
          <p className={`mt-2 text-5xl font-black tracking-tight ${getGpaColorClass(cgpa)}`}>{cgpa.toFixed(2)}</p>
          <p className="mt-3 text-sm leading-6 text-[#a8b1c7]">
            {latestSemester
              ? `You're currently tracking through semester ${latestSemester.semNum}. Open the calculator to update your next result or review saved semesters below.`
              : "Start with the calculator, save your semester result, and your academic history will appear here."}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => navigate("/calculator")} className="primary-button">
              Open Calculator
            </button>
            <button type="button" onClick={() => navigate("/profile")} className="secondary-button">
              View Profile
            </button>
          </div>
        </section>

        <section className="section-card">
          <div className="list-row">
            <div className="list-row__icon">
              <span className="material-symbols-outlined text-[20px] text-[#adc6ff]">history</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#f3f6ff]">History</p>
              <p className="mt-1 text-sm text-[#8c909f]">
                {latestSemester
                  ? `${savedSummary}. Latest entry: semester ${latestSemester.semNum}.`
                  : "No saved calculations yet."}
              </p>
            </div>
          </div>
        </section>

        {semesters.length === 0 ? (
          <section className="section-card py-12 text-center">
            <span className="material-symbols-outlined text-5xl text-[#31394d]">history</span>
            <h2 className="mt-4 text-lg font-semibold text-[#dae2fd]">No semesters saved yet</h2>
            <p className="mt-2 text-sm leading-6 text-[#8c909f]">Your semester results will appear here once you save a completed calculation.</p>
            <button type="button" onClick={() => navigate("/calculator")} className="primary-button mt-6 justify-center">
              Calculate Your First Semester
            </button>
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
