import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
 const [dark, setDark] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}, [dark]);

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
         <Topbar dark={dark} setDark={setDark} />
        <div className="p-8 pt-0 pb-4 flex flex-col min-h-full">
         
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}