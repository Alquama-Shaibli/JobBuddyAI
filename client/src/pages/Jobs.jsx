import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllJobs, getMatchedJobs } from '../api/jobs.api';
import {
    FiSearch,
    FiMapPin,
    FiBriefcase,
    FiDollarSign,
    FiTrendingUp,
    FiStar,
    FiAlertCircle,
    FiExternalLink,
    FiX,
    FiFilter,
} from 'react-icons/fi';

/* ── Helpers ──────────────────────────────────────────────────── */
const matchColor = (pct) => {
    if (pct >= 70) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (pct >= 40) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
};

/* ── Skeleton Card ──────────────────────────────────────────── */
const JobSkeleton = () => (
    <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 animate-pulse'>
        <div className='flex justify-between mb-5'>
            <div>
                <div className='h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2' />
                <div className='h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded-lg' />
            </div>
            <div className='h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full' />
        </div>
        <div className='space-y-2 mb-4'>
            {[...Array(3)].map((_, i) => (
                <div key={i} className='h-4 bg-gray-100 dark:bg-gray-800 rounded-lg' />
            ))}
        </div>
        <div className='flex gap-2 mb-5'>
            {[...Array(3)].map((_, i) => (
                <div key={i} className='h-6 w-14 bg-gray-100 dark:bg-gray-800 rounded-full' />
            ))}
        </div>
        <div className='h-11 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
    </div>
);

/* ── Job Card ─────────────────────────────────────────────────── */
const JobCard = ({ job, matched }) => (
    <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 flex flex-col'>

        {/* TOP */}
        <div className='flex items-start justify-between mb-4'>
            <div className='flex-1 min-w-0 pr-3'>
                <h2 className='text-lg font-bold text-gray-900 dark:text-white leading-tight'>
                    {job.title}
                </h2>
                <p className='text-blue-600 dark:text-blue-400 font-medium mt-0.5 text-sm'>
                    {job.company}
                </p>
            </div>
            {matched && (
                <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${matchColor(matched.matchPercentage)}`}>
                    {matched.matchPercentage}% Match
                </span>
            )}
        </div>

        {/* DETAILS */}
        <div className='space-y-2 text-gray-500 dark:text-gray-400 text-sm mb-4'>
            <div className='flex items-center gap-2'>
                <FiMapPin className='flex-shrink-0' />
                <span>{job.location}</span>
            </div>
            <div className='flex items-center gap-2'>
                <FiBriefcase className='flex-shrink-0' />
                <span>{job.experienceLevel || '—'} • {job.jobType || 'Full-time'}</span>
            </div>
            {job.salary && (
                <div className='flex items-center gap-2'>
                    <FiDollarSign className='flex-shrink-0' />
                    <span>{job.salary}</span>
                </div>
            )}
        </div>

        {/* DESCRIPTION */}
        <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1'>
            {job.description}
        </p>

        {/* REQUIRED SKILLS */}
        {job.skillsRequired?.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mb-4'>
                {job.skillsRequired.slice(0, 5).map((skill, i) => (
                    <span key={i} className='px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium'>
                        {skill}
                    </span>
                ))}
                {job.skillsRequired.length > 5 && (
                    <span className='px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs'>
                        +{job.skillsRequired.length - 5}
                    </span>
                )}
            </div>
        )}

        {/* MISSING SKILLS */}
        {matched?.missingSkills?.length > 0 && (
            <div className='mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800'>
                <p className='text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1.5 flex items-center gap-1'>
                    <FiAlertCircle />
                    Skills to learn
                </p>
                <div className='flex flex-wrap gap-1.5'>
                    {matched.missingSkills.map((skill, i) => (
                        <span key={i} className='px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs'>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* APPLY BUTTON */}
        <a
            href={job.applyUrl || '#'}
            target={job.applyUrl ? '_blank' : '_self'}
            rel='noreferrer'
            className='mt-auto flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition'
        >
            <FiTrendingUp />
            Apply Now
            {job.applyUrl && <FiExternalLink className='text-xs opacity-80' />}
        </a>

    </div>
);

/* ══════════════════════════════════════════════════════════════ */
const Jobs = () => {

    const [jobs, setJobs] = useState([]);
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [matchLoading, setMatchLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'matched'
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        skills: '',
        experience: '',
    });

    /* FETCH ALL JOBS */
    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            // Remove empty filter values
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== '')
            );
            const data = await getAllJobs(activeFilters);
            setJobs(data.jobs || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    /* FETCH MATCHED JOBS */
    const fetchMatchedJobs = async () => {
        try {
            setMatchLoading(true);
            const data = await getMatchedJobs();
            setMatchedJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            // Silently handle – user may not have a profile/skills set
            console.warn('Could not load matched jobs:', error.message);
        } finally {
            setMatchLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchMatchedJobs();
    }, []);

    const handleChange = (e) =>
        setFilters({ ...filters, [e.target.name]: e.target.value });

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const clearFilters = () => {
        setFilters({ keyword: '', location: '', skills: '', experience: '' });
    };

    /* Merge match data into all jobs for display */
    const jobsWithMatch = jobs.map((job) => ({
        job,
        matched: matchedJobs.find((m) => m._id === job._id) || null,
    }));

    /* Top 3 matched jobs for the highlighted section */
    const topMatches = [...matchedJobs]
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 3);

    const displayList = activeTab === 'matched'
        ? matchedJobs.map((j) => ({ job: j, matched: j }))
        : jobsWithMatch;

    const hasActiveFilters = Object.values(filters).some((v) => v !== '');

    return (
        <div className='min-h-screen py-10 px-4'>
            <div className='max-w-7xl mx-auto'>

                {/* ── PAGE HEADER ──────────────────────────────── */}
                <div className='mb-8'>
                    <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
                        Find Your Dream Job
                    </h1>
                    <p className='mt-2 text-gray-500 dark:text-gray-400'>
                        Explore jobs based on your skills and experience.
                    </p>
                </div>

                {/* ── AI MATCHED TOP PICKS ─────────────────────── */}
                {!matchLoading && topMatches.length > 0 && (
                    <div className='mb-10 p-6 rounded-3xl border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40'>
                        <div className='flex items-center gap-2 mb-4'>
                            <FiStar className='text-blue-600 text-lg' />
                            <h2 className='text-lg font-bold text-blue-900 dark:text-blue-200'>
                                AI Top Matches For You
                            </h2>
                        </div>
                        <div className='grid sm:grid-cols-3 gap-3'>
                            {topMatches.map((job) => (
                                <div key={job._id} className='bg-white dark:bg-gray-900 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/50'>
                                    <div className='flex items-start justify-between mb-1'>
                                        <p className='font-semibold text-sm text-gray-900 dark:text-white leading-tight'>{job.title}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${matchColor(job.matchPercentage)}`}>
                                            {job.matchPercentage}%
                                        </span>
                                    </div>
                                    <p className='text-xs text-blue-600 font-medium'>{job.company}</p>
                                    <p className='text-xs text-gray-500 mt-1'>{job.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── TABS ─────────────────────────────────────── */}
                <div className='flex items-center gap-3 mb-6'>
                    {['all', 'matched'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition
                                ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900'
                                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400'
                                }`}
                        >
                            {tab === 'all' ? `All Jobs (${jobs.length})` : `AI Matched (${matchedJobs.length})`}
                        </button>
                    ))}

                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className='ml-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 transition'
                    >
                        <FiFilter />
                        Filters
                        {hasActiveFilters && (
                            <span className='w-2 h-2 rounded-full bg-blue-600' />
                        )}
                    </button>
                </div>

                {/* ── SEARCH & FILTERS ─────────────────────────── */}
                {filtersOpen && (
                    <form
                        onSubmit={handleSearch}
                        className='mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                    >
                        <div className='relative'>
                            <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                            <input
                                type='text'
                                name='keyword'
                                value={filters.keyword}
                                onChange={handleChange}
                                placeholder='Role, company...'
                                id='jobs-keyword-input'
                                className='w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-gray-200'
                            />
                        </div>
                        <input
                            type='text'
                            name='location'
                            value={filters.location}
                            onChange={handleChange}
                            placeholder='Location'
                            id='jobs-location-input'
                            className='rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-gray-200'
                        />
                        <input
                            type='text'
                            name='skills'
                            value={filters.skills}
                            onChange={handleChange}
                            placeholder='Skills (React, Node)'
                            id='jobs-skills-input'
                            className='rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-gray-200'
                        />
                        <div className='flex gap-2'>
                            <button
                                type='submit'
                                id='jobs-search-btn'
                                className='flex-1 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition'
                            >
                                <FiSearch />
                                Search
                            </button>
                            {hasActiveFilters && (
                                <button
                                    type='button'
                                    onClick={clearFilters}
                                    className='p-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* ── LOADING ──────────────────────────────────── */}
                {loading && (
                    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {[...Array(6)].map((_, i) => <JobSkeleton key={i} />)}
                    </div>
                )}

                {/* ── JOB GRID ─────────────────────────────────── */}
                {!loading && (
                    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {displayList.map(({ job, matched }) => (
                            <JobCard key={job._id} job={job} matched={matched} />
                        ))}
                    </div>
                )}

                {/* ── EMPTY STATE ──────────────────────────────── */}
                {!loading && displayList.length === 0 && (
                    <div className='text-center py-24'>
                        <div className='w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-5'>
                            <FiBriefcase className='text-2xl text-gray-400' />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>
                            No Jobs Found
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mb-6'>
                            {activeTab === 'matched'
                                ? 'Update your profile skills to get AI job matches.'
                                : 'Try adjusting your search filters.'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className='px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition'
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Jobs;