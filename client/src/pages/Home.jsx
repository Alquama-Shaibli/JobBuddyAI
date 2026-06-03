import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiArrowRight, FiBriefcase, FiTarget, FiMessageSquare,
    FiCheckCircle, FiFileText, FiStar, FiBarChart2,
    FiPlay, FiZap, FiAward, FiUsers, FiCpu, FiTrendingUp,
    FiShield, FiChevronRight
} from 'react-icons/fi';
import logoWhite from '../assets/logo-white.png';

/* ─────────────────────────────────────────────────────────────── */
/*  Animated counter (triggers when element enters viewport)       */
/* ─────────────────────────────────────────────────────────────── */
const Counter = ({ to, suffix = '' }) => {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    const done = useRef(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !done.current) {
                done.current = true;
                const end = parseInt(to);
                const step = end / 80;
                let cur = 0;
                const t = setInterval(() => {
                    cur = Math.min(cur + step, end);
                    setVal(Math.floor(cur));
                    if (cur >= end) clearInterval(t);
                }, 16);
            }
        }, { threshold: 0.5 });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, [to]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ─────────────────────────────────────────────────────────────── */
/*  Pipeline step                                                  */
/* ─────────────────────────────────────────────────────────────── */
const Step = ({ num, Icon, title, sub, ring, dot, last }) => (
    <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center shrink-0">
            <div className={`w-11 h-11 rounded-xl border-2 ${ring} flex items-center justify-center`}>
                <Icon className={`text-base ${dot}`} />
            </div>
            {!last && <div className="w-px flex-1 min-h-[28px] mt-1 bg-slate-100 dark:bg-slate-800" />}
        </div>
        <div className="pb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                0{num}. {title}
            </p>
            <p className="text-[15px] font-bold text-slate-700 dark:text-slate-200">{sub}</p>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────── */
/*  Feature card                                                   */
/* ─────────────────────────────────────────────────────────────── */
const Card = ({ Icon, label, badge, text, bg, to }) => (
    <Link
        to={to}
        className="group rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8
                   hover:shadow-2xl hover:shadow-blue-500/8 hover:border-blue-200 dark:hover:border-blue-800
                   hover:-translate-y-1 transition-all duration-300 block"
    >
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center text-xl mb-5`}>
            <Icon />
        </div>
        {badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-wide mb-3">
                {badge}
            </span>
        )}
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
            {label}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-6">{text}</p>
        <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Try now <FiChevronRight />
        </div>
    </Link>
);

/* ─────────────────────────────────────────────────────────────── */
/*  Testimonial card                                               */
/* ─────────────────────────────────────────────────────────────── */
const Testimonial = ({ name, role, text, initials, grad }) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
        <div className="flex gap-0.5 mb-4">
            {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-7 mb-5 italic">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-sm shadow`}>
                {initials}
            </div>
            <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{name}</p>
                <p className="text-xs text-slate-400">{role}</p>
            </div>
        </div>
    </div>
);

