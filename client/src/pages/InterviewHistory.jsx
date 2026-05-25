// src/pages/InterviewHistory.jsx

import React, { useEffect, useState } from 'react';

import API from '../api/axios';

import { toast } from 'react-toastify';

import {
    FiTrendingUp,
    FiMessageSquare,
    FiCpu,
    FiAward,
    FiCalendar
} from 'react-icons/fi';

const InterviewHistory = () => {

    const [loading, setLoading] = useState(false);

    const [interviews, setInterviews] = useState([]);

    // FETCH INTERVIEWS
    const fetchInterviews = async () => {

        try {

            setLoading(true);

            const res = await API.get(
                '/interview/history'
            );

            setInterviews(res.data.interviews);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to fetch interviews'
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchInterviews();

    }, []);

    // LOADING
    if (loading) {

        return (

            <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]'>

                <div className='text-xl text-gray-600 dark:text-gray-300'>
                    Loading interviews...
                </div>

            </div>
        );
    }

    return (

        <div className='min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-4'>

            <div className='max-w-7xl mx-auto'>

                {/* HEADER */}
                <div className='mb-10'>

                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                        Interview Analytics
                    </h1>

                    <p className='mt-3 text-gray-500 dark:text-gray-400'>
                        Track your AI interview performance and improve your skills.
                    </p>

                </div>

                {/* EMPTY */}
                {
                    interviews.length === 0 && (

                        <div className='bg-white dark:bg-gray-900 rounded-3xl p-10 text-center border border-gray-200 dark:border-gray-800'>

                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>
                                No Interviews Yet
                            </h2>

                            <p className='text-gray-500 dark:text-gray-400'>
                                Start an AI mock interview to see analytics.
                            </p>

                        </div>
                    )
                }

                {/* GRID */}
                <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>

                    {
                        interviews.map((item) => (

                            <div
                                key={item._id}
                                className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-2xl transition'
                            >

                                {/* TOP */}
                                <div className='flex items-center justify-between mb-6'>

                                    <div>

                                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                            {item.type}
                                        </h2>

                                        <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2 text-sm'>

                                            <FiCalendar />

                                            {
                                                new Date(
                                                    item.createdAt
                                                ).toLocaleDateString()
                                            }

                                        </div>

                                    </div>

                                    <div className='w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>

                                        <span className='text-2xl font-bold text-blue-600'>
                                            {item.score}
                                        </span>

                                    </div>

                                </div>

                                {/* SCORES */}
                                <div className='space-y-4 mb-6'>

                                    {/* TECHNICAL */}
                                    <div>

                                        <div className='flex justify-between mb-1'>

                                            <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>

                                                <FiCpu />

                                                Technical

                                            </div>

                                            <span className='text-sm text-gray-500'>
                                                {item.technicalScore}/10
                                            </span>

                                        </div>

                                        <div className='w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>

                                            <div
                                                className='h-3 bg-blue-600 rounded-full'
                                                style={{
                                                    width: `${item.technicalScore * 10}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* COMMUNICATION */}
                                    <div>

                                        <div className='flex justify-between mb-1'>

                                            <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>

                                                <FiMessageSquare />

                                                Communication

                                            </div>

                                            <span className='text-sm text-gray-500'>
                                                {item.communicationScore}/10
                                            </span>

                                        </div>

                                        <div className='w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>

                                            <div
                                                className='h-3 bg-green-600 rounded-full'
                                                style={{
                                                    width: `${item.communicationScore * 10}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* CONFIDENCE */}
                                    <div>

                                        <div className='flex justify-between mb-1'>

                                            <div className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>

                                                <FiTrendingUp />

                                                Confidence

                                            </div>

                                            <span className='text-sm text-gray-500'>
                                                {item.confidenceScore}/10
                                            </span>

                                        </div>

                                        <div className='w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>

                                            <div
                                                className='h-3 bg-yellow-500 rounded-full'
                                                style={{
                                                    width: `${item.confidenceScore * 10}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* FEEDBACK */}
                                <div className='bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6'>

                                    <div className='flex items-center gap-2 mb-2 text-blue-600 font-semibold'>

                                        <FiAward />

                                        AI Feedback

                                    </div>

                                    <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                                        {item.feedback}
                                    </p>

                                </div>

                                {/* QUESTIONS */}
                                <div>

                                    <h3 className='font-semibold text-gray-900 dark:text-white mb-3'>
                                        Questions Evaluated
                                    </h3>

                                    <div className='space-y-3'>

                                        {
                                            item.questions?.map((q, index) => (

                                                <div
                                                    key={index}
                                                    className='p-3 rounded-2xl border border-gray-200 dark:border-gray-700'
                                                >

                                                    <p className='text-sm font-medium text-gray-800 dark:text-gray-200 mb-2'>
                                                        {q.question}
                                                    </p>

                                                    <div className='flex items-center justify-between'>

                                                        <span className='text-xs text-gray-500'>
                                                            Rating
                                                        </span>

                                                        <span className='text-sm font-bold text-blue-600'>
                                                            {q.rating?.toFixed(1)}/10
                                                        </span>

                                                    </div>

                                                </div>
                                            ))
                                        }

                                    </div>

                                </div>

                            </div>
                        ))
                    }

                </div>

            </div>

        </div>
    );
};

export default InterviewHistory;