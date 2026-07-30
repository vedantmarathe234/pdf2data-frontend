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
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#332C57]">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              User Accounts
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-1">
              Registered platform accounts and total documents extracted per account
            </p>
          </div>

          <button
            onClick={loadUsers}
            title="Refresh Users"
            className="p-3 rounded-2xl bg-white dark:bg-[#1E1A3B] border border-gray-200 dark:border-[#332C57] text-gray-600 dark:text-[#A5A1C4] hover:text-[#8B5CF6] dark:hover:text-white hover:border-[#8B5CF6]/50 transition duration-200 cursor-pointer shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <HiOutlineRefresh
              size={18}
              className={loading ? "animate-spin text-[#8B5CF6]" : ""}
            />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <HiOutlineSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#A5A1C4]/60"
          />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 rounded-2xl border border-gray-200 dark:border-[#332C57] bg-white dark:bg-[#1E1A3B] pl-10 pr-4 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#A5A1C4]/40 outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition shadow-xs"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-medium rounded-2xl shadow-xs">
            {error}
          </div>
        )}

        {/* User Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-400 dark:text-[#A5A1C4]/50 bg-white dark:bg-[#1E1A3B] rounded-3xl border border-gray-200 dark:border-[#332C57]">
              Loading user list...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400 dark:text-[#A5A1C4]/50 bg-white dark:bg-[#1E1A3B] rounded-3xl border border-gray-200 dark:border-[#332C57]">
              No users found.
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-5 bg-white dark:bg-[#1E1A3B] rounded-3xl border border-gray-200 dark:border-[#332C57] shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center justify-between gap-4 hover:border-[#8B5CF6]/40 transition duration-200 group"
              >
                {/* User Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-[#251F47] border border-purple-200 dark:border-[#3D3868] flex items-center justify-center font-bold text-[#8B5CF6] dark:text-[#C084FC] uppercase shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                    {u.username?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#8B5CF6] dark:group-hover:text-[#C084FC] transition-colors">
                      {u.username}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-[#A5A1C4]/70 truncate mt-0.5">
                      {u.email}
                    </p>
                  </div>
                </div>

                {/* Extraction Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 dark:bg-[#251F47] border border-purple-200 dark:border-[#3D3868] shrink-0">
                  <HiOutlineDocumentDuplicate
                    size={16}
                    className="text-[#8B5CF6] dark:text-[#C084FC]"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-[#E9E7F5]">
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