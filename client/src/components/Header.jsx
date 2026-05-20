import React, { useEffect, useState } from 'react'
import { MdOutlineWbSunny } from "react-icons/md";
import { GiMoonBats } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CgProfile } from "react-icons/cg";
import { useTheme } from '../context/ThemeProvider';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const {theme, toggleTheme} = useTheme();
    
    // const [ theme, setTheme ] = useState(
    //     localStorage.getItem('theme') || 'light'
    // )

    // useEffect(()=>{
    //     document.documentElement.className = theme;
    //     localStorage.setItem('theme', theme);
    // })

    // const handleTheme = () => {
    //     setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
    // }

  return (
    <div className='flex justify-between items-center Roboto shadow-lg dark:bg-gray-950 dark:text-white sm:px-20'>
        <Link to={'/'} className="flex items-center">
            {/* Add your logo here */}
            <img src="/logo.png" alt="logo" className='h-20 cursor-pointer' />
            <h1 className='text-2xl sm:text-3xl font-bold  mb-4 cursor-pointer'>Job Buddy</h1>
        </Link>
        {/* login and signup buttons and bg-changer */}
        <div className="sm:flex hidden items-center gap-2">
            {
                currentUser ? (
                    <>
                        <Link to={'/profile'} className='w-10 h-10 rounded-full overflow-hidden border-gray-600 border-2 order-1'>
                            <img src={currentUser.profilePicture} alt={currentUser.username} />
                        </Link>
                        <button onClick={logout} className='bg-red-500 transition duration-300 ease-in-out hover:bg-red-700 text-white px-4 py-2 rounded mr-2'>
                            Logout
                        </button>
                    </>
                    
                ) : (
                    <>
                        <Link to={'/sign-in'} className='border transition delay-100 duration-300 ease-in hover:bg-gray-800 hover:text-white px-4 py-2 rounded mr-2'>
                            Sign In
                        </Link>
                        <Link to={'/sign-up'} className='bg-blue-500 transition duration-300 ease-in-out hover:bg-blue-700 text-white px-4 py-2 rounded mr-2'>
                            Sign Up
                        </Link>
                    </>
                )
            }
            <div className='py-3 px-4 border rounded-xl transition duration-300 ease-in-out hover:bg-gray-700 hover:text-white mr-3' onClick={toggleTheme}>
                {theme === 'light' ?  <GiMoonBats /> : <MdOutlineWbSunny />}
            </div>
        </div>
    </div>
  )
}

export default Header