import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen, FiTarget, FiTrendingUp, FiAward, FiArrowRight,
  FiMessageSquare, FiBriefcase, FiFileText, FiUser, FiMail,
  FiCheckCircle, FiClock, FiUploadCloud, FiLock, FiZap,
  FiChevronRight, FiPlay, FiBarChart2
} from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

/* ─── Pipeline Step definition ────────────────────────────── */
const PIPELINE_STEPS = [
  {
    num: "01",
    label: "Resume Upload",
    sub: "Optimize with AI ATS analysis",
    icon: FiUploadCloud,
    color: "blue",
  },
  {
    num: "02",
    label: "Skill Analysis",
    sub: "AI gap analysis & learning plan",
    icon: FiBarChart2,
    color: "violet",
  },
  {
    num: "03",
    label: "Mock Interview",
    sub: "AI-led practice with scoring",
    icon: FiMessageSquare,
    color: "emerald",
  },
  {
    num: "04",
    label: "Job Matching",
    sub: "AI surfaces your best-fit roles",
    icon: FiBriefcase,
    color: "amber",
  },
];

const COLOR_MAP = {
  blue:    { ring: "ring-blue-500",   bg: "bg-blue-500",   light: "bg-blue-50 dark:bg-blue-500/10",   icon: "text-blue-600 dark:text-blue-400",   bar: "bg-blue-500"    },
  violet:  { ring: "ring-violet-500", bg: "bg-violet-500", light: "bg-violet-50 dark:bg-violet-500/10", icon: "text-violet-600 dark:text-violet-400", bar: "bg-violet-500" },
  emerald: { ring: "ring-emerald-500",bg: "bg-emerald-500",light: "bg-emerald-50 dark:bg-emerald-500/10",icon: "text-emerald-600 dark:text-emerald-400",bar: "bg-emerald-500"},
  amber:   { ring: "ring-amber-500",  bg: "bg-amber-500",  light: "bg-amber-50 dark:bg-amber-500/10",  icon: "text-amber-600 dark:text-amber-400",   bar: "bg-amber-500"   },
};

const JOB_ROLES = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Data Scientist", "ML Engineer", "DevOps Engineer", "Product Manager",
  "Data Analyst", "Mobile Developer", "Other",
];

/* ─── Sub-components ──────────────────────────────────────── */
const LockedFeatureCard = ({ icon: Icon, title, desc, colorClasses }) => (
  <div className="relative bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden opacity-60 select-none cursor-not-allowed">
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-10 pointer-events-none ${colorClasses.glow}`} />
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow">
        <FiLock className="text-slate-500 text-sm" />
        <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">Upload Resume to Unlock</span>
      </div>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-6 ${colorClasses.iconBg} ${colorClasses.iconColor}`}>
      <Icon />
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 h-10">{desc}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, linkTo, linkText, colorClasses }) => (
  <Link
    to={linkTo}
    className="group relative bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden block"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-20 pointer-events-none transition-all group-hover:opacity-40 ${colorClasses.glow}`} />
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm ${colorClasses.iconBg} ${colorClasses.iconColor}`}>
      <Icon />
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 h-10">{desc}</p>
    <div className="flex items-center justify-between mt-auto">
      <span className={`text-sm font-bold ${colorClasses.textColor} flex items-center gap-2`}>
        {linkText} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  </Link>
);

