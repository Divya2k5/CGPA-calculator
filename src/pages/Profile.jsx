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
    <div className="bg-[#0b1326] min-h-screen text-[#dae2fd] pb-28">
      <div className="bg-slate-900/80 backdrop-blur-xl px-6 py-4 flex items-center gap-3 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto w-full flex items-center gap-3">
          <span className="material-symbols-outlined text-[#adc6ff]">person</span>
          <h1 className="text-lg font-bold text-blue-200">Profile</h1>
        </div>
      </div>

      <div className="px-6 pt-6 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#222a3d] rounded-full border-2 border-[#adc6ff]/30 flex items-center justify-center mx-auto">
            <span className="text-4xl font-black text-[#adc6ff]">{initial}</span>
          </div>
          <p className="text-lg font-bold text-white mt-4">{email}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#64d8d8] mt-1">Anna University Student</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-[#171f33] rounded-xl px-5 py-4 border border-[#424754]/10 flex justify-between items-center gap-4"><p className="text-xs text-[#8c909f]">Email</p><p className="text-sm font-semibold text-[#dae2fd] text-right break-all">{email}</p></div>
          <div className="bg-[#171f33] rounded-xl px-5 py-4 border border-[#424754]/10 flex justify-between items-center gap-4"><p className="text-xs text-[#8c909f]">Department</p><p className="text-sm font-semibold text-[#dae2fd] text-right">ECE</p></div>
          <div className="bg-[#171f33] rounded-xl px-5 py-4 border border-[#424754]/10 flex justify-between items-center gap-4"><p className="text-xs text-[#8c909f]">Regulation</p><p className="text-sm font-semibold text-[#dae2fd] text-right">2021</p></div>
          <div className="bg-[#171f33] rounded-xl px-5 py-4 border border-[#424754]/10 flex justify-between items-center gap-4"><p className="text-xs text-[#8c909f]">University</p><p className="text-sm font-semibold text-[#dae2fd] text-right">Anna University</p></div>
        </div>

        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-[#8c909f] font-bold mb-3">About App</p>
          <div className="bg-[#171f33] rounded-xl border border-[#424754]/10 overflow-hidden">
            <div className="flex justify-between px-5 py-3.5 border-b border-[#424754]/10"><span className="text-xs text-[#8c909f]">Version</span><span className="text-sm font-semibold text-[#dae2fd] text-right">1.0.0</span></div>
            <div className="flex justify-between px-5 py-3.5 border-b border-[#424754]/10"><span className="text-xs text-[#8c909f]">Built for</span><span className="text-sm font-semibold text-[#dae2fd] text-right">Anna University Students</span></div>
            <div className="flex justify-between px-5 py-3.5 border-b border-[#424754]/10 gap-4"><span className="text-xs text-[#8c909f]">Departments</span><span className="text-sm font-semibold text-[#dae2fd] text-right">ECE, CSE, IT, MECH, CIVIL, EEE</span></div>
            <div className="flex justify-between px-5 py-3.5 gap-4"><span className="text-xs text-[#8c909f]">Regulations</span><span className="text-sm font-semibold text-[#dae2fd] text-right">2017, 2021</span></div>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-[#93000a]/40 border border-[#ffb4ab]/20 text-[#ffb4ab] rounded-xl py-4 text-sm font-bold flex items-center justify-center gap-2 mt-6"
          onClick={() => logOut().then(() => navigate("/login"))}
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
