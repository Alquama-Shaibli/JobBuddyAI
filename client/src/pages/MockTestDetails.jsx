// src/pages/MockTestDetails.jsx

import React, { useEffect, useState } from 'react';

import {
    FiClock,
    FiCheckCircle,
    FiLoader
} from 'react-icons/fi';

import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import API from '../api/axios';

const MockTestDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [test, setTest] = useState(null);

    const [answers, setAnswers] = useState([]);

    const [timeLeft, setTimeLeft] = useState(0);

    // FETCH TEST
    useEffect(() => {

        fetchMockTest();

    }, []);

    // TIMER
    useEffect(() => {

        if (!timeLeft) return;

        const timer = setInterval(() => {

            setTimeLeft((prev) => {

                if (prev <= 1) {

                    clearInterval(timer);

                    submitTest();

                    return 0;
                }

                return prev - 1;
            });

        }, 1000);

        return () => clearInterval(timer);

    }, [timeLeft]);

    // FETCH
    const fetchMockTest = async () => {

        try {

            const response = await API.get(
                `/mock-test/${id}`
            );

            setTest(response.data.mocktest);

            setTimeLeft(
                response.data.mocktest.timeLimit * 60
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to fetch test'
            );

        } finally {

            setLoading(false);
        }
    };

    // SELECT ANSWER
    const selectAnswer = (
        questionId,
        selectedAnswer
    ) => {

        const existingAnswer = answers.find(
            (ans) => ans.questionId === questionId
        );

        if (existingAnswer) {

            setAnswers(
                answers.map((ans) =>
                    ans.questionId === questionId
                        ? {
                            ...ans,
                            selectedAnswer
                        }
                        : ans
                )
            );

        } else {

            setAnswers([
                ...answers,
                {
                    questionId,
                    selectedAnswer
                }
            ]);
        }
    };

    // FORMAT TIME
    const formatTime = (seconds) => {

        const mins = Math.floor(seconds / 60);

        const secs = seconds % 60;

        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // SUBMIT
    const submitTest = async () => {

        try {

            setSubmitting(true);

            const response = await API.post(
                `/mock-test/submit/${id}`,
                { answers }
            );

            toast.success(
                response.data.message
            );

            navigate(
                `/my-results/${response.data.result._id}`
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Submission failed'
            );

        } finally {

            setSubmitting(false);
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

            <div className='max-w-5xl mx-auto'>

                {/* HEADER */}
                <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 mb-8'>

                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>

                        <div>

                            <div className='inline-flex px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4'>
                                {test.category}
                            </div>

                            <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                                {test.title}
                            </h1>

                        </div>

                        <div className='flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-100 dark:bg-red-500/10 text-red-600 font-bold text-xl'>

                            <FiClock />

                            {formatTime(timeLeft)}

                        </div>

                    </div>

                </div>

                {/* QUESTIONS */}
                <div className='space-y-8'>

                    {
                        test.questions.map((question, index) => (

                            <div
                                key={question._id}
                                className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8'
                            >

                                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
                                    Q{index + 1}. {question.question}
                                </h2>

                                <div className='space-y-4'>

                                    {
                                        question.options.map((option, i) => {

                                            const selected =
                                                answers.find(
                                                    (ans) =>
                                                        ans.questionId === question._id
                                                )?.selectedAnswer === option;

                                            return (

                                                <button
                                                    key={i}
                                                    onClick={() =>
                                                        selectAnswer(
                                                            question._id,
                                                            option
                                                        )
                                                    }
                                                    className={`w-full text-left p-5 rounded-2xl border transition ${
                                                        selected
                                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/10'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                                                    }`}
                                                >

                                                    <div className='flex items-center justify-between'>

                                                        <span className='text-gray-800 dark:text-gray-200'>
                                                            {option}
                                                        </span>

                                                        {
                                                            selected && (
                                                                <FiCheckCircle className='text-blue-600 text-xl' />
                                                            )
                                                        }

                                                    </div>

                                                </button>
                                            );
                                        })
                                    }

                                </div>

                            </div>
                        ))
                    }

                </div>

                {/* SUBMIT */}
                <div className='mt-10'>

                    <button
                        onClick={submitTest}
                        disabled={submitting}
                        className='w-full py-5 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition disabled:opacity-70'
                    >

                        {
                            submitting
                                ? 'Submitting Test...'
                                : 'Submit Mock Test'
                        }

                    </button>

                </div>

            </div>

        </div>
    );
};

export default MockTestDetails;