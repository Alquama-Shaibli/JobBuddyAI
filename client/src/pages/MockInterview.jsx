import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    FiCheckCircle, FiXCircle, FiChevronRight,
    FiChevronLeft, FiSend, FiZap, FiActivity, FiLock,
    FiArrowRight, FiAward, FiTag, FiRefreshCw
} from 'react-icons/fi';

/* ─── Constants ─────────────────────────────────────────── */
const PREDEFINED_ROLES = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Data Analyst",
    "DevOps Engineer",
    "Product Manager",
    "Mobile Developer",
    "Cloud Engineer",
];

/* ─── Grade Config ──────────────────────────────────────── */
const GRADE_CONFIG = {
    S: { label: "Outstanding",  color: "from-yellow-400 to-amber-500",  text: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/40"  },
    A: { label: "Excellent",    color: "from-emerald-400 to-green-500", text: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40" },
    B: { label: "Good",         color: "from-blue-400 to-blue-600",     text: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/40"       },
    C: { label: "Passing",      color: "from-violet-400 to-purple-500", text: "text-violet-600",  bg: "bg-violet-50 dark:bg-violet-500/10 border-violet-300 dark:border-violet-500/40" },
    D: { label: "Needs Work",   color: "from-rose-400 to-red-500",      text: "text-rose-600",    bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40"       },
};

/* ─── Option Letter Labels ──────────────────────────────── */
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/* ═══════════════════════════════════════════════════════════ */
const MockInterview = () => {
    const { currentUser } = useAuth();

    // Flow States: 'SETUP' | 'QUIZ' | 'RESULTS'
    const [view,    setView]    = useState('SETUP');
    const [loading, setLoading] = useState(false);

    // Setup
    const [selectedRole, setSelectedRole] = useState(PREDEFINED_ROLES[0]);
    const [customRole,   setCustomRole]   = useState('');

    // Quiz
    const [quizData,       setQuizData]       = useState(null);
    const [currentQIndex,  setCurrentQIndex]  = useState(0);
    const [answers,        setAnswers]        = useState({});
    const [flagged,        setFlagged]        = useState({});

    // Results
    const [results, setResults] = useState(null);

    /* ── Lock Guard ── */
    if (!currentUser?.isOnboarded) {
        return (
            <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center pt-28">
                <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FiLock className="text-4xl text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">🔒 Feature Locked</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        Please upload your resume on the <strong>Dashboard</strong> to unlock your personalised AI Mock Interview and deep analytics.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition"
                    >
                        Go to Dashboard <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    /* ── Handlers ── */
    const handleStartQuiz = async () => {
        const roleToUse = selectedRole === 'Other' ? customRole.trim() : selectedRole;
        if (!roleToUse) return toast.error('Please provide a valid job role.');

        try {
            setLoading(true);
            const response = await API.post('/quiz/generate', { tag: roleToUse });
            if (response.data?.success) {
                setQuizData(response.data);
                setAnswers({});
                setFlagged({});
                setCurrentQIndex(0);
                setView('QUIZ');
                toast.success(`Generated 10 MCQs for ${roleToUse}!`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    };

    const toggleFlag = (qId) => {
        setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
    };

    const handleSubmitQuiz = async () => {
        const totalQs = quizData.questions.length;
        const answered = Object.keys(answers).length;

        if (answered < totalQs) {
            const unanswered = totalQs - answered;
            return toast.warning(`${unanswered} question${unanswered > 1 ? 's' : ''} unanswered. Please answer all before submitting.`);
        }

        try {
            setLoading(true);
            const payloadArray = Object.entries(answers).map(([qId, optIdx]) => ({
                questionId:     qId,
                selectedOption: optIdx,
            }));

            const response = await API.post('/quiz/submit', {
                quizId:  quizData.quizId,
                answers: payloadArray,
            });

            if (response.data?.success) {
                setResults(response.data);
                setView('RESULTS');
                toast.success('🎯 Quiz evaluated! Check your results.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit quiz.');
        } finally {
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setView('SETUP');
        setQuizData(null);
        setResults(null);
        setAnswers({});
        setFlagged({});
        setCurrentQIndex(0);
    };

    /* ══════════════════════════════════════════════════════════
       ── SETUP VIEW ──
       ══════════════════════════════════════════════════════════ */
    if (view === 'SETUP') {
        return (
            <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center pt-28">
                <div className="max-w-xl w-full">

                    {/* Hero Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/5">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                            <FiActivity className="text-white text-4xl" />
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 text-center">
                            AI MCQ Assessment
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center leading-relaxed">
                            Select a job role and our AI will instantly generate <strong>10 highly-technical Multiple Choice Questions</strong> to benchmark your skills.
                        </p>

                        <div className="space-y-5">
                            {/* Role Dropdown */}
                            <div>
                                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-xs">
                                    Target Role
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => { setSelectedRole(e.target.value); setCustomRole(''); }}
                                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-slate-900 dark:text-white transition appearance-none cursor-pointer font-medium"
                                    >
                                        {PREDEFINED_ROLES.map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                        <option value="Other">Other (Custom Role)</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
                                </div>
                            </div>

                            {/* Custom role input — shown when Other is selected */}
                            {selectedRole === 'Other' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-xs">
                                        Custom Role
                                    </label>
                                    <input
                                        type="text"
                                        value={customRole}
                                        onChange={(e) => setCustomRole(e.target.value)}
                                        placeholder="e.g. Solidity Developer, Site Reliability Engineer..."
                                        autoFocus
                                        className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-slate-900 dark:text-white transition"
                                    />
                                </div>
                            )}

                            {/* Info strip */}
                            <div className="flex items-center gap-6 px-5 py-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                                {[
                                    { label: "Questions",  value: "10 MCQs"  },
                                    { label: "Time",       value: "~15 min"  },
                                    { label: "Difficulty", value: "Mixed"    },
                                ].map(({ label, value }) => (
                                    <div key={label} className="text-center flex-1">
                                        <p className="text-lg font-black text-blue-600 dark:text-blue-400">{value}</p>
                                        <p className="text-xs text-blue-400 font-semibold">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={handleStartQuiz}
                                disabled={loading || (selectedRole === 'Other' && !customRole.trim())}
                                className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
                            >
                                {loading
                                    ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Assessment...</>
                                    : <><FiZap /> Start Assessment</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ══════════════════════════════════════════════════════════
       ── QUIZ VIEW ──
       ══════════════════════════════════════════════════════════ */
    if (view === 'QUIZ' && quizData) {
        const question          = quizData.questions[currentQIndex];
        const totalQ            = quizData.questions.length;
        const progressPct       = ((currentQIndex) / totalQ) * 100;
        const hasAnsweredCurrent = answers[question._id] !== undefined;
        const answeredCount      = Object.keys(answers).length;
        const isLastQ            = currentQIndex === totalQ - 1;

        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 pt-28">
                <div className="max-w-3xl mx-auto">

                    {/* ── Header + Progress ── */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-xs">
                                    {quizData.tag}
                                </span>
                                {question.category && (
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold text-xs">
                                        <FiTag className="text-[10px]" /> {question.category}
                                    </span>
                                )}
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                                {currentQIndex + 1} / {totalQ}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>

                        {/* Question dot indicators */}
                        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
                            {quizData.questions.map((q, i) => (
                                <button
                                    key={q._id}
                                    onClick={() => setCurrentQIndex(i)}
                                    className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all shrink-0 ${
                                        i === currentQIndex
                                            ? 'bg-blue-600 text-white scale-110'
                                            : answers[q._id] !== undefined
                                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                            : flagged[q._id]
                                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600'
                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Question Card ── */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
                            <span className="text-blue-600 dark:text-blue-400 font-black mr-2">Q{currentQIndex + 1}.</span>
                            {question.questionText}
                        </h2>

                        <div className="space-y-3">
                            {question.options.map((opt, idx) => {
                                const isSelected = answers[question._id] === idx;
                                return (
                                    <label
                                        key={idx}
                                        className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
                                            isSelected
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                                : 'border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/50'
                                        }`}
                                    >
                                        {/* Option letter badge */}
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-all ${
                                            isSelected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                        }`}>
                                            {OPTION_LETTERS[idx]}
                                        </div>
                                        <input
                                            type="radio"
                                            name={`q-${question._id}`}
                                            className="hidden"
                                            checked={isSelected}
                                            onChange={() => handleOptionSelect(question._id, idx)}
                                        />
                                        <span className={`font-semibold text-sm leading-relaxed ${
                                            isSelected
                                                ? 'text-blue-900 dark:text-blue-100'
                                                : 'text-slate-700 dark:text-slate-300'
                                        }`}>
                                            {opt}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Footer Navigation ── */}
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => setCurrentQIndex(prev => prev - 1)}
                            disabled={currentQIndex === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 transition disabled:opacity-30 border border-slate-200 dark:border-slate-800"
                        >
                            <FiChevronLeft /> Previous
                        </button>

                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                {answeredCount}/{totalQ} answered
                            </p>
                        </div>

                        {isLastQ ? (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={loading || answeredCount < totalQ}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition shadow-lg shadow-emerald-500/20"
                            >
                                {loading
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Evaluating...</>
                                    : <><FiSend /> Submit Assessment</>
                                }
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQIndex(prev => prev + 1)}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg shadow-blue-500/20"
                            >
                                Next <FiChevronRight />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        );
    }

    /* ══════════════════════════════════════════════════════════
       ── RESULTS VIEW ──
       ══════════════════════════════════════════════════════════ */
    if (view === 'RESULTS' && results) {
        const { score, total, percentage, grade, feedback, evaluations } = results;
        const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG['C'];

        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 pt-28">
                <div className="max-w-4xl mx-auto">

                    {/* ── Score Hero Card ── */}
                    <div className={`rounded-[2.5rem] p-10 border-2 text-center mb-10 ${cfg.bg}`}>
                        {/* Grade Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${cfg.color} text-white font-black text-sm mb-4 shadow-lg`}>
                            <FiAward /> Grade {grade} — {cfg.label}
                        </div>

                        {/* Score Display */}
                        <div className={`text-8xl font-black mb-2 ${cfg.text}`}>
                            {score}
                            <span className="text-3xl opacity-40 ml-1">/ {total}</span>
                        </div>

                        {/* Percentage ring */}
                        <div className={`text-2xl font-black ${cfg.text} mb-4`}>{percentage.toFixed(0)}%</div>

                        {/* Feedback */}
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200 max-w-xl mx-auto">
                            {feedback}
                        </p>

                        {/* Quick stats */}
                        <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-current/10">
                            <div className="text-center">
                                <p className="text-2xl font-black text-emerald-600">{score}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correct</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-rose-600">{total - score}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Incorrect</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{total}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Answer Breakdown ── */}
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Detailed Answer Key</h3>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        <span className="text-sm font-bold text-slate-400">
                            {score}/{total} correct
                        </span>
                    </div>

                    <div className="space-y-5 mb-10">
                        {evaluations.map((ev, i) => (
                            <div
                                key={String(ev.questionId)}
                                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border shadow-sm ${
                                    ev.isCorrect
                                        ? 'border-emerald-200 dark:border-emerald-500/20'
                                        : 'border-rose-200 dark:border-rose-500/20'
                                }`}
                            >
                                {/* Question Header */}
                                <div className="flex items-start gap-4 mb-5">
                                    <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold ${ev.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                        {ev.isCorrect ? <FiCheckCircle /> : <FiXCircle />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-slate-400">Q{i + 1}</span>
                                            {ev.category && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-wider">
                                                    <FiTag className="text-[9px]" /> {ev.category}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-relaxed">
                                            {ev.questionText}
                                        </h4>
                                    </div>
                                </div>

                                {/* Options Grid */}
                                <div className="grid sm:grid-cols-2 gap-3 pl-13">
                                    {ev.options.map((opt, idx) => {
                                        const isUserAns    = ev.userAnswer    === idx;
                                        const isCorrectAns = ev.correctOption === idx;

                                        let boxStyle = "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400";
                                        if (isCorrectAns) {
                                            boxStyle = "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";
                                        } else if (isUserAns && !isCorrectAns) {
                                            boxStyle = "border-rose-400 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-200";
                                        }

                                        return (
                                            <div key={idx} className={`p-4 rounded-xl border-2 font-semibold text-sm flex items-center justify-between gap-3 ${boxStyle}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                                                        isCorrectAns ? 'bg-emerald-500 text-white' :
                                                        isUserAns    ? 'bg-rose-500 text-white' :
                                                        'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                                    }`}>
                                                        {OPTION_LETTERS[idx]}
                                                    </span>
                                                    <span className="leading-tight">{opt}</span>
                                                </div>
                                                <div className="shrink-0">
                                                    {isCorrectAns && <FiCheckCircle className="text-emerald-500 text-lg" />}
                                                    {isUserAns && !isCorrectAns && <FiXCircle className="text-rose-500 text-lg" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Result label */}
                                {!ev.isCorrect && ev.userAnswer !== null && ev.userAnswer !== undefined && (
                                    <div className="mt-4 pl-13 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <span>Your answer:</span>
                                        <span className="font-bold text-rose-600">{OPTION_LETTERS[ev.userAnswer]}. {ev.options[ev.userAnswer]}</span>
                                        <span className="mx-1">·</span>
                                        <span>Correct:</span>
                                        <span className="font-bold text-emerald-600">{OPTION_LETTERS[ev.correctOption]}. {ev.options[ev.correctOption]}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── CTA ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <button
                            onClick={resetQuiz}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:shadow-xl transition-all"
                        >
                            <FiRefreshCw /> Take Another Assessment
                        </button>
                        <Link
                            to="/jobs"
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20 transition"
                        >
                            Find Matching Jobs <FiArrowRight />
                        </Link>
                    </div>

                </div>
            </div>
        );
    }

    return null;
};

export default MockInterview;