const StatCard = ({ title, value, icon: Icon, colorClasses }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${colorClasses.iconBg} ${colorClasses.iconColor}`}>
      <Icon />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{value}</h4>
    </div>
  </div>
);

/* ─── Skeleton loader ─────────────────────────────────────── */
const UploadSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4" />
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/2" />
    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-xl w-2/3" />
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  /* ── Analytics State ── */
  const [analytics, setAnalytics]   = useState(null);
  const [results,   setResults]     = useState([]);
  const [loading,   setLoading]     = useState(true);

  /* ── Resume Upload State ── */
  const [file,       setFile]       = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const fileRef = useRef(null);

  /* ── Job Role Selector ── */
  const [selectedRole,  setSelectedRole]  = useState("");
  const [customRole,    setCustomRole]    = useState("");

  /* ── Pipeline Progress ── */
  const [pipelineStep, setPipelineStep] = useState(0); // 0 = none done

  /* ── Gate: isOnboarded? ── */
  const isOnboarded = currentUser?.isOnboarded === true;

  /* Sync pipeline with onboard state on mount */
  useEffect(() => {
    if (isOnboarded) {
      setPipelineStep(2); // Resume uploaded → steps 1+2 done
      setSelectedRole(currentUser?.preferredRole || JOB_ROLES[0]);
    }
  }, [isOnboarded, currentUser]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, resultsRes] = await Promise.all([
        API.get("/result/analytics").catch(() => ({ data: { analytics: null } })),
        API.get("/result/my-results").catch(() => ({ data: { results: [] } })),
      ]);
      if (analyticsRes.data?.analytics) setAnalytics(analyticsRes.data.analytics);
      if (resultsRes.data?.results)     setResults(resultsRes.data.results);
    } catch {
      toast.error("Failed to load some dashboard data");
    } finally {
      setLoading(false);
    }
  };

  /* ── File Handling ── */
  const validateAndSetFile = (f) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(f.type)) return toast.error("Only PDF or DOCX files are accepted.");
    if (f.size > 5 * 1024 * 1024)  return toast.error("File must be under 5 MB.");
    setFile(f);
  };

  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = ()  => setDragging(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSetFile(dropped);
  };

  /* ── Upload & Auto-Onboard ── */
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a resume file first.");
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const resumeRes = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedSkills    = resumeRes.data?.resume?.skills    || [];
      const extractedLanguages = resumeRes.data?.resume?.languages || [];
      const parsedRole         = currentUser?.preferredRole        || JOB_ROLES[0];

      const onboardRes = await API.post("/user/complete-onboarding", {
        targetRole: parsedRole,
        skills:     extractedSkills,
        languages:  extractedLanguages,
      });

      if (onboardRes.data?.success) {
        updateUser({ isOnboarded: true, skills: extractedSkills, languages: extractedLanguages, preferredRole: parsedRole });
        setSelectedRole(parsedRole);
        setPipelineStep(2);
        toast.success("🎉 Resume analysed! All features are now unlocked.");
        setFile(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ── Find Matches ── */
  const handleFindMatches = () => {
    const role = selectedRole === "Other" ? customRole : selectedRole;
    if (!role.trim()) return toast.info("Please select a target role first.");
    navigate(`/jobs?domain=${encodeURIComponent(role)}`);
  };

  /* ── Pipeline progress % ── */
  const pipelinePercent = isOnboarded
    ? (analytics?.totalTests > 0 ? 100 : 50)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── WELCOME HERO ── */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[40px] p-8 sm:p-12 overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <span className="text-4xl font-black text-white">
                  {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Candidate Workspace
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                  Welcome back, {currentUser?.username?.split(" ")[0]}! 👋
                </h1>
                <div className="flex items-center gap-4 text-blue-100 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><FiMail className="opacity-70" /> {currentUser?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/profile" className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition backdrop-blur-sm shadow-sm flex items-center gap-2">
                <FiUser /> Edit Profile
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            ── MODULE 2: AI JOB MATCHER + CAREER PIPELINE ──
            ══════════════════════════════════════════════════════════ */}
        <section className="grid lg:grid-cols-2 gap-6">

          {/* ── LEFT: AI JOB MATCHER CARD ── */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <FiZap className="text-white" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 dark:text-white">AI Job Matcher</h2>
                <p className="text-xs text-slate-400">Upload → Parse → Match</p>
              </div>
              <div className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isOnboarded
                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnboarded ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {isOnboarded ? "Resume Loaded" : "Awaiting Upload"}
              </div>
            </div>

            {/* ── Drop Zone ── */}
            {!isOnboarded ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !uploading && fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all mb-5 ${
                  dragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.01]"
                    : file
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && validateAndSetFile(e.target.files[0])}
                />
                {uploading ? (
                  <div className="space-y-3">
                    <div className="w-10 h-10 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <UploadSkeleton />
                    <p className="text-sm font-bold text-blue-600">Analysing resume with AI...</p>
                  </div>
                ) : file ? (
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <FiFileText className="text-emerald-600 text-lg" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 dark:text-white text-sm truncate max-w-[180px]">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FiUploadCloud className="text-blue-600 text-xl" />
                    </div>
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Upload PDF or DOCX</p>
                    <p className="text-xs text-slate-400 mt-1">Max size: 5MB</p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl mb-5">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <FiCheckCircle className="text-white" />
                </div>
                <div>
                  <p className="font-black text-emerald-800 dark:text-emerald-200 text-sm">Resume Successfully Parsed</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {(currentUser?.skills || []).length} skills extracted · Role: {currentUser?.preferredRole || "Not set"}
                  </p>
                </div>
              </div>
            )}

            {/* ── Job Role Dropdown ── */}
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Job Role / Target Domain
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => { setSelectedRole(e.target.value); setCustomRole(""); }}
                  disabled={!isOnboarded}
                  className={`w-full px-4 py-3.5 rounded-2xl border appearance-none font-semibold outline-none transition-all ${
                    isOnboarded
                      ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500 cursor-pointer"
                      : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  <option value="" disabled>Select a target role...</option>
                  {JOB_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">▾</div>
                {!isOnboarded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 rounded-2xl backdrop-blur-[1px]">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                      <FiLock /> Upload resume to unlock
                    </div>
                  </div>
                )}
              </div>
              {isOnboarded && selectedRole === "Other" && (
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Blockchain Developer..."
                  className="mt-3 w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-slate-900 dark:text-white text-sm transition"
                />
              )}
            </div>

            {/* ── Actions ── */}
            {!isOnboarded ? (
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 text-sm"
              >
                {uploading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing Resume...</>
                ) : (
                  <><FiUploadCloud /> Analyse & Unlock Features</>
                )}
              </button>
            ) : (
              <button
                onClick={handleFindMatches}
                disabled={!isOnboarded || (!selectedRole.trim())}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <FiZap /> Find My Matches {selectedRole && selectedRole !== "Other" ? `— ${selectedRole}` : ""}
              </button>
            )}
          </div>

          {/* ── RIGHT: CAREER PIPELINE ── */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-40 h-40 bg-violet-400/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-black text-slate-900 dark:text-white">Your Career Pipeline</h2>
                <p className="text-xs text-slate-400 mt-0.5">Progress through each milestone</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-600">{pipelinePercent}%</span>
                <p className="text-xs text-slate-400">Complete</p>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${pipelinePercent}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {PIPELINE_STEPS.map((step, i) => {
                const c       = COLOR_MAP[step.color];
                const done    = isOnboarded && (
                  i === 0 ? true :                        // Resume always done if onboarded
                  i === 1 ? true :                        // Skill analysis done
                  i === 2 ? (analytics?.totalTests > 0) : // interview done if tests taken
                  false
                );
                const active  = !isOnboarded && i === 0;
                return (
                  <div
                    key={step.num}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      done
                        ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5"
                        : active
                        ? "border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10"
                        : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 opacity-50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      done ? "bg-emerald-500" : active ? c.bg : "bg-slate-200 dark:bg-slate-700"
                    }`}>
                      {done
                        ? <FiCheckCircle className="text-white text-lg" />
                        : <step.icon className={done ? "text-white" : active ? "text-white" : "text-slate-400"} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${done ? "text-emerald-500" : active ? "text-blue-500" : "text-slate-400"}`}>
                          {step.num}
                        </span>
                        <p className="font-black text-slate-900 dark:text-white text-sm truncate">{step.label}</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.sub}</p>
                    </div>
                    {done && (
                      <div className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase">
                        Done
                      </div>
                    )}
                    {active && (
                      <div className="shrink-0 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase animate-pulse">
                        Active
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── RESUME UPLOAD GATE (shown only if not onboarded) ── */}
        {!isOnboarded && (
          <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 rounded-[32px] p-8 sm:p-10 border-2 border-dashed border-amber-300 dark:border-amber-500/40 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-widest shrink-0">
                <FiZap className="text-sm" /> Action Required
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                Upload your resume above to unlock <strong>AI Mock Interviews</strong>, <strong>Job Board</strong>, <strong>Resume Analyzer</strong> and all advanced features.
              </p>
            </div>
          </section>
        )}

        {/* ── CORE FEATURES GRID ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">AI Career Tools</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            {!isOnboarded && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <FiLock className="text-sm" /> Upload resume to unlock
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isOnboarded ? (
              <>
                <FeatureCard icon={FiMessageSquare} title="AI Mock Interviews" desc="Practice HR, DSA, MERN & Resume-based rounds with real-time AI scoring and feedback." linkTo="/interview" linkText="Start Interview" colorClasses={{ glow: "bg-blue-500", iconBg: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400", textColor: "text-blue-600 dark:text-blue-400" }} />
                <FeatureCard icon={FiBriefcase} title="Job Board Matches" desc="Discover roles tailored to your exact skillset with AI-calculated match percentages." linkTo="/jobs" linkText="Explore Jobs" colorClasses={{ glow: "bg-emerald-500", iconBg: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400", textColor: "text-emerald-600 dark:text-emerald-400" }} />
                <FeatureCard icon={FiFileText} title="AI Resume Analyzer" desc="Get ATS score, resume feedback, keyword analysis and improvement recommendations." linkTo="/resume-analyzer" linkText="Open Resume Analyzer" colorClasses={{ glow: "bg-violet-500", iconBg: "bg-violet-50 dark:bg-violet-500/10", iconColor: "text-violet-600 dark:text-violet-400", textColor: "text-violet-600 dark:text-violet-400" }} />
              </>
            ) : (
              <>
                <LockedFeatureCard icon={FiMessageSquare} title="AI Mock Interviews" desc="Practice HR, DSA, MERN & Resume-based rounds with real-time AI scoring and feedback." colorClasses={{ glow: "bg-blue-500", iconBg: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400" }} />
                <LockedFeatureCard icon={FiBriefcase} title="Job Board Matches" desc="Discover roles tailored to your exact skillset with AI-calculated match percentages." colorClasses={{ glow: "bg-emerald-500", iconBg: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" }} />
                <LockedFeatureCard icon={FiFileText} title="AI Resume Analyzer" desc="Get ATS score, resume feedback, keyword analysis and improvement recommendations." colorClasses={{ glow: "bg-violet-500", iconBg: "bg-violet-50 dark:bg-violet-500/10", iconColor: "text-violet-600 dark:text-violet-400" }} />
              </>
            )}
          </div>
        </section>

        {/* ── ANALYTICS OVERVIEW ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Performance Overview</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Tests Attempted"  value={analytics?.totalTests   || 0}                     icon={FiBookOpen}   colorClasses={{ iconBg: "bg-blue-50 dark:bg-blue-500/10",    iconColor: "text-blue-600 dark:text-blue-400"   }} />
            <StatCard title="Average Score"    value={`${analytics?.averageScore || 0}/10`}             icon={FiTrendingUp} colorClasses={{ iconBg: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" }} />
            <StatCard title="Highest Score"    value={analytics?.highestScore || 0}                     icon={FiAward}      colorClasses={{ iconBg: "bg-amber-50 dark:bg-amber-500/10",   iconColor: "text-amber-600 dark:text-amber-400"   }} />
            <StatCard title="Overall Accuracy" value={`${analytics?.percentage || 0}%`}                 icon={FiTarget}     colorClasses={{ iconBg: "bg-violet-50 dark:bg-violet-500/10", iconColor: "text-violet-600 dark:text-violet-400"  }} />
          </div>
        </section>

        {/* ── RECENT RESULTS ── */}
        <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recent Mock Tests</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your latest MCQ assessment performances</p>
            </div>
            <Link to="/mock-test" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition">
              Take New Test <FiArrowRight />
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <FiClock className="text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Test History Yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
                Start taking technical and aptitude mock tests to build your performance profile.
              </p>
              <Link to="/mock-test" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-lg shadow-blue-500/20">
                Start First Test
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.slice(0, 5).map((result) => {
                const acc    = Math.round((result.score / result.totalQuestion) * 100);
                const isGood = acc >= 70;
                return (
                  <div key={result._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition bg-slate-50/50 dark:bg-slate-800/20 group">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isGood ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"}`}>
                        {isGood ? <FiCheckCircle className="text-xl" /> : <FiTarget className="text-xl" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
                          {result.testId?.title || "Assessment"}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                          {result.testId?.category || "General"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 sm:gap-10 pl-16 md:pl-0">
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                        <p className="font-black text-slate-900 dark:text-white">{result.score}<span className="text-slate-400 text-sm">/{result.totalQuestion}</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                        <p className={`font-black ${isGood ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{acc}%</p>
                      </div>
                      <Link to={`/result/${result._id}`} className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-slate-800 transition">
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
