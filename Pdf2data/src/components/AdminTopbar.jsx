import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineChevronDown,
  HiOutlineLogout,
  HiMenuAlt2,
  HiOutlineCog,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const ADMIN_PAGE_META = {
  "/admin": {
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
    <header className="bg-[#121222] border-b border-indigo-950/80 px-4 sm:px-8 py-4 transition-colors sticky top-0 z-30 shadow-md">
      <div className="flex justify-between items-center w-full">
        
        {/* Left Side: Page Title & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-purple-950/40 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            <HiMenuAlt2 size={22} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="hidden sm:block text-xs font-medium text-indigo-300/60 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Theme Toggle & Admin Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Theme Switcher Toggle */}
          <div
            onClick={() => setDark(!dark)}
            className="relative flex items-center w-[58px] sm:w-[64px] h-[30px] sm:h-[34px] rounded-full bg-[#0b0b14] border border-indigo-950 p-1 cursor-pointer transition-colors shadow-inner"
          >
            <div
              className={`absolute top-1 h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-md transition-all duration-200 ${
                dark
                  ? "translate-x-[26px] sm:translate-x-[30px]"
                  : "translate-x-0"
              }`}
            />
            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineSun
                size={14}
                className={!dark ? "text-amber-300" : "text-indigo-400/50"}
              />
            </div>
            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineMoon
                size={14}
                className={dark ? "text-purple-200" : "text-indigo-400/50"}
              />
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-indigo-950 cursor-pointer group"
            >
              {/* Profile Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-purple-500/30 shadow-md shrink-0">
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
                <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                  {user?.username || "Admin"}
                </h4>
                <p className="text-[10px] font-bold text-purple-400 tracking-wider">
                  Administrator
                </p>
              </div>

              <HiOutlineChevronDown
                size={14}
                className="text-indigo-400/60 group-hover:text-purple-300 transition-colors"
              />
            </button>

            {/* Menu Popover */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#121222] border border-indigo-950 rounded-2xl shadow-2xl p-1.5 z-50">
                <div className="px-3 py-2 border-b border-indigo-950/80 mb-1">
                  <p className="text-[10px] font-bold text-indigo-400/50 uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-xs font-semibold text-white truncate mt-0.5">
                    {user?.email || user?.username}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-200 hover:text-white hover:bg-purple-950/40 transition cursor-pointer"
                >
                  <HiOutlineCog size={16} className="text-purple-400" /> Admin Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                >
                  <HiOutlineLogout size={16} /> Log out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}