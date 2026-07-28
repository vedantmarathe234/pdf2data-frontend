import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineChevronDown,
  HiOutlineLogout,
  HiMenuAlt2,
  HiOutlineShieldCheck,
  HiOutlineCog,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const ADMIN_PAGE_META = {
  "/admin/dashboard": {
    title: "Admin Overview",
    subtitle: "System analytics & activity monitor",
  },
  "/admin/users": {
    title: "User Management",
    subtitle: "Manage accounts, roles, and permissions",
  },
  "/admin/extractions": {
    title: "Global Extractions",
    subtitle: "System-wide document extraction logs",
  },
  "/settings": {
    title: "Admin Settings",
    subtitle: "System configuration & account preferences",
  },
};

function getAdminPageMeta(pathname) {
  return (
    ADMIN_PAGE_META[pathname] || {
      title: "Admin Control Center",
      subtitle: "System Administration Workspace",
    }
  );
}

export default function AdminTopbar({ dark, setDark, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { title, subtitle } = getAdminPageMeta(location.pathname);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("profilePicture");
    logout();
  };

  return (
    <header className="bg-white dark:bg-[#121215] border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 sm:px-8 py-4 transition-colors sticky top-0 z-30">
      <div className="flex justify-between items-center w-full">
        {/* Left Side: Page Title + Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            <HiMenuAlt2 size={22} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="hidden sm:block text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Dark Mode Toggle & Admin Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle Button */}
          <div
            onClick={() => setDark(!dark)}
            className="relative flex items-center w-[58px] sm:w-[64px] h-[30px] sm:h-[34px] rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 p-1 cursor-pointer transition-colors"
          >
            <div
              className={`absolute top-1 h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] rounded-full bg-white dark:bg-zinc-900 shadow-xs transition-all duration-200 ${
                dark
                  ? "translate-x-[26px] sm:translate-x-[30px]"
                  : "translate-x-0"
              }`}
            />
            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineSun
                size={14}
                className={!dark ? "text-zinc-900" : "text-zinc-400"}
              />
            </div>
            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineMoon
                size={14}
                className={dark ? "text-white" : "text-zinc-400"}
              />
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-zinc-200 dark:border-zinc-800 cursor-pointer group"
            >
              {/* Dynamic Avatar or Initial */}
              <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center overflow-hidden border border-zinc-200/80 dark:border-zinc-800 shadow-xs shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user?.username || "A").charAt(0).toUpperCase()
                )}
              </div>

              <div className="hidden sm:block text-left">
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                  {user?.username || "Admin"}
                </h4>
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                  Admin
                </p>
              </div>

              <HiOutlineChevronDown
                size={14}
                className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition"
              />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-lg p-1.5 z-50">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                    {user?.email || user?.username}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  <HiOutlineCog size={15} /> Admin Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                >
                  <HiOutlineLogout size={15} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}