// src/pages/CreateMockTest.jsx

import React, { useState } from 'react';

import {
    FiPlus,
    FiTrash2
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import API from '../api/axios';

const CreateMockTest = () => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        timeLimit: 30,
        questions: [
            {
                question: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            }
        ]
    });

    // HANDLE BASIC INPUT
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // HANDLE QUESTION CHANGE
    const handleQuestionChange = (
        index,
        field,
        value
    ) => {

        const updatedQuestions = [...formData.questions];

        updatedQuestions[index][field] = value;

        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    // HANDLE OPTION CHANGE
    const handleOptionChange = (
        qIndex,
        optionIndex,
        value
    ) => {

        const updatedQuestions = [...formData.questions];

        updatedQuestions[qIndex]
            .options[optionIndex] = value;

        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    // ADD QUESTION
    const addQuestion = () => {

        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: ''
                }
            ]
        });
    };

    // REMOVE QUESTION
    const removeQuestion = (index) => {

        const updatedQuestions =
            formData.questions.filter(
                (_, i) => i !== index
            );

        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    // SUBMIT
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await API.post(
                '/mock-test/create',
                formData
            );

            toast.success(
                response.data.message
            );

            setFormData({
                title: '',
                category: '',
                timeLimit: 30,
                questions: [
                    {
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: ''
                    }
                ]
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to create mock test'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className='min-h-screen px-4 py-10'>

            <div className='max-w-5xl mx-auto'>

                {/* HEADER */}
                <div className='mb-8'>

                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                        Create Mock Test
                    </h1>

                    <p className='mt-2 text-gray-500 dark:text-gray-400'>
                        Create professional aptitude and technical tests.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className='space-y-8'
                >

                    {/* BASIC DETAILS */}
                    <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 grid md:grid-cols-3 gap-5'>

                        <Input
                            label='Title'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <Input
                            label='Category'
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                        />

                        <Input
                            label='Time Limit (Minutes)'
                            type='number'
                            name='timeLimit'
                            value={formData.timeLimit}
                            onChange={handleChange}
                        />

                    </div>

                    {/* QUESTIONS */}
                    <div className='space-y-6'>

                        {
                            formData.questions.map(
                                (q, index) => (

                                    <div
                                        key={index}
                                        className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6'
                                    >

                                        {/* TOP */}
                                        <div className='flex items-center justify-between mb-6'>

                                            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                                                Question {index + 1}
                                            </h2>

                                            {
                                                formData.questions.length > 1 && (
                                                    <button
                                                        type='button'
                                                        onClick={() =>
                                                            removeQuestion(index)
                                                        }
                                                        className='p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition'
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                )
                                            }

                                        </div>

                                        {/* QUESTION */}
                                        <div className='mb-6'>

                                            <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                Question
                                            </label>

                                            <textarea
                                                rows={3}
                                                value={q.question}
                                                onChange={(e) =>
                                                    handleQuestionChange(
                                                        index,
                                                        'question',
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                                            />

                                        </div>

                                        {/* OPTIONS */}
                                        <div className='grid md:grid-cols-2 gap-4 mb-6'>

                                            {
                                                q.options.map(
                                                    (
                                                        option,
                                                        optionIndex
                                                    ) => (

                                                        <Input
                                                            key={optionIndex}
                                                            label={`Option ${optionIndex + 1}`}
                                                            value={option}
                                                            onChange={(e) =>
                                                                handleOptionChange(
                                                                    index,
                                                                    optionIndex,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                    )
                                                )
                                            }

                                        </div>

                                        {/* CORRECT ANSWER */}
                                        <Input
                                            label='Correct Answer'
                                            value={q.correctAnswer}
                                            onChange={(e) =>
                                                handleQuestionChange(
                                                    index,
                                                    'correctAnswer',
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                )
                            )
                        }

                    </div>

                    {/* ADD QUESTION */}
                    <button
                        type='button'
                        onClick={addQuestion}
                        className='flex items-center gap-2 px-6 py-4 rounded-2xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition'
                    >

                        <FiPlus />

                        Add Question

                    </button>

                    {/* SUBMIT */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                    >

                        {
                            loading
                                ? 'Creating Mock Test...'
                                : 'Create Mock Test'
                        }

                    </button>

                </form>

            </div>

        </div>
    );
};

const Input = ({
    label,
    ...props
}) => (

    <div>

        <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
            {label}
        </label>

        <input
            {...props}
            className='w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition'
        />

    </div>
);

export default CreateMockTest;