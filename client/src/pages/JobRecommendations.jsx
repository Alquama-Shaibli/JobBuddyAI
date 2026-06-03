import React, { useEffect, useRef, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import dummyJobs from '../data/dummyJobs';
import {
    FiBriefcase, FiMapPin, FiDollarSign, FiExternalLink, FiZap,
    FiUploadCloud, FiSearch, FiCheckCircle, FiLoader, FiLayers,
    FiLock, FiX, FiRefreshCw, FiCode, FiFileText, FiBookmark,
    FiClock, FiStar, FiTrendingUp, FiAward
} from 'react-icons/fi';

/* ─── Constants ──────────────────────────────────────────── */
const STANDARD_ROLES = [
    'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Data Scientist', 'Machine Learning Engineer', 'Data Analyst',
    'DevOps Engineer', 'Product Manager',
];

/* ─── Badge Helper ───────────────────────────────────────── */
const getMatchBadge = (pct) => {
    if (pct >= 90) return { label: 'Highly Recommended', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: FiAward };
    if (pct >= 75) return { label: 'Good Match', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: FiTrendingUp };
    return { label: 'Explore', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', icon: FiSearch };
};

const getMatchRingColor = (pct) => {
    if (pct >= 90) return '#22c55e';
    if (pct >= 75) return '#3b82f6';
    return '#64748b';
};

/* ─── Skill Tag Chip ─────────────────────────────────────── */
const SkillChip = ({ label, onRemove, color = 'blue' }) => {
    const styles = {
        blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-500/30',
        violet: 'bg-violet-100 dark:bg-violet-500/20 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-500/30',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all ${styles[color]}`}>
            {label}
            {onRemove && (
                <button onClick={() => onRemove(label)} className="hover:opacity-50 transition ml-0.5">
                    <FiX className="text-[10px]" />
                </button>
            )}
        </span>
    );
};

/* ─── Demo Modal ─────────────────────────────────────────── */
const DemoModal = ({ onClose }) => (
    <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
    >
        <div
            className="bg-[#1e293b] rounded-3xl p-8 max-w-md w-full mx-4 border border-slate-700 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FiBriefcase className="text-3xl text-blue-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Demo Version</h3>
            <p className="text-slate-400 leading-7 mb-6">
                This is a demo version of JobBuddy AI. Application functionality will be available in future releases.
            </p>
            <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-600/20"
            >
                Got it
            </button>
        </div>
    </div>
);

/* ─── Job Card ───────────────────────────────────────────── */
const JobCard = ({ job, onApply, onSave, isSaved }) => {
    const { label, color, icon: BadgeIcon } = getMatchBadge(job.matchPercentage);
    const ringColor = getMatchRingColor(job.matchPercentage);
    const radius = 28;
    const circ = 2 * Math.PI * radius;
    const dash = circ * ((job.matchPercentage || 0) / 100);

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-[28px] p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col h-full">

            {/* Top Row: Title + Match Ring */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                    </h3>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {job.company}
                    </p>
                </div>
                {/* Match % Ring */}
                <div className="relative flex-shrink-0">
                    <svg width="68" height="68" className="-rotate-90">
                        <circle cx="34" cy="34" r={radius} strokeWidth="5" stroke="#1e293b" fill="none" />
                        <circle
                            cx="34" cy="34" r={radius}
                            strokeWidth="5"
                            stroke={ringColor}
                            fill="none"
                            strokeDasharray={`${dash} ${circ}`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.8s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-black text-white">{job.matchPercentage}%</span>
                    </div>
                </div>
            </div>

            {/* Badge */}
            <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${color}`}>
                    <BadgeIcon className="text-xs" />
                    {label}
                </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <FiMapPin className="shrink-0 text-xs" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <FiDollarSign className="shrink-0 text-xs" />
                    <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <FiClock className="shrink-0 text-xs" />
                    <span>{job.experience}</span>
                </div>
            </div>

            {/* Skills */}
            {job.skillsRequired?.length > 0 && (
                <div className="mb-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {job.skillsRequired.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-5 mb-5 line-clamp-2">
                {job.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button
                    onClick={() => onApply(job)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 text-white dark:text-slate-900 dark:hover:text-white font-bold rounded-xl transition-all text-sm"
                >
                    Apply Now <FiExternalLink />
                </button>
                <button
                    onClick={() => onSave(job.id)}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-bold flex items-center gap-2 ${
                        isSaved
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-400 hover:text-amber-400'
                    }`}
                >
                    <FiBookmark className={isSaved ? 'fill-current' : ''} />
                    {isSaved ? 'Saved' : 'Save'}
                </button>
            </div>
        </div>
    );
};

/* ─── Skeleton Card ──────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[28px] p-7 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="flex items-start justify-between mb-5">
            <div className="flex-1 pr-4 space-y-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
                <div className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-1/2" />
            </div>
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0" />
        </div>
        <div className="space-y-2 mb-5">
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        </div>
        <div className="flex gap-2 mb-5">
            {[1, 2, 3].map(i => <div key={i} className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />)}
        </div>
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
    </div>
);

/* ══════════════════════════════════════════════════════════ */
const JobRecommendations = () => {
    const { currentUser, updateUser } = useAuth();
    const fileRef = useRef(null);

    /* ── Core State ── */
    const [isUploaded, setIsUploaded] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [customRole, setCustomRole] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');

    /* ── File Upload State ── */
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    /* ── Job Results State ── */
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    /* ── Modal & Save State ── */
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [savedJobs, setSavedJobs] = useState(() => {
        try { return JSON.parse(localStorage.getItem('jobbuddy_saved_jobs') || '[]'); }
        catch { return []; }
    });

    /* ── Check if user already has isOnboarded ── */
    useEffect(() => {
        if (currentUser?.isOnboarded) {
            setIsUploaded(true);
            setSelectedRole(currentUser.preferredRole || STANDARD_ROLES[0]);
            setSkills(currentUser.skills || []);
            setExtractedData({
                skills: currentUser.skills || [],
                suggestedRole: currentUser.preferredRole || ''
            });
        }
    }, [currentUser]);

    /* ── File Validation ── */
    const validateAndSetFile = (f) => {
        const allowed = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(f.type)) return toast.error('Only PDF or DOCX files accepted.');
        if (f.size > 5 * 1024 * 1024) return toast.error('File must be under 5 MB.');
        setFile(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) validateAndSetFile(dropped);
    };

    /* ── Step 1: Upload Resume ── */
    const handleUpload = async () => {
        if (!file) return toast.error('Please select a resume file first.');
        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append('resume', file);

            const res = await API.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const parsedSkills = res.data?.resume?.skills || [];
            const suggestedRole = currentUser?.preferredRole || STANDARD_ROLES[0];

            const extracted = { skills: parsedSkills, suggestedRole };
            setExtractedData(extracted);
            setSkills(parsedSkills);
            setSelectedRole(suggestedRole);
            setIsUploaded(true);

            if (!currentUser?.isOnboarded) {
                await API.post('/user/complete-onboarding', {
                    targetRole: suggestedRole,
                    skills: parsedSkills,
                    languages: []
                });
                updateUser({ isOnboarded: true, skills: parsedSkills, preferredRole: suggestedRole });
            }

            toast.success(`✅ Resume parsed! ${parsedSkills.length} skills extracted.`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploadLoading(false);
        }
    };

    /* ── Skill Tag Handlers ── */
    const addSkill = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault();
            const val = skillInput.trim().replace(/,$/, '');
            if (val && !skills.includes(val)) setSkills(prev => [...prev, val]);
            setSkillInput('');
        }
    };
    const removeSkill = (s) => setSkills(prev => prev.filter(sk => sk !== s));

    /* ── Step 3: Load Instant Job Matches (local data — no API) ── */
    const handleFindMatches = () => {
        const role = selectedRole === 'Other' ? customRole : selectedRole;
        if (!role.trim()) return toast.error('Please select a target role.');

        setJobsLoading(true);
        setHasFetched(false);

        // Simulate a brief loading state for UX polish, then load instantly
        setTimeout(() => {
            const sorted = [...dummyJobs].sort((a, b) => b.matchPercentage - a.matchPercentage);
            setJobs(sorted);
            setHasFetched(true);
            setJobsLoading(false);
            toast.success(`Found ${sorted.length} job recommendations!`);
        }, 800);
    };

    /* ── Apply Now (Demo Modal) ── */
    const handleApply = () => setShowDemoModal(true);

    /* ── Save Job ── */
    const handleSaveJob = (jobId) => {
        setSavedJobs(prev => {
            const updated = prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId];
            localStorage.setItem('jobbuddy_saved_jobs', JSON.stringify(updated));
            toast.success(prev.includes(jobId) ? 'Job removed from saved' : 'Job saved!');
            return updated;
        });
    };

    const effectiveRole = selectedRole === 'Other' ? customRole : selectedRole;
    const isStandardRole = STANDARD_ROLES.includes(selectedRole);

    /* ════════════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* ── Demo Modal ── */}
                {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-widest mb-4">
                            <FiZap className="text-sm" /> AI Job Matcher
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                            Find Your Perfect Role
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                            Upload your resume, pick a target domain, and discover curated job recommendations matched to your skill profile.
                        </p>
                    </div>
                    {isUploaded && hasFetched && (
                        <button
                            onClick={() => { setHasFetched(false); setJobs([]); }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-blue-500 hover:text-blue-600 transition shadow-sm"
                        >
                            <FiRefreshCw className="text-sm" /> New Search
                        </button>
                    )}
                </div>

                {/* ══════════════════════════════════════════════════════════ */}
                {/* ── MAIN MATCHER CARD ── */}
                {/* ══════════════════════════════════════════════════════════ */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">

                    {/* ── Card Header ── */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <FiBriefcase className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900 dark:text-white">Job Match Engine</h2>
                                <p className="text-xs text-slate-400 font-medium">AI-Powered Recommendations</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                            isUploaded
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                            {isUploaded
                                ? <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Resume Loaded</>
                                : <><FiLock className="text-sm" /> Awaiting Resume</>
                            }
                        </div>
                    </div>

                    <div className="p-8 sm:p-10 space-y-8">

                        {/* ── STEP 1: Resume Upload ── */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                    isUploaded ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                                }`}>
                                    {isUploaded ? <FiCheckCircle /> : '1'}
                                </div>
                                <h3 className="font-black text-slate-900 dark:text-white">
                                    {isUploaded ? 'Resume Parsed ✓' : 'Upload Your Resume'}
                                </h3>
                            </div>

                            {!isUploaded ? (
                                <div className="space-y-4">
                                    {/* Drop Zone */}
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                        onDragLeave={() => setDragging(false)}
                                        onClick={() => !uploadLoading && fileRef.current?.click()}
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                                            dragging
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.01]'
                                                : file
                                                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                                                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/30'
                                        }`}
                                    >
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => e.target.files[0] && validateAndSetFile(e.target.files[0])}
                                        />

                                        {uploadLoading && (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto">
                                                    <FiLoader className="text-blue-600 text-2xl animate-spin" />
                                                </div>
                                                <p className="font-bold text-slate-800 dark:text-white">Parsing resume with AI...</p>
                                                <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full animate-progress" style={{ animation: 'progress 2s ease-in-out infinite' }} />
                                                </div>
                                                <p className="text-xs text-slate-400">Extracting skills, experience and role signals</p>
                                            </div>
                                        )}

                                        {!uploadLoading && file && (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                                    <FiFileText className="text-emerald-600 text-xl" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{file.name}</p>
                                                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                                                </div>
                                            </div>
                                        )}

                                        {!uploadLoading && !file && (
                                            <>
                                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <FiUploadCloud className="text-blue-600 text-2xl" />
                                                </div>
                                                <p className="font-bold text-slate-700 dark:text-slate-200">Drag & drop your resume here</p>
                                                <p className="text-xs text-slate-400 mt-2">PDF or DOCX · Max 5 MB</p>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleUpload}
                                        disabled={!file || uploadLoading}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
                                    >
                                        {uploadLoading
                                            ? <><FiLoader className="animate-spin" /> Analysing Resume...</>
                                            : <><FiUploadCloud /> Analyse Resume & Unlock</>
                                        }
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                                        <FiCheckCircle className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-emerald-800 dark:text-emerald-200 text-sm">Resume Successfully Parsed</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            {skills.length} skills extracted · Role: {extractedData?.suggestedRole || 'Not specified'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setIsUploaded(false); setFile(null); setExtractedData(null); setSkills([]); setJobs([]); setHasFetched(false); }}
                                        className="ml-auto text-slate-400 hover:text-rose-500 transition text-sm font-bold"
                                    >
                                        Re-upload
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── STEP 2: Role Selection + Skills ── */}
                        <div className={`transition-all duration-500 ${isUploaded ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                    !isUploaded ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' :
                                    effectiveRole ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                                }`}>
                                    {!isUploaded ? <FiLock className="text-xs" /> : effectiveRole ? <FiCheckCircle /> : '2'}
                                </div>
                                <h3 className="font-black text-slate-900 dark:text-white">
                                    Select Target Role
                                    {!isUploaded && <span className="ml-2 text-xs font-bold text-slate-400">(Upload resume first)</span>}
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <select
                                        value={isStandardRole ? selectedRole : 'Other'}
                                        onChange={(e) => {
                                            if (e.target.value !== 'Other') {
                                                setSelectedRole(e.target.value);
                                                setCustomRole('');
                                            } else {
                                                setSelectedRole('Other');
                                            }
                                        }}
                                        disabled={!isUploaded}
                                        className={`w-full px-4 py-4 rounded-2xl border appearance-none font-medium outline-none transition-all ${
                                            isUploaded
                                                ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer'
                                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <option value="" disabled>Select a target role...</option>
                                        {STANDARD_ROLES.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                        <option value="Other">Other (custom)</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">▾</div>
                                    {!isUploaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 rounded-2xl backdrop-blur-[1px]">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                <FiLock /> Locked — Upload resume first
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isUploaded && selectedRole === 'Other' && (
                                    <div className="relative">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={customRole}
                                            onChange={(e) => setCustomRole(e.target.value)}
                                            placeholder="e.g. Blockchain Developer, Solidity Engineer…"
                                            autoFocus
                                            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 dark:text-white transition"
                                        />
                                    </div>
                                )}

                                {isUploaded && (
                                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                            <FiCode className="text-blue-500 text-sm" />
                                            <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                                                Extracted Skills — Verify & Edit
                                            </p>
                                            <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black">
                                                {skills.length} skills
                                            </span>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="flex flex-wrap gap-2 min-h-[36px]">
                                                {skills.length > 0
                                                    ? skills.map(s => <SkillChip key={s} label={s} onRemove={removeSkill} color="blue" />)
                                                    : <p className="text-xs text-slate-400 italic">No skills extracted. Add them below.</p>
                                                }
                                            </div>
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyDown={addSkill}
                                                placeholder="Add skill and press Enter…"
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-slate-900 dark:text-white text-sm transition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── STEP 3: Find Matches Button ── */}
                        <div className={`transition-all duration-500 ${isUploaded ? 'opacity-100' : 'opacity-30 pointer-events-none select-none'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                    !isUploaded ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : 'bg-blue-600 text-white'
                                }`}>
                                    {!isUploaded ? <FiLock className="text-xs" /> : '3'}
                                </div>
                                <h3 className="font-black text-slate-900 dark:text-white">Find Job Matches</h3>
                            </div>

                            <button
                                onClick={handleFindMatches}
                                disabled={!isUploaded || !effectiveRole.trim() || jobsLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-3"
                            >
                                {jobsLoading ? (
                                    <><FiLoader className="animate-spin" /> Finding best matches...</>
                                ) : (
                                    <><FiZap /> Find My Matches {effectiveRole ? `— ${effectiveRole}` : ''}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════ */}
                {/* ── JOB RESULTS GRID ── */}
                {/* ══════════════════════════════════════════════════════════ */}

                {jobsLoading && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Finding Matches...</h2>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                        </div>
                    </div>
                )}

                {hasFetched && !jobsLoading && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Recommended Jobs
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                {jobs.length > 0 ? `${jobs.length} Roles Found` : 'No Matches'}
                            </h2>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        </div>

                        {jobs.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiBriefcase className="text-3xl text-slate-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No direct matches found</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                                    Try a broader role like "Software Engineer" or "Backend Developer".
                                </p>
                                <button
                                    onClick={() => { setHasFetched(false); setJobs([]); }}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition"
                                >
                                    <FiRefreshCw /> Try Different Role
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobs.map((job, i) => (
                                    <JobCard
                                        key={job.id || i}
                                        job={job}
                                        onApply={handleApply}
                                        onSave={handleSaveJob}
                                        isSaved={savedJobs.includes(job.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default JobRecommendations;
