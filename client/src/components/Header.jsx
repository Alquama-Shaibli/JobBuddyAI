import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";
import {
  FiMenu, FiX, FiChevronDown, FiSun, FiMoon,
  FiPlusCircle, FiLogOut, FiUser, FiLock, FiUploadCloud,
  FiAlertTriangle
} from "react-icons/fi";
import logoWhite from "../assets/logo-white.png";

const NAV_LINKS = [
  { name: "Dashboard",        path: "/dashboard",      requiresResume: false },
  { name: "AI Mock Interview",path: "/interview",       requiresResume: true  },
  { name: "Job Board",        path: "/jobs",            requiresResume: true  },
  { name: "AI Resume Analyzer",  path: "/resume-analyzer", requiresResume: true  },
  { name: "Mock Tests",       path: "/mock-test",       requiresResume: true  },
];

/* ─── Resume-Gate Modal ────────────────────────────────────── */
const ResumeGateModal = ({ feature, onClose }) => (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <FiX />
      </button>

      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto mb-6">
        <FiLock className="text-amber-500 text-2xl" />
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
          <FiAlertTriangle className="text-xs" /> Upload Required
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          Unlock {feature}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Upload your resume first so our AI can extract your skills and personalise your{" "}
          <strong className="text-slate-700 dark:text-slate-300">{feature}</strong> experience.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition"
        >
          <FiUploadCloud /> Upload Resume on Dashboard
        </Link>
        <button
          onClick={onClose}
          className="py-3 rounded-2xl text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-900 dark:hover:text-white transition"
        >
          Not now
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
const Header = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen,     setMenuOpen]     = useState(false);
  const [scrolled,    setScrolled]     = useState(false);
  const [profileOpen, setProfileOpen]  = useState(false);
  const [gateModal,   setGateModal]    = useState({ open: false, feature: "" });

  const isOnboarded = currentUser?.isOnboarded === true;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = useCallback(
    (e, link) => {
      if (link.requiresResume && !isOnboarded) {
        e.preventDefault();
        setMenuOpen(false);
        setGateModal({ open: true, feature: link.name });
      }
    },
    [isOnboarded]
  );

  /* NavLink className helper — React Router v7 compatible (no children fn) */
  const navClass = (isActive) =>
    `relative inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
        : "text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    }`;

  return (
    <>
      {gateModal.open && (
        <ResumeGateModal
          feature={gateModal.feature}
          onClose={() => setGateModal({ open: false, feature: "" })}
        />
      )}

      <header className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
        <div
          className={`max-w-7xl mx-auto rounded-2xl border px-4 sm:px-6 transition-all duration-300 ${
            scrolled || menuOpen
              ? "border-slate-200 dark:border-slate-700 bg-white/98 dark:bg-slate-900/98 shadow-xl backdrop-blur-xl"
              : "border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 shadow-lg backdrop-blur-md"
          }`}
        >
          <div className="h-14 sm:h-16 flex items-center justify-between">

            {/* LOGO */}
            <Link to="/" className="flex items-center shrink-0">
              <img src={logoWhite} alt="JobBuddy AI" className="h-12 sm:h-14 w-auto" />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={({ isActive }) => navClass(isActive)}
                >
                  {link.name}
                  {link.requiresResume && !isOnboarded && (
                    <FiLock className="text-[10px] text-slate-400 opacity-70" />
                  )}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {/* THEME */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                {theme === "light"
                  ? <FiMoon className="text-slate-600" />
                  : <FiSun className="text-yellow-400" />
                }
              </button>

              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2 relative">
                  {currentUser.isAdmin && (
                    <Link
                      to="/mock-test/create"
                      className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 transition"
                    >
                      <FiPlusCircle className="text-sm" /> Create
                    </Link>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                        {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate hidden md:block">
                        {currentUser?.username}
                      </span>
                      <FiChevronDown className={`text-slate-400 text-sm transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser?.username}</p>
                        </div>
                        <div className="p-1.5">
                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                          >
                            <FiUser className="text-slate-400" /> My Profile
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                          >
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                            </svg>
                            Dashboard
                          </Link>
                          <button
                            onClick={() => { logout(); setProfileOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition font-medium"
                          >
                            <FiLogOut /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/sign-in"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    id="nav-get-started"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* MOBILE HAMBURGER */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center"
              >
                {menuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="md:hidden border-t border-slate-100 dark:border-slate-800 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    if (!link.requiresResume || isOnboarded) setMenuOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  {link.name}
                  {link.requiresResume && !isOnboarded && (
                    <FiLock className="text-xs text-slate-400" />
                  )}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                {currentUser ? (
                  <>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {currentUser?.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{currentUser?.username}</p>
                        <p className="text-xs text-slate-400">View Profile</p>
                      </div>
                    </Link>
                    <button onClick={logout} className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition text-sm">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/sign-in" onClick={() => setMenuOpen(false)} className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-center text-sm font-medium">
                      Sign In
                    </Link>
                    <Link to="/sign-up" onClick={() => setMenuOpen(false)} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-bold transition">
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
};

export default Header;