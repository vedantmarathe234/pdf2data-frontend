import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiEye,
  HiEyeOff,
  HiX,
} from "react-icons/hi";
import { useState } from "react";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      refreshUser();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage({ type: "", text: "" });

    try {
      await api.post("/auth/forgot-password", { email: resetEmail });

      setResetMessage({
        type: "success",
        text: "Password reset link has been sent to your email inbox!",
      });
      setResetEmail("");
    } catch (err) {
      setResetMessage({
        type: "error",
        text:
          err.response?.data?.message || "User with this email was not found.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl lg:h-[720px] bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-[30px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
        <div className="relative p-10 flex flex-col justify-between h-full min-h-[300px] lg:min-h-full">
          <div
            className="absolute inset-0 m-4 rounded-[20px]"
            style={{
              background:
                "radial-gradient(circle at 20% 20%,#3f3f46,transparent 30%),radial-gradient(circle at 50% 40%,#18181b,transparent 35%),radial-gradient(circle at 80% 10%,#52525b,transparent 30%),linear-gradient(135deg,#09090b,#18181b,#27272a)",
            }}
          ></div>
          <div className="relative z-10">
            <div className="text-white text-6xl font-bold">PDF2Data</div>
          </div>
          <div className="relative z-10 text-white">
            <p className="text-lg opacity-80">AI powered extraction</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">
              Extract structured
              <br />
              data from PDFs
            </h1>
            <p className="mt-8 text-lg opacity-90 max-w-sm">
              OCR, AI extraction, chat with documents, and export to JSON, CSV,
              Excel & SQL.
            </p>
          </div>
        </div>

        <div className="p-10 lg:p-10 flex items-center h-full overflow-y-auto">
          <div className="w-full">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
              Sign in to continue using PDF2Data
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}

            <form className="mt-8" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="mt-1.5 relative">
                  <HiOutlineMail
                    size={18}
                    className="absolute left-4 top-3.5 text-zinc-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-4 text-sm outline-none hover:border-zinc-400 dark:hover:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 transition"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="mt-1.5 relative">
                  <HiOutlineLockClosed
                    size={18}
                    className="absolute left-4 top-3.5 text-zinc-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-11 text-sm outline-none hover:border-zinc-400 dark:hover:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 transition"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff size={18} />
                    ) : (
                      <HiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 text-xs font-medium">
                <label className="flex items-center cursor-pointer text-zinc-600 dark:text-zinc-400 select-none">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-500"
                  />
                  <span className="ml-2">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setResetMessage({ type: "", text: "" });
                  }}
                  className="text-zinc-900 dark:text-white font-semibold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="shadow-md mt-6 w-full h-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm transition-all duration-200 hover:bg-zinc-800 dark:hover:bg-white disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 active:scale-[0.99] cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="my-5 flex items-center">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              <p className="mx-3 text-zinc-400 text-xs uppercase tracking-wider font-medium">
                or register with
              </p>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <p className="text-center mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              Don't have an account?
              <Link
                to="/register"
                className="ml-1.5 text-zinc-900 dark:text-white font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Reset Your Password
              </h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
              >
                <HiX size={20} />
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Enter your account's registered email address below. We'll send
              you a link to reset your password.
            </p>

            {resetMessage.text && (
              <div
                className={`p-3 text-xs font-semibold rounded-xl border ${
                  resetMessage.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                }`}
              >
                {resetMessage.text}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Account Email
                </label>
                <div className="mt-1.5 relative">
                  <HiOutlineMail
                    size={18}
                    className="absolute left-4 top-3.5 text-zinc-400"
                  />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-4 text-sm outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? "Sending Link..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
