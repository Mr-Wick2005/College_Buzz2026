import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection.jsx';
import FloatingElements from '../components/FloatingElements.jsx';
import {
  Search, Filter, Calendar, Users, Star, MapPin, Clock,
  ChevronLeft, ChevronRight, Zap, LogOut, User, Bell, Heart, Share2,
  Ticket, CheckCircle, Sparkles, QrCode, X, ArrowRight, Compass
} from 'lucide-react';
import { getEvents, getMyRegistrations, registerForEvent } from '../lib/supabase.js';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'passes'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  const studentEmail = localStorage.getItem('user_email') || 'student@university.edu';
  const studentName = localStorage.getItem('user_name') || 'Campus Student';
  const navigate = useNavigate();

  const eventsPerPage = 12;

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setAllEvents(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const data = await getMyRegistrations();
      setRegistrations(data);
    } catch {
      // ignore
    }
  };

  const handleRegisterEvent = async (event) => {
    setRegistering(true);
    try {
      const reg = await registerForEvent(event.id);
      setRegisteredSuccess({
        id: reg.id,
        eventId: event.id,
        ticketCode: reg.qr_code,
        registeredAt: reg.registered_at,
      });
      await fetchRegistrations();
    } catch (err) {
      alert(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const categories = ['All', 'Workshop', 'Cultural', 'Sports', 'Hackathon', 'Dance', 'Acting', 'Music', 'Debate'];

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Workshop': return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'Cultural': return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'Sports': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Hackathon': return 'bg-orange-500/10 text-orange-300 border-orange-500/20';
      case 'Dance': return 'bg-pink-500/10 text-pink-300 border-pink-500/20';
      case 'Music': return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      default: return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    }
  };

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.college?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage) || 1;
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const toggleBookmark = (eventId) => {
    setBookmarkedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <FloatingElements />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">CAMPUS BUZZ</span>
                  <span className="block text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">Student Portal</span>
                </div>
              </Link>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${activeTab === 'discover' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Compass size={16} />
                <span>Explore Events</span>
              </button>
              <button
                onClick={() => setActiveTab('passes')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${activeTab === 'passes' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Ticket size={16} />
                <span>My Passes ({registrations.length})</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white">{studentName}</span>
                <span className="text-[11px] text-slate-400">{studentEmail}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all">
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden mb-6 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-3 rounded-xl font-semibold text-xs text-center transition-all ${activeTab === 'discover' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Explore Events
          </button>
          <button
            onClick={() => setActiveTab('passes')}
            className={`flex-1 py-3 rounded-xl font-semibold text-xs text-center transition-all ${activeTab === 'passes' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            My Passes ({registrations.length})
          </button>
        </div>

        {activeTab === 'discover' && (
          <>
            {/* Banner Header */}
            <div className="relative rounded-3xl p-8 mb-8 overflow-hidden bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 shadow-2xl">
              <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300 mb-4">
                  <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                  <span>Powered by Supabase Database & Auth</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                  Discover, Register & Attend College Fests Nationwide
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Join hackathons, cultural concerts, tech summits, and sports tournaments across top universities. Instant registration with downloadable digital QR badges.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by event title, host, or keyword..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">Clear</button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800/80 hover:text-white hover:bg-slate-850'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Grid */}
            {loading ? (
              <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400" />
                <p className="text-slate-400 text-xs font-medium mt-4">Loading events...</p>
              </div>
            ) : currentEvents.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/80 p-8">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Events Match Your Query</h3>
                <p className="text-slate-400 text-xs mb-4">Try clearing your search terms or selecting another category filter.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentEvents.map((evt) => {
                  const isBookmarked = bookmarkedEvents.includes(evt.id);
                  const isRegistered = registrations.some(r => r.event_id === evt.id || r.eventId === evt.id);

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/50 cursor-pointer flex flex-col"
                    >
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <img
                          src={evt.image_url || evt.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop'}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex items-center space-x-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md ${getCategoryBadgeClass(evt.category)}`}>
                            {evt.category}
                          </span>
                          {evt.isLive && (
                            <span className="px-2.5 py-1 bg-rose-500/90 backdrop-blur-md text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider animate-pulse flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-1" />
                              LIVE NOW
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(evt.id); }}
                          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${isBookmarked ? 'bg-rose-500/80 border-rose-400 text-white' : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white'}`}
                        >
                          <Heart size={16} className={isBookmarked ? 'fill-current' : ''} />
                        </button>
                      </div>

                      {/* Event Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-semibold text-indigo-400 mb-1">{evt.college || evt.host}</div>
                          <h3 className="font-extrabold text-white text-base group-hover:text-indigo-200 transition-colors line-clamp-2 mb-2">
                            {evt.title}
                          </h3>
                          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                            {evt.description}
                          </p>
                        </div>

                        <div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-4 bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/60">
                            <div className="flex items-center space-x-1.5">
                              <Calendar size={13} className="text-indigo-400" />
                              <span className="truncate">{evt.date}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <Clock size={13} className="text-indigo-400" />
                              <span className="truncate">{evt.time || '10:00 AM'}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <MapPin size={13} className="text-indigo-400" />
                              <span className="truncate">{evt.location || 'Main Auditorium'}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <Users size={13} className="text-indigo-400" />
                              <span>{evt.attendees || evt.registrations || 100}+ Seats</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(evt); }}
                            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${isRegistered ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/20'}`}
                          >
                            {isRegistered ? (
                              <>
                                <CheckCircle size={14} />
                                <span>Registered (View Pass)</span>
                              </>
                            ) : (
                              <>
                                <span>View Event & Register</span>
                                <ArrowRight size={14} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Passes Tab */}
        {activeTab === 'passes' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Your Digital Event Passes</h2>
                <p className="text-slate-400 text-xs">Present these QR passes at event check-in desks on campus.</p>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center space-x-2">
                <QrCode size={18} />
                <span>{registrations.length} Passes Active</span>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/80 p-8">
                <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Registered Events Yet</h3>
                <p className="text-slate-400 text-xs mb-4">Explore upcoming campus events and claim your free digital entry pass.</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-semibold transition-all"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registrations.map((reg) => {
                  const evt = (reg.events) || allEvents.find(e => e.id === (reg.event_id || reg.eventId)) || {
                    title: "Registered Event",
                    college: "Campus Host",
                    date: "Upcoming",
                    location: "University Hall"
                  };

                  return (
                    <div key={reg.id} className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-extrabold text-indigo-400">ENTRY PASS</span>
                          <h4 className="font-extrabold text-white text-base leading-tight mt-0.5">{evt.title}</h4>
                          <span className="text-slate-400 text-xs">{evt.college}</span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl shrink-0">
                          <QrCode size={36} className="text-indigo-400" />
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300 mb-6 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Attendee:</span>
                          <span className="font-bold text-white">{studentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pass Code:</span>
                          <span className="font-mono font-bold text-indigo-300">{reg.qr_code || reg.ticketCode || 'TKT-892101'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Registration Date:</span>
                          <span>{new Date(reg.registered_at || reg.registeredAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle size={14} />
                          <span>Pass Verified</span>
                        </span>
                        <button
                          onClick={() => alert(`Ticket Code: ${reg.qr_code || reg.ticketCode || 'TKT-892101'}\nName: ${studentName}\nEvent: ${evt.title}`)}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          Download Pass
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Event Details & Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => { setSelectedEvent(null); setRegisteredSuccess(null); }}
              className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white rounded-full z-10 transition-all border border-slate-800"
            >
              <X size={18} />
            </button>

            <div className="relative h-56 bg-slate-950 shrink-0">
              <img
                src={selectedEvent.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop'}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getCategoryBadgeClass(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span>
                <h2 className="text-2xl font-black text-white mt-2">{selectedEvent.title}</h2>
                <p className="text-indigo-300 text-xs font-semibold">{selectedEvent.college || selectedEvent.host}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {registeredSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Registration Confirmed!</h3>
                    <p className="text-slate-300 text-xs mt-1">Your pass has been generated and saved to your Supabase account.</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-center">
                    <span className="text-slate-400 text-xs block mb-1">PASS TICKET CODE</span>
                    <span className="text-indigo-400 font-extrabold text-lg">{registeredSuccess.ticketCode}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedEvent(null); setRegisteredSuccess(null); setActiveTab('passes'); }}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs transition-all"
                  >
                    View in My Passes
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Event</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-1">Date & Time</span>
                      <span className="text-white font-bold">{selectedEvent.date} @ {selectedEvent.time || '10:00 AM'}</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px] mb-1">Venue Location</span>
                      <span className="text-white font-bold">{selectedEvent.location || 'Main Auditorium'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
                    <button
                      onClick={() => handleRegisterEvent(selectedEvent)}
                      disabled={registering}
                      className="flex-1 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                    >
                      {registering ? 'Securing Seat...' : 'Claim Digital Entry Pass'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
