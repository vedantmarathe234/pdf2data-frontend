import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";

import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const menus = [
  { name: "Home", icon: HiOutlineHome, path: "/dashboard" },
  { name: "Extractions", icon: HiOutlineCollection, path: "/extractions" },
  { name: "History", icon: HiOutlineClock, path: "/history" },
  { name: "Settings", icon: HiOutlineCog, path: "/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isPathActive = (path) => {
    if (path === "/dashboard") {
      // Chat workspace opened from Dashboard/History should keep Home lit
      return (
        location.pathname === "/dashboard" ||
        location.pathname.startsWith("/chat/")
      );
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-[280px] border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen transition-colors">
      <div className="px-8 py-8 flex items-center gap-3 shrink-0">
        <img
          src={logo}
          alt="Logo"
          className="w-10 h-10 object-contain flex-shrink-0"
        />
        <h1 className="text-[28px] font-bold tracking-tight whitespace-nowrap dark:text-white">
          PDF<span className="text-[#6139ff]">2DATA</span>
        </h1>
      </div>

      <div className="px-4 flex-1 space-y-1 mt-2">
        {menus.map((item, index) => {
          const Icon = item.icon;
          const isActive = isPathActive(item.path);

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-medium
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#6139ff] to-[#805af5] text-white shadow-md shadow-indigo-100/50"
                    : "text-gray-600 dark:text-slate-400 hover:text-[#6139ff] dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
                }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-6 pt-2 shrink-0 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2 pt-4">
          <div className="w-9 h-9 rounded-full bg-[#6139ff] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {(user?.username || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.username || "Guest"}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
              {user?.email || (user?.role === "ROLE_ADMIN" ? "Administrator" : "User")}
            </p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            <HiOutlineLogout size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
