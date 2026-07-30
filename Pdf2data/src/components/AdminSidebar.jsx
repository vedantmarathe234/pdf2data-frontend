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
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[260px] border-r border-indigo-950/80 bg-[#121222] flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header Section */}
        <div className="px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-indigo-950/60">
          <div className="flex items-center justify-center min-w-0 flex-1">
            <img
              src={logo}
              alt="PDF2DATA Admin Logo"
              className="h-20 w-auto max-w-[180px] object-contain transition-all"
            />
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-indigo-400 hover:text-white rounded-lg cursor-pointer ml-2"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 flex-1 space-y-1.5 mt-4 overflow-y-auto">
          <p className="px-3.5 text-[10px] font-bold text-indigo-400/50 uppercase tracking-wider mb-2">
            System Control
          </p>

          {adminMenus.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all text-sm font-semibold cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25"
                    : "text-indigo-300/70 hover:text-white hover:bg-[#18182f]"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive ? "text-white" : "text-indigo-400/60"
                  }
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="px-3 pb-5 pt-2 shrink-0 border-t border-indigo-950/80">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0b0b14] border border-indigo-950/80">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
              {(user?.username || "A").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-[10px] font-medium text-purple-400 truncate">
                Administrator
              </p>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-xl text-indigo-400/60 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
            >
              <HiOutlineLogout size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}