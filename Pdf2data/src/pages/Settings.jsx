import { HiOutlineMail, HiOutlineUser, HiOutlineShieldCheck, HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="pt-6 pb-10 max-w-2xl">
      <div className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-[24px] p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#6139ff] flex items-center justify-center text-white font-bold text-2xl">
            {(user?.username || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.username}
            </h2>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[#6139ff] text-xs font-semibold">
              <HiOutlineShieldCheck size={13} />
              {user?.role === "ROLE_ADMIN" ? "Administrator" : "User"}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800">
            <HiOutlineUser className="text-gray-400" size={18} />
            <div>
              <p className="text-xs text-gray-500">Username</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.username || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800">
            <HiOutlineMail className="text-gray-400" size={18} />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.email || "—"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition"
        >
          <HiOutlineLogout size={16} /> Log out
        </button>
      </div>
    </div>
  );
}
