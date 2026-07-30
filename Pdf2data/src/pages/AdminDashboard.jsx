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
    <div className="min-h-screen bg-[#0b0b14] text-white p-6 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-indigo-950/60">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Admin Overview
            </h1>
            <p className="text-xs text-indigo-300/70 mt-1">
              Real-time analytics and quick system navigation
            </p>
          </div>

          <button
            onClick={loadStats}
            title="Refresh Stats"
            className="p-3 rounded-xl bg-[#121222] border border-indigo-950 text-indigo-300 hover:text-white hover:border-purple-500/50 transition duration-200 cursor-pointer shadow-lg shadow-purple-950/20 active:scale-95"
          >
            <HiOutlineRefresh size={18} className={loading ? "animate-spin text-purple-400" : ""} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-950/50 border border-red-900/80 text-red-400 text-xs font-medium rounded-2xl shadow-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Card 1: Total Users */}
          <div className="p-6 bg-[#121222] rounded-3xl border border-indigo-950/80 shadow-xl hover:border-purple-500/30 transition duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition duration-500"></div>

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
                <HiOutlineUsers size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-300/60 uppercase tracking-wider">
                  Total Users
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {loading ? "..." : stats.totalUsers}
                </h3>
              </div>
            </div>

            <Link
              to="/admin/users"
              className="flex items-center justify-between pt-4 border-t border-indigo-950/80 text-xs font-bold text-purple-400 hover:text-purple-300 transition relative z-10"
            >
              <span>View All Users</span>
              <HiOutlineArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Extractions Today */}
          <div className="p-6 bg-[#121222] rounded-3xl border border-indigo-950/80 shadow-xl hover:border-indigo-500/30 transition duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition duration-500"></div>

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                <HiOutlineDocumentText size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-300/60 uppercase tracking-wider">
                  Extractions Today
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {loading ? "..." : stats.extractionsToday}
                </h3>
              </div>
            </div>

            <Link
              to="/admin/extractions"
              className="flex items-center justify-between pt-4 border-t border-indigo-950/80 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition relative z-10"
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