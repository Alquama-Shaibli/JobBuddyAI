// ResumeAnalyzer.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiTarget,
  FiBriefcase,
} from "react-icons/fi";
import API from "../api/axios";

const ResumeAnalyzer = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);

      const res = await API.post(
        "resume/analyze",
        {
          withCredentials: true,
        }
      );

      setAnalysis(res.data.analysis);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <h1 className="text-white text-2xl animate-pulse">
          Analyzing Resume...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">
            AI Resume Analyzer
          </h1>

          <p className="text-gray-400 text-lg">
            Improve your ATS score and get better job matches.
          </p>
        </div>

        {/* ATS SCORE */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-[#1e293b] rounded-3xl p-8 shadow-lg border border-slate-700">
            <h2 className="text-2xl font-semibold mb-6">
              ATS Score
            </h2>

            <div className="flex items-center gap-6">

              <div className="w-40 h-40 rounded-full border-[10px] border-green-500 flex items-center justify-center">
                <span className="text-5xl font-bold">
                  {analysis?.ats_score}%
                </span>
              </div>

              <div>
                <p className="text-gray-300 text-lg leading-8">
                  Your resume is optimized for modern ATS systems.
                </p>

                <div className="mt-4">
                  <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                    Strong Resume
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-[#1e293b] rounded-3xl p-8 shadow-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-5">
              <FiTrendingUp className="text-3xl text-cyan-400" />
              <h2 className="text-2xl font-semibold">
                Resume Summary
              </h2>
            </div>

            <p className="text-gray-300 leading-8 text-lg">
              {analysis?.resume_summary}
            </p>
          </div>
        </div>

        {/* STRENGTHS + WEAKNESSES */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* STRENGTHS */}
          <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <FiCheckCircle className="text-3xl text-green-400" />
              <h2 className="text-2xl font-semibold">
                Strengths
              </h2>
            </div>

            <div className="space-y-4">
              {analysis?.strengths?.map((item, index) => (
                <div
                  key={index}
                  className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl"
                >
                  <p className="text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WEAKNESSES */}
          <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <FiAlertCircle className="text-3xl text-red-400" />
              <h2 className="text-2xl font-semibold">
                Weaknesses
              </h2>
            </div>

            <div className="space-y-4">
              {analysis?.weaknesses?.map((item, index) => (
                <div
                  key={index}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
                >
                  <p className="text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MISSING SKILLS */}
        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiTarget className="text-3xl text-yellow-400" />
            <h2 className="text-2xl font-semibold">
              Missing Skills
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {analysis?.missing_skills?.map((skill, index) => (
              <div
                key={index}
                className="bg-yellow-500/10 border border-yellow-500/30 px-5 py-3 rounded-full"
              >
                <span className="text-yellow-300 font-medium">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDED ROLES */}
        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FiBriefcase className="text-3xl text-cyan-400" />
            <h2 className="text-2xl font-semibold">
              Recommended Roles
            </h2>
          </div>

          <div className="space-y-6">
            {analysis?.recommended_roles?.map((role, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium">
                    {role.role}
                  </h3>

                  <span className="text-cyan-400 font-semibold">
                    {role.match_percentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{
                      width: `${role.match_percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IMPROVEMENT SUGGESTIONS */}
        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-6">
            Improvement Suggestions
          </h2>

          <div className="space-y-4">
            {analysis?.improvement_suggestions?.map((tip, index) => (
              <div
                key={index}
                className="bg-cyan-500/10 border border-cyan-500/20 p-5 rounded-xl"
              >
                <p className="text-gray-200 leading-7">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeAnalyzer;