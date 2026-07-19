import {
  HiOutlineHome,
  HiOutlineCloudUpload,
  HiOutlineCollection,
  HiOutlineChatAlt2,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineTemplate,
  HiOutlineCode,
  HiOutlineCog,
  HiArrowRight
} from "react-icons/hi";

import logo from "../assets/logo.png";

const menus = [
  { name: "Home", icon: HiOutlineHome },
  { name: "Extractions", icon: HiOutlineCollection },
  { name: "History", icon: HiOutlineClock },
  { name: "Settings", icon: HiOutlineCog },
];

export default function Sidebar() {
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
          const isActive = index === 0; // Home is active

          return (
            <button
              key={index}
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

      
    </aside>
  );
}