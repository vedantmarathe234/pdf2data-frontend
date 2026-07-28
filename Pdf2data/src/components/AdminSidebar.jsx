import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineLogout,
  HiX,
} from "react-icons/hi";
import logo from "../assets/logo2.png";
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
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[260px] border-r border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#121215] flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={logo}
                alt="PDF2DATA Admin Logo"
                className="object-contain scale-125 dark:invert transition-all"
              />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight whitespace-nowrap text-zinc-900 dark:text-white">
                PDF2DATA
              </h1>
              <span className="inline-block text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
          >
            <HiX size={20} />
          </button>
        </div>

        <div className="px-3 flex-1 space-y-1.5 mt-4 overflow-y-auto">
          <p className="px-3.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
            System Control
          </p>

          {adminMenus.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all text-sm font-semibold cursor-pointer
                  ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-white dark:text-zinc-900"
                      : "text-zinc-400 dark:text-zinc-500"
                  }
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="px-3 pb-5 pt-2 shrink-0 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {(user?.username || "A").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 truncate">
                Administrator
              </p>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
            >
              <HiOutlineLogout size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
