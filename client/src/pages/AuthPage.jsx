import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiArrowRight, FiZap } from 'react-icons/fi';
import logoWhite from '../assets/logo-white.png';

/* ── Testimonials for the left panel ─────────────────────────── */
const TESTIMONIALS = [
    {
        quote: "JobBuddy's AI mock interviews are as close to real as it gets. I cracked Zomato after just 3 weeks of practice here.",
        name: 'Priya Sharma',
        role: 'SDE at Zomato',
        initials: 'PS',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        quote: "The ATS Resume Analyzer found 7 missing skills I had no idea about. Got 4 callbacks in a single week after fixing my resume.",
        name: 'Aryan Gupta',
        role: 'Frontend Dev at Razorpay',
        initials: 'AG',
        color: 'from-violet-500 to-purple-600',
    },
    {
        quote: "The job matching is incredible — it doesn't just list jobs, it tells you exactly why you're a fit and what's missing.",
        name: 'Sneha Mehta',
        role: 'Full Stack at Groww',
        initials: 'SM',
        color: 'from-emerald-500 to-teal-600',
    },
];

/* ── Input field component ────────────────────────────────────── */
const Field = ({ label, id, type = 'text', value, onChange, placeholder, required, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 pr-16"
            />
            {children}
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════════════ */
const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Determine initial tab from the route
    const [tab, setTab] = useState(location.pathname === '/sign-up' ? 'register' : 'login');
    const [slide, setSlide] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Form state for login
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // Form state for register
    const [regData, setRegData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

    // Auto-advance testimonial carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setSlide((s) => (s + 1) % TESTIMONIALS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    // Sync tab when route changes
    useEffect(() => {
        setTab(location.pathname === '/sign-up' ? 'register' : 'login');
    }, [location.pathname]);

    const switchTab = (t) => {
        setTab(t);
        navigate(t === 'login' ? '/sign-in' : '/sign-up', { replace: true });
        setShowPass(false);
        setShowConfirm(false);
    };

    /* ── LOGIN SUBMIT ── */
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password)
            return toast.error('Please fill in all fields.');
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(loginData.email))
            return toast.error('Please enter a valid email address.');

        try {
            setLoading(true);
            const res = await API.post('/auth/login', loginData);
            if (res.data.success) {
                login(res.data.user);
                toast.success(res.data.message || 'Welcome back! 🎉');
                navigate('/dashboard');
            } else {
                toast.error(res.data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    /* ── REGISTER SUBMIT ── */
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!regData.username || !regData.email || !regData.password || !regData.confirmPassword)
            return toast.error('Please fill in all fields.');
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(regData.email))
            return toast.error('Please enter a valid email address.');
        if (regData.password !== regData.confirmPassword)
            return toast.error('Passwords do not match.');
        if (regData.password.length < 6)
            return toast.error('Password must be at least 6 characters.');

        try {
            setLoading(true);
            const res = await API.post('/auth/signup', {
                username: regData.username,
                email: regData.email,
                password: regData.password,
            });
            if (res.data.success) {
                toast.success('Account created! Let\'s get you set up 🚀');
                setRegData({ username: '', email: '', password: '', confirmPassword: '' });
                if (res.data.user) {
                    login(res.data.user);
                    navigate('/dashboard');
                } else {
                    switchTab('login');
                }
            } else {
                toast.error(res.data.message || 'Registration failed.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const t = TESTIMONIALS[slide];

    /* ═══════════════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/60 dark:shadow-slate-900/60 flex min-h-[580px]">

                {/* ── LEFT PANEL ──────────────────────────────── */}
                <div className="hidden md:flex md:w-[42%] relative flex-col justify-between p-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">

                    {/* Decorative circles */}
                    <div className="absolute top-[-60px] right-[-60px] w-56 h-56 rounded-full bg-white/8" />
                    <div className="absolute bottom-[-80px] left-[-40px] w-72 h-72 rounded-full bg-white/5" />
                    <div className="absolute top-[40%] left-[-30px] w-32 h-32 rounded-full bg-blue-500/30" />

                    <div className="relative z-10">
                        <img src={logoWhite} alt="JobBuddy AI" className="h-12 w-auto" />
                    </div>

                    {/* Testimonial */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
                        {/* Big quote marks */}
                        <div className="text-5xl text-white/30 font-black leading-none mb-6 font-serif">"</div>

                        <p className="text-white/90 text-base leading-7 italic font-medium mb-8 min-h-[84px] transition-all duration-500">
                            {t.quote}
                        </p>

                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                                {t.initials}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{t.name}</p>
                                <p className="text-blue-200 text-xs">{t.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Carousel controls */}
                    <div className="relative z-10 flex items-center gap-4">
                        {/* Dots */}
                        <div className="flex gap-1.5">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlide(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                                />
                            ))}
                        </div>
                        {/* Arrows */}
                        <div className="flex gap-2 ml-auto">
                            <button
                                onClick={() => setSlide((slide - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white text-sm font-bold"
                            >
                                ‹
                            </button>
                            <button
                                onClick={() => setSlide((slide + 1) % TESTIMONIALS.length)}
                                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition text-white text-sm font-bold"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL ─────────────────────────────── */}
                <div className="flex-1 bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col justify-center">

                    <div className="flex items-center gap-2 mb-6 md:hidden">
                        <img src={logoWhite} alt="JobBuddy AI" className="h-10 w-auto" />
                    </div>

                    {/* Heading */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                            {tab === 'login' ? 'Welcome back' : 'Create your account'}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-2">
                            <FiZap className="text-blue-500 text-xs" />
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                AI-Powered Career Acceleration Platform
                            </p>
                        </div>
                    </div>

                    {/* ── TAB SWITCHER ── */}
                    <div className="flex gap-0 border-b border-slate-200 dark:border-slate-700 mb-7">
                        {['login', 'register'].map((t_) => (
                            <button
                                key={t_}
                                id={`auth-tab-${t_}`}
                                onClick={() => switchTab(t_)}
                                className={`relative pb-3 px-1 mr-6 text-sm font-bold transition-colors capitalize ${
                                    tab === t_
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {t_ === 'login' ? 'Login' : 'Register'}
                                {tab === t_ && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── LOGIN FORM ── */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Field
                                label="Email Address"
                                id="email"
                                type="email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                placeholder="Enter your email address"
                                required
                            />
                            <Field
                                label="Password"
                                id="password"
                                type={showPass ? 'text' : 'password'}
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                placeholder="Enter your password"
                                required
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-semibold flex items-center gap-1 hover:text-blue-700 transition"
                                >
                                    {showPass ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                                    {showPass ? 'Hide' : 'Show'}
                                </button>
                            </Field>

                            <div className="flex justify-end">
                                <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition">
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                id="login-submit-btn"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In to Continue
                                        <FiArrowRight />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-1">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchTab('register')}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Register free
                                </button>
                            </p>
                        </form>
                    )}

                    {/* ── REGISTER FORM ── */}
                    {tab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <Field
                                label="Full Name / Username"
                                id="username"
                                value={regData.username}
                                onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                                placeholder="Enter your full name"
                                required
                            />
                            <Field
                                label="Email ID"
                                id="reg-email"
                                type="email"
                                value={regData.email}
                                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                placeholder="Enter your active Email ID"
                                required
                            />
                            <Field
                                label="Password"
                                id="reg-password"
                                type={showPass ? 'text' : 'password'}
                                value={regData.password}
                                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                placeholder="Create a password (min. 6 chars)"
                                required
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-semibold flex items-center gap-1 hover:text-blue-700 transition"
                                >
                                    {showPass ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                                    {showPass ? 'Hide' : 'Show'}
                                </button>
                            </Field>
                            <Field
                                label="Confirm Password"
                                id="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                value={regData.confirmPassword}
                                onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                                placeholder="Re-enter your password"
                                required
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-semibold flex items-center gap-1 hover:text-blue-700 transition"
                                >
                                    {showConfirm ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                                    {showConfirm ? 'Hide' : 'Show'}
                                </button>
                            </Field>

                            {/* Password strength indicator */}
                            {regData.password.length > 0 && (
                                <div>
                                    <div className="flex gap-1 mt-1">
                                        {[1,2,3,4].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                    regData.password.length >= i * 3
                                                        ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-blue-400' : 'bg-emerald-500'
                                                        : 'bg-slate-200 dark:bg-slate-700'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1 ${
                                        regData.password.length < 6 ? 'text-red-400' :
                                        regData.password.length < 9 ? 'text-amber-500' :
                                        regData.password.length < 12 ? 'text-blue-500' : 'text-emerald-500'
                                    }`}>
                                        {regData.password.length < 6 ? 'Too short' :
                                        regData.password.length < 9 ? 'Fair password' :
                                        regData.password.length < 12 ? 'Good password' : 'Strong password'}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                id="register-submit-btn"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account & Continue
                                        <FiArrowRight />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-1">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => switchTab('login')}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Sign In
                                </button>
                            </p>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AuthPage;
