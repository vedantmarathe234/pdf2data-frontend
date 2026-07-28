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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            User Accounts
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Registered platform accounts and total documents extracted per
            account
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <HiOutlineRefresh
            size={16}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      <div className="relative max-w-md">
        <HiOutlineSearch
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] pl-10 pr-4 text-xs font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 shadow-xs"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            Loading user list...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            No users found.
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              className="p-5 bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200 uppercase shrink-0">
                  {u.username?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                    {u.username}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/50 shrink-0">
                <HiOutlineDocumentDuplicate
                  size={16}
                  className="text-zinc-500"
                />
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {u.extractionCount || 0} Documents
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
