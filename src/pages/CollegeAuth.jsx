import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  QrCode
} from "lucide-react"
import FloatingElements from "../components/FloatingElements.jsx"
import { signIn, signUpAdmin, resendConfirmation } from "../lib/supabase.js"

const CollegeAuth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    collegeName: "",
    adminName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")
  const [apiSuccess, setApiSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
    if (apiError) setApiError("")
  }

  const validateForm = () => {
    const newErrors = {}
    if (!isLogin) {
      if (!formData.collegeName.trim()) {
        newErrors.collegeName = "Institution name is required"
      }
      if (!formData.adminName.trim()) {
        newErrors.adminName = "Representative name is required"
      }
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = "Official contact number is required"
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Official college email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid official email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setApiError("")
    setApiSuccess("")

    try {
      if (isLogin) {
        const data = await signIn({
          email: formData.email,
          password: formData.password,
        })

        localStorage.setItem("token", data.session.access_token)
        localStorage.setItem("user_email", formData.email)
        localStorage.setItem(
          "user_name",
          data.user?.user_metadata?.full_name || formData.email.split("@")[0],
        )
        localStorage.setItem("user_role", "admin")

        navigate("/admin-dashboard")
      } else {
        const data = await signUpAdmin({
          email: formData.email,
          password: formData.password,
          adminName: formData.adminName,
          collegeName: formData.collegeName,
          contactNumber: formData.contactNumber,
        })

        if (data.session) {
          localStorage.setItem("token", data.session.access_token)
          localStorage.setItem("user_email", formData.email)
          localStorage.setItem("user_name", formData.adminName)
          localStorage.setItem("college_name", formData.collegeName)
          localStorage.setItem("user_role", "admin")

          navigate("/admin-dashboard")
        } else {
          setNeedsConfirmation(true)
          setApiSuccess(
            "College account created! Please check your inbox to confirm your email, then sign in.",
          )
          setTimeout(() => {
            setIsLogin(true)
            setFormData({
              collegeName: "",
              adminName: "",
              contactNumber: "",
              email: formData.email,
              password: "",
              confirmPassword: "",
            })
            setApiSuccess("")
            setNeedsConfirmation(false)
          }, 4000)
        }
      }
    } catch (err) {
      const msg = err.message || ""
      if (msg.includes("Email not confirmed")) {
        setNeedsConfirmation(true)
        setApiError(
          "Email not confirmed yet. Check your inbox or resend the confirmation link.",
        )
      } else if (
        msg.includes("already registered") ||
        msg.includes("User already registered")
      ) {
        setApiError(
          "An account with this email already exists. Please sign in.",
        )
        setIsLogin(true)
      } else {
        setApiError(msg || "Authentication failed. Please verify credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#07090C] text-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden pt-24 pb-12 selection:bg-purple-500 selection:text-white">
      <FloatingElements />

      <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-white/10 bg-[#0E1118]/85 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]">
        {/* Left Side: Host Studio Overview */}
        <div className="lg:col-span-5 relative p-8 sm:p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-purple-950/60 via-[#141220] to-[#0A0D14] border-b lg:border-b-0 lg:border-r border-white/[0.08]">
          <div className="ambient-glow top-0 left-0 w-64 h-64 bg-purple-500/20" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white mb-8 transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Campus Buzz</span>
            </Link>

            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-lg shadow-purple-500/20">
              <Building2 size={24} />
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-3">
              College Host Studio.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Publish university fests, hackathons, and tech seminars. Access real-time attendee rosters and lightning-fast gate QR verification.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-6 border-t border-white/[0.08]">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <ShieldCheck size={15} className="text-purple-400 shrink-0" />
              <span>Verified university organizer credential</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <QrCode size={15} className="text-emerald-400 shrink-0" />
              <span>Live gate check-in scanner and attendee sync</span>
            </div>
          </div>
        </div>

        {/* Right Side: Host Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          {/* Segmented Switcher Pill */}
          <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] grid grid-cols-2 gap-1 mb-8">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setErrors({})
                setApiError("")
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                isLogin
                  ? "bg-white text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Organizer Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setErrors({})
                setApiError("")
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                !isLogin
                  ? "bg-white text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register College
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-display font-bold text-xl text-white mb-1">
              {isLogin ? "Host Console Sign In" : "Onboard Your Institution"}
            </h3>
            <p className="text-slate-400 text-xs">
              {isLogin
                ? "Enter your administrator credentials to manage your events."
                : "Register your university or department to start publishing."}
            </p>
          </div>

          {/* Alerts */}
          {apiError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-start space-x-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {apiSuccess && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-start space-x-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span>{apiSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                    Institution / University Name
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      placeholder="e.g. Stanford University or MIT Media Lab"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  {errors.collegeName && <p className="text-rose-400 text-[11px] mt-1 ml-1">{errors.collegeName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                      Admin Representative
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleInputChange}
                        placeholder="Dr. Jordan Hayes"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    {errors.adminName && <p className="text-rose-400 text-[11px] mt-1 ml-1">{errors.adminName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                      Contact Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    {errors.contactNumber && <p className="text-rose-400 text-[11px] mt-1 ml-1">{errors.contactNumber}</p>}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                Official College Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="fest-chair@college.edu"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              {errors.email && <p className="text-rose-400 text-[11px] mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-[11px] mt-1 ml-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-rose-400 text-[11px] mt-1 ml-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:scale-[1.01] active:scale-[0.99] text-white text-xs font-bold tracking-wide shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Open Host Console" : "Onboard Institution"}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Student Portal */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <span className="text-xs text-slate-400">Looking to attend events as a student? </span>
            <Link to="/student-auth" className="text-xs font-bold text-purple-400 hover:underline">
              Student Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollegeAuth
