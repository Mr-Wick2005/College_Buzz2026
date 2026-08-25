import React, { useState, useEffect } from "react"

import { Link, useNavigate } from "react-router-dom"

import AnimatedSection from "../components/AnimatedSection.jsx"

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

  const fetchPosters = async () => {
    setPostersLoading(true)

    try {
      const data = await getEvents()

      setPosters(data)
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

    if (changePassword) {
      if (!profile.oldPassword) {
        setProfileError("Please enter your current password")
        setProfileLoading(false)
        return
      }

      if (!profile.password) {
        setProfileError("Please enter a new password")
        setProfileLoading(false)
        return
      }

      if (profile.password !== profile.confirmPassword) {
        setProfileError("New passwords do not match")
        setProfileLoading(false)
        return
      }
    }

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

      setProfileSuccess("Profile updated successfully in Supabase!")

      localStorage.setItem("user_name", profile.admin_name)

      localStorage.setItem("college_name", profile.college_name)

      setTimeout(() => setProfileSuccess(""), 3000)
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

        capacity: 200,
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
    } catch (err) {
      alert("Failed to create event: " + err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDeletePoster = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id)

        setPosters((prev) => prev.filter((p) => p.id !== id))
      } catch (err) {
        alert("Failed to delete: " + err.message)
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

        date: editingPoster.date
          ? new Date(editingPoster.date).toISOString()
          : undefined,

        time: editingPoster.time,

        location: editingPoster.location,

        image_url: editingPoster.image_url || editingPoster.image,
      })

      setPosters((prev) =>
        prev.map((p) => (p.id === editingPoster.id ? { ...p, ...updated } : p)),
      )

      setEditingPoster(null)

      alert("Event updated successfully!")
    } catch (err) {
      alert("Failed to update event: " + err.message)
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
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleViewRoster = async (evt) => {
    setRosterEvent(evt)

    setRosterLoading(true)

    try {
      const data = await getEventRegistrations(evt.id)

      setRosterAttendees(data)
    } catch (err) {
      alert("Failed to load attendees: " + err.message)
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
      title: "Total Events",
      value: posters.length.toString(),
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
    },

    {
      title: "Total Views",
      value: posters.reduce((s, p) => s + (p.views || 0), 0).toLocaleString(),
      icon: Eye,
      color: "from-emerald-500 to-teal-500",
    },

    {
      title: "Registrations",
      value: posters.reduce((s, p) => s + (p.registrations || 0), 0).toString(),
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },

    {
      title: "Engagement Rate",
      value: "+28.4%",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500",
    },
  ]

  const sidebarItems = [
    { id: "dashboard", label: "Console Overview", icon: LayoutDashboard },

    { id: "upload", label: "Publish New Event", icon: Upload },

    { id: "posters", label: "Event Catalog", icon: Image },

    { id: "profile", label: "College Profile", icon: Settings },
  ]

  const filteredPosters = posters.filter((poster) => {
    const matchesSearch = poster.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" || poster.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      <FloatingElements />

      {/* Sidebar Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 shrink-0`}
      >
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-3 mb-8 group">
            <div className="p-2.5 bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 rounded-2xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                CAMPUS ADMIN
              </span>
              <span className="block text-[10px] text-purple-400 font-semibold uppercase tracking-widest">
                College Portal
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
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-semibold text-xs transition-all ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={active ? "text-white" : "text-slate-400"}
                  />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/80">
          <div className="mb-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              INSTITUTION
            </span>
            <span className="text-xs font-extrabold text-white truncate block">
              {profile.college_name}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-semibold transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-extrabold text-white">
              {sidebarItems.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="hidden sm:inline text-slate-400">
              Logged in as{" "}
              <strong className="text-white">{profile.admin_name}</strong>
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
              Supabase Sync
            </span>
          </div>
        </header>

        <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 relative overflow-hidden shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400">
                        {stat.title}
                      </span>
                      <div
                        className={`p-2.5 rounded-2xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}
                      >
                        <stat.icon size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Analytics List */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Active College Events
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Real-time attendee stats and engagement
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <Plus size={16} />
                    <span>Create Event</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {posters.map((poster) => (
                    <div
                      key={poster.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl gap-4 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={poster.image_url || poster.image}
                          alt={poster.title}
                          className="w-14 h-14 object-cover rounded-xl shrink-0"
                        />
                        <div>
                          <h4 className="font-extrabold text-white text-sm">
                            {poster.title}
                          </h4>
                          <span className="text-slate-400 text-xs">
                            {poster.category} • {poster.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-xs text-right shrink-0">
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            Registrations
                          </span>
                          <span className="font-extrabold text-indigo-400">
                            {poster.registrations || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            Total Views
                          </span>
                          <span className="font-extrabold text-white">
                            {poster.views || 100}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeletePoster(poster.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {posters.length === 0 && (
                    <p className="text-slate-500 text-xs text-center py-8">
                      No events published yet. Click "Create Event" to get
                      started.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload / Create Tab */}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto bg-slate-900/80 border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white">
                  Publish New Event
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Fill event metadata to broadcast across the student discovery
                  network in Supabase.
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
                    placeholder="e.g. Annual Hackathon 2025"
                    value={newPoster.title}
                    onChange={(e) =>
                      setNewPoster({ ...newPoster, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={newPoster.category}
                      onChange={(e) =>
                        setNewPoster({ ...newPoster, category: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      Venue / Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Main Auditorium"
                      value={newPoster.location}
                      onChange={(e) =>
                        setNewPoster({ ...newPoster, location: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      onChange={(e) =>
                        setNewPoster({ ...newPoster, date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      onChange={(e) =>
                        setNewPoster({ ...newPoster, time: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-slate-300 uppercase tracking-wider text-xs">
                      Event Poster / Cover Image
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
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="Or enter image URL (https://images.unsplash.com/...)"
                      value={newPoster.image}
                      onChange={(e) =>
                        setNewPoster({ ...newPoster, image: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Event Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide full schedule, prize pool, speaker highlights, and eligibility..."
                    value={newPoster.description}
                    onChange={(e) =>
                      setNewPoster({
                        ...newPoster,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 mt-2"
                >
                  {creating
                    ? "Publishing to Supabase..."
                    : "Publish Event Live"}
                </button>
              </form>
            </div>
          )}

          {/* Posters Catalog */}
          {activeTab === "posters" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search event catalog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1">
                  {[
                    "All",
                    "Workshop",
                    "Cultural",
                    "Sports",
                    "Hackathon",
                    "Music",
                    "Dance",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                          : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <span className="text-slate-400 text-xs pl-2 border-l border-slate-800 shrink-0">
                    {filteredPosters.length} Listed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosters.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-slate-950">
                        <img
                          src={evt.image_url || evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold rounded-lg border border-purple-500/20">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h4 className="font-extrabold text-white text-base mb-1">
                          {evt.title}
                        </h4>
                        <p className="text-slate-400 text-xs line-clamp-2 mb-3">
                          {evt.description}
                        </p>
                        <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                          <div>
                            📅 {evt.date} @ {evt.time || "10:00 AM"}
                          </div>
                          <div>📍 {evt.location || "Main Campus"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0 flex justify-between items-center text-xs">
                      <button
                        onClick={() => handleViewRoster(evt)}
                        className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                        title="View Attendee List"
                      >
                        <span>{evt.registrations || 0} Registered</span>
                        <Users size={13} className="ml-1" />
                      </button>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setEditingPoster(evt)}
                          className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                          title="Edit Event"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePoster(evt.id)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendee Roster Modal */}
              {rosterEvent && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="font-black text-white text-lg">
                          Attendee Roster
                        </h3>
                        <p className="text-purple-400 text-xs">
                          {rosterEvent.title}
                        </p>
                      </div>
                      <button
                        onClick={() => setRosterEvent(null)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5">
                      {rosterLoading ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          Loading attendee records from Supabase...
                        </div>
                      ) : rosterAttendees.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                          No students have registered for this event yet.
                        </div>
                      ) : (
                        rosterAttendees.map((att, idx) => (
                          <div
                            key={att.id || idx}
                            className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-white">
                                {att.profiles?.full_name || "Student"}
                              </div>
                              <div className="text-slate-400 text-[11px]">
                                {att.profiles?.college || "Registered Student"}{" "}
                                • {att.profiles?.contact_number || "No contact"}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20 text-[10px]">
                                {att.qr_code}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-1">
                                {new Date(
                                  att.registered_at,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                      <span>Total: {rosterAttendees.length} Students</span>
                      <button
                        onClick={() => setRosterEvent(null)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Event Modal */}
              {editingPoster && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="font-black text-white text-lg">
                        Edit Event Details
                      </h3>
                      <button
                        onClick={() => setEditingPoster(null)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleUpdatePoster} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Event Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPoster.title || ""}
                          onChange={(e) =>
                            setEditingPoster({
                              ...editingPoster,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Category
                          </label>
                          <select
                            value={editingPoster.category || "Workshop"}
                            onChange={(e) =>
                              setEditingPoster({
                                ...editingPoster,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                          >
                            {[
                              "Workshop",
                              "Cultural",
                              "Sports",
                              "Hackathon",
                              "Dance",
                              "Acting",
                              "Music",
                              "Debate",
                            ].map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={editingPoster.location || ""}
                            onChange={(e) =>
                              setEditingPoster({
                                ...editingPoster,
                                location: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Upload New Poster / Cover Image
                        </label>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          onChange={(e) => handleFileUpload(e, "edit")}
                          disabled={uploadingImage}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white cursor-pointer mb-1.5"
                        />
                        <input
                          type="url"
                          placeholder="Or image URL"
                          value={
                            editingPoster.image_url || editingPoster.image || ""
                          }
                          onChange={(e) =>
                            setEditingPoster({
                              ...editingPoster,
                              image_url: e.target.value,
                              image: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={editingPoster.description || ""}
                          onChange={(e) =>
                            setEditingPoster({
                              ...editingPoster,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingPoster(null)}
                          className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updating || uploadingImage}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                        >
                          {updating ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Settings Tab */}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-2xl font-black text-white mb-2">
                College Profile & Security
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Update official contact details and manage authentication
                settings in Supabase.
              </p>

              {profileSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form
                onSubmit={handleProfileSubmit}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Institution / College Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.college_name}
                    onChange={(e) =>
                      setProfile({ ...profile, college_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    onChange={(e) =>
                      setProfile({ ...profile, admin_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={profile.contact_number}
                    onChange={(e) =>
                      setProfile({ ...profile, contact_number: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-xs shadow-lg transition-all"
                >
                  {profileLoading ? "Saving..." : "Update Supabase Profile"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
