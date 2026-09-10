import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineUserGroup,
  HiOutlineLogout,
  HiX,
} from "react-icons/hi";
import logo from "../assets/pdf2data.png"; 
import { useAuth } from "../context/AuthContext";

const adminMenus = [
  { name: "Overview", icon: HiOutlineViewGrid, path: "/admin" },
  {
    name: "All Extractions",
    icon: HiOutlineCollection,
    path: "/admin/extractions",
  },
  { name: "All Users", icon: HiOutlineUserGroup, path: "/admin/users" },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Floating Card Sidebar Container */}
      <aside
        className={`fixed lg:static top-4 left-4 lg:top-0 lg:left-0 lg:my-4 lg:ml-4 z-50 h-[calc(100vh-2rem)] w-[260px] rounded-3xl border border-gray-200/80 dark:border-[#332C57] bg-white dark:bg-[#1E1A3B] shadow-xl shadow-gray-300/40 dark:shadow-black/50 flex flex-col transition-transform duration-300 ease-in-out shrink-0 overflow-hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-[calc(100%+1rem)] lg:translate-x-0"
        }`}
      >
        {/* Header Section */}
        <div className="px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-gray-100 dark:border-[#332C57]/60">
          <div className="flex items-center justify-center min-w-0 flex-1">
            <img
              src={logo}
              alt="PDF2DATA Admin Logo"
              className="h-20 w-auto max-w-[180px] object-contain transition-all"
            />
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-[#E9E7F5] rounded-lg cursor-pointer ml-2"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 flex-1 space-y-2 mt-4 overflow-y-auto">
          <p className="px-3.5 text-[10px] font-bold text-gray-400 dark:text-[#A5A1C4]/60 uppercase tracking-wider mb-2">
            System Control
          </p>

          {adminMenus.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-3xl transition-all text-sm font-semibold cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-xs"
                    : "text-gray-600 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-[#251F47]"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-white"
                      : "text-gray-400 dark:text-[#A5A1C4]/60"
                  }
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="px-3 pb-5 pt-2 shrink-0 border-t border-gray-100 dark:border-[#332C57]/80">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-gray-50 dark:bg-[#171331] border border-gray-200/60 dark:border-[#332C57]/80">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {(user?.username || "A").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-[11px] font-medium text-gray-400 dark:text-[#A5A1C4]/60 truncate">
                Administrator
              </p>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-xl text-gray-400 dark:text-[#A5A1C4]/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
            >
              <HiOutlineLogout size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}