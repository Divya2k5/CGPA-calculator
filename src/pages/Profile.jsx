import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/config.js"
import { logOut } from "../firebase/auth.js"
import { toAppErrorMessage } from "../utils/appErrors.js"
import BottomNav from "../components/BottomNav.jsx"

export default function Profile() {
  const navigate = useNavigate()
  const [email] = useState(auth?.currentUser?.email || "No email available")
  const [error, setError] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)
  const initial = email.slice(0, 1).toUpperCase()

  const handleLogout = async () => {
    setLoggingOut(true)
    setError("")

    try {
      await logOut()
      navigate("/login", { replace: true })
    } catch (err) {
      setError(toAppErrorMessage(err, "Sign-out failed. Please try again."))
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar__inner">
          <div>
            <p className="eyebrow">Profile</p>
            <h1 className="page-title">Account</h1>
          </div>
        </div>
      </header>

      <main className="app-content space-y-5">
        {error ? (
          <section className="status-banner status-banner--error" role="alert" aria-live="assertive">
            {error}
          </section>
        ) : null}

        <section className="section-card text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#111a2f] text-3xl font-black text-[#adc6ff]">
            {initial}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#f3f6ff]">{email}</h2>
          <p className="mt-2 text-sm text-[#8c909f]">Signed in to your CGPA tracker account.</p>
        </section>

        <section className="section-card overflow-hidden">
          <div className="profile-row">
            <span>Email</span>
            <span className="text-right text-[#dae2fd]">{email}</span>
          </div>
          <div className="profile-row">
            <span>University</span>
            <span className="text-[#dae2fd]">Anna University</span>
          </div>
          <div className="profile-row">
            <span>App focus</span>
            <span className="text-[#dae2fd]">GPA and CGPA tracking</span>
          </div>
        </section>

        <button
          type="button"
          className="danger-button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          {loggingOut ? "Signing Out..." : "Sign Out"}
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
