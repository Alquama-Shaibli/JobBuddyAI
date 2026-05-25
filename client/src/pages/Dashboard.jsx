import React, { useEffect, useState } from "react";

import {
  FiBookOpen,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import API from "../api/axios";

import { toast } from "react-toastify";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // FETCH ANALYTICS
      const analyticsRes = await API.get("/result/analytics");

      // FETCH RECENT RESULTS
      const resultsRes = await API.get("/result/my-results");

      setAnalytics(analyticsRes.data.analytics);

      setResults(resultsRes.data.results);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Track your interview preparation, mock test performance, and overall
            progress.
          </p>
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* TOTAL TESTS */}
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Tests
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics?.totalTests || 0}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 text-2xl">
                <FiBookOpen />
              </div>
            </div>
          </div>

          {/* AVERAGE SCORE */}
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Score
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics?.averageScore || 0}/10
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 text-2xl">
                <FiTrendingUp />
              </div>
            </div>
          </div>

          {/* HIGHEST SCORE */}
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Highest Score
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics?.highestScore || 0}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 text-2xl">
                <FiAward />
              </div>
            </div>
          </div>

          {/* ACCURACY */}
          <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Accuracy
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics?.percentage || 0}%
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 text-2xl">
                <FiTarget />
              </div>
            </div>
          </div>
        </div>

        {/* AI FEATURES */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* MOCK Interview History */}

          {/* MOCK INTERVIEW */}
          <div
            className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 hover:border-blue-500 transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              AI Mock Interview
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Practice HR, DSA, MERN and Resume interviews with AI feedback.
            </p>

            <div className="flex items-center justify-between text-blue-600 font-semibold">
              <Link to={'/interview'} className="flex items-center gap-2">
                Start Interview
                <FiArrowRight />
              </Link>
              <div className="">
                <Link
                  to="/interview-history"
                  className="px-6 py-3 rounded-2xl bg-gray-900 text-white"
                >
                  View History
                </Link>
              </div>
            </div>
          </div>

          <Link
            to="/ai-chat"
            className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 hover:border-purple-500 transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              AI Career Assistant
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get AI help for resumes, interviews, jobs, and career guidance.
            </p>

            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              Open Assistant
              <FiArrowRight />
            </div>
          </Link>

          {/* MOCK TEST */}
          <Link
            to="/mock-tests"
            className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 hover:border-green-500 transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Mock Tests
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Attempt MCQ based aptitude and technical mock tests.
            </p>

            <div className="flex items-center gap-2 text-green-600 font-semibold">
              Start Test
              <FiArrowRight />
            </div>
          </Link>
        </div>

        {/* RECENT RESULTS */}
        <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Results
              </h2>

              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Your latest mock test performances.
              </p>
            </div>

            <Link
              to="/mock-tests"
              className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
            >
              Take New Test
              <FiArrowRight />
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                No Results Yet
              </h3>

              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Start attempting mock tests to track your performance.
              </p>

              <Link
                to="/mock-tests"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Start Mock Test
                <FiArrowRight />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {results.slice(0, 5).map((result) => {
                const percentage = Math.round(
                  (result.score / result.totalQuestion) * 100,
                );

                return (
                  <div
                    key={result._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-blue-500 transition"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {result.testId?.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {result.testId?.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Score
                        </p>

                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {result.score}/{result.totalQuestion}
                        </h4>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Accuracy
                        </p>

                        <h4 className="text-xl font-bold text-blue-600">
                          {percentage}%
                        </h4>
                      </div>

                      <Link
                        to={`/result/${result._id}`}
                        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
