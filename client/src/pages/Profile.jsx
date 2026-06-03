import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../api/user.api';
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import InputField from '../components/Profile/InputField';
import SkillInput from '../components/Profile/SkillInput';

/* ── Skeleton Loader ──────────────────────────────────────────── */
const ProfileSkeleton = () => (
    <div className='animate-pulse'>
        <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4' />
        <div className='h-4 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg mb-10' />
        <div className='grid md:grid-cols-2 gap-6'>
            {[...Array(6)].map((_, i) => (
                <div key={i} className='space-y-2'>
                    <div className='h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded' />
                    <div className='h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl' />
                </div>
            ))}
        </div>
        <div className='mt-6 h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl' />
        <div className='mt-6 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl' />
    </div>
);

/* ══════════════════════════════════════════════════════════════ */
const Profile = () => {

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [user, setUser] = useState(null);
    const [skillInput, setSkillInput] = useState('');

    const [formData, setFormData] = useState({
        skills: [],
        experience: '',
        preferredRole: '',
        location: '',
        education: '',
        phone: '',
        bio: '',
        github: '',
        portfolio: ''
    });

    useEffect(() => { fetchProfile(); }, []);

    /* FETCH PROFILE */
    const fetchProfile = async () => {
        setFetching(true);
        try {
            const data = await getProfile();
            setUser(data.user);
            setFormData({
                skills: data.user.skills || [],
                experience: data.user.experience || '',
                preferredRole: data.user.preferredRole || '',
                location: data.user.location || '',
                education: data.user.education || '',
                phone: data.user.phone || '',
                bio: data.user.bio || '',
                github: data.user.github || '',
                portfolio: data.user.portfolio || ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            setSkillInput('');
        }
    };

    const removeSkill = (skill) =>
        setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });

    /* PROFILE COMPLETION */
    const fields = [
        formData.skills.length > 0,
        formData.experience,
        formData.preferredRole,
        formData.location,
        formData.education,
        formData.phone,
        formData.bio,
        formData.github,
        formData.portfolio
    ];
    const completionPercentage = Math.round(
        (fields.filter(Boolean).length / fields.length) * 100
    );

    /* SUBMIT */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await updateProfile(user._id, formData);
            toast.success(data.message || 'Profile updated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Profile update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen py-10 px-4'>
            <div className='max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-6'>

                {/* ── SIDEBAR ────────────────────────────────── */}
                <div className='lg:sticky lg:top-24 lg:h-fit'>
                    <ProfileSidebar
                        user={user}
                        formData={formData}
                        completionPercentage={completionPercentage}
                    />
                </div>

                {/* ── FORM ───────────────────────────────────── */}
                <div className='rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8'>

                    {fetching ? <ProfileSkeleton /> : (
                        <>
                            <div className='mb-8'>
                                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                                    Edit Profile
                                </h1>
                                <p className='mt-2 text-gray-500 dark:text-gray-400 text-sm'>
                                    Keep your profile updated to improve job matching and interview recommendations.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-8'>

                                {/* GRID */}
                                <div className='grid sm:grid-cols-2 gap-5'>
                                    <InputField
                                        label='Preferred Role'
                                        name='preferredRole'
                                        value={formData.preferredRole}
                                        onChange={handleChange}
                                        placeholder='e.g. Full Stack Developer'
                                    />
                                    <InputField
                                        label='Experience (Years)'
                                        type='number'
                                        name='experience'
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder='e.g. 2'
                                        min={0}
                                    />
                                    <InputField
                                        label='Location'
                                        name='location'
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder='e.g. New Delhi, India'
                                    />
                                    <InputField
                                        label='Education'
                                        name='education'
                                        value={formData.education}
                                        onChange={handleChange}
                                        placeholder='e.g. B.Tech Computer Science'
                                    />
                                    <InputField
                                        label='Phone'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder='+91 9876543210'
                                    />
                                    <InputField
                                        label='GitHub URL'
                                        name='github'
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder='https://github.com/username'
                                    />
                                </div>

                                {/* PORTFOLIO */}
                                <InputField
                                    label='Portfolio URL'
                                    name='portfolio'
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    placeholder='https://yourportfolio.dev'
                                />

                                {/* BIO */}
                                <div>
                                    <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Bio
                                    </label>
                                    <textarea
                                        rows={5}
                                        name='bio'
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder='Write something about yourself...'
                                        className='w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none transition dark:text-gray-200'
                                    />
                                </div>

                                {/* SKILLS */}
                                <SkillInput
                                    skillInput={skillInput}
                                    setSkillInput={setSkillInput}
                                    addSkill={addSkill}
                                    removeSkill={removeSkill}
                                    skills={formData.skills}
                                />

                                {/* SUBMIT */}
                                <button
                                    type='submit'
                                    disabled={loading}
                                    id='profile-save-btn'
                                    className='w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                                >
                                    {loading ? (
                                        <>
                                            <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>

                            </form>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;