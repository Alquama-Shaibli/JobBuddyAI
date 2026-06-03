import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import logoWhite from '../assets/logo-white.png';
import {
    FiUploadCloud, FiFileText, FiCheckCircle, FiLoader,
    FiX, FiArrowRight, FiArrowLeft, FiZap, FiBriefcase, FiCode
} from 'react-icons/fi';

/* ─── Constants ─────────────────────────────────────────── */
const STANDARD_ROLES = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Data Analyst',
    'DevOps Engineer',
    'Product Manager',
];

const STEPS = [
    { id: 1, label: 'Resume', icon: FiUploadCloud },
    { id: 2, label: 'Target Role', icon: FiBriefcase },
    { id: 3, label: 'Skills & Languages', icon: FiCode },
];

/* ─── Tag Chip component ─────────────────────────────────── */
const TagChip = ({ label, onRemove, color = 'blue' }) => {
    const styles = {
        blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-500/30',
        violet: 'bg-violet-100 dark:bg-violet-500/20 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-500/30',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-semibold text-sm ${styles[color]}`}>
            {label}
            <button onClick={() => onRemove(label)} className="hover:opacity-60 transition">
                <FiX className="text-xs" />
            </button>
        </span>
    );
};

/* ─── Tag Input ──────────────────────────────────────────── */
const TagInput = ({ tags, setTags, placeholder, color }) => {
    const [input, setInput] = useState('');
    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            const val = input.trim().replace(/,$/, '');
            if (val && !tags.includes(val)) {
                setTags(prev => [...prev, val]);
            }
            setInput('');
        }
    };
    const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));

    return (
        <div>
            <div className="flex flex-wrap gap-2 min-h-[42px] mb-3">
                {tags.map(tag => (
                    <TagChip key={tag} label={tag} onRemove={removeTag} color={color} />
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <p className="text-xs text-slate-400 mt-1.5">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">,</kbd> to add a tag</p>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════ */
const OnboardingWizard = () => {
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    /* wizard step: 1 | 2 | 3 */
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    /* Step 1 — Resume */
    const [file, setFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);
    const fileRef = useRef(null);

    /* Step 2 — Role */
    const [selectedRole, setSelectedRole] = useState(STANDARD_ROLES[0]);
    const [customRole, setCustomRole] = useState('');

    /* Step 3 — Skills & Languages */
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);

    /* ── Drag & Drop ── */
    const [dragging, setDragging] = useState(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) validateAndSetFile(dropped);
    };
    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => setDragging(false);

    const validateAndSetFile = (f) => {
        const allowed = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(f.type)) {
            return toast.error('Only PDF or DOCX files are allowed.');
        }
        if (f.size > 5 * 1024 * 1024) {
            return toast.error('File must be under 5 MB.');
        }
        setFile(f);
        setUploadDone(false);
    };

    /* ── Upload Resume & Parse Skills ── */
    const handleUpload = async () => {
        if (!file) return toast.error('Please select a resume file first.');
        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append('resume', file);

            const res = await API.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUploadDone(true);
            toast.success('Resume parsed successfully!');

            // Pre-populate skills from ATS parser
            if (res.data.resume?.skills?.length > 0) {
                setSkills(res.data.resume.skills);
                toast.info(`Extracted ${res.data.resume.skills.length} skills from your resume.`);
            }
            if (res.data.resume?.languages?.length > 0) {
                setLanguages(res.data.resume.languages);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Resume upload failed.');
        } finally {
            setUploadLoading(false);
        }
    };

    /* ── Step Validation ── */
    const canAdvance = () => {
        if (step === 1) return uploadDone;
        if (step === 2) {
            const role = selectedRole === 'Other' ? customRole : selectedRole;
            return role.trim().length > 0;
        }
        return true;
    };

    const goNext = () => {
        if (!canAdvance()) {
            if (step === 1) toast.warning('Please upload your resume first.');
            if (step === 2) toast.warning('Please select or enter a target role.');
            return;
        }
        setStep(s => Math.min(s + 1, 3));
    };
    const goPrev = () => setStep(s => Math.max(s - 1, 1));

    /* ── Final Submit ── */
    const handleCompleteSetup = async () => {
        const targetRole = selectedRole === 'Other' ? customRole : selectedRole;
        if (!targetRole.trim()) return toast.error('Please select a target role.');
        if (skills.length === 0) return toast.warning('Add at least one skill to continue.');

        try {
            setSubmitting(true);
            const res = await API.post('/user/complete-onboarding', {
                targetRole,
                skills,
                languages
            });

            if (res.data.success) {
                // Update global auth state so isOnboarded = true
                updateUser({ isOnboarded: true, preferredRole: targetRole, skills, languages });
                toast.success('🎉 Setup complete! Welcome to JobBuddy AI.');
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    const finalRole = selectedRole === 'Other' ? customRole : selectedRole;

    /* ════════════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen flex items-center justify-center p-4">

            <div className="w-full max-w-2xl">

                {/* ── Logo ── */}
                <div className="flex items-center justify-center mb-8">
                    <img src={logoWhite} alt="JobBuddy AI" className="h-10 w-auto" />
                </div>

                {/* ── Step Indicator ── */}
                <div className="flex items-center justify-center gap-0 mb-10">
                    {STEPS.map((s, i) => {
                        const isActive = step === s.id;
                        const isDone = step > s.id;
                        const Icon = s.icon;
                        return (
                            <React.Fragment key={s.id}>
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                                        isDone ? 'bg-emerald-500 shadow-emerald-500/30' :
                                        isActive ? 'bg-blue-600 shadow-blue-600/30' :
                                        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                                    }`}>
                                        {isDone
                                            ? <FiCheckCircle className="text-white text-lg" />
                                            : <Icon className={`text-lg ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        }
                                    </div>
                                    <span className={`text-xs font-bold ${isActive || isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 rounded-full transition-all duration-500 ${step > s.id ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* ── Card ── */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-200/80 dark:border-slate-800 overflow-hidden">

                    {/* ── STEP 1: Resume Upload ── */}
                    {step === 1 && (
                        <div className="p-8 sm:p-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Upload Your Resume</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                                We'll automatically extract your skills and languages to pre-fill the next steps.
                            </p>

                            {/* Drop zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => !uploadDone && fileRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                                    uploadDone
                                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 cursor-default'
                                        : dragging
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.01]'
                                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={e => e.target.files[0] && validateAndSetFile(e.target.files[0])}
                                    className="hidden"
                                />

                                {uploadDone ? (
                                    <>
                                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <FiCheckCircle className="text-3xl text-emerald-600" />
                                        </div>
                                        <p className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">Resume Parsed!</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{file?.name}</p>
                                    </>
                                ) : file ? (
                                    <>
                                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <FiFileText className="text-3xl text-blue-600" />
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">{file.name}</p>
                                        <p className="text-slate-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB — Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <FiUploadCloud className="text-3xl text-blue-500" />
                                        </div>
                                        <p className="font-bold text-slate-700 dark:text-slate-200 text-base">Drag & Drop your Resume</p>
                                        <p className="text-slate-400 text-sm mt-2">or click to browse · PDF, DOCX · Max 5 MB</p>
                                    </>
                                )}
                            </div>

                            {/* Upload button */}
                            {file && !uploadDone && (
                                <button
                                    onClick={handleUpload}
                                    disabled={uploadLoading}
                                    className="mt-5 w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2"
                                >
                                    {uploadLoading
                                        ? <><FiLoader className="animate-spin" /> Parsing Resume...</>
                                        : <><FiUploadCloud /> Analyse My Resume</>
                                    }
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── STEP 2: Target Role ── */}
                    {step === 2 && (
                        <div className="p-8 sm:p-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Choose Your Target Role</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                                We'll match jobs and generate interview questions tailored to this role.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Role</label>
                                    <div className="relative">
                                        <select
                                            value={selectedRole}
                                            onChange={e => setSelectedRole(e.target.value)}
                                            className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 dark:text-white transition appearance-none cursor-pointer font-medium"
                                        >
                                            {STANDARD_ROLES.map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                            <option value="Other">Other (specify below)</option>
                                        </select>
                                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</div>
                                    </div>
                                </div>

                                {selectedRole === 'Other' && (
                                    <div className="animate-pulse-once">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Custom Role</label>
                                        <input
                                            type="text"
                                            value={customRole}
                                            onChange={e => setCustomRole(e.target.value)}
                                            placeholder="e.g. Blockchain Developer, Solidity Engineer…"
                                            autoFocus
                                            className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-900 dark:text-white transition font-medium"
                                        />
                                    </div>
                                )}

                                {/* Preview card */}
                                {finalRole && (
                                    <div className="mt-2 flex items-center gap-3 px-5 py-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                            <FiBriefcase className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Your Target Role</p>
                                            <p className="font-black text-slate-900 dark:text-white">{finalRole}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Skills & Languages ── */}
                    {step === 3 && (
                        <div className="p-8 sm:p-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Confirm Your Skills</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                                We've pre-filled these from your resume. Add or remove any to get the most accurate job matches.
                            </p>

                            <div className="space-y-8">
                                {/* Technical Skills */}
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-black">Skills</span>
                                        Technical Competencies
                                    </label>
                                    <TagInput
                                        tags={skills}
                                        setTags={setSkills}
                                        placeholder="Add a skill (e.g. React, Python)…"
                                        color="blue"
                                    />
                                </div>

                                {/* Programming Languages */}
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-black">Lang</span>
                                        Programming Languages
                                    </label>
                                    <TagInput
                                        tags={languages}
                                        setTags={setLanguages}
                                        placeholder="Add a language (e.g. TypeScript, Go)…"
                                        color="violet"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Footer Navigation ── */}
                    <div className="px-8 sm:px-10 pb-8 sm:pb-10 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                        {step > 1 ? (
                            <button
                                onClick={goPrev}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <FiArrowLeft /> Back
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button
                                onClick={goNext}
                                disabled={!canAdvance()}
                                className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg shadow-blue-600/20 transition"
                            >
                                Continue <FiArrowRight />
                            </button>
                        ) : (
                            <button
                                onClick={handleCompleteSetup}
                                disabled={submitting || skills.length === 0}
                                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg shadow-emerald-600/20 transition"
                            >
                                {submitting
                                    ? <><FiLoader className="animate-spin" /> Finishing Setup…</>
                                    : <><FiCheckCircle /> Complete Setup</>
                                }
                            </button>
                        )}
                    </div>
                </div>

                {/* footer note */}
                <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
                    Your data is stored securely and used only to personalise your experience.
                </p>
            </div>
        </div>
    );
};

export default OnboardingWizard;
