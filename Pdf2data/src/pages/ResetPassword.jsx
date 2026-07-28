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
    <div className="min-h-screen bg-zinc-100 dark:bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Set New Password
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
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
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              New Password
            </label>
            <div className="mt-1.5 relative">
              <HiOutlineLockClosed
                size={18}
                className="absolute left-4 top-3.5 text-zinc-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="•••••••••"
                className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-11 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition"
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="mt-1.5 relative">
              <HiOutlineLockClosed
                size={18}
                className="absolute left-4 top-3.5 text-zinc-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="•••••••••"
                className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-4 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm transition-all duration-200 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}