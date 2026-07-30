import React, { useEffect, useState } from "react";
import { fetchAdminUsers } from "../services/adminService";
import {
  HiOutlineSearch,
  HiOutlineDocumentDuplicate,
  HiOutlineRefresh,
} from "react-icons/hi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white p-6 sm:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-indigo-950/60">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              User Accounts
            </h1>
            <p className="text-xs text-indigo-300/70 mt-1">
              Registered platform accounts and total documents extracted per account
            </p>
          </div>

          <button
            onClick={loadUsers}
            title="Refresh Users"
            className="p-3 rounded-xl bg-[#121222] border border-indigo-950 text-indigo-300 hover:text-white hover:border-purple-500/50 transition duration-200 cursor-pointer shadow-lg shadow-purple-950/20 active:scale-95 self-start sm:self-auto"
          >
            <HiOutlineRefresh
              size={18}
              className={loading ? "animate-spin text-purple-400" : ""}
            />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <HiOutlineSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400/60"
          />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 rounded-2xl border border-indigo-950 bg-[#121222] pl-10 pr-4 text-xs font-medium text-white placeholder-indigo-400/40 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition shadow-xl"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-950/50 border border-red-900/80 text-red-400 text-xs font-medium rounded-2xl">
            {error}
          </div>
        )}

        {/* User Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-indigo-300/50 bg-[#121222] rounded-3xl border border-indigo-950/80">
              Loading user list...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-indigo-300/50 bg-[#121222] rounded-3xl border border-indigo-950/80">
              No users found.
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-5 bg-[#121222] rounded-3xl border border-indigo-950/80 shadow-xl flex items-center justify-between gap-4 hover:border-purple-500/40 transition duration-200 group"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 uppercase shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    {u.username?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {u.username}
                    </h3>
                    <p className="text-xs text-indigo-300/60 truncate mt-0.5">{u.email}</p>
                  </div>
                </div>

                {/* Extraction Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#17172c] border border-indigo-900/60 shrink-0">
                  <HiOutlineDocumentDuplicate
                    size={16}
                    className="text-purple-400"
                  />
                  <span className="text-xs font-bold text-indigo-200">
                    {u.extractionCount || 0} Documents
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}