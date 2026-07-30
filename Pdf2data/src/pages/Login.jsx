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
import logo from "../assets/pdf2data.png"; 

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
    <div className="min-h-screen bg-[#0b0b14] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl lg:h-[720px] bg-[#121222] border border-indigo-950/50 rounded-[30px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
        
        {/* Left Banner Section */}
        <div className="relative p-10 flex flex-col justify-between h-full min-h-[300px] lg:min-h-full overflow-hidden bg-gradient-to-br from-[#1b153b] via-[#120f24] to-[#0b0b14]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Logo Section (Fixed) */}
          <div className="relative z-10 flex items-center">
            <img
              src={logo}
              alt="PDF2DATA Logo"
              className="h-30 w-auto max-w-[200px] object-contain"
            />
          </div>

          <div className="relative z-10 text-white my-auto py-6">
            <p className="text-purple-400 text-sm font-semibold tracking-wide uppercase">
              AI powered extraction
            </p>
            <h1 className="mt-2 text-4xl lg:text-5xl font-extrabold leading-tight">
              Extract structured
              <br />
              data from PDFs
            </h1>
            <p className="mt-4 text-sm text-indigo-200/80 max-w-sm leading-relaxed">
              OCR, AI extraction, chat with documents, and export to JSON, CSV,
              Excel & SQL.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2.5 mt-6">
              <span className="px-3 py-1 rounded-lg bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs font-semibold">JSON</span>
              <span className="px-3 py-1 rounded-lg bg-teal-900/40 border border-teal-700/50 text-teal-300 text-xs font-semibold">CSV</span>
              <span className="px-3 py-1 rounded-lg bg-orange-900/40 border border-orange-700/50 text-orange-300 text-xs font-semibold">EXCEL</span>
              <span className="px-3 py-1 rounded-lg bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">SQL</span>
            </div>
          </div>

          <div className="relative z-10 text-xs text-indigo-300/60">
            © 2026 PDF2Data. All rights reserved.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-8 lg:p-12 flex items-center h-full overflow-y-auto bg-[#121222]">
          <div className="w-full">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </h2>
            <p className="text-indigo-300/70 mt-1.5 text-xs">
              Sign in to continue using PDF2Data
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-900 text-red-400 text-xs font-medium rounded-xl">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Email
                </label>
                <div className="mt-1.5 relative">
                  <HiOutlineMail
                    size={18}
                    className="absolute left-4 top-3.5 text-indigo-400/60"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-11 rounded-xl border border-indigo-950 bg-[#18182f] text-white placeholder-indigo-400/40 pl-11 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="mt-1.5 relative">
                  <HiOutlineLockClosed
                    size={18}
                    className="absolute left-4 top-3.5 text-indigo-400/60"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full h-11 rounded-xl border border-indigo-950 bg-[#18182f] text-white placeholder-indigo-400/40 pl-11 pr-11 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-indigo-400/60 hover:text-white transition cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-medium pt-1">
                <label className="flex items-center cursor-pointer text-indigo-300/80 select-none">
                  <input
                    type="checkbox"
                    className="rounded border-indigo-900 bg-indigo-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setResetMessage({ type: "", text: "" });
                  }}
                  className="text-purple-400 font-semibold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 shadow-lg shadow-purple-600/30 active:scale-[0.99] cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="my-5 flex items-center">
              <div className="flex-1 h-px bg-indigo-950" />
              <p className="mx-3 text-indigo-400/50 text-[11px] uppercase tracking-wider font-semibold">
                or register with
              </p>
              <div className="flex-1 h-px bg-indigo-950" />
            </div>

            <p className="text-center text-xs text-indigo-300/70">
              Don't have an account?
              <Link
                to="/register"
                className="ml-1.5 text-purple-400 font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#151528] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-indigo-950 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Reset Your Password
              </h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1.5 rounded-full text-indigo-400 hover:text-white transition cursor-pointer"
              >
                <HiX size={20} />
              </button>
            </div>

            <p className="text-xs text-indigo-300/70 leading-relaxed">
              Enter your account's registered email address below. We'll send
              you a link to reset your password.
            </p>

            {resetMessage.text && (
              <div
                className={`p-3 text-xs font-semibold rounded-xl border ${
                  resetMessage.type === "success"
                    ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                    : "bg-red-950/40 border-red-800 text-red-400"
                }`}
              >
                {resetMessage.text}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Account Email
                </label>
                <div className="mt-1.5 relative">
                  <HiOutlineMail
                    size={18}
                    className="absolute left-4 top-3.5 text-indigo-400/60"
                  />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-11 rounded-xl border border-indigo-950 bg-[#1c1c38] text-white placeholder-indigo-400/40 pl-11 pr-4 text-sm outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-indigo-950 text-xs font-semibold text-indigo-300 hover:bg-[#1c1c38] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
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