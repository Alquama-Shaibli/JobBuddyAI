import React, { useState } from 'react';
import {
    FiUploadCloud,
    FiFileText,
    FiCheckCircle,
    FiLoader,
    FiAward,
    FiTrash2,
    FiTrendingUp,
    FiAlertCircle,
    FiBriefcase,
    FiTarget,
    FiStar
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error('Only PDF or DOC files are allowed');
            return;
        }

        setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        setResumeData(null);
        setAnalysisData(null);
    };

    const runAnalysis = async () => {
        try {
            setAnalyzing(true);
            const response = await API.get('/resume/analyze');
            if (response.data && response.data.analysis) {
                setAnalysisData(response.data.analysis);
                toast.success('Resume analyzed successfully!');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error(error.response?.data?.message || 'Failed to analyze resume');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleUpload = async () => {
        try {
            if (!file) return toast.error('Please select a resume');
            setUploading(true);

            const formData = new FormData();
            formData.append('resume', file);

            const response = await API.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResumeData(response.data.resume);
            toast.success('Resume uploaded. Running ATS Analysis...');
            
            // Automatically trigger analysis
            await runAnalysis();

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Resume upload failed');
        } finally {
            setUploading(false);
        }
    };

    // Circular progress stroke calculation
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = analysisData 
        ? circumference - (analysisData.ats_score / 100) * circumference 
        : circumference;

    const getColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-rose-500';
    };

    return (
        <div className='min-h-screen px-4 py-10 pt-28'>
            <div className='max-w-5xl mx-auto'>

                {/* HEADER */}
                <div className='text-center mb-10'>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-sm mb-4'>
                        <FiTarget /> ATS Resume Analyzer
                    </div>
                    <h1 className='text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4'>
                        Score Your Resume
                    </h1>
                    <p className='text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto'>
                        Upload your resume to get an instant ATS score, uncover missing skills, and receive section-by-section actionable feedback to land more interviews.
                    </p>
                </div>

                {/* UPLOAD SECTION */}
                <div className='rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none mb-10'>
                    <div className='p-8 sm:p-12'>
                        {!file ? (
                            <div className='border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
                                <div className='w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6'>
                                    <FiUploadCloud className='text-4xl text-blue-600' />
                                </div>
                                <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
                                    Drag & Drop your Resume
                                </h2>
                                <p className='text-slate-500 dark:text-slate-400 mb-8'>
                                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                                </p>
                                <input
                                    type='file'
                                    accept='.pdf,.doc,.docx'
                                    onChange={handleFileChange}
                                    className='hidden'
                                    id='resumeInput'
                                />
                                <label
                                    htmlFor='resumeInput'
                                    className='inline-flex cursor-pointer items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 font-bold transition-all shadow-lg hover:shadow-blue-500/25'
                                >
                                    <FiUploadCloud /> Browse Files
                                </label>
                            </div>
                        ) : (
                            <div className='bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700'>
                                <div className='flex flex-col sm:flex-row items-center gap-6'>
                                    <div className='w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0'>
                                        <FiFileText className='text-3xl text-blue-600' />
                                    </div>
                                    <div className='flex-1 text-center sm:text-left'>
                                        <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-1 truncate'>
                                            {file.name}
                                        </h3>
                                        <p className='text-slate-500 dark:text-slate-400'>
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <div className='flex gap-3 w-full sm:w-auto'>
                                        <button
                                            onClick={removeFile}
                                            disabled={uploading || analyzing}
                                            className='flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition disabled:opacity-50'
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploading || analyzing}
                                            className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg hover:shadow-blue-500/25 disabled:opacity-50'
                                        >
                                            {uploading || analyzing ? (
                                                <><FiLoader className='animate-spin text-xl' /> {analyzing ? 'Analyzing...' : 'Uploading...'}</>
                                            ) : (
                                                <><FiZap className="hidden" /> Analyze Resume</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ANALYSIS RESULTS */}
                {analysisData && (
                    <div className='grid lg:grid-cols-3 gap-8'>
                        
                        {/* LEFT COLUMN: ATS SCORE & SUMMARY */}
                        <div className='lg:col-span-1 space-y-8'>
                            {/* Score Card */}
                            <div className='bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none text-center'>
                                <h3 className='text-xl font-black text-slate-900 dark:text-white mb-6'>Overall ATS Score</h3>
                                <div className="relative w-48 h-48 mx-auto mb-6">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        {/* Background Circle */}
                                        <circle
                                            cx="50" cy="50" r="45"
                                            className="stroke-slate-100 dark:stroke-slate-800"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        {/* Progress Circle */}
                                        <circle
                                            cx="50" cy="50" r="45"
                                            className={`${getColor(analysisData.ats_score)} transition-all duration-1000 ease-out`}
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-5xl font-black ${getColor(analysisData.ats_score)}`}>
                                            {analysisData.ats_score}
                                        </span>
                                        <span className="text-sm font-bold text-slate-400 mt-1">/ 100</span>
                                    </div>
                                </div>
                                <p className='text-slate-600 dark:text-slate-300 font-medium'>
                                    {analysisData.resume_summary}
                                </p>
                            </div>

                            {/* Missing Skills */}
                            {analysisData.missing_skills && analysisData.missing_skills.length > 0 && (
                                <div className='bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none'>
                                    <h3 className='text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4'>
                                        <FiAlertCircle className="text-rose-500" /> Missing Keywords
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {analysisData.missing_skills.map((skill, idx) => (
                                            <span key={idx} className='px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-semibold'>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: SECTION FEEDBACK */}
                        <div className='lg:col-span-2 space-y-8'>
                            
                            {/* Section Recommendations */}
                            {analysisData.section_recommendations && analysisData.section_recommendations.length > 0 && (
                                <div className='bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none'>
                                    <h3 className='text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3'>
                                        <FiTrendingUp className="text-blue-600" /> Actionable Fixes
                                    </h3>
                                    <div className='space-y-4'>
                                        {analysisData.section_recommendations.map((rec, idx) => (
                                            <div key={idx} className='p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex gap-4'>
                                                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className='font-bold text-slate-900 dark:text-white mb-1'>
                                                        {rec.section} Section
                                                    </h4>
                                                    <p className='text-slate-600 dark:text-slate-400 text-sm'>
                                                        {rec.recommendation}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Strengths & General Improvements */}
                            <div className='grid sm:grid-cols-2 gap-8'>
                                <div className='bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] p-8 border border-emerald-100 dark:border-emerald-900/30'>
                                    <h4 className='font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-4'>
                                        <FiCheckCircle /> Key Strengths
                                    </h4>
                                    <ul className='space-y-3'>
                                        {analysisData.strengths?.map((str, idx) => (
                                            <li key={idx} className='flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-500'>
                                                <span className='mt-1 shrink-0'>•</span> {str}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] p-8 border border-amber-100 dark:border-amber-900/30'>
                                    <h4 className='font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-4'>
                                        <FiStar /> Suggested Roles
                                    </h4>
                                    <ul className='space-y-4'>
                                        {analysisData.recommended_roles?.map((role, idx) => (
                                            <li key={idx} className='flex items-center justify-between p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl'>
                                                <span className='font-semibold text-amber-900 dark:text-amber-200 text-sm'>{role.role}</span>
                                                <span className='text-xs font-black px-2 py-1 bg-amber-200 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 rounded-md'>
                                                    {role.match_percentage}% Match
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;