// src/pages/ResumeUpload.jsx

import React, { useState } from 'react';

import {
    FiUploadCloud,
    FiFileText,
    FiCheckCircle,
    FiLoader,
    FiAward,
    FiTrash2
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import API from '../api/axios';
import { Link } from 'react-router-dom';

const ResumeUpload = () => {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [resumeData, setResumeData] = useState(null);

    // FILE CHANGE
    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        // VALIDATION
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

    // REMOVE FILE
    const removeFile = () => {

        setFile(null);

        setResumeData(null);
    };

    // UPLOAD RESUME
    const handleUpload = async () => {

        try {

            if (!file) {
                return toast.error('Please select a resume');
            }

            setLoading(true);

            const formData = new FormData();

            formData.append('resume', file);

            const response = await API.post(
                '/resume/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setResumeData(response.data.resume);

            toast.success(response.data.message);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                'Resume upload failed'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className='min-h-screen bg-gray-50 dark:bg-[#0f172a] px-4 py-10'>

            <div className='max-w-5xl mx-auto'>

                {/* HEADER */}
                <div className='text-center mb-10'>

                    <div className='w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-5'>

                        <FiFileText className='text-4xl text-blue-600' />

                    </div>

                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                        Resume Upload
                    </h1>

                    {/* <Link to='/resume-analysis' className='mt-2 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'>
                        <p className='mt-2 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'>
                            Resume Analysis with AI
                        </p>
                    </Link> */}

                    <p className='mt-3 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto'>
                        Upload your resume to unlock AI-powered interview questions,
                        job matching, and skill analysis.
                    </p>

                </div>

                {/* MAIN CARD */}
                <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden'>

                    {/* TOP */}
                    <div className='p-8 border-b border-gray-200 dark:border-gray-800'>

                        <div className='border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-10 text-center'>

                            <div className='w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-5'>

                                <FiUploadCloud className='text-3xl text-blue-600' />

                            </div>

                            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                Upload Your Resume
                            </h2>

                            <p className='mt-2 text-gray-500 dark:text-gray-400'>
                                Supported formats: PDF, DOC, DOCX
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
                                className='inline-flex mt-6 cursor-pointer items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition'
                            >

                                <FiUploadCloud />

                                Choose File

                            </label>

                        </div>

                        {/* FILE PREVIEW */}
                        {
                            file && (

                                <div className='mt-6 flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-5 py-4'>

                                    <div className='flex items-center gap-4'>

                                        <div className='w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center'>

                                            <FiFileText className='text-blue-600 text-xl' />

                                        </div>

                                        <div>

                                            <h3 className='font-medium text-gray-900 dark:text-white'>
                                                {file.name}
                                            </h3>

                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        onClick={removeFile}
                                        className='p-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 transition'
                                    >

                                        <FiTrash2 />

                                    </button>

                                </div>
                            )
                        }

                    </div>

                    {/* BUTTON */}
                    <div className='p-8 border-b border-gray-200 dark:border-gray-800'>

                        <button
                            onClick={handleUpload}
                            disabled={loading || !file}
                            className='w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold transition flex items-center justify-center gap-3'
                        >

                            {
                                loading
                                    ? (
                                        <>
                                            <FiLoader className='animate-spin' />
                                            Uploading Resume...
                                        </>
                                    )
                                    : (
                                        <>
                                            <FiUploadCloud />
                                            Upload Resume
                                        </>
                                    )
                            }

                        </button>

                    </div>

                    {/* AI ANALYSIS */}
                    {
                        resumeData && (

                            <div className='p-8'>

                                <div className='flex items-center gap-3 mb-8'>

                                    <div className='w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center'>

                                        <FiCheckCircle className='text-green-600 text-2xl' />

                                    </div>

                                    <div>

                                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                            Resume Processed Successfully
                                        </h2>

                                        <p className='text-gray-500 dark:text-gray-400'>
                                            AI extracted important information from your resume.
                                        </p>

                                    </div>

                                </div>

                                {/* SKILLS */}
                                <div>

                                    <div className='flex items-center gap-2 mb-5'>

                                        <FiAward className='text-blue-600' />

                                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                                            Extracted Skills
                                        </h3>

                                    </div>

                                    <div className='flex flex-wrap gap-3'>

                                        {
                                            resumeData.skills?.length > 0 ? (

                                                resumeData.skills.map((skill, index) => (

                                                    <div
                                                        key={index}
                                                        className='px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium'
                                                    >
                                                        {skill}
                                                    </div>
                                                ))

                                            ) : (

                                                <p className='text-gray-500 dark:text-gray-400'>
                                                    No skills detected
                                                </p>
                                            )
                                        }

                                    </div>

                                </div>

                            </div>
                        )
                    }

                </div>

            </div>

        </div>
    );
};

export default ResumeUpload;