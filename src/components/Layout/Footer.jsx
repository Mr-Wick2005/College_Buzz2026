import React from "react"
import { Link } from "react-router-dom"
import {
  Zap,
  Radio,
  Globe,
  Share2,
  MessageSquare,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  Heart
} from "lucide-react"

const Footer = () => {
  return (
    <footer className="relative bg-[#090B0F] border-t border-white/[0.07] text-slate-400 overflow-hidden">
      {/* Subtle background glow */}
      <div className="ambient-glow -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-indigo-600/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Zap size={16} className="fill-white" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                COLLEGE<span className="text-indigo-400">BUZZ</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The real-time social event discovery engine for universities. Connecting students with hackathons, cultural festivals, tech summits, and creative meetups across top campuses.
            </p>

            {/* Live System Status Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono-acc text-[11px] text-slate-300">
                Supabase Cloud Sync: Operational
              </span>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.instagram.com/veda_222005/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-pink-400 transition-all hover:scale-105"
                aria-label="Instagram"
              >
                <Globe size={15} />
              </a>
              <a
                href="https://www.linkedin.com/in/vedanth-gali-00683328b/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-indigo-400 transition-all hover:scale-105"
                aria-label="LinkedIn"
              >
                <Share2 size={15} />
              </a>
              <a
                href="mailto:vedantmgali@gmail.com"
                className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-all hover:scale-105"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Column 1: Discovery */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Trending College Fests
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Hackathons & Build Nights
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Cultural Celebrations
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Workshops & Tech Talks
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-white transition-colors">
                  Inter-College Sports
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform Portals */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/student-auth" className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>Student Sign In</span>
                  <ArrowUpRight size={12} className="text-indigo-400" />
                </Link>
              </li>
              <li>
                <Link to="/college-auth" className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>College Host Admin</span>
                  <ArrowUpRight size={12} className="text-purple-400" />
                </Link>
              </li>
              <li>
                <Link to="/student-dashboard" className="hover:text-white transition-colors">
                  My Digital Passes
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard" className="hover:text-white transition-colors">
                  Host Console & Rosters
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Partner Your College
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider mb-4">
              Campus Relations
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <Mail size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-slate-300">vedantmgali@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Phone size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-slate-300">+91 9987602631</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-slate-300">Mumbai & Pan-India Hubs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} College Buzz Platform. Crafted for collegiate innovation & fest culture.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-300 cursor-pointer">Security & Passes</span>
            <span className="hover:text-slate-300 cursor-pointer">Event Terms</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
