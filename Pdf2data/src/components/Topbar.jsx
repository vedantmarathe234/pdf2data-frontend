import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const PAGE_META = {
  "/dashboard": { title: "Home", subtitle: "Dashboard" },
  "/extractions": { title: "Extractions", subtitle: "All processed documents" },
  "/history": { title: "History", subtitle: "Your chat sessions" },
  "/settings": { title: "Settings", subtitle: "Account & preferences" },
};

function getPageMeta(pathname) {
  if (pathname.startsWith("/chat/")) {
    return { title: "Chat", subtitle: "Document conversation" };
  }
  return PAGE_META[pathname] || { title: "PDF2DATA", subtitle: "" };
}

export default function Topbar({ dark, setDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { title, subtitle } = getPageMeta(location.pathname);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center dark:bg-slate-900 p-8 transition-colors border-b border-gray-300 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div
            onClick={() => setDark(!dark)}
            className="relative flex items-center w-[74px] h-[38px] rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-1 cursor-pointer"
          >
            <div
              className={`absolute top-1 h-[30px] w-[30px] rounded-full bg-gray-100 dark:bg-slate-700 shadow-sm transition-all duration-300 ${
                dark ? "translate-x-[34px]" : "translate-x-0"
              }`}
            />

            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineSun
                size={18}
                className={!dark ? "text-gray-900" : "text-gray-400"}
              />
            </div>

            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineMoon
                size={18}
                className={dark ? "text-white" : "text-gray-400"}
              />
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#6139ff] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {(user?.username || "?").charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {user?.username || "Guest"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === "ROLE_ADMIN" ? "Administrator" : "User"}
                </p>
              </div>
              <HiOutlineChevronDown size={16} className="text-gray-400 ml-1" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  <HiOutlineUser size={16} /> Account Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <HiOutlineLogout size={16} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
