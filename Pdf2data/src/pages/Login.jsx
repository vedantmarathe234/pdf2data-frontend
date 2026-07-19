import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useState } from "react";
import { loginUser } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const responseData = await loginUser(email, password);

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("username", responseData.username);
      localStorage.setItem("role", responseData.role);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef1ff] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl lg:h-[720px] bg-white rounded-[30px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
        
    
        <div className="relative p-10 flex flex-col justify-between h-full min-h-[300px] lg:min-h-full">
          <div
            className="absolute inset-0 m-4 rounded-[20px]"
            style={{
              background:
                "radial-gradient(circle at 20% 20%,#5ac8ff,transparent 30%),radial-gradient(circle at 50% 40%,#6536ff,transparent 35%),radial-gradient(circle at 80% 10%,#d6e7ff,transparent 30%),linear-gradient(135deg,#147bff,#7145ff,#c9ddff)",
            }}
          ></div>
          <div className="relative z-10"><div className="text-white text-6xl font-bold">PDF2Data</div></div>
          <div className="relative z-10 text-white">
            <p className="text-lg opacity-80">AI powered extraction</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">Extract structured<br />data from PDFs</h1>
            <p className="mt-8 text-lg opacity-90 max-w-sm">OCR, AI extraction, chat with documents, and export to JSON, CSV, Excel & SQL.</p>
          </div>
        </div>

        <div className="p-10 lg:p-10 flex items-center h-full overflow-y-auto">
          <div className="w-full">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in to continue using PDF2Data</p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}

            <form className="mt-8" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
                <div className="mt-1.5 relative">
                  <HiOutlineMail size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-11 rounded-xl border border-gray-200 pl-11 pr-4 text-sm outline-none hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</label>
                <div className="mt-1.5 relative">
                  <HiOutlineLockClosed size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full h-11 rounded-xl border border-gray-200 pl-11 pr-11 text-sm outline-none hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-4 text-xs font-medium">
                <label className="flex items-center cursor-pointer text-gray-600 select-none">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-indigo-600 hover:underline">Forgot password?</a>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="shadow-md mt-6 w-full h-11 rounded-xl bg-indigo-600 text-white font-semibold text-sm transition-all duration-200 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-[0.99]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="my-5 flex items-center">
              <div className="flex-1 h-px bg-gray-200" />
              <p className="mx-3 text-gray-400 text-xs uppercase tracking-wider font-medium">or register with</p>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-center mt-6 text-sm text-gray-500">
              Don't have an account?
              <Link to="/register" className="ml-1.5 text-indigo-600 font-bold hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}