import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';

import {
    FiSearch,
    FiMapPin,
    FiBriefcase,
    FiDollarSign,
    FiTrendingUp
} from 'react-icons/fi';

const Jobs = () => {

    const [jobs, setJobs] = useState([]);
    const [matchedJobs, setMatchedJobs] = useState([]);

    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        skills: '',
        experience: ''
    });

    // FETCH ALL JOBS
    const fetchJobs = async () => {

        try {

            setLoading(true);

            const query = new URLSearchParams(filters).toString();

            const res = await API.get(
                `/jobs/getAllJobs?${query}`
            );

            setJobs(res.data.jobs);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Failed to fetch jobs'
            );

        } finally {

            setLoading(false);
        }
    };

    // FETCH MATCHED JOBS
    const fetchMatchedJobs = async () => {

        try {

            const res = await API.get('/jobs/match');

            setMatchedJobs(res.data);

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        fetchJobs();

        fetchMatchedJobs();

    }, []);

    // FILTER INPUT CHANGE
    const handleChange = (e) => {

        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // SEARCH BUTTON
    const handleSearch = () => {
        fetchJobs();
    };

    return (

        <div className='min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-4'>

            <div className='max-w-7xl mx-auto'>

                {/* HEADER */}
                <div className='mb-10'>

                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                        Find Your Dream Job
                    </h1>

                    <p className='mt-3 text-gray-500 dark:text-gray-400'>
                        Explore jobs based on your skills and experience.
                    </p>

                </div>

                {/* FILTERS */}
                <div className='grid md:grid-cols-4 gap-4 mb-8'>

                    <input
                        type='text'
                        name='keyword'
                        value={filters.keyword}
                        onChange={handleChange}
                        placeholder='Search jobs...'
                        className='rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <input
                        type='text'
                        name='location'
                        value={filters.location}
                        onChange={handleChange}
                        placeholder='Location'
                        className='rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <input
                        type='text'
                        name='skills'
                        value={filters.skills}
                        onChange={handleChange}
                        placeholder='Skills (React, Node)'
                        className='rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <button
                        onClick={handleSearch}
                        className='flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                    >

                        <FiSearch />

                        Search

                    </button>

                </div>

                {/* LOADING */}
                {
                    loading && (
                        <div className='text-center py-20 text-lg text-gray-500'>
                            Loading jobs...
                        </div>
                    )
                }

                {/* JOBS GRID */}
                <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>

                    {
                        jobs.map((job) => {

                            const matched = matchedJobs.find(
                                (m) => m._id === job._id
                            );

                            return (

                                <div
                                    key={job._id}
                                    className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-2xl transition'
                                >

                                    {/* TOP */}
                                    <div className='flex items-start justify-between mb-5'>

                                        <div>

                                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                                {job.title}
                                            </h2>

                                            <p className='text-blue-600 font-medium mt-1'>
                                                {job.company}
                                            </p>

                                        </div>

                                        {
                                            matched && (
                                                <div className='bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full'>
                                                    {matched.matchPercentage}% Match
                                                </div>
                                            )
                                        }

                                    </div>

                                    {/* DETAILS */}
                                    <div className='space-y-3 text-gray-600 dark:text-gray-300 mb-5'>

                                        <div className='flex items-center gap-2'>
                                            <FiMapPin />
                                            <span>{job.location}</span>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <FiBriefcase />
                                            <span>
                                                {job.experienceLevel} • {job.jobType}
                                            </span>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <FiDollarSign />
                                            <span>{job.salary}</span>
                                        </div>

                                    </div>

                                    {/* DESCRIPTION */}
                                    <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-5'>
                                        {job.description}
                                    </p>

                                    {/* SKILLS */}
                                    <div className='flex flex-wrap gap-2 mb-6'>

                                        {
                                            job.skillsRequired?.map((skill, index) => (

                                                <span
                                                    key={index}
                                                    className='px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm'
                                                >
                                                    {skill}
                                                </span>
                                            ))
                                        }

                                    </div>

                                    {/* MISSING SKILLS */}
                                    {
                                        matched?.missingSkills?.length > 0 && (

                                            <div className='mb-5'>

                                                <p className='text-sm font-semibold text-red-500 mb-2'>
                                                    Missing Skills
                                                </p>

                                                <div className='flex flex-wrap gap-2'>

                                                    {
                                                        matched.missingSkills.map((skill, index) => (

                                                            <span
                                                                key={index}
                                                                className='px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs'
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))
                                                    }

                                                </div>

                                            </div>
                                        )
                                    }

                                    {/* BUTTON */}
                                    <button
                                        className='w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                                    >

                                        <FiTrendingUp />

                                        Apply Now

                                    </button>

                                </div>
                            );
                        })
                    }

                </div>

                {/* EMPTY */}
                {
                    !loading && jobs.length === 0 && (
                        <div className='text-center py-20 text-gray-500'>
                            No jobs found.
                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default Jobs;