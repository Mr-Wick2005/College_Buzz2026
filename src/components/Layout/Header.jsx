import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, GraduationCap, Building2, User, LogOut } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  const userName = localStorage.getItem('user_name') || 'Account';

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About Us' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                CAMPUS BUZZ
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate('/')} className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('events')} className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Events
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Contact
            </button>

            {token ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                <Link
                  to={role === 'college' ? '/admin-dashboard' : '/student-dashboard'}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
                >
                  <User size={14} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-xl bg-slate-900 border border-slate-800"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-4 border-l border-slate-800">
                <Link
                  to="/student-auth"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
                >
                  Student Login
                </Link>
                <Link
                  to="/college-auth"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  College Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3 bg-slate-950">
            <button onClick={() => { navigate('/'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-300">
              Home
            </button>
            <button onClick={() => scrollToSection('events')} className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-300">
              Events
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-300">
              Contact
            </button>

            {token ? (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <Link
                  to={role === 'college' ? '/admin-dashboard' : '/student-dashboard'}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-center px-4 py-2.5 bg-slate-900 text-rose-400 rounded-xl text-xs font-bold border border-slate-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <Link
                  to="/student-auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Student Login
                </Link>
                <Link
                  to="/college-auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  College Admin
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
