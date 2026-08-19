import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Mail, Lock, User, Phone, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection.jsx';
import FloatingElements from '../components/FloatingElements.jsx';
import { signIn, signUpAdmin, resendConfirmation } from '../lib/supabase.js';

const CollegeAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: '', adminName: '', contactNumber: '', email: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin) {
      if (!formData.collegeName.trim()) newErrors.collegeName = 'College / Institution name is required';
      if (!formData.adminName.trim()) newErrors.adminName = 'Admin representative name is required';
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      }
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Official college email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError('');
    setApiSuccess('');

    try {
      if (isLogin) {
        const data = await signIn({ email: formData.email, password: formData.password });
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user_email', formData.email);
        localStorage.setItem('user_name', data.user?.user_metadata?.full_name || formData.adminName || 'Admin');
        localStorage.setItem('college_name', formData.collegeName || 'Partner Institution');
        localStorage.setItem('user_role', 'college');
        navigate('/admin-dashboard');
      } else {
        const data = await signUpAdmin({
          email: formData.email,
          password: formData.password,
          adminName: formData.adminName,
          collegeName: formData.collegeName,
          contactNumber: formData.contactNumber,
        });
        if (data.session) {
          // Email confirmation disabled — log in immediately
          localStorage.setItem('token', data.session.access_token);
          localStorage.setItem('user_email', formData.email);
          localStorage.setItem('user_name', formData.adminName || 'Admin');
          localStorage.setItem('college_name', formData.collegeName || 'Partner Institution');
          localStorage.setItem('user_role', 'college');
          navigate('/admin-dashboard');
        } else {
          setNeedsConfirmation(true);
          setApiSuccess('College account registered! Check your inbox and confirm your email, then sign in.');
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ collegeName: '', adminName: '', contactNumber: '', email: formData.email, password: '', confirmPassword: '' });
            setApiSuccess('');
            setNeedsConfirmation(false);
          }, 4000);
        }
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Email not confirmed')) {
        setNeedsConfirmation(true);
        setApiError('Email not confirmed yet. Check your inbox or resend the confirmation email.');
      } else if (msg.includes('already registered') || msg.includes('User already registered')) {
        setApiError('An account with this email already exists. Please sign in.');
        setIsLogin(true);
      } else {
        setApiError(msg || 'Authentication failed. Please verify institution credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-indigo-900/30 to-slate-950" />
      <FloatingElements />

      <div className="relative z-10 w-full max-w-lg">
        <AnimatedSection animation="fadeInLeft">
          <Link to="/" className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-all duration-300 hover:-translate-x-1">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Return to Home</span>
          </Link>
        </AnimatedSection>

        <AnimatedSection animation="scaleIn" delay={100} className="bg-slate-900/80 backdrop-blur-2xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-950/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30 group transition-transform duration-500 hover:scale-110">
              <Building2 className="w-8 h-8 text-white transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-3 text-xs text-purple-300 font-medium">
              <ShieldCheck size={12} className="animate-pulse text-purple-400" />
              <span>College Organizer Hub</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {isLogin ? 'College Portal' : 'Partner Your Institution'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {isLogin ? 'Manage events, track live registrations & download attendee insights' : 'List your college fests & reach thousands of students nationwide'}
            </p>
          </div>

          {apiSuccess && (
            <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-300 text-sm animate-fadeIn">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{apiSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Institution Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="collegeName"
                      placeholder="Stanford University / MIT"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${errors.collegeName ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-700/60 focus:ring-purple-500 focus:border-transparent'}`}
                    />
                  </div>
                  {errors.collegeName && <p className="text-rose-400 text-xs mt-1">{errors.collegeName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Admin / Coordinator Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="adminName"
                      placeholder="Dr. Sarah Connor"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${errors.adminName ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-700/60 focus:ring-purple-500 focus:border-transparent'}`}
                    />
                  </div>
                  {errors.adminName && <p className="text-rose-400 text-xs mt-1">{errors.adminName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="contactNumber"
                      placeholder="+1 (555) 019-2834"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${errors.contactNumber ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-700/60 focus:ring-purple-500 focus:border-transparent'}`}
                    />
                  </div>
                  {errors.contactNumber && <p className="text-rose-400 text-xs mt-1">{errors.contactNumber}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="events@college.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-700/60 focus:ring-purple-500 focus:border-transparent'}`}
                />
              </div>
              {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-11 py-3.5 bg-slate-800/60 border rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-700/60 focus:ring-purple-500 focus:border-transparent'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-11 py-3.5 bg-slate-800/60 border rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-rose-500/50 focus:ring-rose-500' : 'border-slate-700/60 focus:ring-purple-500 focus:border-transparent'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {apiError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs text-center space-y-2">
                <p>{apiError}</p>
                {needsConfirmation && (
                  <button
                    type="button"
                    onClick={async () => {
                      try { await resendConfirmation(formData.email); setApiError('Confirmation email resent! Check your inbox.'); }
                      catch (e) { setApiError(e.message); }
                    }}
                    className="text-purple-400 underline font-semibold hover:text-purple-300"
                  >
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : (isLogin ? 'Access College Admin Console' : 'Register College Account')}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Need to register your institution?' : 'Already partnered with us?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ collegeName: '', adminName: '', contactNumber: '', email: '', password: '', confirmPassword: '' });
                  setErrors({});
                  setApiError('');
                }}
                className="text-purple-400 hover:text-purple-300 ml-2 font-semibold hover:underline"
              >
                {isLogin ? 'Register college' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-slate-800">
            <p className="text-slate-400 text-xs mb-1">Are you a student looking for events?</p>
            <Link to="/student-auth" className="text-purple-400 hover:text-purple-300 text-sm font-semibold inline-flex items-center space-x-1 group">
              <span>Go to Student Portal</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default CollegeAuth;
