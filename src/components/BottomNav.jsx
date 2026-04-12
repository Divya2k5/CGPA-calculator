import { useNavigate, useLocation } from "react-router-dom"

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { label: "Home", icon: "home", path: "/" },
    { label: "Calculator", icon: "calculate", path: "/calculator" },
    { label: "Profile", icon: "person", path: "/profile" }
  ]

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/5 bg-[#0c1428]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-2xl items-center justify-around px-3">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path

        return (
          <button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            className={isActive
              ? "flex min-w-[88px] flex-col items-center justify-center rounded-2xl bg-[#adc6ff]/12 px-4 py-2 text-[#dae2fd] transition-all"
              : "flex min-w-[88px] flex-col items-center justify-center rounded-2xl px-4 py-2 text-[#7f8aa3] transition-all hover:text-[#dae2fd]"}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="mt-1 text-[11px] font-medium">{tab.label}</span>
          </button>
        )
      })}
      </div>
    </div>
  )
}
