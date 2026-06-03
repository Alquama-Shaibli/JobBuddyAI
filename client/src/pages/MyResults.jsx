// src/pages/MyResults.jsx

import React, { useEffect, useState } from 'react';

import {
    FiAward,
    FiArrowRight,
    FiLoader,
    FiClock
} from 'react-icons/fi';

import { Link } from 'react-router-dom';

import { toast } from 'react-toastify';

import API from '../api/axios';

const MyResults = () => {

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        fetchResults();

    }, []);

    // FETCH RESULTS
    const fetchResults = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                '/result/my-results'
            );

            setResults(response.data.results);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to fetch results'
            );

        } finally {

            setLoading(false);
        }
    };

    // LOADING
    if (loading) {

        return (

            <div className='min-h-screen flex items-center justify-center'>

                <FiLoader className='animate-spin text-4xl text-blue-600' />

            </div>
        );
    }

    return (

        <div className='min-h-screen px-4 py-10'>

            <div className='max-w-7xl mx-auto'>

                {/* HEADER */}
                <div className='mb-12 text-center'>

                    <div className='w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-5'>

                        <FiAward className='text-4xl text-blue-600' />

                    </div>

                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                        My Results
                    </h1>

                    <p className='mt-3 text-gray-500 dark:text-gray-400'>
                        Track your mock test performance and progress.
                    </p>

                </div>

                {/* EMPTY */}
                {
                    results.length === 0 && (

                        <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-16 text-center'>

                            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                No Results Found
                            </h2>

                            <p className='mt-2 text-gray-500 dark:text-gray-400'>
                                Start taking mock tests to see your results here.
                            </p>

                            <Link
                                to='/mock-tests'
                                className='inline-flex mt-6 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition'
                            >

                                Browse Mock Tests

                            </Link>

                        </div>
                    )
                }

                {/* RESULTS GRID */}
                {
                    results.length > 0 && (

                        <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8'>

                            {
                                results.map((result) => {

                                    const percentage = Math.round(
                                        (result.score / result.totalQuestion) * 100
                                    );

                                    return (

                                        <div
                                            key={result._id}
                                            className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl transition duration-300'
                                        >

                                            {/* TOP */}
                                            <div className='p-6 border-b border-gray-200 dark:border-gray-800'>

                                                <div className='flex items-center justify-between mb-5'>

                                                    <div className='px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-medium'>
                                                        {result.testId?.category}
                                                    </div>

                                                    <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>

                                                        <FiClock />

                                                        {
                                                            new Date(
                                                                result.createdAt
                                                            ).toLocaleDateString()
                                                        }

                                                    </div>

                                                </div>

                                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white leading-snug'>
                                                    {result.testId?.title}
                                                </h2>

                                            </div>

                                            {/* BODY */}
                                            <div className='p-6'>

                                                {/* SCORE */}
                                                <div className='flex items-center justify-between mb-6'>

                                                    <div>

                                                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                                            Score
                                                        </p>

                                                        <h3 className='text-3xl font-bold text-gray-900 dark:text-white'>
                                                            {result.score}/{result.totalQuestion}
                                                        </h3>

                                                    </div>

                                                    <div className='w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center'>

                                                        <span className='text-xl font-bold text-blue-600'>
                                                            {percentage}%
                                                        </span>

                                                    </div>

                                                </div>

                                                {/* PROGRESS */}
                                                <div className='mb-6'>

                                                    <div className='flex justify-between mb-2 text-sm text-gray-500 dark:text-gray-400'>

                                                        <span>Performance</span>

                                                        <span>{percentage}%</span>

                                                    </div>

                                                    <div className='w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden'>

                                                        <div
                                                            style={{
                                                                width: `${percentage}%`
                                                            }}
                                                            className='h-full bg-blue-600 rounded-full'
                                                        />

                                                    </div>

                                                </div>

                                                {/* BUTTON */}
                                                <Link
                                                    to={`/result/${result._id}`}
                                                    className='w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                                                >

                                                    View Details

                                                    <FiArrowRight />

                                                </Link>

                                            </div>

                                        </div>
                                    );
                                })
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default MyResults;