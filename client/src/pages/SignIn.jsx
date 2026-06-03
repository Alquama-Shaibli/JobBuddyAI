import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // empty field validation
      if (!formData.email || !formData.password) {
        return toast.error("Please fill in all the fields.");
      }

      // email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return toast.error("Please enter a valid email address.");
      }

      try {
        setLoading(true);
        const response = await API.post("/auth/login", formData);

        if (response.data.success === true) {
          login(response.data.user);
          toast.success(
            response.data.message || "Sign in successful!",
          );

          navigate("/dashboard");
        } else {
          toast.error(
            response.data.message ||
              "Sign in failed. please try again later.",
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className='min-h-screen dark:text-white'>
        <div className="flex flex-col sm:flex-row items-center Roboto pt-20 sm:pt-32 sm:mx-20 mx-4 gap-2">
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
            <div className="ring-2 ring-rose-500/50 flex-1 p-6 rounded-lg w-full max-w-md">
                <h2 className='mb-2 sm:text-xl font-bold'>Welcome to Job Buddy</h2>
                <hr className='text-gray-200 mb-4' />
                <form action="" className='space-y-4' onSubmit={handleSubmit}>
                    {/* <div className="">
                        <label htmlFor="username">Name</label>
                        <input type='text' id='username' name='username' className='border-2 border-gray-400 m-3 rounded-sm w-full p-1 py-2' placeholder='Enter your name...' />
                    </div> */}

                    <div className="">
                        <label htmlFor="email">Email</label>
                        <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} className='border-2 border-gray-400 rounded-sm w-full p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter your email...' />
                    </div>
                    
                    <div className="">
                        <label htmlFor="password">Password</label>
                        <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} className='border-2 border-gray-400 rounded-sm w-full p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter your password...' />
                    </div>

                    <button type='submit' disabled={loading}  className={` bg-blue-500 text-white p-2 rounded-lg w-full focus:outline-2 duration-300 ease-in focus:outline-offset-2 focus:outline-blue-500 ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700 cursor-pointer"}`}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <p className='mt-5 text-sm'>Don't have an account ? <Link to={'/sign-up'} className='text-blue-500 cursor-pointer'>Sign Up</Link></p>
            </div>
        </div>
    </div>
  )
}

export default SignIn