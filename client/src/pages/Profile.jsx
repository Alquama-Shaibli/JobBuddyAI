import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import {
    getProfile,
    updateProfile
} from '../api/user.api';

import ProfileSidebar from '../components/profile/ProfileSidebar';
import InputField from '../components/profile/InputField';
import SkillInput from '../components/profile/SkillInput';

const Profile = () => {

    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchProfile();
    }, []);

    // FETCH PROFILE
    const fetchProfile = async () => {

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

            toast.error(
                error.response?.data?.message ||
                'Failed to fetch profile'
            );
        }
    };

    // INPUT CHANGE
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ADD SKILL
    const addSkill = () => {

        if (
            skillInput.trim() &&
            !formData.skills.includes(skillInput.trim())
        ) {

            setFormData({
                ...formData,
                skills: [
                    ...formData.skills,
                    skillInput.trim()
                ]
            });

            setSkillInput('');
        }
    };

    // REMOVE SKILL
    const removeSkill = (skill) => {

        setFormData({
            ...formData,
            skills: formData.skills.filter(
                (s) => s !== skill
            )
        });
    };

    // PROFILE COMPLETION
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

    const completedFields =
        fields.filter(Boolean).length;

    const completionPercentage = Math.round(
        (completedFields / fields.length) * 100
    );

    // SUBMIT
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = await updateProfile(
                user._id,
                formData
            );

            toast.success(data.message);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Profile update failed'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className='min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-4'>

            <div className='max-w-7xl mx-auto grid lg:grid-cols-3 gap-8'>

                {/* SIDEBAR */}
                <ProfileSidebar
                    user={user}
                    formData={formData}
                    completionPercentage={completionPercentage}
                />

                {/* FORM */}
                <div className='lg:col-span-2 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8'>

                    <div className='mb-8'>

                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                            Edit Profile
                        </h1>

                        <p className='mt-2 text-gray-500 dark:text-gray-400'>
                            Keep your profile updated to improve job matching and interview recommendations.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className='space-y-8'
                    >

                        {/* GRID */}
                        <div className='grid md:grid-cols-2 gap-6'>

                            <InputField
                                label='Preferred Role'
                                name='preferredRole'
                                value={formData.preferredRole}
                                onChange={handleChange}
                            />

                            <InputField
                                label='Experience (Years)'
                                type='number'
                                name='experience'
                                value={formData.experience}
                                onChange={handleChange}
                            />

                            <InputField
                                label='Location'
                                name='location'
                                value={formData.location}
                                onChange={handleChange}
                            />

                            <InputField
                                label='Education'
                                name='education'
                                value={formData.education}
                                onChange={handleChange}
                            />

                            <InputField
                                label='Phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                            />

                            <InputField
                                label='Github URL'
                                name='github'
                                value={formData.github}
                                onChange={handleChange}
                            />

                        </div>

                        {/* PORTFOLIO */}
                        <InputField
                            label='Portfolio URL'
                            name='portfolio'
                            value={formData.portfolio}
                            onChange={handleChange}
                        />

                        {/* BIO */}
                        <div>

                            <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Bio
                            </label>

                            <textarea
                                rows={6}
                                name='bio'
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder='Write something about yourself...'
                                className='w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition'
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

                        {/* BUTTON */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-70'
                        >
                            {
                                loading
                                    ? 'Updating Profile...'
                                    : 'Save Changes'
                            }
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Profile;