import React from 'react';
import { FiX } from 'react-icons/fi';

const SkillInput = ({
    skillInput,
    setSkillInput,
    addSkill,
    removeSkill,
    skills
}) => {

    return (

        <div>

            <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                Skills
            </label>

            <div className='flex gap-3'>

                <input
                    type='text'
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder='Add a skill'
                    className='flex-1 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition'
                />

                <button
                    type='button'
                    onClick={addSkill}
                    className='px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition'
                >
                    Add
                </button>

            </div>

            <div className='flex flex-wrap gap-3 mt-5'>

                {
                    skills.map((skill, index) => (
                        <div
                            key={index}
                            className='flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                        >

                            <span className='text-sm font-medium'>
                                {skill}
                            </span>

                            <button
                                type='button'
                                onClick={() => removeSkill(skill)}
                            >
                                <FiX />
                            </button>

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default SkillInput;