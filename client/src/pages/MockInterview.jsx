import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MockInterview = () => {

    const [type, setType] = useState('HR');

    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState([]);

    const [evaluations, setEvaluations] = useState([]);

    const [loading, setLoading] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    // GENERATE QUESTIONS
    const generateQuestions = async () => {

        try {

            setLoading(true);

            const res = await axios.post(
                'http://localhost:8080/api/v1/interview/generate',
                { type },
                {
                    withCredentials: true
                }
            );

            setQuestions(res.data.questions);

            setAnswers(
                res.data.questions.map((q) => ({
                    question: q.question,
                    answer: ''
                }))
            );

            toast.success('Questions Generated');

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to generate questions'
            );

        } finally {

            setLoading(false);
        }
    };

    // HANDLE ANSWER
    const handleAnswerChange = (index, value) => {

        const updated = [...answers];

        updated[index].answer = value;

        setAnswers(updated);
    };

    // SUBMIT ANSWERS
    const submitAnswers = async () => {

        try {

            setLoading(true);

            const res = await axios.post(
                'http://localhost:8080/api/v1/interview/evaluate',
                { answers },
                {
                    withCredentials: true
                }
            );

            setEvaluations(res.data.evaluations);

            setSubmitted(true);

            toast.success('Interview Evaluated');

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Evaluation failed'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className='min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-4'>

            <div className='max-w-5xl mx-auto'>

                <div className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8'>

                    <h1 className='text-4xl font-bold mb-2 dark:text-white'>
                        AI Mock Interview
                    </h1>

                    <p className='text-gray-500 dark:text-gray-400 mb-8'>
                        Practice interviews with AI and get instant feedback.
                    </p>

                    {/* TYPE */}
                    <div className='flex flex-wrap gap-4 mb-8'>

                        {
                            ['HR', 'DSA', 'MERN', 'RESUME'].map((item) => (

                                <button
                                    key={item}
                                    onClick={() => setType(item)}
                                    className={`px-6 py-3 rounded-2xl font-semibold transition
                                    
                                    ${
                                        type === item
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))
                        }

                    </div>

                    {/* GENERATE */}
                    <button
                        onClick={generateQuestions}
                        disabled={loading}
                        className='w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                    >
                        {
                            loading
                            ? 'Generating...'
                            : 'Generate Questions'
                        }
                    </button>

                    {/* QUESTIONS */}
                    <div className='mt-10 space-y-8'>

                        {
                            questions.map((q, index) => (

                                <div
                                    key={index}
                                    className='border border-gray-200 dark:border-gray-800 rounded-3xl p-6'
                                >

                                    <h2 className='text-lg font-semibold mb-4 dark:text-white'>
                                        Q{index + 1}. {q.question}
                                    </h2>

                                    <textarea
                                        rows={5}
                                        value={answers[index]?.answer || ''}
                                        onChange={(e) =>
                                            handleAnswerChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder='Write your answer...'
                                        className='w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition'
                                    />

                                </div>
                            ))
                        }

                    </div>

                    {
                        questions.length > 0 && !submitted && (

                            <button
                                onClick={submitAnswers}
                                className='w-full mt-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold transition'
                            >
                                Submit Answers
                            </button>
                        )
                    }

                    {/* RESULTS */}
                    {
                        submitted && (

                            <div className='mt-12 space-y-6'>

                                <h2 className='text-3xl font-bold dark:text-white'>
                                    AI Feedback
                                </h2>

                                {
                                    evaluations.map((item, index) => (

                                        <div
                                            key={index}
                                            className='rounded-3xl border border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-950'
                                        >

                                            <h3 className='font-bold text-lg mb-4 dark:text-white'>
                                                {item.question}
                                            </h3>

                                            <div className='grid md:grid-cols-3 gap-4 mb-6'>

                                                <div className='p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30'>
                                                    Technical: {item.technical_correctness}/10
                                                </div>

                                                <div className='p-4 rounded-2xl bg-green-100 dark:bg-green-900/30'>
                                                    Communication: {item.communication_clarity}/10
                                                </div>

                                                <div className='p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30'>
                                                    Confidence: {item.confidence}/10
                                                </div>

                                            </div>

                                            <div className='space-y-3 text-sm dark:text-gray-300'>

                                                <p>
                                                    <span className='font-semibold'>
                                                        Strengths:
                                                    </span>

                                                    {' '}
                                                    {item.strengths?.join(', ')}
                                                </p>

                                                <p>
                                                    <span className='font-semibold'>
                                                        Weaknesses:
                                                    </span>

                                                    {' '}
                                                    {item.weaknesses?.join(', ')}
                                                </p>

                                                <p>
                                                    <span className='font-semibold'>
                                                        Improvement:
                                                    </span>

                                                    {' '}
                                                    {item.improvement_tips?.join(', ')}
                                                </p>

                                            </div>

                                        </div>
                                    ))
                                }

                            </div>
                        )
                    }

                </div>

            </div>

        </div>
    );
};

export default MockInterview;