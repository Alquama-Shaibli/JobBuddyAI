import React, { useEffect, useState } from 'react';

import {
    FiAward,
    FiCheckCircle,
    FiXCircle,
    FiLoader
} from 'react-icons/fi';

import { Link, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import API from '../api/axios';

const ResultDetails = () => {

    const { id } = useParams();

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchResult();

    }, []);

    // FETCH RESULT
    const fetchResult = async () => {

        try {

            const response = await API.get(
                `/result/${id}`
            );

            setResult(response.data.result);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to fetch result'
            );

        } finally {

            setLoading(false);
        }
    };

    // LOADING
    if (loading) {

        return (

            <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]'>

                <FiLoader className='animate-spin text-4xl text-blue-600' />

            </div>
        );
    }

    // PERCENTAGE
    const percentage = Math.round(
        (result.score / result.totalQuestion) * 100
    );

    return (

        <div className='min-h-screen bg-gray-50 dark:bg-[#0f172a] px-4 py-10'>

            <div className='max-w-5xl mx-auto'>

                {/* TOP CARD */}
                <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 mb-8'>

                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>

                        <div>

                            <div className='w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-5'>

                                <FiAward className='text-4xl text-blue-600' />

                            </div>

                            <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                                Result Details
                            </h1>

                            <p className='mt-2 text-gray-500 dark:text-gray-400'>
                                Review your mock test performance.
                            </p>

                        </div>

                        {/* SCORE */}
                        <div className='grid grid-cols-2 gap-5'>

                            <div className='rounded-2xl bg-gray-100 dark:bg-gray-800 p-5 text-center min-w-[140px]'>

                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                                    Score
                                </p>

                                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                                    {result.score}/{result.totalQuestion}
                                </h2>

                            </div>

                            <div className='rounded-2xl bg-blue-100 dark:bg-blue-500/10 p-5 text-center min-w-[140px]'>

                                <p className='text-sm text-blue-600 mb-2'>
                                    Percentage
                                </p>

                                <h2 className='text-3xl font-bold text-blue-600'>
                                    {percentage}%
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* PROGRESS */}
                    <div className='mt-8'>

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

                </div>

                {/* ANSWERS */}
                <div className='space-y-6'>

                    {
                        result.answers.map((answer, index) => {

                            const isCorrect =
                                answer.selectedAnswer ===
                                answer.correctAnswer;

                            return (

                                <div
                                    key={index}
                                    className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6'
                                >

                                    {/* HEADER */}
                                    <div className='flex items-center justify-between mb-6'>

                                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                                            Question {index + 1}
                                        </h2>

                                        <div
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                                                isCorrect
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                            }`}
                                        >

                                            {
                                                isCorrect
                                                    ? <FiCheckCircle />
                                                    : <FiXCircle />
                                            }

                                            {
                                                isCorrect
                                                    ? 'Correct'
                                                    : 'Wrong'
                                            }

                                        </div>

                                    </div>

                                    {/* ANSWERS */}
                                    <div className='grid md:grid-cols-2 gap-5'>

                                        {/* USER ANSWER */}
                                        <div className='rounded-2xl border border-gray-200 dark:border-gray-800 p-5'>

                                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
                                                Your Answer
                                            </p>

                                            <p className='font-medium text-gray-900 dark:text-white break-words'>
                                                {
                                                    answer.selectedAnswer ||
                                                    'Not Answered'
                                                }
                                            </p>

                                        </div>

                                        {/* CORRECT ANSWER */}
                                        <div className='rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-500/5 p-5'>

                                            <p className='text-sm text-green-600 mb-3'>
                                                Correct Answer
                                            </p>

                                            <p className='font-medium text-gray-900 dark:text-white break-words'>
                                                {answer.correctAnswer}
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            );
                        })
                    }

                </div>

                {/* BUTTON */}
                <div className='mt-10'>

                    <Link
                        to='/my-results'
                        className='w-full flex items-center justify-center py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                    >

                        Back To Results

                    </Link>

                </div>

            </div>

        </div>
    );
};

export default ResultDetails;