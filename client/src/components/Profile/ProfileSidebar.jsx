import React from 'react';
import {
    FiMapPin,
    FiBriefcase,
    FiBookOpen,
    FiGithub,
    FiGlobe
} from 'react-icons/fi';

const ProfileSidebar = ({
    user,
    formData,
    completionPercentage
}) => {

    return (

        <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 h-fit sticky top-24'>

            <div className='flex flex-col items-center text-center'>

                {/* AVATAR */}
                <div className='w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg'>

                    {
                        user?.username?.charAt(0)?.toUpperCase()
                    }

                </div>

                {/* USERNAME */}
                <h2 className='mt-5 text-2xl font-bold text-gray-900 dark:text-white'>
                    {user?.username}
                </h2>

                {/* EMAIL */}
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    {user?.email}
                </p>

                {/* ROLE */}
                {
                    formData?.preferredRole && (
                        <div className='mt-4 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-medium'>
                            {formData.preferredRole}
                        </div>
                    )
                }

            </div>

            {/* PROFILE COMPLETION */}
            <div className='mt-8'>

                <div className='flex justify-between text-sm mb-2'>

                    <span className='text-gray-600 dark:text-gray-400'>
                        Profile Completion
                    </span>

                    <span className='font-semibold text-blue-600 dark:text-blue-400'>
                        {completionPercentage}%
                    </span>

                </div>

                <div className='h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden'>

                    <div
                        className='h-3 rounded-full bg-blue-600 transition-all duration-500'
                        style={{
                            width: `${completionPercentage}%`
                        }}
                    />

                </div>

            </div>

            {/* USER DETAILS */}
            <div className='mt-8 space-y-5'>

                {
                    formData.location && (
                        <div className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
                            <FiMapPin className='text-blue-500' />
                            <span>{formData.location}</span>
                        </div>
                    )
                }

                {
                    formData.experience && (
                        <div className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
                            <FiBriefcase className='text-blue-500' />
                            <span>{formData.experience} Years Experience</span>
                        </div>
                    )
                }

                {
                    formData.education && (
                        <div className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
                            <FiBookOpen className='text-blue-500' />
                            <span>{formData.education}</span>
                        </div>
                    )
                }

            </div>

            {/* SOCIAL LINKS */}
            <div className='mt-8 flex gap-3'>

                {
                    formData.github && (
                        <a
                            href={formData.github}
                            target='_blank'
                            rel='noreferrer'
                            className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                        >
                            <FiGithub />
                            <span className='text-sm font-medium'>
                                Github
                            </span>
                        </a>
                    )
                }

                {
                    formData.portfolio && (
                        <a
                            href={formData.portfolio}
                            target='_blank'
                            rel='noreferrer'
                            className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                        >
                            <FiGlobe />
                            <span className='text-sm font-medium'>
                                Portfolio
                            </span>
                        </a>
                    )
                }

            </div>

        </div>
    );
};

export default ProfileSidebar;