/* ═════════════════════════════════════════════════════════════════
   HOME PAGE
═════════════════════════════════════════════════════════════════ */
export const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    /* Primary CTA — if already logged in, go dashboard; else sign-up */
    const primaryHref = currentUser ? '/dashboard' : '/sign-up';
    const primaryLabel = currentUser ? 'Go to Dashboard' : 'Get Started Free';

    const stats = [
        { to: '10000', suffix: '+', label: 'Mock Interviews Done', Icon: FiMessageSquare, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
        { to: '5000',  suffix: '+', label: 'Jobs Available',       Icon: FiBriefcase,    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
        { to: '95',    suffix: '%', label: 'Success Rate',         Icon: FiAward,        color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10' },
        { to: '2000',  suffix: '+', label: 'Users Placed',         Icon: FiUsers,        color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
    ];

    const features = [
        {
            Icon: FiMessageSquare,
            label: 'AI Mock Interviews',
            badge: 'Most Popular',
            text: 'Practice HR, DSA, MERN & Resume-based rounds. Get scored on technical accuracy, communication, and confidence.',
            bg: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
            to: currentUser ? '/interview' : '/sign-up',
        },
        {
            Icon: FiBriefcase,
            label: 'Smart Job Matching',
            badge: null,
            text: 'AI matches you to roles based on your skills and resume. See real match % scores and missing skill gaps.',
            bg: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            to: currentUser ? '/jobs' : '/sign-up',
        },
        {
            Icon: FiTarget,
            label: 'AI Resume Analyzer',
            badge: null,
            text: 'Get ATS score, resume feedback, keyword analysis and improvement recommendations powered by AI.',
            bg: 'bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
            to: currentUser ? '/resume-analyzer' : '/sign-up',
        },
        {
            Icon: FiBarChart2,
            label: 'Performance Analytics',
            badge: null,
            text: 'Track your mock test scores, interview history, and career growth over time with visual dashboards.',
            bg: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
            to: currentUser ? '/dashboard' : '/sign-up',
        },
    ];

    const testimonials = [
        {
            name: 'Priya Sharma', role: 'SDE at Zomato',
            text: "JobBuddy's AI interviews felt as real as actual interviews. Cracked Zomato in just 3 weeks of practice here!",
            initials: 'PS', grad: 'from-blue-500 to-indigo-600',
        },
        {
            name: 'Aryan Gupta', role: 'Frontend at Razorpay',
            text: "The ATS analyzer found 7 missing skills I had no idea about. Got 4 callbacks in a single week after fixing my resume.",
            initials: 'AG', grad: 'from-violet-500 to-purple-600',
        },
        {
            name: 'Sneha Mehta', role: 'Full Stack at Groww',
            text: "The HR interview module is gold. Real questions, instant detailed feedback. Nothing like it in the market.",
            initials: 'SM', grad: 'from-emerald-500 to-teal-600',
        },
    ];

    /* ── render ── */
    return (
        <div className="min-h-screen text-slate-900 dark:text-white overflow-x-hidden">

            {/* ════════════════════════════════════════════════
                HERO
            ════════════════════════════════════════════════ */}
            <section className="relative pt-36 pb-28 overflow-hidden">

                {/* ambient glows */}
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-300 dark:bg-blue-800 rounded-full blur-[130px] opacity-20 pointer-events-none" />
                <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900 rounded-full blur-[130px] opacity-20 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* ── LEFT copy ── */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold text-sm mb-8">
                            <FiZap className="text-blue-500" />
                            AI-Powered Career Acceleration Platform
                        </div>

                        {/* Headline */}
                        <h1 className="text-[clamp(40px,5vw,70px)] font-black leading-[1.06] text-slate-900 dark:text-white">
                            Smarter prep.
                            <br />
                            <span className="text-blue-600">Faster placement.</span>
                        </h1>

                        {/* Sub */}
                        <p className="text-slate-600 dark:text-slate-300 text-lg mt-6 max-w-lg leading-relaxed">
                            Practice AI mock interviews, fix your ATS score, find skill-matched jobs, and track your growth — all in one free platform.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 mt-10">
                            <Link
                                to={primaryHref}
                                id="hero-primary-cta"
                                className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/30 overflow-hidden group transition"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                                {primaryLabel}
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to={currentUser ? '/interview' : '/sign-in'}
                                id="hero-secondary-cta"
                                className="flex items-center gap-3 border border-slate-300 dark:border-slate-700 px-7 py-4 rounded-2xl font-bold bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition group"
                            >
                                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                    <FiPlay className="text-blue-600 group-hover:text-white text-xs ml-0.5 transition-colors" />
                                </div>
                                {currentUser ? 'Start Interview' : 'Sign In'}
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-4 mt-10">
                            <div className="flex">
                                {['bg-blue-500','bg-violet-500','bg-amber-500','bg-emerald-500'].map((c,i) => (
                                    <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-[#F8FAFC] dark:border-slate-950 flex items-center justify-center text-white shadow-md ${i>0?'-ml-3':''}`}>
                                        <FiUsers className="text-xs" />
                                    </div>
                                ))}
                                <div className="w-9 h-9 -ml-3 rounded-full bg-slate-700 border-2 border-[#F8FAFC] dark:border-slate-950 flex items-center justify-center text-white text-[9px] font-black shadow-md">
                                    +1.8k
                                </div>
                            </div>
                            <div>
                                <div className="flex gap-0.5 mb-1">
                                    {[...Array(5)].map((_,i) => (
                                        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                    Trusted by <span className="text-slate-900 dark:text-white font-black">2,000+</span> job seekers
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT — pipeline card ── */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl shadow-slate-300/40 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-800">

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-black text-xl text-slate-900 dark:text-white">Your Career Pipeline</h3>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">AI-Powered Workflow</p>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                AI Active
                            </span>
                        </div>

                        {/* progress */}
                        <div className="mb-8">
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="text-[9px] text-slate-400">Start</span>
                                <span className="text-[9px] text-blue-500 font-bold">60% Complete</span>
                                <span className="text-[9px] text-slate-400">Hired ✓</span>
                            </div>
                        </div>

                        {/* steps */}
                        <Step num={1} Icon={FiFileText}     title="Resume Upload"   sub="Optimize with AI ATS analysis"     ring="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-500/10"    dot="text-blue-500" />
                        <Step num={2} Icon={FiTarget}       title="Skill Analysis"  sub="AI gap analysis & learning plan"   ring="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-500/10" dot="text-violet-500" />
                        <Step num={3} Icon={FiMessageSquare} title="Mock Interview" sub="AI-led practice with scoring"      ring="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-500/10"  dot="text-amber-500" />
                        <Step num={4} Icon={FiBriefcase}    title="Job Matching"    sub="AI surfaces your best-fit roles"   ring="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-500/10" dot="text-emerald-500" last />

                        {/* mini stats */}
                        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            {[
                                { label: 'ATS Score', val: '88/100', color: 'text-blue-600' },
                                { label: 'Interviews', val: '12 done', color: 'text-violet-600' },
                                { label: 'Job Matches', val: '23 jobs', color: 'text-emerald-600' },
                            ].map(({ label, val, color }) => (
                                <div key={label} className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3">
                                    <p className={`text-sm font-black ${color}`}>{val}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold leading-tight">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ════════════════════════════════════════════════
                STATS STRIP
            ════════════════════════════════════════════════ */}
            <section className="py-16 border-y-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.45em] mb-12">
                        Trusted by Job Seekers Across India
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {stats.map(({ to, suffix, label, Icon, color }) => (
                            <div key={label} className="text-center">
                                <div className="flex justify-center mb-3">
                                    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
                                        <Icon className="text-xl" />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                                    <Counter to={to} suffix={suffix} />
                                </h2>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                FEATURES
            ════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#F8FAFC] dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold text-sm mb-6">
                            <FiZap /> Platform Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                            Everything you need to<br />
                            <span className="text-blue-600">land your dream job</span>
                        </h2>
                        <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                            All-in-one AI career platform — from resume analysis to job matching to interview practice.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => <Card key={i} {...f} />)}
                    </div>

                    {/* Login CTA below features (only show when not logged in) */}
                    {!currentUser && (
                        <div className="mt-12 text-center">
                            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
                                All features are free to use after signing up
                            </p>
                            <Link
                                to="/sign-up"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg shadow-blue-600/20"
                            >
                                Create Free Account <FiArrowRight />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                HOW IT WORKS
            ════════════════════════════════════════════════ */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* left copy */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm mb-6">
                                <FiCheckCircle /> How It Works
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                                From upload to<br />
                                <span className="text-emerald-600">offer letter</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10">
                                JobBuddy guides you through every step of your job search — no complex setup, start in minutes for free.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { n:'01', title:'Upload Your Resume', desc:"Get your ATS score and missing skills in under 30 seconds.", col:'text-blue-600', bg:'bg-blue-50 dark:bg-blue-500/10', path: currentUser ? '/resume' : '/sign-up' },
                                    { n:'02', title:'Practice Mock Interviews', desc:"Choose HR, DSA, MERN, or Resume-based. Get scored by Gemini AI.", col:'text-violet-600', bg:'bg-violet-50 dark:bg-violet-500/10', path: currentUser ? '/interview' : '/sign-up' },
                                    { n:'03', title:'Apply to Matched Jobs', desc:"AI surfaces roles matching your skill profile with % match scores.", col:'text-emerald-600', bg:'bg-emerald-50 dark:bg-emerald-500/10', path: currentUser ? '/jobs' : '/sign-up' },
                                ].map(({ n, title, desc, col, bg, path }) => (
                                    <Link to={path} key={n} className="flex items-start gap-4 group cursor-pointer">
                                        <span className={`flex-shrink-0 w-10 h-10 rounded-xl ${bg} ${col} font-black text-sm flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            {n}
                                        </span>
                                        <div>
                                            <h4 className={`font-bold text-slate-900 dark:text-white mb-0.5 group-hover:${col} transition-colors`}>{title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-5">{desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <Link
                                to={primaryHref}
                                id="howitworks-cta"
                                className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition shadow-lg shadow-blue-600/25"
                            >
                                {primaryLabel} <FiArrowRight />
                            </Link>
                        </div>

                        {/* right — live preview card */}
                        <div className="space-y-4">
                            {/* Interview result card */}
                            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white text-base">Interview Completed ✓</p>
                                        <p className="text-xs text-slate-400 mt-0.5">MERN Stack • AI Evaluation</p>
                                    </div>
                                    <div className="text-center bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 shadow-sm border border-slate-100 dark:border-slate-700">
                                        <p className="text-2xl font-black text-emerald-600">8.4</p>
                                        <p className="text-[10px] text-slate-400 font-bold">/10</p>
                                    </div>
                                </div>
                                {[
                                    { label:'Technical Accuracy', val:84, color:'bg-blue-500' },
                                    { label:'Communication',      val:79, color:'bg-violet-500' },
                                    { label:'Confidence',         val:91, color:'bg-emerald-500' },
                                ].map(({ label, val, color }) => (
                                    <div key={label} className="mb-3">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{val}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <div className={`${color} h-full rounded-full transition-all`} style={{ width:`${val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ATS card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
                                {/* ring */}
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                                        <circle cx="18" cy="18" r="14" strokeWidth="3" stroke="#e2e8f0" fill="none" />
                                        <circle cx="18" cy="18" r="14" strokeWidth="3" stroke="#2563eb" fill="none"
                                            strokeDasharray={`${14*2*Math.PI*0.88} ${14*2*Math.PI}`}
                                            strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-black text-blue-600">88</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">ATS Resume Score</p>
                                    {['✓ Format clean & readable', '⚠ Missing: React, TypeScript', '✓ 92% keyword match'].map((t) => (
                                        <p key={t} className={`text-xs leading-5 font-medium ${t.startsWith('✓') ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{t}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Job match card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Top AI Job Match</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white">Full Stack Developer</p>
                                        <p className="text-xs text-blue-600 font-semibold mt-0.5">Razorpay • Bangalore</p>
                                    </div>
                                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-black">94%</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {['React','Node.js','MongoDB','TypeScript'].map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                TESTIMONIALS
            ════════════════════════════════════════════════ */}
            <section className="py-24 bg-[#F8FAFC] dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
                            Loved by Job Seekers
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            Real stories from people who leveled up their careers with JobBuddy AI.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => <Testimonial key={i} {...t} />)}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                CTA BANNER
            ════════════════════════════════════════════════ */}
            <section className="py-24 bg-white dark:bg-slate-900 px-6">
                <div className="max-w-5xl mx-auto rounded-[40px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/30">

                    {/* decoration */}
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/20 rounded-full pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur text-white font-bold text-sm mb-6">
                            <FiZap /> Ready to Level Up?
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                            {currentUser
                                ? 'Keep growing — your next opportunity awaits'
                                : 'Start your career journey with AI today — it\'s free'}
                        </h2>
                        <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            {currentUser
                                ? 'Check your dashboard, practice more interviews, and apply to AI-matched jobs.'
                                : 'Join 2,000+ job seekers who use JobBuddy AI to practice smarter, apply confidently, and get hired faster.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to={primaryHref}
                                id="cta-primary"
                                className="px-9 py-4 rounded-2xl bg-white text-blue-600 font-black hover:scale-105 transition shadow-xl"
                            >
                                {currentUser ? 'Go to Dashboard' : 'Create Free Account'}
                            </Link>
                            {!currentUser && (
                                <Link
                                    to="/sign-in"
                                    id="cta-login"
                                    className="px-9 py-4 rounded-2xl border-2 border-white/30 hover:bg-white/10 font-bold transition"
                                >
                                    Already have an account? Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                FOOTER
            ════════════════════════════════════════════════ */}
            <footer className="border-t border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        {/* brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <img src={logoWhite} alt="JobBuddy AI" className="h-9 w-auto" />
                            </div>
                            <p className="text-sm text-slate-400 max-w-xs leading-5">
                                AI-powered career platform to help you crack interviews, fix your resume, and land your dream job.
                            </p>
                        </div>

                        {/* links */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-3 text-sm">
                            {[
                                { label:'Jobs',            path:'/jobs' },
                                { label:'Mock Interview',  path:'/interview' },
                                { label:'AI Resume Analyzer', path:'/resume-analyzer' },
                                { label:'Mock Tests',      path:'/mock-test' },
                                { label:'Dashboard',       path:'/dashboard' },
                                { label:'Profile',         path:'/profile' },
                            ].map(({ label, path }) => (
                                <Link key={label} to={path} className="text-slate-400 hover:text-blue-600 transition font-medium">
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* auth quick links */}
                        {!currentUser && (
                            <div className="flex gap-3">
                                <Link to="/sign-in" className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-400 transition">
                                    Sign In
                                </Link>
                                <Link to="/sign-up" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-md shadow-blue-600/20">
                                    Register Free
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-slate-400">© 2025 JobBuddy AI. Built to help you get hired faster.</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <FiShield className="text-emerald-500" />
                            Secure · Private · Free
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};