import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineLogout,
  HiMenuAlt2,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const PAGE_META = {
  "/dashboard": {
    title: "Home",
    subtitle: "Overview & quick extraction hub",
  },
  "/extractions": {
    title: "Extractions",
    subtitle: "View and manage all processed documents",
  },
  "/extractions/new": {
    title: "New Extraction",
    subtitle: "Upload a PDF or image to extract structured data",
  },
  "/history": {
    title: "Chat History",
    subtitle: "Revisit your past document conversations",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Account, security & application preferences",
  },
  "/settings/profile": {
    title: "Profile Settings",
    subtitle: "Manage your personal information and avatar",
  },
  "/settings/security": {
    title: "Security",
    subtitle: "Update your password and authentication settings",
  },
};
function getPageMeta(pathname) {
  if (pathname.startsWith("/chat/")) {
    return { title: "Chat", subtitle: "Document conversation" };
  }
  return PAGE_META[pathname] || { title: "PDF2DATA", subtitle: "" };
}

export default function Topbar({ dark, setDark, setMobileOpen }) {
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

  const avatarUrl =
    user?.profilePicture || localStorage.getItem("profilePicture");

  return (
    <header className="mx-4 mt-4 bg-white dark:bg-[#1E1A3B] border border-gray-200/80 dark:border-[#332C57] rounded-3xl shadow-xl shadow-gray-300/40 dark:shadow-black/50 px-4 sm:px-8 py-4 transition-colors sticky top-4 z-30">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-[#E9E7F5] hover:bg-gray-100 dark:hover:bg-[#251F47] transition"
            aria-label="Toggle Menu"
          >
            <HiMenuAlt2 size={22} />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="hidden sm:block text-xs font-medium text-gray-500 dark:text-[#A5A1C4] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            onClick={() => setDark(!dark)}
            className="relative flex items-center w-[58px] sm:w-[64px] h-[30px] sm:h-[34px] rounded-full bg-gray-100 dark:bg-[#251F47] border border-gray-200 dark:border-[#3D3868] p-1 cursor-pointer transition-colors"
          >
            <div
              className={`absolute top-1 h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] rounded-full bg-white dark:bg-gradient-to-br dark:from-[#8B5CF6] dark:to-[#EC4899] shadow-xs transition-all duration-200 ${
                dark
                  ? "translate-x-[26px] sm:translate-x-[30px]"
                  : "translate-x-0"
              }`}
            />
            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineSun
                size={14}
                className={!dark ? "text-gray-900" : "text-[#A5A1C4]/50"}
              />
            </div>
            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineMoon
                size={14}
                className={dark ? "text-white" : "text-gray-400"}
              />
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-[#332C57] cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-gray-200/80 dark:border-[#3D3868] shadow-xs shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user?.username || "?").charAt(0).toUpperCase()
                )}
              </div>

              <div className="hidden sm:block text-left">
                <h4 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-[#C084FC] transition">
                  {user?.username || "Guest"}
                </h4>
                <p className="text-[11px] font-medium text-gray-400 dark:text-[#A5A1C4]/60">
                  {user?.role === "ROLE_ADMIN" ? "Administrator" : "User"}
                </p>
              </div>

              <HiOutlineChevronDown
                size={14}
                className="text-gray-400 dark:text-[#A5A1C4]/60 group-hover:text-gray-600 dark:group-hover:text-[#E9E7F5] transition"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E1A3B] border border-gray-200/80 dark:border-[#332C57] rounded-2xl shadow-lg p-1.5 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-[#E9E7F5] hover:bg-gray-100 dark:hover:bg-[#251F47] transition"
                >
                  <HiOutlineUser size={15} /> Account Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
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