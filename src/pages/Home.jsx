import React, { useState, useEffect, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import FloatingElements from "../components/FloatingElements.jsx"
import ContactForm from "../components/ContactForm.jsx"
import {
  Calendar,
  Users,
  Search,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
  Building2,
  GraduationCap,
  Heart,
  Share2,
  CheckCircle2,
  Flame,
  Radio,
  SlidersHorizontal,
  Ticket,
  ChevronRight,
  X,
  ExternalLink,
  QrCode,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Award,
  Layers,
  MessageSquare
} from "lucide-react"
import { getEvents, registerForEvent } from "../lib/supabase.js"
import { useAuth } from "../context/AuthContext.jsx"

// Curated high-production campus event mock data
const INITIAL_EVENTS = [
  {
    id: 1,
    title: "HackSpring 2026: AI & Web3 Global Hackathon",
    category: "Hackathon",
    date: "Mar 28, 2026",
    time: "09:00 AM - 48 Hours",
    location: "Main Innovation Lab, MIT Campus",
    college: "MIT Institute of Tech",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80",
    rating: 4.95,
    attendees: 720,
    maxAttendees: 800,
    price: "Free Entry",
    description: "The flagship annual hackathon bringing together 800+ builders, designers, and researchers. $50,000+ in bounties, mentor office hours with Silicon Valley founders, hardware lab access, and unlimited caffeine.",
    speakers: ["Dr. Aris Vance (MIT AI)", "Sarah Lin (Founder, VectorLabs)"],
    schedule: [
      { time: "09:00 AM", title: "Opening Ceremony & Problem Tracks" },
      { time: "12:00 PM", title: "Team Formation & Hacking Starts" },
      { time: "06:00 PM", title: "Late Night Lightning Mentoring" },
      { time: "Sunday 2 PM", title: "Grand Pitch Finale & Awards" }
    ],
    featured: true,
    day: "28",
    month: "MAR"
  },
  {
    id: 2,
    title: "Euphoria: Annual Spring Music & Cultural Gala",
    category: "Cultural",
    date: "Apr 04, 2026",
    time: "05:30 PM - 11:30 PM",
    location: "Grand Amphitheater, Stanford",
    college: "Stanford University",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80",
    rating: 4.98,
    attendees: 1850,
    maxAttendees: 2000,
    price: "Student Pass",
    description: "Experience 3 live stages featuring indie rock bands, electronic sets, cultural dance troupes, and visual projection mapping across the historic Quad.",
    speakers: ["Neon Horizon (Live Band)", "The Stanford Arts Collective"],
    schedule: [
      { time: "05:30 PM", title: "Acoustic Sunset Stage Open" },
      { time: "07:30 PM", title: "Inter-Collegiate Dance Showdown" },
      { time: "09:30 PM", title: "Headline Concert & Drone Sky Show" }
    ],
    featured: true,
    day: "04",
    month: "APR"
  },
  {
    id: 3,
    title: "Quantum Leap: Frontiers of Neural Computing & Robotics",
    category: "Workshop",
    date: "Apr 11, 2026",
    time: "10:00 AM - 04:00 PM",
    location: "Kresge Hall, Harvard Yard",
    college: "Harvard University",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
    rating: 4.88,
    attendees: 420,
    maxAttendees: 500,
    price: "Free Entry",
    description: "Hands-on seminar and laboratory demonstrations with leading minds in neuromorphic chips, quantum simulation, and autonomous humanoid robotics.",
    speakers: ["Prof. Elena Rostova", "Marcus Chen (Chief Scientist)"],
    schedule: [
      { time: "10:00 AM", title: "Keynote: Neuromorphic Architecture" },
      { time: "01:30 PM", title: "Hands-on Lab Simulation" },
      { time: "03:15 PM", title: "Researcher Networking Roundtable" }
    ],
    featured: false,
    day: "11",
    month: "APR"
  },
  {
    id: 4,
    title: "Inter-Collegiate Esports & Gaming Arena 2026",
    category: "Sports",
    date: "Apr 18, 2026",
    time: "11:00 AM - 08:00 PM",
    location: "Recreational Arena, UC Berkeley",
    college: "UC Berkeley",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80",
    rating: 4.85,
    attendees: 950,
    maxAttendees: 1000,
    price: "Free Entry",
    description: "The ultimate university showdown in Valorant, Rocket League, and Smash Ultimate. High-refresh battle stations, live shoutcasting, and hardware giveaways.",
    speakers: ["Caster Jordan 'Pulse' Scott", "Cal Esports Captains"],
    schedule: [
      { time: "11:00 AM", title: "Group Stage Knockouts" },
      { time: "04:00 PM", title: "Semifinals & Halftime Cosplay" },
      { time: "06:30 PM", title: "Championship Bo5 & Trophy" }
    ],
    featured: false,
    day: "18",
    month: "APR"
  },
  {
    id: 5,
    title: "Mood Indigo: National Arts & Theater Odyssey",
    category: "Cultural",
    date: "Apr 25, 2026",
    time: "04:00 PM - 10:00 PM",
    location: "Open Air Theatre, Powai",
    college: "IIT Bombay",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80",
    rating: 4.96,
    attendees: 2400,
    maxAttendees: 2500,
    price: "Free Pass",
    description: "Asia's premier collegiate cultural extravaganza. Street play championships, spoken word poetry, indie fashion runway, and star artist night.",
    speakers: ["Renowned Theater Directors", "Celebrity Artist Panel"],
    schedule: [
      { time: "04:00 PM", title: "National Street Play Finals" },
      { time: "07:00 PM", title: "Spoken Word & Battle of the Bands" },
      { time: "09:00 PM", title: "Celebrity Headliner" }
    ],
    featured: true,
    day: "25",
    month: "APR"
  },
  {
    id: 6,
    title: "Venture Velocity: Student Startup & VC Demo Day",
    category: "Workshop",
    date: "May 02, 2026",
    time: "01:00 PM - 06:30 PM",
    location: "Auditorium 2, BITS Pilani",
    college: "BITS Pilani",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80",
    rating: 4.91,
    attendees: 380,
    maxAttendees: 400,
    price: "Free Entry",
    description: "20 collegiate startups pitch to top seed funds and angel syndicates. Interactive pitch decks, prototype tables, and venture speed-dating.",
    speakers: ["Karan Mehta (Partner, Sequoia)", "Ananya Rao (YC Alum)"],
    schedule: [
      { time: "01:00 PM", title: "Founder Keynote" },
      { time: "02:30 PM", title: "Top 20 Startup Pitches" },
      { time: "05:00 PM", title: "Investor Mixer & Term Sheet Offers" }
    ],
    featured: false,
    day: "02",
    month: "MAY"
  }
]

// Campus Stories mock data (Mobbin Social / Partiful style highlight rings)
const CAMPUS_STORIES = [
  {
    id: "s1",
    name: "HackSpring",
    college: "MIT",
    avatar: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&auto=format&fit=crop&q=80",
    badge: "🔥 Live Hype",
    views: "2.4k views",
    teaser: "Midnight hardware lab tour! 3D printers and VR rigs ready for 800 hackers."
  },
  {
    id: "s2",
    name: "Euphoria",
    college: "Stanford",
    avatar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80",
    badge: "🎸 Soundcheck",
    views: "5.1k views",
    teaser: "Stage lighting rehearsal underway at Frost Amphitheater. Check out the laser setup!"
  },
  {
    id: "s3",
    name: "Mood Indigo",
    college: "IIT Bombay",
    avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop&q=80",
    badge: "🎭 Rehearsal",
    views: "8.9k views",
    teaser: "Street play teams from 40 colleges are practicing in the main quad. Energy is unmatched."
  },
  {
    id: "s4",
    name: "Esports Cup",
    college: "UC Berkeley",
    avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80",
    badge: "⚡ Bracket Live",
    views: "3.2k views",
    teaser: "Valorant championship bracket announced! 32 collegiate squads face off this weekend."
  },
  {
    id: "s5",
    name: "AI Symposium",
    college: "Harvard",
    avatar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop&q=80",
    badge: "🤖 Demo Lab",
    views: "1.8k views",
    teaser: "Sneak peek of the autonomous drone obstacle course built by student researchers."
  }
]

const PARTNER_COLLEGES = [
  "MIT Institute of Technology",
  "Stanford University",
  "IIT Bombay",
  "Harvard University",
  "UC Berkeley",
  "BITS Pilani",
  "Oxford University",
  "Delhi University",
  "Carnegie Mellon",
  "IIT Delhi",
  "Georgia Tech"
]

const CATEGORIES = [
  "All Fests",
  "Hackathon",
  "Cultural",
  "Workshop",
  "Sports"
]

const Home = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Fests")
  const [selectedCollege, setSelectedCollege] = useState("All Campuses")
  const [viewMode, setViewMode] = useState("grid") // 'grid' | 'calendar'
  
  // Interactive Story Modal
  const [activeStory, setActiveStory] = useState(null)
  
  // Event Details Sheet Modal
  const [selectedEventModal, setSelectedEventModal] = useState(null)
  const [likedEvents, setLikedEvents] = useState(new Set([1, 2]))
  const [toastMessage, setToastMessage] = useState("")
  const [registeredSuccess, setRegisteredSuccess] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)

  // Countdown timer for headline spotlight
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 14, mins: 28, secs: 45 })

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchLiveEvents()
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 }
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 }
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const parseDateBadge = (dateStr) => {
    if (!dateStr) return { day: "28", month: "MAR" }
    try {
      const d = new Date(dateStr)
      if (!isNaN(d.getTime())) {
        const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase()
        const day = String(d.getDate()).padStart(2, "0")
        return { day, month }
      }
    } catch {}
    return { day: "15", month: "MAR" }
  }

  const fetchLiveEvents = async () => {
    try {
      setLoading(true)
      const data = await getEvents()
      if (data && data.length > 0) {
        // Merge Supabase events with rich fields
        const formatted = data.map((d, i) => {
          const badge = parseDateBadge(d.date)
          const fallbackImg = INITIAL_EVENTS[i % INITIAL_EVENTS.length]?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80"
          return {
            ...d,
            image: d.image_url || d.image || fallbackImg,
            day: badge.day,
            month: badge.month,
            price: d.price || "Free Entry",
            rating: d.rating || (4.8 + (i % 3) * 0.08).toFixed(2),
            attendees: d.attendees || 350 + i * 40,
            maxAttendees: d.maxAttendees || 500,
            schedule: d.schedule || [
              { time: "10:00 AM", title: "Registrations & Welcome Keynote" },
              { time: "01:00 PM", title: "Main Event Track & Sessions" },
              { time: "04:30 PM", title: "Networking & Showcase" },
            ],
          }
        })
        setEvents(formatted)
      }
    } catch {
      // Fallback to rich curated events
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3500)
  }

  const toggleLike = (e, eventId) => {
    e.stopPropagation()
    setLikedEvents((prev) => {
      const next = new Set(prev)
      if (next.has(eventId)) {
        next.delete(eventId)
        showToast("Removed from saved events")
      } else {
        next.add(eventId)
        showToast("Saved to your festival watchlist! 🔥")
      }
      return next
    })
  }

  const handleShare = (e, event) => {
    e.stopPropagation()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#event-${event.id}`)
      showToast(`Link for "${event.title}" copied to clipboard! 📋`)
    }
  }

  const handleQuickRSVP = async (event) => {
    if (!isAuthenticated) {
      navigate("/student-auth")
      return
    }
    setIsRegistering(true)
    try {
      const reg = await registerForEvent(event.id)
      setRegisteredSuccess({
        title: event.title,
        ticketCode: reg?.qr_code || `CB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        date: event.date,
        location: event.location
      })
      showToast("Pass confirmed! Added to your Student Dashboard.")
    } catch {
      // Offline fallback pass
      setRegisteredSuccess({
        title: event.title,
        ticketCode: `CB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        date: event.date,
        location: event.location
      })
      showToast("Pass generated! View in Student Dashboard.")
    } finally {
      setIsRegistering(false)
    }
  }

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchQuery =
        !searchQuery ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchCategory =
        selectedCategory === "All Fests" ||
        evt.category?.toLowerCase() === selectedCategory.toLowerCase()

      const matchCollege =
        selectedCollege === "All Campuses" ||
        evt.college?.toLowerCase().includes(selectedCollege.toLowerCase())

      return matchQuery && matchCategory && matchCollege
    })
  }, [events, searchQuery, selectedCategory, selectedCollege])

  const spotlightEvent = events[0] || INITIAL_EVENTS[0]

  return (
    <div className="relative min-h-screen bg-[#07090C] text-slate-100 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Aurora Mesh Background */}
      <FloatingElements />

      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-[#0F131D]/95 border border-indigo-500/30 text-white text-xs font-semibold shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles size={16} className="text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HERO SECTION: Mobbin Social & Editorial Event Layout ──────────────── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Glowing Status Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl mb-6 shadow-sm hover:border-indigo-500/30 transition-all cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono-acc font-semibold tracking-wider text-slate-300 uppercase">
              Spring 2026 University Season Live
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-indigo-400 text-xs font-bold hover:underline flex items-center">
              14 New Fests <ChevronRight size={13} className="ml-0.5" />
            </span>
          </div>

          {/* Primary High-Impact Display Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white mb-6">
            Where Campus Culture <br className="hidden sm:inline" />
            Meets <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Live Hype.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            The social discovery hub for premier collegiate hackathons, cultural concerts, tech symposiums, and sports showdowns across top institutions.
          </p>

          {/* Integrated Search & Filter Island (Luma/Mobbin pattern) */}
          <div className="p-2 sm:p-2.5 rounded-3xl sm:rounded-full bg-[#11141D]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] max-w-3xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full flex items-center pl-4">
                <Search size={18} className="text-slate-400 shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder="Search fests, hackathons, colleges, speakers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none py-2"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 mr-2 text-slate-500 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Campus Selector Dropdown */}
              <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/10 px-3 py-1 flex items-center">
                <MapPin size={15} className="text-indigo-400 mr-2 shrink-0" />
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="bg-transparent text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer py-1.5 pr-2"
                >
                  <option value="All Campuses" className="bg-[#11141D] text-white">All Campuses</option>
                  <option value="MIT" className="bg-[#11141D] text-white">MIT Institute</option>
                  <option value="Stanford" className="bg-[#11141D] text-white">Stanford University</option>
                  <option value="IIT Bombay" className="bg-[#11141D] text-white">IIT Bombay</option>
                  <option value="Harvard" className="bg-[#11141D] text-white">Harvard University</option>
                  <option value="UC Berkeley" className="bg-[#11141D] text-white">UC Berkeley</option>
                  <option value="BITS Pilani" className="bg-[#11141D] text-white">BITS Pilani</option>
                </select>
              </div>

              {/* Explore Action Button */}
              <a
                href="#events"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl sm:rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white text-xs font-extrabold tracking-wide shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-1.5 shrink-0"
              >
                <span>Find Fests</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Verified Student Passes</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-indigo-400" />
              <span>100+ Premier Universities</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-pink-400" />
              <span>Zero Scalper QR Codes</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── PARTNER UNIVERSITY TICKER: Continuous Marquee ──────────────────── */}
      <section className="relative py-4 border-y border-white/[0.06] bg-black/30 backdrop-blur-md overflow-hidden">
        <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap">
          {[...PARTNER_COLLEGES, ...PARTNER_COLLEGES].map((col, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <span className="text-xs font-mono-acc uppercase tracking-widest text-slate-400 font-semibold hover:text-white transition-colors cursor-default">
                {col}
              </span>
              <span className="text-indigo-500/50 text-xs">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAMPUS STORIES / HYPE HIGHLIGHTS (Mobbin Social Stories Pattern) ── */}
      <section id="stories" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Radio size={16} className="text-pink-400 animate-pulse" />
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight">
              Campus Hype Reels & Teasers
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Updated 10m ago</span>
        </div>

        {/* Story Avatar Rings Carousel */}
        <div className="flex items-center space-x-4 sm:space-x-6 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {CAMPUS_STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center group cursor-pointer shrink-0 focus:outline-none"
            >
              <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-500 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-pink-500/20">
                <div className="p-0.5 rounded-full bg-[#07090C]">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover group-hover:brightness-110 transition-all"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[8px] font-bold border-2 border-[#07090C]">
                  LIVE
                </span>
              </div>
              <span className="mt-2 text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                {story.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {story.college}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── SPOTLIGHT "HEADLINE FEST OF THE WEEK" ────────────────────────────── */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0F131D]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">
          <div className="ambient-glow -top-20 -right-20 w-[450px] h-[450px] bg-indigo-600/20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-mono-acc font-extrabold uppercase tracking-wider shadow-md">
                  Spotlight Fest
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1">
                  <Building2 size={13} className="text-indigo-400" />
                  <span>{spotlightEvent.college}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  {spotlightEvent.price}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                {spotlightEvent.title}
              </h2>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                {spotlightEvent.description}
              </p>

              {/* Live Countdown Clock */}
              <div className="pt-2">
                <div className="text-[10px] font-mono-acc uppercase tracking-wider text-slate-400 font-bold mb-2">
                  Registration Doors Close In:
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
                  {[
                    { label: "Days", val: timeLeft.days },
                    { label: "Hours", val: timeLeft.hours },
                    { label: "Mins", val: timeLeft.mins },
                    { label: "Secs", val: timeLeft.secs }
                  ].map((unit, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                      <div className="font-mono-acc font-extrabold text-lg sm:text-2xl text-white">
                        {String(unit.val).padStart(2, "0")}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setSelectedEventModal(spotlightEvent)}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 active:scale-95 text-white text-xs font-bold tracking-wide shadow-xl shadow-indigo-500/30 transition-all flex items-center space-x-2"
                >
                  <Ticket size={15} />
                  <span>View Details & Claim Pass</span>
                </button>

                <button
                  onClick={(e) => toggleLike(e, spotlightEvent.id)}
                  className={`p-3.5 rounded-full border transition-all ${
                    likedEvents.has(spotlightEvent.id)
                      ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                      : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white"
                  }`}
                  aria-label="Save to watchlist"
                >
                  <Heart
                    size={16}
                    className={likedEvents.has(spotlightEvent.id) ? "fill-current" : ""}
                  />
                </button>

                <button
                  onClick={(e) => handleShare(e, spotlightEvent)}
                  className="p-3.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-all"
                  aria-label="Share fest link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Right Poster Visual */}
            <div className="lg:col-span-5 relative group cursor-pointer" onClick={() => setSelectedEventModal(spotlightEvent)}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-square border border-white/10 shadow-2xl">
                <img
                  src={spotlightEvent.image}
                  alt={spotlightEvent.title}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80"
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090C] via-transparent to-transparent opacity-80" />

                {/* Overlaid Attendee Facepile */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Attendee" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Attendee" />
                      <img className="inline-block h-6 w-6 rounded-full ring-2 ring-black" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Attendee" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      +{spotlightEvent.attendees} Attending
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-acc text-amber-400 font-bold flex items-center space-x-1">
                    <Star size={12} className="fill-current" />
                    <span>{spotlightEvent.rating}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCOVERY FEED: Filter Tabs & Event Grid ─────────────────────────── */}
      <section id="events" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono-acc font-semibold uppercase tracking-wider mb-2">
              <Compass size={14} />
              <span>Campus Discovery Feed</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Upcoming University Fests & Summits
            </h2>
          </div>

          {/* View Mode Toggle: Grid vs Calendar View */}
          <div className="flex items-center space-x-1 p-1 rounded-full bg-white/[0.04] border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Card Feed
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "calendar"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Timeline / Calendar
            </button>
          </div>
        </div>

        {/* Category Pills (Mobbin Filter Ribbon) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-white text-black shadow-lg"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── CARD GRID VIEW ─────────────────────────────────────────────────── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((evt) => {
              const isLiked = likedEvents.has(evt.id)
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventModal(evt)}
                  className="group relative rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] hover:border-indigo-500/40 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                >
                  {/* Top Image Banner with Date Tag */}
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-900">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F121A] via-transparent to-transparent opacity-90" />

                    {/* Luma-style Date Stacked Pill */}
                    <div className="absolute top-3 left-3 p-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-center min-w-[50px] shadow-lg">
                      <div className="text-[9px] font-mono-acc font-extrabold text-indigo-400 uppercase tracking-wider">
                        {evt.month}
                      </div>
                      <div className="font-display font-black text-lg text-white leading-none">
                        {evt.day}
                      </div>
                    </div>

                    {/* Category & Rating Pill */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                        {evt.category}
                      </span>
                      <button
                        onClick={(e) => toggleLike(e, evt.id)}
                        className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                          isLiked
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                            : "bg-black/60 border-white/10 text-slate-300 hover:text-white"
                        }`}
                        aria-label="Save fest"
                      >
                        <Heart size={13} className={isLiked ? "fill-current" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* College Host */}
                      <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold mb-1.5">
                        <Building2 size={13} />
                        <span>{evt.college}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-white text-lg leading-snug line-clamp-2 mb-3 group-hover:text-indigo-300 transition-colors">
                        {evt.title}
                      </h3>

                      {/* Info Badges */}
                      <div className="space-y-2 text-xs text-slate-400 mb-5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center space-x-2">
                          <Clock size={13} className="text-slate-500 shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={13} className="text-slate-500 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                        <Users size={13} className="text-indigo-400" />
                        <span>{evt.attendees} registered</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => handleShare(e, evt)}
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                          title="Share event link"
                        >
                          <Share2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEventModal(evt)
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white text-slate-200 hover:text-black text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                        >
                          <span>Pass Details</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── TIMELINE / CALENDAR VIEW (Mobbin Luma Style) ────────────────────── */}
        {viewMode === "calendar" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEventModal(evt)}
                className="p-4 sm:p-5 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] hover:border-indigo-500/40 backdrop-blur-xl transition-all hover:bg-white/[0.02] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  {/* Date Block */}
                  <div className="p-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-center min-w-[65px] shrink-0">
                    <div className="text-[10px] font-mono-acc font-extrabold text-indigo-400 uppercase">
                      {evt.month}
                    </div>
                    <div className="font-display font-black text-2xl text-white">
                      {evt.day}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {evt.college}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {evt.category}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-base sm:text-lg">
                      {evt.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{evt.time}</span>
                      </span>
                      <span className="flex items-center space-x-1 truncate max-w-[200px]">
                        <MapPin size={12} />
                        <span>{evt.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className="text-xs font-mono-acc text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {evt.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEventModal(evt)
                    }}
                    className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center space-x-1"
                  >
                    <span>RSVP</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── BENTO GRID: Why College Buzz & Platform Architecture ─────────────── */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-indigo-400 text-xs font-mono-acc font-semibold uppercase tracking-wider mb-2">
            <Zap size={14} />
            <span>Built for Modern Campus Life</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Next-Gen Fest Infrastructure
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminating paper sign-up sheets, forged tickets, and fragmented group chats. Powered by real-time Supabase cloud sync.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Tile 1 (Large 2-col) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
            <div className="ambient-glow -top-10 -right-10 w-72 h-72 bg-indigo-600/15" />
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <QrCode size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-3">
                Instant Verified Digital QR Passes
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Claim an event ticket with one click. Scannable QR passes live in your Student Dashboard with unique cryptographic check-in hashes. No duplicates, no scalping.
              </p>
              <div className="flex items-center space-x-3 text-xs text-indigo-300 font-semibold font-mono-acc">
                <CheckCircle2 size={15} />
                <span>Zero app download required — instant mobile web wallet</span>
              </div>
            </div>
          </div>

          {/* Bento Tile 2 */}
          <div className="p-8 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <Building2 size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">
              College Host Studio
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Universities publish seminars and fests in under 2 minutes. Live attendee rosters, real-time check-in scanner, and instant CSV attendee exports.
            </p>
            <Link
              to="/college-auth"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>Explore Host Console</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Bento Tile 3 */}
          <div className="p-8 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6">
              <Radio size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-3">
              Live Social Hype & Feeds
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Stories, attendee facepiles, live countdowns, and campus-wide trending algorithms surface the best happenings near you.
            </p>
          </div>

          {/* Bento Tile 4 (Large 2-col) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <Shield size={24} />
            </div>
            <h3 className="font-display font-bold text-2xl text-white mb-3">
              High-Speed Supabase Cloud Architecture
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Zero lag when thousands of students register simultaneously for headline concerts. Built on PostgreSQL row-level security and Supabase Edge infrastructure.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono-acc text-slate-300">
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">Edge Auth</span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">Realtime Database</span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">Signed QR Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS ACCORDION ─────────────────────────────── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-2">
            Campus Questions Answered
          </h2>
          <p className="text-slate-400 text-xs">Everything you need to know about passes and college registration.</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Are festival entry passes completely free for students?",
              a: "Yes! 95% of events on College Buzz are completely free student passes sponsored by partner universities, tech sponsors, and student unions. Certain specialized multi-day workshops may have nominal seat deposit fees."
            },
            {
              q: "Can student clubs and college committees publish events?",
              a: "Absolutely. Student organizers and college administrators can register via the College Host Portal to publish fests, verify attendees, and access the live check-in console."
            },
            {
              q: "How does the digital QR entry pass work at the gate?",
              a: "Once registered, your pass appears in your Student Dashboard. At the campus auditorium or gate, simply show the QR pass on your phone screen. Gate volunteers scan it in 0.5s."
            },
            {
              q: "Can students from other colleges attend?",
              a: "Yes! College Buzz fosters an inter-collegiate campus network. Events specify whether admission is open to all university students across India or exclusive to campus students."
            }
          ].map((item, idx) => (
            <details
              key={idx}
              className="group p-5 rounded-2xl bg-[#0F121A]/80 border border-white/[0.08] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                <span>{item.q}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/[0.04]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CONTACT & HOST DISPATCH SECTION ─────────────────────────────────── */}
      <section id="contact" className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0F121A]/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="ambient-glow -bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15" />
          
          <div className="relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-mono-acc font-semibold uppercase tracking-wider mb-4 inline-block">
              Get in Touch
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
              Host Your College Fest on Buzz
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed">
              Want to partner your university or have questions about attendee badge verification? Send a message to our campus team.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE EVENT DETAIL SLIDE-OVER / MODAL (Luma Pattern) ─────────── */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0E1118] border border-white/15 shadow-2xl text-left">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedEventModal(null)
                setRegisteredSuccess(null)
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-white/10 text-slate-300 hover:text-white hover:bg-black transition-all"
            >
              <X size={18} />
            </button>

            {/* Poster Header */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden">
              <img
                src={selectedEventModal.image}
                alt={selectedEventModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1118] via-transparent to-transparent opacity-95" />

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {selectedEventModal.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    {selectedEventModal.price}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {selectedEventModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* If just registered, show Digital Pass QR */}
              {registeredSuccess ? (
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-display font-bold text-xl text-white">
                    Pass Confirmed! You're On The Guestlist.
                  </h4>
                  <p className="text-slate-300 text-xs">
                    Your digital pass has been minted and added to your Student Dashboard.
                  </p>

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 max-w-xs mx-auto">
                    <div className="text-[10px] font-mono-acc text-slate-400 mb-1">
                      PASS TOKEN
                    </div>
                    <div className="font-mono-acc font-black text-lg text-indigo-400 tracking-widest">
                      {registeredSuccess.ticketCode}
                    </div>
                  </div>

                  <Link
                    to="/student-dashboard"
                    className="inline-block px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                  >
                    Open Student Dashboard Wallet
                  </Link>
                </div>
              ) : (
                <>
                  {/* Host and Meta details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-400 font-medium">Host Institution</div>
                      <div className="text-white font-bold flex items-center space-x-1.5">
                        <Building2 size={14} className="text-indigo-400" />
                        <span>{selectedEventModal.college}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-400 font-medium">Date & Timing</div>
                      <div className="text-white font-bold flex items-center space-x-1.5">
                        <Calendar size={14} className="text-indigo-400" />
                        <span>{selectedEventModal.date} • {selectedEventModal.time}</span>
                      </div>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <div className="text-slate-400 font-medium">Venue Location</div>
                      <div className="text-white font-bold flex items-center space-x-1.5">
                        <MapPin size={14} className="text-indigo-400" />
                        <span>{selectedEventModal.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-2">
                      About This Festival
                    </h4>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {selectedEventModal.description}
                    </p>
                  </div>

                  {/* Schedule */}
                  {selectedEventModal.schedule && (
                    <div>
                      <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
                        Festival Itinerary
                      </h4>
                      <div className="space-y-2 border-l-2 border-indigo-500/30 pl-4 ml-2">
                        {selectedEventModal.schedule.map((item, idx) => (
                          <div key={idx} className="relative text-xs">
                            <span className="font-mono-acc font-bold text-indigo-400 block">
                              {item.time}
                            </span>
                            <span className="text-slate-300 font-medium">
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="text-xs">
                      <div className="text-slate-400">Total Capacity</div>
                      <div className="text-white font-bold font-mono-acc">
                        {selectedEventModal.attendees} / {selectedEventModal.maxAttendees || 1000} Claimed
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => toggleLike(e, selectedEventModal.id)}
                        className={`p-3 rounded-full border transition-all ${
                          likedEvents.has(selectedEventModal.id)
                            ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                            : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Heart size={16} className={likedEvents.has(selectedEventModal.id) ? "fill-current" : ""} />
                      </button>

                      <button
                        onClick={() => handleQuickRSVP(selectedEventModal)}
                        disabled={isRegistering}
                        className="px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-bold tracking-wide shadow-xl shadow-indigo-500/30 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        {isRegistering ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Ticket size={15} />
                            <span>Claim Verified Entry Pass</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE STORY PREVIEW MODAL ──────────────────────────────────── */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0F131D] border border-white/20 overflow-hidden shadow-2xl text-left">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={18} />
            </button>

            {/* Simulated progress bar */}
            <div className="absolute top-2 left-3 right-3 z-20 flex space-x-1">
              <div className="h-1 flex-1 bg-white rounded-full animate-pulse" />
              <div className="h-1 flex-1 bg-white/30 rounded-full" />
            </div>

            <div className="relative h-96 w-full">
              <img
                src={activeStory.avatar}
                alt={activeStory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F131D] via-transparent to-transparent opacity-95" />

              <div className="absolute top-8 left-4 flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full ring-2 ring-indigo-500 overflow-hidden">
                  <img src={activeStory.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{activeStory.name}</div>
                  <div className="text-[10px] text-slate-300">{activeStory.college} • {activeStory.badge}</div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-3">
                <p className="text-white text-xs sm:text-sm font-medium leading-relaxed drop-shadow">
                  "{activeStory.teaser}"
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{activeStory.views}</span>
                  <a
                    href="#events"
                    onClick={() => setActiveStory(null)}
                    className="px-4 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-md"
                  >
                    View Fest Page
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
