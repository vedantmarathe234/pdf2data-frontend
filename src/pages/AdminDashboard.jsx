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
    <div >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-[#332C57]">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Admin Overview
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-1">
              Real-time analytics and quick system navigation
            </p>
          </div>

          <button
            onClick={loadStats}
            title="Refresh Stats"
            className="p-3 rounded-2xl bg-white dark:bg-[#1E1A3B] border border-gray-200 dark:border-[#332C57] text-gray-600 dark:text-[#A5A1C4] hover:text-[#8B5CF6] dark:hover:text-white hover:border-[#8B5CF6]/50 transition duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            <HiOutlineRefresh size={18} className={loading ? "animate-spin text-[#8B5CF6]" : ""} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-medium rounded-2xl shadow-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Card 1: Total Users */}
          <div className="p-6 bg-white dark:bg-[#1E1A3B] rounded-3xl border border-gray-200 dark:border-[#332C57] shadow-lg shadow-gray-200/50 dark:shadow-none hover:border-[#8B5CF6]/40 transition duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition duration-500" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-[#251F47] border border-purple-200 dark:border-[#3D3868] flex items-center justify-center text-[#8B5CF6] shrink-0 shadow-inner">
                <HiOutlineUsers size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-[#A5A1C4]/70 uppercase tracking-wider">
                  Total Users
                </p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {loading ? "..." : stats.totalUsers}
                </h3>
              </div>
            </div>

            <Link
              to="/admin/users"
              className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#332C57] text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] dark:hover:text-[#C084FC] transition relative z-10"
            >
              <span>View All Users</span>
              <HiOutlineArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Extractions Today */}
          <div className="p-6 bg-white dark:bg-[#1E1A3B] rounded-3xl border border-gray-200 dark:border-[#332C57] shadow-lg shadow-gray-200/50 dark:shadow-none hover:border-[#EC4899]/40 transition duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition duration-500" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-[#251F47] border border-pink-200 dark:border-[#3D3868] flex items-center justify-center text-pink-500 dark:text-[#EC4899] shrink-0 shadow-inner">
                <HiOutlineDocumentText size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-[#A5A1C4]/70 uppercase tracking-wider">
                  Extractions Today
                </p>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {loading ? "..." : stats.extractionsToday}
                </h3>
              </div>
            </div>

            <Link
              to="/admin/extractions"
              className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#332C57] text-xs font-bold text-pink-500 hover:text-pink-600 dark:text-[#EC4899] dark:hover:text-[#F472B6] transition relative z-10"
            >
              <span>View All Extractions</span>
              <HiOutlineArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}