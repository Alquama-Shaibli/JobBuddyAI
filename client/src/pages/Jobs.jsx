import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Jobs = () => {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                setLoading(true);

                const response = await API.get('jobs/getAllJobs');
                // console.log(response.data);
                setJobs(response.data.jobs);

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Failed to fetch jobs"
                );
                navigate('/sign-in');

            } finally {

                setLoading(false);
            }
        };

        fetchJobs();

    }, []);

    if (loading) {
        return (
            <div className='text-center mt-10'>
                Loading jobs...
            </div>
        );
    }

    return (

        <div className='max-w-7xl mx-auto p-4'>

            <h1 className='text-3xl font-bold mb-6'>
                Latest Jobs
            </h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

                {
                    jobs.map((job) => (

                        <div
                            key={job._id}
                            className='border rounded-xl p-5 shadow-md hover:shadow-xl duration-300'
                        >

                            <h2 className='text-xl font-bold mb-2'>
                                {job.title}
                            </h2>

                            <p className='text-gray-500 mb-2'>
                                {job.company}
                            </p>

                            <p className='mb-3'>
                                {job.location}
                            </p>

                            <p className='mb-3'>
                                {job.salary ? `${job.salary}/year` : 'Salary not specified'}
                            </p>

                            <p className='mb-3'>
                                {job.experienceLevel} | {job.experienceRequired} years experience
                            </p>

                            <div className='flex flex-wrap gap-2 mb-4'>

                                {
                                    job.skillsRequired?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className='bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm'
                                        >
                                            {skill}
                                        </span>
                                    ))
                                }

                            </div>

                            <button
                                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 duration-300'
                            >
                                View Details
                            </button>

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default Jobs