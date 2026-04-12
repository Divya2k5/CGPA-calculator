import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import CalculatorPage from "./pages/CalculatorPage.jsx"
import History from "./pages/History.jsx"
import Profile from "./pages/Profile.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/calculator" element={
          <ProtectedRoute><CalculatorPage /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
