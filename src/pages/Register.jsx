import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineKey,
  HiEye,
  HiEyeOff,
  HiOutlineArrowLeft,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi";
import { useState, useEffect } from "react";
import { registerUser } from "../services/auth";
import logo from "../assets/pdf2data.png";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const role = isAdminRoute ? "ADMIN" : "USER";

    try {
      await registerUser(
        username,
        email,
        password,
        role,
        isAdminRoute ? adminSecretKey : "",
      );
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0b14] flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-6xl lg:h-[720px] bg-white dark:bg-[#121222] border border-slate-200 dark:border-indigo-950/50 rounded-[30px] shadow-2xl shadow-slate-300/40 dark:shadow-black/60 overflow-hidden grid lg:grid-cols-2 transition-colors duration-200">
    
        <div className="relative p-10 flex flex-col justify-between h-full min-h-[300px] lg:min-h-full overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 dark:from-[#1b153b] dark:via-[#120f24] dark:to-[#0b0b14]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute -left-10 -top-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

  
          <div className="relative z-10 flex items-center">
            <img
              src={logo}
              alt="PDF2DATA Logo"
              className="h-28 w-auto max-w-[200px] object-contain drop-shadow-md"
            />
          </div>

          <div className="relative z-10 text-white my-auto py-6">
            <p className="text-purple-300 dark:text-purple-400 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              {isAdminRoute ? "Admin Operations Portal" : "AI powered extraction"}
            </p>
            <h1 className="mt-2 text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              {isAdminRoute
                ? "System Admin\nAccess Control"
                : "Extract structured\ndata from PDFs"}
            </h1>
            <p className="mt-4 text-sm text-indigo-100/90 dark:text-indigo-200/80 max-w-sm leading-relaxed">
              OCR, AI extraction, chat with documents, and export to JSON, CSV,
              Excel & SQL.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-6">
              <span className="px-3 py-1 rounded-lg bg-purple-900/50 border border-purple-700/60 text-purple-200 text-xs font-semibold">JSON</span>
              <span className="px-3 py-1 rounded-lg bg-teal-900/50 border border-teal-700/60 text-teal-200 text-xs font-semibold">CSV</span>
              <span className="px-3 py-1 rounded-lg bg-orange-900/50 border border-orange-700/60 text-orange-200 text-xs font-semibold">EXCEL</span>
              <span className="px-3 py-1 rounded-lg bg-indigo-900/50 border border-indigo-700/60 text-indigo-200 text-xs font-semibold">SQL</span>
            </div>
          </div>

          <div className="relative z-10 text-xs text-indigo-200/60">
            2026 PDF2Data.
          </div>
        </div>

      
        <div className="p-8 lg:p-12 flex flex-col justify-between h-full overflow-y-auto bg-white dark:bg-[#121222] transition-colors duration-200">
          <div className="w-full py-2">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-indigo-300/70 dark:hover:text-white transition group"
              >
                <HiOutlineArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>

            
              <div
                onClick={() => setDark(!dark)}
                className="relative flex items-center w-[58px] sm:w-[64px] h-[30px] sm:h-[34px] rounded-full bg-slate-100 dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 p-1 cursor-pointer transition-colors"
                title="Toggle Theme"
              >
                <div
                  className={`absolute top-1 h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] rounded-full bg-white dark:bg-gradient-to-br dark:from-[#8B5CF6] dark:to-[#EC4899] shadow-md transition-all duration-200 ${
                    dark
                      ? "translate-x-[26px] sm:translate-x-[30px]"
                      : "translate-x-0"
                  }`}
                />
                <div className="relative z-10 flex-1 flex justify-center">
                  <HiOutlineSun
                    size={14}
                    className={!dark ? "text-slate-900 font-bold" : "text-indigo-400/50"}
                  />
                </div>
                <div className="relative z-10 flex-1 flex justify-center">
                  <HiOutlineMoon
                    size={14}
                    className={dark ? "text-white font-bold" : "text-slate-400"}
                  />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isAdminRoute ? "Admin Registration" : "Create Account"}
            </h2>
            <p className="text-slate-500 dark:text-indigo-300/70 mt-1 text-xs">
              {isAdminRoute
                ? "Enter your master secret key to create an administrator profile"
                : "Get started with your free PDF2Data account"}
            </p>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400 text-xs font-medium rounded-xl">
                {error}
              </div>
            )}

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-indigo-300 uppercase tracking-wider">
                  Username
                </label>
                <div className="mt-1 relative">
                  <HiOutlineUser
                    size={18}
                    className="absolute left-4 top-3 text-slate-400 dark:text-indigo-400/60"
                  />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="example"
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-indigo-950 bg-slate-50 dark:bg-[#18182f] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-400/40 pl-11 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-indigo-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <HiOutlineMail
                    size={18}
                    className="absolute left-4 top-3 text-slate-400 dark:text-indigo-400/60"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-indigo-950 bg-slate-50 dark:bg-[#18182f] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-400/40 pl-11 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-indigo-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="mt-1 relative">
                  <HiOutlineLockClosed
                    size={18}
                    className="absolute left-4 top-3 text-slate-400 dark:text-indigo-400/60"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-indigo-950 bg-slate-50 dark:bg-[#18182f] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-400/40 pl-11 pr-11 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3 text-slate-400 dark:text-indigo-400/60 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </div>

              {isAdminRoute && (
                <div>
                  <label className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Admin Secret Key
                  </label>
                  <div className="mt-1 relative">
                    <HiOutlineKey
                      size={18}
                      className="absolute left-4 top-3 text-red-500 dark:text-red-400"
                    />
                    <input
                      type="password"
                      required
                      placeholder="Master Key"
                      value={adminSecretKey}
                      onChange={(e) => setAdminSecretKey(e.target.value)}
                      className="w-full h-10 rounded-xl border border-red-200 dark:border-red-900/50 bg-slate-50 dark:bg-[#18182f] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-indigo-400/40 pl-11 pr-4 text-sm outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center pt-1 text-xs font-medium">
                <label className="flex items-center cursor-pointer text-slate-600 dark:text-indigo-300/80 select-none">
                  <input
                    type="checkbox"
                    required
                    className="rounded border-slate-300 dark:border-indigo-900 bg-slate-100 dark:bg-indigo-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2">
                    I agree to the Terms & Conditions
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 shadow-lg shadow-purple-600/30 active:scale-[0.99] cursor-pointer"
              >
                {loading
                  ? "Creating Account..."
                  : isAdminRoute
                    ? "Register Administrator"
                    : "Sign Up"}
              </button>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-1 h-px bg-slate-200 dark:bg-indigo-950" />
              <p className="mx-3 text-slate-400 dark:text-indigo-400/50 text-[11px] uppercase tracking-wider font-semibold">
                or continue with
              </p>
              <div className="flex-1 h-px bg-slate-200 dark:bg-indigo-950" />
            </div>

            <p className="text-center text-xs text-slate-600 dark:text-indigo-300/70">
              Already have an account?
              <Link
                to="/login"
                className="ml-1.5 text-purple-600 dark:text-purple-400 font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}