import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection.jsx';
import FloatingElements from '../components/FloatingElements.jsx';
import ContactForm from '../components/ContactForm.jsx';
import {
  ChevronLeft, ChevronRight, Calendar, Users, Search, Star, MapPin, Clock,
  ArrowRight, Zap, Shield, Globe, Sparkles, Building2, GraduationCap, CheckCircle2
} from 'lucide-react';
import { EDGE_FUNCTION_URL } from '../lib/supabase.js';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveEvents();
  }, []);

  const fetchLiveEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${EDGE_FUNCTION_URL}/api/events/public`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        throw new Error('Fallback to default events');
      }
    } catch {
      setEvents([
        {
          id: 1,
          title: "Tech Innovation Summit 2025",
          category: "Workshop",
          date: "March 15, 2025",
          time: "10:00 AM",
          location: "MIT Auditorium",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
          rating: 4.8,
          attendees: 500,
          college: "MIT Institute"
        },
        {
          id: 2,
          title: "Annual Cultural Fest Euphoria",
          category: "Cultural",
          date: "March 20, 2025",
          time: "6:00 PM",
          location: "Main Campus",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
          rating: 4.9,
          attendees: 1200,
          college: "Stanford University"
        },
        {
          id: 3,
          title: "Sports Championship 2025",
          category: "Sports",
          date: "March 25, 2025",
          time: "9:00 AM",
          location: "Sports Complex",
          image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
          rating: 4.7,
          attendees: 800,
          college: "Harvard Campus"
        },
        {
          id: 4,
          title: "CodeStorm Hackathon 2025",
          category: "Hackathon",
          date: "March 30, 2025",
          time: "8:00 AM",
          location: "Computer Center",
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
          rating: 4.9,
          attendees: 300,
          college: "UC Berkeley"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Workshop': return 'from-cyan-500 to-blue-500';
      case 'Cultural': return 'from-purple-500 to-pink-500';
      case 'Sports': return 'from-emerald-500 to-teal-500';
      case 'Hackathon': return 'from-orange-500 to-amber-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  const eventsPerSlide = 4;
  const totalSlides = Math.max(1, Math.ceil(events.length / eventsPerSlide));
  const eventSlides = Array.from({ length: totalSlides }, (_, index) =>
    events.slice(index * eventsPerSlide, (index + 1) * eventsPerSlide)
  );

  const features = [
    { icon: Zap, title: "Instant Supabase Auth", description: "Seamless one-click sign in for both students & college administrators." },
    { icon: Search, title: "Real-time Event Discovery", description: "Live categorization, instant venue maps, and seat availability tracking." },
    { icon: Users, title: "Interactive Digital Passes", description: "Download verified QR code badges directly to your dashboard." },
    { icon: Shield, title: "Enterprise Grade Cloud", description: "Backed by Supabase database & Edge Functions for 100% uptime." },
    { icon: Globe, title: "Nationwide Campus Network", description: "Connect with events and participants from premier institutions." },
    { icon: Star, title: "Live Host Console", description: "Publish events, view live registration count, and manage attendee rosters." }
  ];

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="pt-16 min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
        <FloatingElements />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-950/30 to-slate-950" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <AnimatedSection animation="fadeInUp">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 backdrop-blur-md shadow-lg">
              <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">The Ultimate Campus Event Hub</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={150}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Discover, Attend & Host{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                College Fests
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={300}>
            <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              Connect with premier universities, claim digital QR entry passes, and experience hackathons, cultural concerts, and tech summits in real-time.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={450}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link
                to="/student-auth"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <GraduationCap size={18} />
                <span>Student Portal</span>
              </Link>
              <Link
                to="/college-auth"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Building2 size={18} />
                <span>College Admin</span>
              </Link>
            </div>
          </AnimatedSection>

          {/* Quick Metrics */}
          <AnimatedSection animation="fadeInUp" delay={600} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80 pt-10">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl font-black text-indigo-400">100+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Partner Colleges</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl font-black text-purple-400">25,000+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Active Students</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl font-black text-pink-400">500+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Live Events</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Supabase Powered</div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trending Events Carousel */}
      <section id="events" className="relative py-20 bg-slate-900/40 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Trending College Fests
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Explore upcoming high-impact events across engineering, arts, business, and athletic domains.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="scaleIn" delay={200} className="relative">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {eventSlides.map((slideEvents, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
                        {slideEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group"
                          >
                            <div className="relative h-44 overflow-hidden bg-slate-950">
                              <img
                                src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'}
                                alt={evt.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className={`absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r ${getCategoryColor(evt.category)} text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-md`}>
                                {evt.category}
                              </span>
                              <div className="absolute top-3 right-3 flex items-center space-x-1 bg-slate-950/80 backdrop-blur-md rounded-lg px-2 py-0.5 text-xs text-amber-300 font-bold border border-slate-800">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{evt.rating || 4.8}</span>
                              </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[11px] font-semibold text-indigo-400 block mb-1">{evt.college || evt.host}</span>
                                <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2 mb-3">{evt.title}</h3>
                                <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/60">
                                  <div className="flex items-center space-x-2"><Calendar size={13} className="text-indigo-400" /><span>{evt.date}</span></div>
                                  <div className="flex items-center space-x-2"><MapPin size={13} className="text-indigo-400" /><span>{evt.location || 'Campus'}</span></div>
                                </div>
                              </div>

                              <Link
                                to="/student-auth"
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl text-xs font-bold text-center block shadow-lg shadow-indigo-500/20 transition-all"
                              >
                                Join Event
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white rounded-2xl transition-all shadow-xl"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white rounded-2xl transition-all shadow-xl"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp" className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Why Universities & Students Choose Campus Buzz
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Architected with Supabase for real-time responsiveness, seamless user authentication, and verified digital event badges.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <AnimatedSection
              key={idx}
              animation="fadeInUp"
              delay={idx * 100}
              className="bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg shadow-indigo-500/20">
                <feat.icon size={22} />
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{feat.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection animation="fadeInUp">
            <h2 className="text-3xl font-black text-white mb-2">Get in Touch</h2>
            <p className="text-slate-400 text-xs mb-8">Have questions about setting up your college festival or integration? Send us a message.</p>
            <ContactForm />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
