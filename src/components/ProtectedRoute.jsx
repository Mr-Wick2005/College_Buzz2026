import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/**
 * ProtectedRoute: Ensures user is authenticated and authorized according to their role.
 *
 * @param {string} requiredRole - Optional role ('admin' | 'student'). If omitted, any authenticated user is allowed.
 * @param {React.ReactNode} children - Child component to render.
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold">
          Verifying session...
        </p>
      </div>
    )
  }

  // If not authenticated, redirect to appropriate login portal
  if (!isAuthenticated) {
    const redirectPath =
      requiredRole === "admin" ? "/college-auth" : "/student-auth"
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // If a specific role is required, verify user has that role
  if (requiredRole) {
    const normalizedRole = role === "college" ? "admin" : role
    const isAuthorized = normalizedRole === requiredRole

    if (!isAuthorized) {
      // Redirect to their own dashboard or home if attempting to access unauthorized portal
      if (normalizedRole === "admin") {
        return <Navigate to="/admin-dashboard" replace />
      } else {
        return <Navigate to="/student-dashboard" replace />
      }
    }
  }

  return children
}

export default ProtectedRoute
