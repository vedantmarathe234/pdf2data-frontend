import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import api from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage({
        type: "success",
        text: "Password reset successful! Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid or expired token.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] dark:bg-[#0B0A10] text-[#2D2A4A] dark:text-[#E9E7F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1635] border border-[#E2E8F0] dark:border-[#332C57] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] dark:text-white">
            Set New Password
          </h2>
          <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-1">
            Please enter your new password below.
          </p>
        </div>

        {message.text && (
          <div
            className={`p-3 text-xs font-semibold rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-[#A5A1C4] uppercase tracking-wider">
              New Password
            </label>
            <div className="mt-1.5 relative">
              <HiOutlineLockClosed
                size={18}
                className="absolute left-4 top-3.5 text-gray-400 dark:text-[#A5A1C4]"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="•••••••••"
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#A5A1C4]/60 pl-11 pr-11 text-sm outline-none focus:border-[#8B5CF6] transition"
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-[#E9E7F5] transition cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-[#A5A1C4] uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="mt-1.5 relative">
              <HiOutlineLockClosed
                size={18}
                className="absolute left-4 top-3.5 text-gray-400 dark:text-[#A5A1C4]"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="•••••••••"
                className="w-full h-11 rounded-xl border border-gray-200 dark:border-[#332C57] bg-gray-50 dark:bg-[#251F47] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#A5A1C4]/60 pl-11 pr-4 text-sm outline-none focus:border-[#8B5CF6] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-semibold text-gray-500 dark:text-[#A5A1C4] hover:text-[#1E1B4B] dark:hover:text-white transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}