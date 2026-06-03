import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiMapPin,
    FiBriefcase,
    FiBookOpen,
    FiGithub,
    FiGlobe,
    FiGrid,
    FiSearch,
    FiFileText,
    FiTarget,
    FiUser,
    FiChevronRight,
} from 'react-icons/fi';

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { label: 'Profile', path: '/profile', icon: FiUser },
    { label: 'Jobs', path: '/jobs', icon: FiSearch },
    { label: 'Mock Interview', path: '/interview', icon: FiTarget },
    { label: 'Resume Upload', path: '/resume', icon: FiFileText },
    { label: 'AI Resume Analyzer', path: '/resume-analyzer', icon: FiBriefcase },
];

const ProfileSidebar = ({ user, formData, completionPercentage }) => {

    const scoreColor =
        completionPercentage >= 75
            ? 'bg-emerald-500'
            : completionPercentage >= 40
            ? 'bg-amber-500'
            : 'bg-rose-500';

    return (
        <div className='flex flex-col gap-4'>

            {/* ── Profile Card ─────────────────────────────────── */}
            <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sticky top-24'>

                <div className='flex flex-col items-center text-center'>

                    {/* AVATAR */}
                    <div className='relative w-24 h-24'>
                        <div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-blue-100 dark:ring-blue-900'>
                            {user?.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        {/* Online dot */}
                        <span className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900'/>
                    </div>

                    {/* USERNAME */}
                    <h2 className='mt-4 text-xl font-bold text-gray-900 dark:text-white'>
                        {user?.username || '—'}
                    </h2>

                    {/* EMAIL */}
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-full px-2'>
                        {user?.email || '—'}
                    </p>

                    {/* PREFERRED ROLE */}
                    {formData?.preferredRole && (
                        <div className='mt-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold'>
                            {formData.preferredRole}
                        </div>
                    )}

                </div>

                {/* ── Profile Completion ────────────── */}
                <div className='mt-6'>
                    <div className='flex justify-between text-xs mb-1.5'>
                        <span className='text-gray-500 dark:text-gray-400 font-medium'>Profile Completion</span>
                        <span className='font-bold text-gray-700 dark:text-gray-200'>{completionPercentage}%</span>
                    </div>
                    <div className='h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden'>
                        <div
                            className={`h-2 rounded-full ${scoreColor} transition-all duration-700`}
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>

                {/* ── User Details ──────────────────── */}
                {(formData?.location || formData?.experience || formData?.education) && (
                    <div className='mt-6 space-y-3'>
                        {formData.location && (
                            <div className='flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300'>
                                <FiMapPin className='text-blue-500 flex-shrink-0' />
                                <span className='truncate'>{formData.location}</span>
                            </div>
                        )}
                        {formData.experience && (
                            <div className='flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300'>
                                <FiBriefcase className='text-blue-500 flex-shrink-0' />
                                <span>{formData.experience} Years Experience</span>
                            </div>
                        )}
                        {formData.education && (
                            <div className='flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300'>
                                <FiBookOpen className='text-blue-500 flex-shrink-0' />
                                <span className='truncate'>{formData.education}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Skills Preview ────────────────── */}
                {formData?.skills?.length > 0 && (
                    <div className='mt-5'>
                        <p className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide'>Skills</p>
                        <div className='flex flex-wrap gap-1.5'>
                            {formData.skills.slice(0, 6).map((skill, i) => (
                                <span
                                    key={i}
                                    className='px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium'
                                >
                                    {skill}
                                </span>
                            ))}
                            {formData.skills.length > 6 && (
                                <span className='px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs'>
                                    +{formData.skills.length - 6}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Social Links ──────────────────── */}
                {(formData?.github || formData?.portfolio) && (
                    <div className='mt-5 flex gap-2'>
                        {formData.github && (
                            <a
                                href={formData.github}
                                target='_blank'
                                rel='noreferrer'
                                className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium text-gray-700 dark:text-gray-300'
                            >
                                <FiGithub className='text-base' />
                                Github
                            </a>
                        )}
                        {formData.portfolio && (
                            <a
                                href={formData.portfolio}
                                target='_blank'
                                rel='noreferrer'
                                className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium text-gray-700 dark:text-gray-300'
                            >
                                <FiGlobe className='text-base' />
                                Portfolio
                            </a>
                        )}
                    </div>
                )}

            </div>

            {/* ── Sidebar Navigation ───────────────────────────── */}
            <nav className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 overflow-hidden'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 pt-1 pb-2'>
                    Navigation
                </p>
                <ul className='space-y-1'>
                    {navItems.map(({ label, path, icon: Icon }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`text-base flex-shrink-0 ${isActive ? 'text-blue-500' : ''}`} />
                                        <span className='flex-1'>{label}</span>
                                        {isActive && <FiChevronRight className='text-blue-400 text-sm' />}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

        </div>
    );
};

export default ProfileSidebar;