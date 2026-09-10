import React, { useState } from "react";
import { HiOutlineLockClosed, HiOutlineX } from "react-icons/hi";
import { changePassword } from "../services/auth";
import { useToast } from "../context/ToastContext";

export default function ChangePasswordModal({ open, onClose }) {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1635] border border-gray-200 dark:border-[#332C57] rounded-2xl p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-[#251F47] text-[#7C3AED] dark:text-[#C084FC]">
              <HiOutlineLockClosed size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1B4B] dark:text-white">
                Change Password
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#A5A1C4]">
                Update your account login password
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-xl transition cursor-pointer"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-600 dark:text-[#A5A1C4] mb-1 uppercase tracking-wider text-[11px]">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] text-gray-900 dark:text-white outline-none focus:border-[#8B5CF6] transition"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-600 dark:text-[#A5A1C4] mb-1 uppercase tracking-wider text-[11px]">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] text-gray-900 dark:text-white outline-none focus:border-[#8B5CF6] transition"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-600 dark:text-[#A5A1C4] mb-1 uppercase tracking-wider text-[11px]">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] text-gray-900 dark:text-white outline-none focus:border-[#8B5CF6] transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-[#A5A1C4] hover:bg-gray-100 dark:hover:bg-[#251F47] font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-xs"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}