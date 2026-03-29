import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { onAuthChange } from "../firebase/auth.js"

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(currentUser => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return (
    <div className="bg-[#0b1326] min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 bg-[#222a3d] rounded-2xl flex items-center justify-center border border-[#adc6ff]/20">
        <span className="material-symbols-outlined text-[#adc6ff] text-3xl">school</span>
      </div>
      <div className="w-8 h-8 rounded-full border-2 border-[#adc6ff] border-t-transparent animate-spin" />
      <p className="text-[#8c909f] text-sm">Loading...</p>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  return children
}
