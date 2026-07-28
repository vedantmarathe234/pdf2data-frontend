import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineKey,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { useState } from "react";
import { registerUser } from "../services/auth";

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
    <div className="min-h-screen bg-zinc-100 dark:bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl lg:h-[720px] bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-[30px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
        {/* Left Visual Card */}
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
            <p className="text-lg opacity-80">
              {isAdminRoute
                ? "Admin Operations Portal"
                : "AI powered extraction"}
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">
              {isAdminRoute
                ? "System Admin\nAccess Control"
                : "Extract structured\ndata from PDFs"}
            </h1>
            <p className="mt-8 text-lg opacity-90 max-w-sm">
              OCR, AI extraction, chat with documents, and export to JSON, CSV,
              Excel & SQL.
            </p>
          </div>
        </div>

        <div className="p-10 lg:p-10 flex items-center h-full overflow-y-auto">
          <div className="w-full py-4">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {isAdminRoute ? "Admin Registration" : "Create Account"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
              {isAdminRoute
                ? "Enter your master secret key to create an administrator profile"
                : "Get started with your free PDF2Data portfolio profile"}
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}

            <form className="mt-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Username
                </label>
                <div className="mt-1.5 relative">
                  <HiOutlineUser
                    size={18}
                    className="absolute left-4 top-3.5 text-zinc-400"
                  />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="example"
                    className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-4 text-sm outline-none hover:border-zinc-400 dark:hover:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Email Address
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
                    className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-4 text-sm outline-none hover:border-zinc-400 dark:hover:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800"
                  />
                </div>
              </div>

              <div className="mt-3">
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
                    className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-11 text-sm outline-none hover:border-zinc-400 dark:hover:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
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

              {isAdminRoute && (
                <div className="mt-3">
                  <label className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Admin Secret Key
                  </label>
                  <div className="mt-1.5 relative">
                    <HiOutlineKey
                      size={18}
                      className="absolute left-4 top-3.5 text-red-400"
                    />
                    <input
                      type="password"
                      required
                      placeholder="Master Key"
                      value={adminSecretKey}
                      onChange={(e) => setAdminSecretKey(e.target.value)}
                      className="w-full h-11 rounded-xl border border-red-200 dark:border-red-900/50 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white placeholder-zinc-400 pl-11 pr-4 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center mt-4 text-xs font-medium">
                <label className="flex items-center cursor-pointer text-zinc-600 dark:text-zinc-400 select-none">
                  <input
                    type="checkbox"
                    required
                    className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-500"
                  />
                  <span className="ml-2">
                    I agree to the Terms & Conditions
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full h-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm transition-all duration-200 hover:bg-zinc-800 dark:hover:bg-white disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 active:scale-[0.99] cursor-pointer"
              >
                {loading
                  ? "Creating Account..."
                  : isAdminRoute
                    ? "Register Administrator"
                    : "Sign Up"}
              </button>
            </form>

            <div className="my-5 flex items-center">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              <p className="mx-3 text-zinc-400 text-xs uppercase tracking-wider font-medium">
                or continue with
              </p>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <p className="text-center mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?
              <Link
                to="/login"
                className="ml-1.5 text-zinc-900 dark:text-white font-bold hover:underline"
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
