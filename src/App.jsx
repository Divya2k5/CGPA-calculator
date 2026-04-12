import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.jsx"
import CalculatorPage from "./pages/CalculatorPage.jsx"
import History from "./pages/History.jsx"
import Profile from "./pages/Profile.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/calculator" element={
          <ProtectedRoute><CalculatorPage /></ProtectedRoute>
        } />
        <Route path="/history" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
