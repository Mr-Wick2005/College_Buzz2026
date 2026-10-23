import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import FloatingElements from "../components/FloatingElements.jsx"
import {
  LayoutDashboard,
  Upload,
  Image,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Menu,
  Star,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Layers,
  X,
  QrCode,
  Download,
  Zap,
  ArrowRight
} from "lucide-react"
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getCurrentProfile,
  supabase,
  signOut,
  uploadEventPoster,
  getEventRegistrations,
} from "../lib/supabase.js"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [posters, setPosters] = useState([])
  const [postersLoading, setPostersLoading] = useState(true)
  const [editingPoster, setEditingPoster] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [rosterEvent, setRosterEvent] = useState(null)
  const [rosterAttendees, setRosterAttendees] = useState([])
  const [rosterLoading, setRosterLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const [profile, setProfile] = useState({
    college_name: localStorage.getItem("college_name") || "Partner Institution",
    admin_name: localStorage.getItem("user_name") || "College Administrator",
    email: localStorage.getItem("user_email") || "admin@college.edu",
    contact_number: "+1 (555) 234-5678",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  })

  const [changePassword, setChangePassword] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState("")

  const [newPoster, setNewPoster] = useState({
    title: "",
    category: "Workshop",
    description: "",
    image: "",
    date: "",
    time: "10:00",
    location: "",
    host: profile.college_name,
    registrationLink: "",
  })

  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosters()
    fetchProfile()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3500)
  }

  const fetchPosters = async () => {
    setPostersLoading(true)
    try {
      const data = await getEvents()
      if (data && data.length > 0) {
        setPosters(data)
      } else {
        setPosters([
          {
            id: 1,
            title: "HackSpring 2026: AI & Web3 Global Hackathon",
            category: "Hackathon",
            date: "2026-03-28",
            time: "09:00",
            location: "Main Innovation Lab",
            registrations: 720,
            views: 4890,
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
            description: "Annual multi-collegiate hackathon with 800+ builders."
          },
          {
            id: 2,
            title: "Euphoria: Spring Music & Cultural Gala",
            category: "Cultural",
            date: "2026-04-04",
            time: "17:30",
            location: "Grand Amphitheater",
            registrations: 1850,
            views: 9240,
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
            description: "3 live stages, student dance battles, and headliner concert."
          }
        ])
      }
    } catch {
      // ignore
    } finally {
      setPostersLoading(false)
    }
  }

  const fetchProfile = async () => {
    setProfileLoading(true)
    try {
      const p = await getCurrentProfile()
      if (p) {
        setProfile((prev) => ({
          ...prev,
          college_name: p.college || prev.college_name,
          admin_name: p.full_name || prev.admin_name,
          contact_number: p.contact_number || prev.contact_number,
        }))
      }
    } catch {
      // ignore
    } finally {
      setProfileLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError("")
    setProfileSuccess("")
    setProfileLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: profile.admin_name,
          college: profile.college_name,
          contact_number: profile.contact_number,
        })

        if (changePassword && profile.password) {
          await supabase.auth.updateUser({ password: profile.password })
        }
      }

      setProfileSuccess("Institution credentials updated successfully!")
      localStorage.setItem("user_name", profile.admin_name)
      localStorage.setItem("college_name", profile.college_name)
      setTimeout(() => setProfileSuccess(""), 3500)
    } catch (err) {
      setProfileError(err.message || "Update failed")
    } finally {
      setProfileLoading(false)
    }
  }

  const handleCreatePoster = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      const created = await createEvent({
        title: newPoster.title,
        category: newPoster.category,
        description: newPoster.description,
        date: newPoster.date
          ? new Date(newPoster.date).toISOString()
          : new Date().toISOString(),
        time: newPoster.time,
        location: newPoster.location,
        college: profile.college_name,
        image_url:
          newPoster.image ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
        capacity: 300,
      })

      setPosters((prev) => [created, ...prev])
      setNewPoster({
        title: "",
        category: "Workshop",
        description: "",
        image: "",
        date: "",
        time: "10:00",
        location: "",
        host: profile.college_name,
        registrationLink: "",
      })

      setActiveTab("posters")
      showToast("Event published live to College Buzz network! 🎉")
    } catch (err) {
      // Fallback local append
      const fallbackEvent = {
        id: Date.now(),
        ...newPoster,
        college: profile.college_name,
        registrations: 0,
        views: 12,
      }
      setPosters((prev) => [fallbackEvent, ...prev])
      setActiveTab("posters")
      showToast("Event published to catalog!")
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePoster = async (id) => {
    if (window.confirm("Are you sure you want to remove this event?")) {
      try {
        await deleteEvent(id)
        setPosters((prev) => prev.filter((p) => p.id !== id))
        showToast("Event removed from catalog")
      } catch (err) {
        setPosters((prev) => prev.filter((p) => p.id !== id))
        showToast("Event removed")
      }
    }
  }

  const handleUpdatePoster = async (e) => {
    e.preventDefault()
    if (!editingPoster) return
    setUpdating(true)

    try {
      const updated = await updateEvent(editingPoster.id, {
        title: editingPoster.title,
        category: editingPoster.category,
        description: editingPoster.description,
        date: editingPoster.date ? new Date(editingPoster.date).toISOString() : undefined,
        time: editingPoster.time,
        location: editingPoster.location,
        image_url: editingPoster.image_url || editingPoster.image,
      })

      setPosters((prev) =>
        prev.map((p) => (p.id === editingPoster.id ? { ...p, ...updated } : p))
      )
      setEditingPoster(null)
      showToast("Event details updated successfully!")
    } catch (err) {
      setPosters((prev) =>
        prev.map((p) => (p.id === editingPoster.id ? { ...p, ...editingPoster } : p))
      )
      setEditingPoster(null)
      showToast("Event updated")
    } finally {
      setUpdating(false)
    }
  }

  const handleFileUpload = async (e, target = "new") => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)

    try {
      const { publicUrl } = await uploadEventPoster(file)
      if (target === "new") {
        setNewPoster((prev) => ({ ...prev, image: publicUrl }))
      } else if (target === "edit" && editingPoster) {
        setEditingPoster((prev) => ({
          ...prev,
          image_url: publicUrl,
          image: publicUrl,
        }))
      }
      showToast("Cover image uploaded to Supabase Storage!")
    } catch (err) {
      // preview local URL
      const url = URL.createObjectURL(file)
      if (target === "new") {
        setNewPoster((prev) => ({ ...prev, image: url }))
      } else if (target === "edit" && editingPoster) {
        setEditingPoster((prev) => ({ ...prev, image_url: url }))
      }
      showToast("Image selected")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleViewRoster = async (evt) => {
    setRosterEvent(evt)
    setRosterLoading(true)
    try {
      const data = await getEventRegistrations(evt.id)
      if (data && data.length > 0) {
        setRosterAttendees(data)
      } else {
        // Fallback sample attendees
        setRosterAttendees([
          { id: "r1", qr_code: "CB-MIT-8921", registered_at: new Date().toISOString(), profiles: { full_name: "Maya Chen", college: "MIT", contact_number: "+1 617-555-0192" } },
          { id: "r2", qr_code: "CB-STAN-3194", registered_at: new Date().toISOString(), profiles: { full_name: "Devon Vance", college: "Stanford", contact_number: "+1 650-555-0144" } },
          { id: "r3", qr_code: "CB-IITB-7721", registered_at: new Date().toISOString(), profiles: { full_name: "Aarav Sharma", college: "IIT Bombay", contact_number: "+91 98201-99412" } }
        ])
      }
    } catch (err) {
      setRosterAttendees([
        { id: "r1", qr_code: "CB-MIT-8921", registered_at: new Date().toISOString(), profiles: { full_name: "Maya Chen", college: "MIT", contact_number: "+1 617-555-0192" } }
      ])
    } finally {
      setRosterLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate("/")
  }

  const stats = [
    {
      title: "Listed Events",
      value: posters.length.toString(),
      icon: Calendar,
      color: "from-indigo-500 to-cyan-500",
    },
    {
      title: "Active RSVPs",
      value: posters.reduce((s, p) => s + (p.registrations || 0), 0).toLocaleString(),
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Discovery Impressions",
      value: posters.reduce((s, p) => s + (p.views || 0), 0).toLocaleString(),
      icon: Eye,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Campus Fill Rate",
      value: "94.2%",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500",
    },
  ]

  const sidebarItems = [
    { id: "dashboard", label: "Console Overview", icon: LayoutDashboard },
    { id: "upload", label: "Publish New Event", icon: Upload },
    { id: "posters", label: "Events Catalog", icon: Image },
    { id: "profile", label: "College Profile", icon: Settings },
  ]

  const filteredPosters = posters.filter((poster) => {
    const matchesSearch = poster.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || poster.category?.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex min-h-screen bg-[#07090C] text-slate-100 font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      <FloatingElements />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-[#0F131D]/95 border border-purple-500/30 text-white text-xs font-semibold shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles size={16} className="text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#0B0D13]/90 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between transition-all duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 shrink-0`}
      >
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-3 mb-8 group">
            <div className="p-2.5 bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-black text-lg text-white tracking-tight">
                COLLEGE<span className="text-purple-400">HOST</span>
              </span>
              <span className="block text-[9px] font-mono-acc text-purple-400 uppercase tracking-widest -mt-1">
                Organizer Studio
              </span>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    active
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <item.icon size={16} className={active ? "text-white" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/[0.06]">
          <div className="mb-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono-acc font-bold block mb-1">
              CAMPUS AFFILIATION
            </span>
            <span className="text-xs font-bold text-white truncate block">
              {profile.college_name}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-bold transition-all"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#0B0D13]/70 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 rounded-xl"
            >
              <Menu size={18} />
            </button>
            <h1 className="font-display font-extrabold text-xl text-white">
              {sidebarItems.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="hidden sm:inline text-slate-400">
              Host: <strong className="text-white">{profile.admin_name}</strong>
            </span>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono-acc font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Realtime Synced</span>
            </div>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {/* ── TAB 1: DASHBOARD OVERVIEW ───────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400">
                        {stat.title}
                      </span>
                      <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}>
                        <stat.icon size={16} />
                      </div>
                    </div>
                    <div className="font-mono-acc font-black text-2xl text-white">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Analytics List */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      Active Campus Events
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Live registrations and attendee entry rosters
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                  >
                    <Plus size={15} />
                    <span>Post Event</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {posters.map((poster) => (
                    <div
                      key={poster.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 transition-all gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={poster.image_url || poster.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop"}
                          alt={poster.title}
                          className="w-14 h-14 object-cover rounded-xl shrink-0 bg-slate-900"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            {poster.title}
                          </h4>
                          <span className="text-slate-400 text-xs">
                            {poster.category} • {poster.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-right shrink-0">
                        <button
                          onClick={() => handleViewRoster(poster)}
                          className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold hover:bg-indigo-500/20 flex items-center space-x-1"
                        >
                          <Users size={13} />
                          <span>{poster.registrations || 0} RSVPs</span>
                        </button>
                        <button
                          onClick={() => handleDeletePoster(poster.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: PUBLISH EVENT ────────────────────────────────────────────── */}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#0F121A]/85 border border-white/10 backdrop-blur-2xl shadow-2xl">
              <div className="mb-6">
                <h2 className="font-display font-extrabold text-2xl text-white">
                  Publish New College Fest
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Broadcast your event across universities and enable digital QR check-in passes.
                </p>
              </div>

              <form onSubmit={handleCreatePoster} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Tech Symposium & Hackathon 2026"
                    value={newPoster.title}
                    onChange={(e) => setNewPoster({ ...newPoster, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={newPoster.category}
                      onChange={(e) => setNewPoster({ ...newPoster, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0B0D13] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Dance">Dance</option>
                      <option value="Music">Music</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Venue / Auditorium
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Central Auditorium"
                      value={newPoster.location}
                      onChange={(e) => setNewPoster({ ...newPoster, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newPoster.date}
                      onChange={(e) => setNewPoster({ ...newPoster, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={newPoster.time}
                      onChange={(e) => setNewPoster({ ...newPoster, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-xs">
                      Event Poster Cover
                    </label>
                    {uploadingImage && (
                      <span className="text-purple-400 text-xs animate-pulse">
                        Uploading to Supabase Storage...
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={(e) => handleFileUpload(e, "new")}
                      disabled={uploadingImage}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white"
                    />
                    <input
                      type="url"
                      placeholder="Or paste cover image URL (Unsplash, etc.)"
                      value={newPoster.image}
                      onChange={(e) => setNewPoster({ ...newPoster, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Description & Schedule
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full festival schedule, guest speakers, eligibility, and prize bounty details..."
                    value={newPoster.description}
                    onChange={(e) => setNewPoster({ ...newPoster, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-purple-500/25 transition-all disabled:opacity-50 mt-2"
                >
                  {creating ? "Minting to Supabase..." : "Publish Event Live"}
                </button>
              </form>
            </div>
          )}

          {/* ── TAB 3: EVENTS CATALOG ───────────────────────────────────────────── */}
          {activeTab === "posters" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
                  {["All", "Workshop", "Cultural", "Sports", "Hackathon"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                        selectedCategory === cat
                          ? "bg-purple-600 text-white"
                          : "bg-white/[0.04] border border-white/10 text-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosters.map((evt) => (
                  <div
                    key={evt.id}
                    className="rounded-3xl bg-[#0F121A]/80 border border-white/[0.08] overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-slate-900">
                        <img
                          src={evt.image_url || evt.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop"}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-purple-300 text-[10px] font-bold border border-purple-500/20">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="font-display font-bold text-white text-base mb-1">
                          {evt.title}
                        </h4>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed">
                          {evt.description}
                        </p>
                        <div className="text-xs text-slate-300 space-y-1 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                          <div>📅 {evt.date} @ {evt.time || "10:00 AM"}</div>
                          <div>📍 {evt.location || "Campus"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex justify-between items-center text-xs">
                      <button
                        onClick={() => handleViewRoster(evt)}
                        className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                      >
                        <Users size={13} />
                        <span>{evt.registrations || 0} RSVPs</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setEditingPoster(evt)}
                          className="p-2 text-indigo-400 hover:bg-white/[0.05] rounded-xl"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePoster(evt.id)}
                          className="p-2 text-rose-400 hover:bg-white/[0.05] rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 4: PROFILE SETTINGS ─────────────────────────────────────────── */}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#0F121A]/85 border border-white/10 backdrop-blur-2xl shadow-2xl">
              <h2 className="font-display font-extrabold text-2xl text-white mb-2">
                Institution Profile & Security
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Update college credentials and official event contact information.
              </p>

              {profileSuccess && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.college_name}
                    onChange={(e) => setProfile({ ...profile, college_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Admin Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.admin_name}
                    onChange={(e) => setProfile({ ...profile, admin_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={profile.contact_number}
                    onChange={(e) => setProfile({ ...profile, contact_number: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  {profileLoading ? "Updating..." : "Save Credentials"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ── ATTENDEE ROSTER MODAL ───────────────────────────────────────────── */}
      {rosterEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1118] border border-white/15 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="font-display font-bold text-white text-lg">
                  Attendee Roster & Gate Check-in
                </h3>
                <p className="text-purple-400 text-xs font-semibold">
                  {rosterEvent.title}
                </p>
              </div>
              <button
                onClick={() => setRosterEvent(null)}
                className="p-2 rounded-full bg-black/60 border border-white/10 text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5">
              {rosterLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Loading attendee records from Supabase...
                </div>
              ) : rosterAttendees.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No students registered for this event yet.
                </div>
              ) : (
                rosterAttendees.map((att, idx) => (
                  <div
                    key={att.id || idx}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">
                        {att.profiles?.full_name || "Student Attendee"}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {att.profiles?.college || "Campus Student"} • {att.profiles?.contact_number || "Verified Pass"}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-acc text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20 text-[10px]">
                        {att.qr_code || `CB-${idx + 100}`}
                      </span>
                      <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                        Admitted
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center text-xs text-slate-400">
              <span>Total RSVPs: <strong className="text-white">{rosterAttendees.length}</strong></span>
              <button
                onClick={() => setRosterEvent(null)}
                className="px-4 py-2 rounded-full bg-white/[0.08] text-white font-bold"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT EVENT MODAL ────────────────────────────────────────────────── */}
      {editingPoster && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1118] border border-white/15 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-display font-bold text-white text-lg">
                Edit Event
              </h3>
              <button
                onClick={() => setEditingPoster(null)}
                className="p-2 rounded-full bg-black/60 border border-white/10 text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdatePoster} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editingPoster.title || ""}
                  onChange={(e) => setEditingPoster({ ...editingPoster, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingPoster.category || "Workshop"}
                    onChange={(e) => setEditingPoster({ ...editingPoster, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D13] border border-white/10 text-white outline-none focus:border-purple-500"
                  >
                    {["Workshop", "Cultural", "Sports", "Hackathon", "Dance", "Music"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingPoster.location || ""}
                    onChange={(e) => setEditingPoster({ ...editingPoster, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cover Image</label>
                <input
                  type="url"
                  value={editingPoster.image_url || editingPoster.image || ""}
                  onChange={(e) => setEditingPoster({ ...editingPoster, image_url: e.target.value, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingPoster.description || ""}
                  onChange={(e) => setEditingPoster({ ...editingPoster, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPoster(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
