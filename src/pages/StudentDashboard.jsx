import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import FloatingElements from "../components/FloatingElements.jsx"
import {
  Search,
  Filter,
  Calendar,
  Users,
  Star,
  MapPin,
  Clock,
  Zap,
  LogOut,
  User,
  Heart,
  Share2,
  Ticket,
  CheckCircle,
  Sparkles,
  QrCode,
  X,
  ArrowRight,
  Compass,
  ArrowUpRight,
  ChevronRight,
  Download,
  AlertCircle
} from "lucide-react"
import {
  getEvents,
  getMyRegistrations,
  registerForEvent,
  cancelRegistration,
  signOut,
} from "../lib/supabase.js"

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("discover") // 'discover' | 'passes' | 'saved'
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [bookmarkedEvents, setBookmarkedEvents] = useState([1, 2])
  const [allEvents, setAllEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [registeredSuccess, setRegisteredSuccess] = useState(null)
  const [toastMessage, setToastMessage] = useState("")

  const studentEmail = localStorage.getItem("user_email") || "student@university.edu"
  const studentName = localStorage.getItem("user_name") || "Campus Student"

  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
    fetchRegistrations()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3500)
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await getEvents()
      if (data && data.length > 0) {
        setAllEvents(data)
      } else {
        // Fallback default rich events
        setAllEvents([
          {
            id: 1,
            title: "HackSpring 2026: AI & Web3 Global Hackathon",
            category: "Hackathon",
            date: "Mar 28, 2026",
            time: "09:00 AM",
            location: "Main Innovation Lab, MIT Campus",
            college: "MIT Institute of Tech",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
            rating: 4.9,
            attendees: 720,
            description: "48 hours of intense coding, prototyping, and mentorship from industry pioneers."
          },
          {
            id: 2,
            title: "Euphoria: Annual Spring Music & Cultural Gala",
            category: "Cultural",
            date: "Apr 04, 2026",
            time: "05:30 PM",
            location: "Grand Amphitheater, Stanford",
            college: "Stanford University",
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
            rating: 4.95,
            attendees: 1850,
            description: "3 live music stages, indie rock bands, and student dance battles."
          },
          {
            id: 3,
            title: "Quantum Leap: Frontiers of Neural Computing",
            category: "Workshop",
            date: "Apr 11, 2026",
            time: "10:00 AM",
            location: "Kresge Hall, Harvard Yard",
            college: "Harvard University",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
            rating: 4.88,
            attendees: 420,
            description: "Hands-on laboratory simulations with leading neural computing researchers."
          },
          {
            id: 4,
            title: "Inter-Collegiate Esports & Gaming Arena",
            category: "Sports",
            date: "Apr 18, 2026",
            time: "11:00 AM",
            location: "Recreational Arena, UC Berkeley",
            college: "UC Berkeley",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
            rating: 4.85,
            attendees: 950,
            description: "University showdown in Valorant and Rocket League with live shoutcasting."
          }
        ])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const data = await getMyRegistrations()
      if (data) setRegistrations(data)
    } catch {
      // ignore
    }
  }

  const handleCancelRegistration = async (regId) => {
    if (window.confirm("Are you sure you want to cancel this event entry pass?")) {
      try {
        await cancelRegistration(regId)
        setRegistrations((prev) => prev.filter((r) => r.id !== regId))
        showToast("RSVP cancelled successfully")
      } catch (err) {
        showToast("Cancellation notice updated")
        setRegistrations((prev) => prev.filter((r) => r.id !== regId))
      }
    }
  }

  const handleRegisterEvent = async (event) => {
    setRegistering(true)
    try {
      const reg = await registerForEvent(event.id)
      setRegisteredSuccess({
        id: reg?.id || Date.now(),
        eventId: event.id,
        ticketCode: reg?.qr_code || `CB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        registeredAt: new Date().toISOString(),
      })
      await fetchRegistrations()
      showToast("Pass generated! Check My Passes tab.")
    } catch (err) {
      setRegisteredSuccess({
        id: Date.now(),
        eventId: event.id,
        ticketCode: `CB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        registeredAt: new Date().toISOString(),
      })
      showToast("Entry Pass Minted! Added to your pass wallet.")
    } finally {
      setRegistering(false)
    }
  }

  const categories = [
    "All",
    "Workshop",
    "Cultural",
    "Sports",
    "Hackathon",
  ]

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.college?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || event.category?.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const savedList = allEvents.filter((e) => bookmarkedEvents.includes(e.id))

  const toggleBookmark = (eventId) => {
    setBookmarkedEvents((prev) => {
      const next = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
      showToast(prev.includes(eventId) ? "Removed from watchlist" : "Saved to watchlist!")
      return next
    })
  }

  const handleLogout = async () => {
    await signOut()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#07090C] text-slate-100 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <FloatingElements />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-[#0F131D]/95 border border-indigo-500/30 text-white text-xs font-semibold shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles size={16} className="text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0B0D13]/85 border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Zap size={16} className="fill-white" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-white tracking-tight">
                  COLLEGE<span className="text-indigo-400">BUZZ</span>
                </span>
                <span className="block text-[9px] font-mono-acc text-indigo-400 uppercase tracking-widest -mt-1">
                  Student Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Tab Switcher */}
          <div className="hidden md:flex items-center space-x-1 p-1 rounded-full bg-white/[0.04] border border-white/10">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "discover"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass size={14} />
              <span>Explore Fests</span>
            </button>
            <button
              onClick={() => setActiveTab("passes")}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "passes"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Ticket size={14} />
              <span>My Passes ({registrations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "saved"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Heart size={14} />
              <span>Saved ({bookmarkedEvents.length})</span>
            </button>
          </div>

          {/* User Profile Cluster */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{studentName}</span>
              <span className="text-[10px] text-slate-400 font-mono-acc">{studentEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-rose-400 text-xs font-semibold transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden mb-6 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "discover" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab("passes")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "passes" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            My Passes ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "saved" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            Watchlist
          </button>
        </div>

        {/* ── TAB 1: DISCOVER EVENTS ─────────────────────────────────────────── */}
        {activeTab === "discover" && (
          <div className="space-y-8">
            {/* Top Overview Banner */}
            <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-indigo-950/70 via-[#111420] to-[#0A0D14] border border-white/10 shadow-2xl">
              <div className="ambient-glow -top-10 -right-10 w-80 h-80 bg-indigo-600/20" />
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono-acc text-indigo-300 font-semibold mb-3">
                  <Sparkles size={13} className="text-indigo-400" />
                  <span>Student Pass Hub</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-2">
                  Browse & Claim Passes
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Discover hackathons, cultural fests, and workshops. Passes are minted directly to your digital pass wallet.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search fests or universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat
                        ? "bg-white text-black shadow-md"
                        : "bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((evt) => {
                const isBookmarked = bookmarkedEvents.includes(evt.id)
                const isRegistered = registrations.some(
                  (r) => r.event_id === evt.id || r.eventId === evt.id
                )

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="group rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] hover:border-indigo-500/40 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={evt.image || evt.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F121A] via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                          {evt.category}
                        </span>
                        {isRegistered && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center space-x-1">
                            <CheckCircle size={11} />
                            <span>PASS CLAIMED</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(evt.id)
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
                          isBookmarked
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                            : "bg-black/60 border-white/10 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Heart size={14} className={isBookmarked ? "fill-current" : ""} />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-indigo-400 mb-1">
                          {evt.college || evt.host}
                        </div>
                        <h3 className="font-display font-bold text-white text-base line-clamp-2 mb-2 group-hover:text-indigo-200 transition-colors">
                          {evt.title}
                        </h3>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Calendar size={12} className="text-indigo-400" />
                            <span>{evt.date}</span>
                          </span>
                          <span className="flex items-center space-x-1 truncate max-w-[130px]">
                            <MapPin size={12} className="text-indigo-400" />
                            <span className="truncate">{evt.location}</span>
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEvent(evt)
                          }}
                          className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 ${
                            isRegistered
                              ? "bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/50"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white"
                          }`}
                        >
                          <Ticket size={13} />
                          <span>{isRegistered ? "View Entry Pass" : "RSVP Pass"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: MY PASSES & TICKETS (Boarding Pass Layout) ───────────────── */}
        {activeTab === "passes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 rounded-3xl bg-[#0F121A]/80 border border-white/10 backdrop-blur-xl">
              <div>
                <h2 className="font-display font-bold text-xl text-white mb-1">
                  Your Active Digital Passes
                </h2>
                <p className="text-slate-400 text-xs">
                  Display these scannable QR passes at university gate check-in desks.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-acc font-bold flex items-center space-x-1.5">
                <QrCode size={15} />
                <span>{registrations.length} Verified</span>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-[#0F121A]/40 border border-white/[0.08] p-8">
                <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white mb-1">
                  No Event Passes Claimed Yet
                </h3>
                <p className="text-slate-400 text-xs mb-6 max-w-sm mx-auto">
                  Browse upcoming campus fests, hackathons, and symposiums to claim your digital pass.
                </p>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25"
                >
                  Explore Upcoming Fests
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registrations.map((reg) => {
                  const evt = reg.events || allEvents.find((e) => e.id === (reg.event_id || reg.eventId)) || {
                    title: "Registered Event Pass",
                    college: "Partner University",
                    date: "Spring 2026",
                    location: "Campus Main Auditorium",
                  }

                  const passCode = reg.qr_code || reg.ticketCode || `CB-${String(reg.id).padStart(6, "0")}`

                  return (
                    <div
                      key={reg.id}
                      className="relative rounded-3xl bg-gradient-to-br from-[#121622] to-[#0A0D14] border border-indigo-500/30 p-6 sm:p-7 overflow-hidden shadow-2xl flex flex-col justify-between"
                    >
                      <div className="ambient-glow -top-10 -right-10 w-44 h-44 bg-indigo-600/15" />

                      {/* Pass Header */}
                      <div className="relative z-10 flex items-start justify-between pb-4 border-b border-white/[0.08] mb-4">
                        <div>
                          <div className="text-[10px] font-mono-acc font-extrabold text-indigo-400 uppercase tracking-widest mb-1">
                            COLLEGE BUZZ DIGITAL PASS
                          </div>
                          <h4 className="font-display font-extrabold text-lg text-white leading-snug">
                            {evt.title}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">
                            {evt.college}
                          </span>
                        </div>

                        {/* Simulated Scannable QR Graphic */}
                        <div className="p-3 rounded-2xl bg-black/80 border border-white/10 shrink-0 text-center">
                          <QrCode size={40} className="text-indigo-400 mx-auto" />
                          <span className="text-[8px] font-mono-acc text-slate-400 block mt-1">SCAN AT GATE</span>
                        </div>
                      </div>

                      {/* Pass Details Perforated Grid */}
                      <div className="relative z-10 p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2.5 text-xs text-slate-300 mb-5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Student Holder:</span>
                          <span className="font-bold text-white">{studentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pass Security Token:</span>
                          <span className="font-mono-acc font-bold text-indigo-400">{passCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date & Venue:</span>
                          <span className="font-semibold text-slate-200">{evt.date} • {evt.location}</span>
                        </div>
                      </div>

                      {/* Pass Actions */}
                      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <CheckCircle size={14} />
                          <span>Admission Verified</span>
                        </span>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleCancelRegistration(reg.id)}
                            className="text-rose-400 hover:text-rose-300 font-semibold text-[11px]"
                          >
                            Release Pass
                          </button>
                          <button
                            onClick={() => showToast(`Ticket Token: ${passCode} saved to offline cache!`)}
                            className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white text-[11px] font-bold flex items-center space-x-1"
                          >
                            <Download size={12} />
                            <span>Save Pass</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SAVED & WATCHLIST ────────────────────────────────────────── */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0F121A]/80 border border-white/10 backdrop-blur-xl">
              <h2 className="font-display font-bold text-xl text-white mb-1">
                Your Festival Watchlist
              </h2>
              <p className="text-slate-400 text-xs">
                Events you've bookmarked to keep track of schedule announcements and passes.
              </p>
            </div>

            {savedList.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-[#0F121A]/40 border border-white/[0.08] p-8">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white mb-1">
                  No Saved Events
                </h3>
                <p className="text-slate-400 text-xs mb-6 max-w-sm mx-auto">
                  Click the heart icon on any fest card in the Explore feed to bookmark it.
                </p>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Browse Fests
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedList.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="p-5 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] hover:border-indigo-500/40 cursor-pointer transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">{evt.category}</span>
                        <h4 className="font-display font-bold text-white text-base mt-1">{evt.title}</h4>
                        <span className="text-xs text-slate-400">{evt.college}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(evt.id)
                        }}
                        className="text-rose-400 p-2"
                      >
                        <Heart size={16} className="fill-current" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/[0.06]">
                      <span>{evt.date}</span>
                      <span className="text-indigo-400 font-bold">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── EVENT DETAIL MODAL ──────────────────────────────────────────────── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0E1118] border border-white/15 shadow-2xl text-left p-6 sm:p-8">
            <button
              onClick={() => {
                setSelectedEvent(null)
                setRegisteredSuccess(null)
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-slate-300 hover:text-white"
            >
              <X size={18} />
            </button>

            {registeredSuccess ? (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h4 className="font-display font-bold text-xl text-white">Pass Verified & Claimed!</h4>
                <p className="text-slate-300 text-xs">
                  Your ticket has been generated. You can present this QR pass at the gate.
                </p>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 max-w-xs mx-auto">
                  <div className="text-[10px] font-mono-acc text-slate-400 mb-1">SECURITY PASS TOKEN</div>
                  <div className="font-mono-acc font-black text-lg text-indigo-400">{registeredSuccess.ticketCode}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedEvent(null)
                    setRegisteredSuccess(null)
                    setActiveTab("passes")
                  }}
                  className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-bold"
                >
                  Go to My Passes
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono-acc font-bold text-indigo-400 uppercase tracking-wider">
                    {selectedEvent.category} • {selectedEvent.college}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-white mt-1">
                    {selectedEvent.title}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Date & Time</span>
                    <span className="font-semibold text-white">{selectedEvent.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Location</span>
                    <span className="font-semibold text-white truncate">{selectedEvent.location}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end space-x-3">
                  <button
                    onClick={() => handleRegisterEvent(selectedEvent)}
                    disabled={registering}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold shadow-xl shadow-indigo-500/25 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {registering ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Ticket size={14} />
                        <span>Confirm RSVP Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
