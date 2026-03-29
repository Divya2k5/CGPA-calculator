import { useNavigate, useLocation } from "react-router-dom"

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { label: "Home", icon: "dashboard", path: "/dashboard" },
    { label: "Calculator", icon: "calculate", path: "/calculator" },
    { label: "History", icon: "history", path: "/history" },
    { label: "Profile", icon: "person", path: "/profile" }
  ]

  return (
    <div className="fixed bottom-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl shadow border-t border-white/5 flex justify-around items-center h-20 px-4">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path

        return (
          <button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            className={isActive
              ? "flex flex-col items-center justify-center bg-blue-500/20 text-blue-200 rounded-xl px-4 py-1.5 transition-all"
              : "flex flex-col items-center justify-center text-slate-500 p-2 hover:text-blue-100 transition-all"}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] uppercase tracking-[0.05em] font-medium mt-1">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
