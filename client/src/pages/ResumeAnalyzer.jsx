import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiFileText, FiExternalLink, FiZap, FiCheckCircle,
    FiTarget, FiSearch, FiTrendingUp, FiLock, FiArrowRight
} from 'react-icons/fi';

const ANALYZER_URL = "https://airesumeanalyzer-mv6aj7xqwmktxhr27ly8pm.streamlit.app/";

const ResumeAnalyzer = () => {
    const { currentUser } = useAuth();

    const handleOpenAnalyzer = () => {
        window.open(ANALYZER_URL, "_blank");
    };

    /* ── LOCK GUARD ── */
    if (!currentUser?.isOnboarded) {
        return (
            <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center">
                <div className="max-w-lg w-full bg-[#1e293b] rounded-[2.5rem] p-10 border border-slate-700 shadow-2xl text-center">
                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FiLock className="text-4xl text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3">🔒 Feature Locked</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Please upload your resume on the <strong className="text-white">Job Board</strong> tab to unlock your personalised AI Resume Analyzer and deep analytics.
                    </p>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition"
                    >
                        Go to Job Board <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen text-white p-6 pb-16'>
            <div className='max-w-5xl mx-auto'>

                {/* ── HEADER ───────────────────────────────────── */}
                <div className='mb-10'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3'>
                        <FiZap /> AI-Powered
                    </div>
                    <h1 className='text-3xl sm:text-4xl font-extrabold mb-2'>
                        AI Resume Analyzer
                    </h1>
                    <p className='text-gray-400 text-base'>
                        Get ATS score, resume feedback, keyword analysis and improvement recommendations.
                    </p>
                </div>

                {/* ── MAIN CARD ──────────────────────────────────── */}
                <div className='bg-[#1e293b] rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl'>

                    {/* Icon + Title */}
                    <div className='flex items-center gap-4 mb-8'>
                        <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20'>
                            <FiFileText className='text-3xl text-white' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-black text-white'>AI Resume Analyzer</h2>
                            <p className='text-gray-400 text-sm mt-0.5'>Powered by Advanced AI Engine</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className='text-gray-300 leading-8 text-base mb-8'>
                        Get ATS score, resume feedback, keyword analysis and improvement recommendations. Our AI engine scans your resume against industry standards and provides actionable insights to help you land more interviews.
                    </p>

                    {/* Feature highlights */}
                    <div className='grid sm:grid-cols-2 gap-4 mb-10'>
                        {[
                            { icon: FiTarget, label: 'ATS Compatibility Score', desc: 'See how well your resume passes automated screening systems' },
                            { icon: FiSearch, label: 'Keyword Analysis', desc: 'Identify missing keywords that recruiters look for' },
                            { icon: FiTrendingUp, label: 'Improvement Recommendations', desc: 'Get specific suggestions to strengthen your resume' },
                            { icon: FiCheckCircle, label: 'Formatting Review', desc: 'Ensure your resume follows best practices for ATS readability' },
                        ].map(({ icon: Icon, label, desc }, i) => (
                            <div key={i} className='flex items-start gap-3 bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl'>
                                <div className='w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5'>
                                    <Icon className='text-cyan-400' />
                                </div>
                                <div>
                                    <h3 className='text-sm font-bold text-white'>{label}</h3>
                                    <p className='text-xs text-gray-400 mt-0.5 leading-5'>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleOpenAnalyzer}
                        className='w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-3 group'
                    >
                        <FiExternalLink className='text-xl group-hover:rotate-12 transition-transform' />
                        Open Resume Analyzer
                    </button>

                    <p className='text-center text-gray-500 text-xs mt-4'>
                        Opens in a new tab · Free to use · No data stored
                    </p>
                </div>

                {/* ── INFO CARD ──────────────────────────────────── */}
                <div className='mt-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 flex items-start gap-4'>
                    <div className='w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0'>
                        <FiZap className='text-cyan-400' />
                    </div>
                    <div>
                        <h3 className='text-sm font-bold text-cyan-300 mb-1'>How it works</h3>
                        <p className='text-gray-400 text-sm leading-6'>
                            Upload your resume on the external analyzer tool and get instant feedback. The analyzer checks your resume against ATS standards, identifies missing keywords, and provides improvement suggestions tailored to your target role.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;