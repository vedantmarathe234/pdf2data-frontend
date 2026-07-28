import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar"; 

export default function AdminLayout({ children, dark, setDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-[#09090b] flex transition-colors duration-200">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <AdminTopbar dark={dark} setDark={setDark} setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}