import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Zap,
  GraduationCap,
  Building2,
  User,
  LogOut,
  Search,
  Sparkles,
  Calendar,
  Radio,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Compass
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, role, profile, signOut } = useAuth()

  const userName =
    profile?.full_name || localStorage.getItem("user_name") || "Student"
  const userRole = role || localStorage.getItem("user_role") || "student"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 rounded-full transition-all duration-300 ${
            scrolled
              ? "bg-[#0B0D13]/85 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.85)]"
              : "bg-[#0F121A]/60 backdrop-blur-xl border border-white/[0.07]"
          }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <Zap className="h-4 w-4 fill-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0B0D13] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  COLLEGE<span className="text-indigo-400">BUZZ</span>
                </span>
                <span className="hidden lg:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-mono-acc font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  LIVE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => {
                navigate("/")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                location.pathname === "/"
                  ? "text-white bg-white/[0.08]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              Explore Feed
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center space-x-1.5"
            >
              <Flame size={13} className="text-amber-400" />
              <span>Campus Fests</span>
            </button>
            <button
              onClick={() => scrollToSection("stories")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all flex items-center space-x-1.5"
            >
              <Radio size={13} className="text-pink-400 animate-pulse" />
              <span>Highlights</span>
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              Why Buzz
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Quick Search Shortcut */}
            <button
              onClick={() => scrollToSection("events")}
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-slate-200 transition-all text-xs"
            >
              <Search size={13} className="text-slate-400" />
              <span className="text-[11px] font-medium">Search fests...</span>
              <kbd className="text-[9px] font-mono-acc px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-400">
                ⌘K
              </kbd>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={
                    userRole === "admin" || userRole === "college"
                      ? "/admin-dashboard"
                      : "/student-dashboard"
                  }
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="truncate max-w-[100px]">{userName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-full hover:bg-white/[0.05]"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/student-auth"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.02] flex items-center space-x-1.5"
                >
                  <GraduationCap size={14} />
                  <span>Student Sign In</span>
                </Link>

                <Link
                  to="/college-auth"
                  className="px-3.5 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-slate-300 hover:text-white text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5"
                >
                  <Building2 size={13} className="text-purple-400" />
                  <span>College Host</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            {!isAuthenticated ? (
              <Link
                to="/student-auth"
                className="px-3 py-1.5 rounded-full bg-indigo-500 text-white text-[11px] font-bold"
              >
                Sign In
              </Link>
            ) : (
              <Link
                to={
                  userRole === "admin" || userRole === "college"
                    ? "/admin-dashboard"
                    : "/student-dashboard"
                }
                className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/[0.05]"
              aria-label="Toggle Navigation"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Sheet */}
        {isMenuOpen && (
          <div className="sm:hidden mt-2 p-4 rounded-3xl bg-[#0F121A]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                navigate("/")
                setIsMenuOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl"
            >
              Explore Feed
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl"
            >
              Campus Fests & Events
            </button>
            <button
              onClick={() => scrollToSection("stories")}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl"
            >
              Campus Highlights
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl"
            >
              Why College Buzz
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.05] rounded-xl"
            >
              Contact Support
            </button>

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={
                      userRole === "admin" || userRole === "college"
                        ? "/admin-dashboard"
                        : "/student-dashboard"
                    }
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-indigo-600 text-white text-xs font-bold text-center"
                  >
                    Go to Dashboard ({userName})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full py-2 px-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/student-auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold text-center"
                  >
                    Student Portal
                  </Link>
                  <Link
                    to="/college-auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-bold text-center"
                  >
                    College Host Console
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
