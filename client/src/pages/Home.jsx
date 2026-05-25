import React from 'react';

import {
    FiArrowRight,
    FiBriefcase,
    FiTrendingUp,
    FiTarget,
    FiMessageSquare,
    FiAward,
    FiCheckCircle
} from 'react-icons/fi';

import { Link } from 'react-router-dom';

export const Home = () => {

    const features = [
        {
            title: 'AI Mock Interviews',
            icon: <FiMessageSquare />,
            desc: 'Practice HR, DSA, MERN and Resume based interviews with AI feedback.'
        },
        {
            title: 'Smart Job Matching',
            icon: <FiBriefcase />,
            desc: 'Get jobs matched according to your skills and experience.'
        },
        {
            title: 'Performance Analytics',
            icon: <FiTrendingUp />,
            desc: 'Track mock test scores, interview progress and overall improvement.'
        },
        {
            title: 'Resume Analyzer',
            icon: <FiTarget />,
            desc: 'Upload resume and improve ATS score with AI suggestions.'
        }
    ];

    const stats = [
        {
            number: '10K+',
            label: 'Mock Interviews'
        },
        {
            number: '5K+',
            label: 'Jobs Posted'
        },
        {
            number: '95%',
            label: 'Success Rate'
        },
        {
            number: '24/7',
            label: 'AI Support'
        }
    ];

    return (

        <div className='min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white overflow-hidden'>

            {/* HERO SECTION */}
            {/* HERO SECTION */}
{/* HERO SECTION */}
<section className='px-6 pt-24 pb-20'>

    <div className='max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center'>

        {/* LEFT */}
        <div>

            <span className='inline-block px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-sm font-medium mb-6'>

                AI Powered Career Platform

            </span>

            <h1 className='text-5xl md:text-6xl font-black leading-tight text-gray-900 dark:text-white'>

                Crack Interviews.
                <br />

                Get Better Jobs.

            </h1>

            <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-xl'>

                Practice interviews, improve resumes,
                take mock tests and track your progress
                with AI powered tools.

            </p>

            <div className='mt-10 flex flex-wrap gap-4'>

                <Link
                    to='/sign-up'
                    className='px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition'
                >

                    Get Started

                    <FiArrowRight />

                </Link>

                <Link
                    to='/jobs'
                    className='px-7 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-blue-500 font-semibold transition'
                >

                    Browse Jobs

                </Link>

            </div>

        </div>

        {/* RIGHT */}
        <div className='flex justify-center lg:justify-end'>

            <div className='w-full max-w-md rounded-[32px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl'>

                <div className='flex items-center justify-between mb-8'>

                    <div>

                        <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                            Frontend Developer
                        </h3>

                        <p className='text-gray-500 dark:text-gray-400 mt-1'>
                            Profile Match
                        </p>

                    </div>

                    <div className='px-4 py-2 rounded-xl bg-green-100 dark:bg-green-500/10 text-green-600 font-bold'>

                        92%

                    </div>

                </div>

                <div className='space-y-5'>

                    <div>

                        <div className='flex justify-between mb-2 text-sm'>

                            <span className='text-gray-500 dark:text-gray-400'>
                                Resume Score
                            </span>

                            <span className='font-semibold text-gray-900 dark:text-white'>
                                88/100
                            </span>

                        </div>

                        <div className='h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden'>

                            <div className='w-[88%] h-full bg-blue-600 rounded-full'></div>

                        </div>

                    </div>

                    <div>

                        <div className='flex justify-between mb-2 text-sm'>

                            <span className='text-gray-500 dark:text-gray-400'>
                                Interview Performance
                            </span>

                            <span className='font-semibold text-gray-900 dark:text-white'>
                                91%
                            </span>

                        </div>

                        <div className='h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden'>

                            <div className='w-[91%] h-full bg-green-600 rounded-full'></div>

                        </div>

                    </div>

                    <div>

                        <div className='flex justify-between mb-2 text-sm'>

                            <span className='text-gray-500 dark:text-gray-400'>
                                Skill Match
                            </span>

                            <span className='font-semibold text-gray-900 dark:text-white'>
                                95%
                            </span>

                        </div>

                        <div className='h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden'>

                            <div className='w-[95%] h-full bg-purple-600 rounded-full'></div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

            {/* STATS */}
            <section className='px-6 py-16 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'>

                <div className='max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10'>

                    {
                        stats.map((item, index) => (

                            <div
                                key={index}
                                className='text-center'
                            >

                                <h2 className='text-4xl font-black text-blue-600'>
                                    {item.number}
                                </h2>

                                <p className='mt-2 text-gray-500 dark:text-gray-400'>
                                    {item.label}
                                </p>

                            </div>
                        ))
                    }

                </div>

            </section>

            {/* FEATURES */}
            <section className='px-6 py-24'>

                <div className='max-w-7xl mx-auto'>

                    <div className='text-center mb-16'>

                        <h2 className='text-4xl font-black'>
                            Everything You Need
                        </h2>

                        <p className='mt-4 text-lg text-gray-500 dark:text-gray-400'>
                            All-in-one AI platform for interview preparation and career growth.
                        </p>

                    </div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>

                        {
                            features.map((feature, index) => (

                                <div
                                    key={index}
                                    className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 hover:border-blue-500 transition'
                                >

                                    <div className='w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center text-3xl mb-6'>

                                        {feature.icon}

                                    </div>

                                    <h3 className='text-2xl font-bold mb-4'>
                                        {feature.title}
                                    </h3>

                                    <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>
                                        {feature.desc}
                                    </p>

                                </div>
                            ))
                        }

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className='px-6 pb-24'>

                <div className='max-w-5xl mx-auto rounded-[40px] bg-gradient-to-r from-blue-600 to-purple-600 p-14 text-center text-white'>

                    <h2 className='text-4xl md:text-5xl font-black leading-tight'>

                        Ready To Level Up
                        Your Career?

                    </h2>

                    <p className='mt-6 text-lg text-blue-100 max-w-2xl mx-auto'>

                        Join JobBuddy and start preparing smarter with AI-powered tools.

                    </p>

                    <div className='mt-10 flex flex-wrap justify-center gap-5'>

                        <Link
                            to='/sign-up'
                            className='px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold hover:scale-105 transition'
                        >

                            Start Free

                        </Link>

                        <Link
                            to='/jobs'
                            className='px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/10 font-bold transition'
                        >

                            Explore Jobs

                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};