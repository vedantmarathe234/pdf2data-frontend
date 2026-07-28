import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F4F5F8] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Topbar
          dark={dark}
          setDark={setDark}
          setMobileOpen={setMobileOpen}
        />
        <div className="flex-1 w-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}