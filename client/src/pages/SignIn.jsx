import React from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  return (
    <div className='min-h-screen dark:bg-gray-950 dark:text-white'>
        <div className="flex justify-between items-center Roboto pt-20 sm:pt-32 sm:mx-20 mx-4 gap-2">
            {/* add logo here */}
            <div className=" sm:flex hidden items-center flex-col p-4 flex-1 text-xl sm:text-4xl  relative">
                {/* <img src="/logo1.png" alt="logo"
                className='w-64 ' 
                /> */}
                <div className="cursor-pointer">
                    <span className='px-3 py-1 bg-linear-to-r from-rose-700 via-amber-600  rounded-lg text-white/70 hover:text-white '>Job</span>Buddy
                </div>
                <p className='text-sm mt-4'>Bridging Skills and Careers with Intelligence.</p>
            </div>
            {/*  add your sign up form here */}
            <div className="ring-2 ring-rose-500/50 flex-1 p-6 rounded-lg ">
                <h2 className='mb-2 sm:text-xl font-bold'>Welcome to Job Buddy</h2>
                <hr className='text-gray-200 mb-4' />
                <form action="">
                    {/* <div className="">
                        <label htmlFor="username">Name</label>
                        <input type='text' id='username' name='username' className='border-2 border-gray-400 m-3 rounded-sm w-full p-1 py-2' placeholder='Enter your name...' />
                    </div> */}

                    <div className="">
                        <label htmlFor="email">Email</label>
                        <input type='email' id='email' name='email' className='border-2 border-gray-400 m-3 rounded-sm w-full p-1 py-2' placeholder='Enter your email...' />
                    </div>
                    
                    <div className="">
                        <label htmlFor="password">Password</label>
                        <input type='password' id='password' name='password' className='border-2 border-gray-400 m-3 rounded-sm w-full p-1 py-2' placeholder='Enter your password...' />
                    </div>

                    <button type='submit' className='bg-blue-500 text-white p-2 rounded-lg ml-2 hover:bg-blue-700 cursor-pointer w-25 focus:outline-2 duration-300 ease-in focus:outline-offset-2 focus:outline-blue-500'>Sign In</button>
                </form>
                <p className='mt-5 text-sm'>Already have an account ? <Link to={'/sign-up'} className='text-blue-500 cursor-pointer'>Sign Up</Link></p>
            </div>
        </div>
    </div>
  )
}

export default SignIn