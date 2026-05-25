import React from 'react';

const InputField = ({
    label,
    ...props
}) => {

    return (

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
};

export default InputField;