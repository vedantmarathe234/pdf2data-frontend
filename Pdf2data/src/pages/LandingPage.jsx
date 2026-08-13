import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineChatAlt2,
  HiOutlineDatabase,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi";
import logo from "../assets/pdf2data.png";

export default function LandingPage() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const features = [
    {
      id: "ai-extraction",
      icon: <HiOutlineSparkles className="text-purple-600 dark:text-purple-400" size={24} />,
      title: "AI-Powered Extraction",
      description:
        "Groq & Llama-3 models parse unstructured PDFs, invoices, and receipts into high-precision key-value pairs and tables with sub-second latency.",
      badge: "Fast & Precise",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:border-purple-700/50 dark:text-purple-300",
    },
    {
      id: "doc-chat",
      icon: <HiOutlineChatAlt2 className="text-teal-600 dark:text-teal-400" size={24} />,
      title: "Interactive Document Chat",
      description:
        "Ask questions across uploaded documents in real-time. Retrieve specific clauses, financial figures, or summaries with complete contextual accuracy.",
      badge: "Real-time RAG",
      badgeColor: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:border-teal-700/50 dark:text-teal-300",
    },
    {
      id: "multi-export",
      icon: <HiOutlineDatabase className="text-orange-600 dark:text-orange-400" size={24} />,
      title: "Multi-Format Export",
      description:
        "Cleanly map structured extractions directly into JSON blobs, formatted CSV spreadsheets, XLSX files, or SQL insert queries ready for database entry.",
      badge: "4 Formats",
      badgeColor: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:border-orange-700/50 dark:text-orange-300",
    },
    {
      id: "security",
      icon: <HiOutlineShieldCheck className="text-indigo-600 dark:text-indigo-400" size={24} />,
      title: "Role-Based Security",
      description:
        "Built-in Spring Security JWT authentication, complete separation for Admin Control Center & User Workspaces, and Cloudinary media management.",
      badge: "Enterprise Ready",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:border-indigo-700/50 dark:text-indigo-300",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0b0b14] text-zinc-900 dark:text-white selection:bg-purple-600 selection:text-white font-sans relative transition-colors duration-200">
      
      <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8">
        <nav className="max-w-6xl mx-auto bg-white/90 dark:bg-[#121222]/90 backdrop-blur-md border border-zinc-200 dark:border-indigo-950/80 rounded-2xl px-6 py-2.5 shadow-xl flex items-center justify-between transition-colors">
          
          <div className="flex items-center">
            <img
              src={logo}
              alt="PDF2DATA Logo"
              className="h-11 sm:h-12 w-auto object-contain transition-transform hover:scale-105 my-auto drop-shadow-md dark:drop-shadow-none"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5 my-auto">
            <div
              onClick={() => setDark((prev) => !prev)}
              className="relative flex items-center w-[58px] sm:w-[64px] h-[30px] sm:h-[34px] rounded-full bg-zinc-100 dark:bg-[#18182f] border border-zinc-200 dark:border-indigo-950 p-1 cursor-pointer transition-colors"
              title="Toggle Theme"
            >
              <div
                className={`absolute top-1 h-[20px] sm:h-[24px] w-[20px] sm:w-[24px] rounded-full bg-white dark:bg-gradient-to-br dark:from-[#8B5CF6] dark:to-[#EC4899] shadow-md transition-all duration-200 ${
                  dark
                    ? "translate-x-[26px] sm:translate-x-[30px]"
                    : "translate-x-0"
                }`}
              />
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineSun
                  size={14}
                  className={!dark ? "text-zinc-900 font-bold" : "text-indigo-400/50"}
                />
              </div>
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineMoon
                  size={14}
                  className={dark ? "text-white font-bold" : "text-zinc-400"}
                />
              </div>
            </div>

            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-indigo-300 hover:text-zinc-900 dark:hover:text-white transition px-4 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#18182f]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs sm:text-sm font-bold px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white transition shadow-md shadow-purple-600/30 cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative px-6 sm:px-12 pt-36 pb-20 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/40 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-6">
          <HiOutlineSparkles className="text-purple-600 dark:text-purple-400" size={16} />
          <span>Next-Gen OCR & Document Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-zinc-900 dark:text-white">
          Extract structured data from <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-300">PDFs in seconds</span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-zinc-600 dark:text-indigo-200/80 max-w-2xl mx-auto leading-relaxed">
          OCR, AI extraction, chat with documents, and export structured datasets directly to JSON, CSV, Excel & SQL queries.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            Create Free Account <HiOutlineArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-indigo-950/60 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-indigo-400/60 mr-2">
            Export directly to:
          </span>
          <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 text-xs font-semibold">JSON</span>
          <span className="px-3 py-1 rounded-lg bg-teal-100 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700/50 text-teal-700 dark:text-teal-300 text-xs font-semibold">CSV</span>
          <span className="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700/50 text-orange-700 dark:text-orange-300 text-xs font-semibold">EXCEL</span>
          <span className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">SQL</span>
        </div>
      </section>

      <section className="px-6 sm:px-12 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Everything you need for document workflows
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-indigo-300/70 mt-2">
            Built for developers, data analysts, and administrative automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#121222] border border-zinc-200/80 dark:border-indigo-950/60 hover:border-purple-500/40 transition duration-300 space-y-4 group relative overflow-hidden shadow-xs hover:shadow-xl dark:hover:shadow-purple-950/20"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-[#18182f] w-fit border border-zinc-200 dark:border-indigo-950 group-hover:scale-105 transition transform">
                  {feature.icon}
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-indigo-300/70 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-indigo-950 px-6 sm:px-12 py-8 bg-white dark:bg-[#0b0b14] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-indigo-300/60">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <HiOutlineDocumentText size={18} className="text-purple-600 dark:text-purple-400" /> PDF2Data Platform
          </div>
          <p>2026 PDF2Data.</p>
        </div>
      </footer>

    </div>
  );
}