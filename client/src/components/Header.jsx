import React, { useState } from "react";

import {
  MdOutlineWbSunny
} from "react-icons/md";

import {
  GiMoonBats
} from "react-icons/gi";

import {
  HiOutlineMenuAlt3,
  HiX
} from "react-icons/hi";

import {
  FiPlusCircle
} from "react-icons/fi";

import {
  Link,
  NavLink
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { useTheme } from "../context/ThemeProvider";

const Header = () => {

  const { currentUser, logout } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Jobs",
      path: "/jobs",
    },
    {
      name: "Mock Tests",
      path: "/mock-test",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Interview",
      path: "/interview",
    },
    {
      name: "Resume",
      path: "/resume",
    },
    {
      name: "Resume Analysis",
      path: "/resume-analyzer",
    },
  ];

  return (

    <header className="sticky top-0 z-50 border-b border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <img
              src="/logo.png"
              alt="Job Buddy"
              className="w-11 h-11 rounded-2xl object-cover"
            />

            <div>

              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Job Buddy
              </h1>

            </div>

          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-2 rounded-2xl">

            {
              navLinks.map((link) => (

                <NavLink
                  key={link.name}
                  to={link.path}
                  target={link?.target}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-white dark:bg-[#0f172a] text-blue-600 shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-[#0f172a]"
                    }`
                  }
                >

                  {link.name}

                </NavLink>
              ))
            }

          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="w-11 h-11 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center hover:scale-105 transition"
            >

              {
                theme === "light"
                  ? <GiMoonBats className="text-lg text-gray-700" />
                  : <MdOutlineWbSunny className="text-lg text-yellow-400" />
              }

            </button>

            {/* AUTH */}
            {
              currentUser ? (

                <div className="hidden sm:flex items-center gap-3">

                  {/* ADMIN */}
                  {
                    currentUser.isAdmin && (

                      <Link
                        to="/mock-test/create"
                        className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                      >

                        <FiPlusCircle />

                        Create

                      </Link>
                    )
                  }

                  {/* PROFILE */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                  >

                    <img
                      src={currentUser?.profilePicture || "/avatar.png"}
                      alt="profile"
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-500"
                    />

                    <div className="hidden md:block">

                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {currentUser?.username}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Developer
                      </p>

                    </div>

                  </Link>

                  {/* LOGOUT */}
                  <button
                    onClick={logout}
                    className="px-4 py-2.5 rounded-2xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-semibold transition"
                  >

                    Logout

                  </button>

                </div>

              ) : (

                <div className="hidden sm:flex items-center gap-3">

                  <Link
                    to="/sign-in"
                    className="px-5 py-2.5 rounded-2xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                  >

                    Sign In

                  </Link>

                  <Link
                    to="/sign-up"
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                  >

                    Get Started

                  </Link>

                </div>
              )
            }

            {/* MOBILE MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-11 h-11 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center"
            >

              {
                menuOpen
                  ? <HiX className="text-xl" />
                  : <HiOutlineMenuAlt3 className="text-xl" />
              }

            </button>

          </div>

        </div>

      </div>

      {/* MOBILE MENU */}
      {
        menuOpen && (

          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#020617]">

            <div className="px-4 py-5 space-y-3">

              {
                navLinks.map((link) => (

                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-2xl text-sm font-medium transition
                      ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-900"
                      }`
                    }
                  >

                    {link.name}

                  </NavLink>
                ))
              }

              {
                currentUser?.isAdmin && (

                  <Link
                    to="/mock-test/create"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >

                    <FiPlusCircle />

                    Create Mock Test

                  </Link>
                )
              }

              {/* MOBILE AUTH */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">

                {
                  currentUser ? (

                    <>

                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 mb-4"
                      >

                        <img
                          src={currentUser?.profilePicture || "/avatar.png"}
                          alt="profile"
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500"
                        />

                        <div>

                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {currentUser?.username}
                          </h3>

                          <p className="text-sm text-gray-500">
                            View Profile
                          </p>

                        </div>

                      </Link>

                      <button
                        onClick={logout}
                        className="w-full py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                      >

                        Logout

                      </button>

                    </>

                  ) : (

                    <div className="flex flex-col gap-3">

                      <Link
                        to="/sign-in"
                        onClick={() => setMenuOpen(false)}
                        className="w-full py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-center font-medium"
                      >

                        Sign In

                      </Link>

                      <Link
                        to="/sign-up"
                        onClick={() => setMenuOpen(false)}
                        className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold transition"
                      >

                        Create Account

                      </Link>

                    </div>
                  )
                }

              </div>

            </div>

          </div>
        )
      }

    </header>
  );
};

export default Header;