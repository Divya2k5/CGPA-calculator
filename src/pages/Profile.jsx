import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/config.js"
import { logOut } from "../firebase/auth.js"
import BottomNav from "../components/BottomNav.jsx"

export default function Profile() {
  const navigate = useNavigate()
  const [email] = useState(auth.currentUser?.email || "student@annauniv.edu")
  const initial = email.slice(0, 1).toUpperCase()

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
          onClick={() => logOut().then(() => navigate("/login"))}
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign Out
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
