import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAdminStats } from "../services/adminService";
import {
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineRefresh,
  HiOutlineArrowRight,
} from "react-icons/hi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, extractionsToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Admin Overview
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time analytics and quick system navigation
          </p>
        </div>

        <button
          onClick={loadStats}
          className="p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer shadow-xs"
        >
          <HiOutlineRefresh size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
              <HiOutlineUsers size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
                {loading ? "..." : stats.totalUsers}
              </h3>
            </div>
          </div>

          <Link
            to="/admin/users"
            className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white hover:underline"
          >
            <span>View All Users</span>
            <HiOutlineArrowRight size={16} />
          </Link>
        </div>

        <div className="p-6 bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white shrink-0">
              <HiOutlineDocumentText size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Extractions Today
              </p>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
                {loading ? "..." : stats.extractionsToday}
              </h3>
            </div>
          </div>

          <Link
            to="/admin/extractions"
            className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white hover:underline"
          >
            <span>View All Extractions</span>
            <HiOutlineArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}