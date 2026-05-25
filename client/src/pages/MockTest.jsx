// src/pages/MockTests.jsx

import React, { useEffect, useState } from 'react';

import {
    FiClock,
    FiBookOpen,
    FiArrowRight,
    FiLoader,
    FiAward
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';

import API from '../api/axios';

const MockTests = () => {

    const [tests, setTests] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMockTests();
    }, []);

    // FETCH TESTS
    const fetchMockTests = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                '/mock-test'
            );

            setTests(response.data.mockTest);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to fetch mock tests'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className='min-h-screen bg-gray-50 dark:bg-[#0f172a] px-4 py-10'>

            <div className='max-w-7xl mx-auto'>

                {/* HEADER */}
                <div className='text-center mb-12'>

                    <div className='w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-5'>

                        <FiAward className='text-4xl text-blue-600' />

                    </div>

                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                        Mock Tests
                    </h1>

                    <p className='mt-3 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto'>
                        Practice technical, aptitude, and interview-based assessments
                        to improve your preparation.
                    </p>

                </div>

                {/* LOADING */}
                {
                    loading && (

                        <div className='flex items-center justify-center py-20'>

                            <FiLoader className='animate-spin text-4xl text-blue-600' />

                        </div>
                    )
                }

                {/* EMPTY */}
                {
                    !loading && tests.length === 0 && (

                        <div className='text-center py-20 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>

                            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                No Mock Tests Available
                            </h2>

                            <p className='mt-2 text-gray-500 dark:text-gray-400'>
                                Admin has not added any mock tests yet.
                            </p>

                        </div>
                    )
                }

                {/* TEST GRID */}
                {
                    !loading && tests.length > 0 && (

                        <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8'>

                            {
                                tests.map((test) => (

                                    <div
                                        key={test._id}
                                        className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl transition duration-300'
                                    >

                                        {/* TOP */}
                                        <div className='p-6 border-b border-gray-200 dark:border-gray-800'>

                                            <div className='flex items-center justify-between mb-5'>

                                                <div className='px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-medium'>
                                                    {test.category}
                                                </div>

                                                <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>

                                                    <FiClock />

                                                    {test.timeLimit} min

                                                </div>

                                            </div>

                                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white leading-snug'>
                                                {test.title}
                                            </h2>

                                        </div>

                                        {/* BODY */}
                                        <div className='p-6'>

                                            <div className='flex items-center gap-3 mb-6'>

                                                <div className='w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>

                                                    <FiBookOpen className='text-xl text-blue-600' />

                                                </div>

                                                <div>

                                                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                                                        Questions
                                                    </h3>

                                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                        {test.questions?.length || 0} Questions
                                                    </p>

                                                </div>

                                            </div>

                                            <Link
                                                to={`/mock-test/${test._id}`}
                                                className='w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                                            >

                                                Start Test

                                                <FiArrowRight />

                                            </Link>

                                        </div>

                                    </div>
                                ))
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default MockTests;