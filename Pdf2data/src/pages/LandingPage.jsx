import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineDatabase,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineCheck,
  HiOutlineUserGroup,
  HiOutlineEye,
  HiOutlineDocumentDuplicate,
  HiOutlineChartSquareBar,
  HiOutlineLightningBolt,
  HiOutlineLockClosed,
  HiMenu,
  HiX,
  HiHeart,
} from "react-icons/hi";
import logo from "../assets/pdf2data.png";

export default function LandingPage() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0b0b14] text-slate-900 dark:text-white font-sans transition-colors duration-200 flex flex-col selection:bg-purple-600 selection:text-white">
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#121222]/95 backdrop-blur-md border-b border-slate-200 dark:border-indigo-950/80 transition-colors">
        <div className="w-full px-4 sm:px-8 md:px-14 lg:px-20 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="PDF2DATA Logo"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>

          <div className="hidden sm:flex items-center gap-3 md:gap-4">
            <div
              onClick={() => setDark((prev) => !prev)}
              className="relative flex items-center w-[54px] sm:w-[58px] md:w-[64px] h-[28px] sm:h-[30px] md:h-[34px] rounded-full bg-slate-100 dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 p-1 cursor-pointer transition-colors"
              title="Toggle Theme"
            >
              <div
                className={`absolute top-1 h-[18px] sm:h-[20px] md:h-[24px] w-[18px] sm:w-[20px] md:w-[24px] rounded-full bg-white dark:bg-purple-600 shadow-sm transition-transform duration-200 ${
                  dark ? "translate-x-[24px] sm:translate-x-[26px] md:translate-x-[30px]" : "translate-x-0"
                }`}
              />
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineSun
                  size={14}
                  className={!dark ? "text-slate-900 font-bold" : "text-indigo-400/50"}
                />
              </div>
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineMoon
                  size={14}
                  className={dark ? "text-white font-bold" : "text-slate-400"}
                />
              </div>
            </div>

            <Link
              to="/login"
              className="text-xs md:text-sm font-semibold text-slate-700 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white transition px-3 md:px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#18182f]"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm cursor-pointer"
            >
              Get Started
            </Link>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <div
              onClick={() => setDark((prev) => !prev)}
              className="relative flex items-center w-12 h-7 rounded-full bg-slate-100 dark:bg-[#18182f] border border-slate-200 dark:border-indigo-950 p-0.5 cursor-pointer"
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white dark:bg-purple-600 shadow-sm transition-transform duration-200 ${
                  dark ? "translate-x-5" : "translate-x-0"
                }`}
              />
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineSun size={12} className={!dark ? "text-slate-900" : "text-indigo-400/40"} />
              </div>
              <div className="relative z-10 flex-1 flex justify-center">
                <HiOutlineMoon size={12} className={dark ? "text-white" : "text-slate-400"} />
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#18182f] transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-5 space-y-2.5 bg-white/95 dark:bg-[#121222]/95 border-b border-slate-200 dark:border-indigo-950">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-[#18182f] text-slate-800 dark:text-indigo-200"
            >
              Log In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 text-xs font-bold rounded-xl bg-purple-600 text-white shadow-sm"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 pt-10 sm:pt-14 md:pt-16 pb-8 sm:pb-12 text-center">
        <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Extract the <span className="text-purple-600 dark:text-purple-400">PDF Data</span> You Need
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 dark:text-indigo-200/80 leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
            Our Extract PDF tool was built to help you pull structured data from PDFs in the fastest, simplest way possible. Whether you need a single invoice table or key-value fields from several documents, grab exactly what you need without any hassle.
          </p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-4 sm:py-8">
        <div className="w-full max-w-[1400px] mx-auto bg-slate-50 dark:bg-[#121222] border-l-4 border-l-purple-600 border border-slate-200 dark:border-indigo-950/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-sm grid lg:grid-cols-12 gap-6 md:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How To Extract Data from PDF Online for Free
            </h2>

            <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
              {[
                "Import or drag & drop your file into our PDF Extraction tool.",
                "Choose AI Key-Value Extraction, OCR Table Parsing, or Interactive Chat.",
                "Review the structured visual output with sub-second accuracy.",
                "Select your target export format: JSON, CSV, Excel, or SQL.",
                "Download your structured data ready for your database or spreadsheet—done!",
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 sm:gap-4">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-indigo-200/90 leading-snug">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center p-4 sm:p-8 bg-white dark:bg-[#18182f] rounded-xl sm:rounded-2xl border border-slate-200 dark:border-indigo-950 min-h-[220px] sm:min-h-[260px]">
            <div className="relative w-60 sm:w-72 h-52 sm:h-60 flex items-center justify-center">
              <div className="absolute w-44 sm:w-52 h-48 sm:h-56 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-md p-4 sm:p-5 space-y-2.5 sm:space-y-3 transform -rotate-3">
                <div className="w-12 sm:w-14 h-4 sm:h-5 bg-purple-600 rounded text-[9px] sm:text-[10px] font-bold text-white flex items-center justify-center">
                  PDF
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-purple-200 dark:bg-purple-800/60 rounded-full" />
                <div className="w-4/5 h-1.5 sm:h-2 bg-purple-200 dark:bg-purple-800/60 rounded-full" />
                <div className="w-full h-1.5 sm:h-2 bg-purple-200 dark:bg-purple-800/60 rounded-full" />
                <div className="w-3/5 h-1.5 sm:h-2 bg-purple-200 dark:bg-purple-800/60 rounded-full" />
              </div>

              <div className="absolute w-40 sm:w-48 h-40 sm:h-48 bg-white dark:bg-[#121222] rounded-2xl border border-slate-300 dark:border-indigo-900 shadow-xl p-4 sm:p-5 flex flex-col justify-between transform rotate-3">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="w-16 sm:w-20 h-3.5 sm:h-4 bg-emerald-600 rounded text-[8px] sm:text-[9px] font-bold tracking-wider text-white flex items-center justify-center">
                    EXTRACTED
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-100 dark:bg-indigo-950 rounded-full" />
                  <div className="w-3/4 h-1.5 sm:h-2 bg-slate-100 dark:bg-indigo-950 rounded-full" />
                  <div className="w-4/5 h-1.5 sm:h-2 bg-slate-100 dark:bg-indigo-950 rounded-full" />
                </div>
                <div className="flex justify-end">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
                    <HiOutlineCheck size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-10 sm:py-16">
        <div className="w-full max-w-[1400px] mx-auto space-y-14 sm:space-y-20 md:space-y-24">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Extract <span className="text-purple-600 dark:text-purple-400">Structured Data</span> From a PDF
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-indigo-200/80 leading-relaxed">
                Parse key invoice fields, summary blocks, and tabular figures directly from your PDF. Convert your unstructured data into clean JSON or relational database entries in seconds.
              </p>
            </div>

            <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-slate-50 dark:bg-[#121222] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-indigo-950">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm">
                <div className="p-3 sm:p-4 bg-white dark:bg-[#18182f] rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-900/50 shadow-xs space-y-2 sm:space-y-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <HiOutlineDocumentText size={16} />
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="w-2/3 h-1.5 sm:h-2 bg-purple-500 rounded-full" />
                </div>
                <div className="p-3 sm:p-4 bg-white dark:bg-[#18182f] rounded-xl sm:rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-xs space-y-2 sm:space-y-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                    <HiOutlineCheck size={16} />
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="w-2/3 h-1.5 sm:h-2 bg-emerald-500 rounded-full" />
                </div>
                <div className="p-3 sm:p-4 bg-white dark:bg-[#18182f] rounded-xl sm:rounded-2xl border border-teal-200 dark:border-teal-900/50 shadow-xs space-y-2 sm:space-y-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                    <HiOutlineSparkles size={16} />
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="w-2/3 h-1.5 sm:h-2 bg-teal-500 rounded-full" />
                </div>
                <div className="p-3 sm:p-4 bg-white dark:bg-[#18182f] rounded-xl sm:rounded-2xl border border-indigo-200 dark:border-indigo-900/50 shadow-xs space-y-2 sm:space-y-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                    <HiOutlineChartSquareBar size={16} />
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="w-2/3 h-1.5 sm:h-2 bg-indigo-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-slate-50 dark:bg-[#121222] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-indigo-950">
              <div className="grid grid-cols-2 gap-3.5 sm:gap-5 w-full max-w-sm">
                {[
                  { name: "JSON", bg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700/50" },
                  { name: "CSV", bg: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-700/50" },
                  { name: "EXCEL", bg: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-700/50" },
                  { name: "SQL", bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50" },
                ].map((format, i) => (
                  <div
                    key={i}
                    className="h-20 sm:h-24 bg-white dark:bg-[#18182f] border border-slate-200 dark:border-indigo-900/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-xs"
                  >
                    <span className={`text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md border ${format.bg} w-fit`}>
                      {format.name}
                    </span>
                    <div className="w-full h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Extract Across <span className="text-purple-600 dark:text-purple-400">Multiple Documents</span>
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-indigo-200/80 leading-relaxed">
                Upload multiple files and collect unified tables, receipts, or legal clauses in batches. Query multiple documents with real-time AI search without processing each file one by one.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Choose Your <span className="text-purple-600 dark:text-purple-400">Output Format</span>
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-indigo-200/80 leading-relaxed">
                After extracting your data, decide how you want it formatted. Export as structured JSON payloads, formatted CSV sheets, Microsoft Excel (.xlsx), or direct SQL INSERT queries.
              </p>
            </div>

            <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-10 md:p-12 bg-slate-50 dark:bg-[#121222] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-indigo-950">
              <div className="w-full max-w-sm bg-white dark:bg-[#18182f] rounded-xl sm:rounded-2xl border border-slate-200 dark:border-indigo-900/60 p-4 sm:p-6 shadow-md space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-indigo-950">
                  <span className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 truncate">output_dataset.json</span>
                  <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">READY</span>
                </div>
                <div className="space-y-1 sm:space-y-1.5 font-mono text-[11px] sm:text-xs text-slate-600 dark:text-indigo-300">
                  <p>&#123;</p>
                  <p className="pl-3 sm:pl-4">"invoice": "INV-2026",</p>
                  <p className="pl-3 sm:pl-4">"total": "$1,533.60"</p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-12 sm:py-16 md:py-20 border-t border-slate-200/80 dark:border-indigo-950/40">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-10 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Extract Only the <span className="text-purple-600 dark:text-purple-400">PDF Data</span> You Want
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-x-12 md:gap-y-12">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50 shadow-xs shrink-0">
                <HiOutlineUserGroup className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Start for Free—Right Now
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 mt-1 leading-relaxed">
                  Drop your PDF into the tool and begin extracting data instantly. No credit card or installation required to get started.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50 shadow-xs shrink-0">
                <HiOutlineEye className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Preview Data Before Exporting
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 mt-1 leading-relaxed">
                  View real-time structured tables and raw key-value pairs before exporting, ensuring accuracy on long, complex documents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50 shadow-xs shrink-0">
                <HiOutlineDocumentDuplicate className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Keep Your Original PDF Unchanged
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 mt-1 leading-relaxed">
                  Extraction parses content non-destructively. Your original PDF document stays completely intact and untouched.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-700/50 shadow-xs shrink-0">
                <HiOutlineDatabase className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Multi-Format Database Mapping
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 mt-1 leading-relaxed">
                  Transform complex page layouts into standard JSON, formatted CSV, Excel spreadsheets, or SQL statements ready for database ingestion.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50 shadow-xs shrink-0">
                <HiOutlineLightningBolt className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Real-Time Document Chat
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 mt-1 leading-relaxed">
                  Ask questions to uploaded documents in natural language to quickly clarify numbers, dates, terms, or specific policies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50 shadow-xs shrink-0">
                <HiOutlineLockClosed className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Certified Information Security
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-300/70 mt-1 leading-relaxed">
                  Built with Spring Security JWT tokens and protected by 256-bit TLS encryption so your documents remain strictly confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-8 md:px-14 lg:px-20 py-8 sm:py-12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="relative overflow-hidden bg-slate-50 dark:bg-[#121222] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-indigo-950/70 p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-sm">
            
            <div className="space-y-3 sm:space-y-4 max-w-2xl text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Pdf Work <span className="text-purple-600 dark:text-purple-400">Made Easy</span>
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-indigo-200/80 leading-relaxed">
                Boost productivity with unlimited access to PDF2Data tools for taking the hassle out of document workflows. Do more, better, faster.
              </p>
            </div>

            <div className="relative w-44 sm:w-56 h-32 sm:h-44 flex items-center justify-center shrink-0">
              <div className="absolute w-16 sm:w-24 h-16 sm:h-24 bg-blue-600 rounded-2xl sm:rounded-3xl transform rotate-12 -top-1 sm:-top-2 left-2 sm:left-4 shadow-md" />
              <div className="absolute w-16 sm:w-24 h-16 sm:h-24 bg-purple-600 rounded-2xl sm:rounded-3xl transform -rotate-12 top-0 right-1 sm:right-2 shadow-md" />
              <div className="absolute w-24 sm:w-32 h-16 sm:h-24 bg-amber-500 rounded-2xl sm:rounded-3xl transform rotate-6 bottom-0 left-6 sm:left-10 shadow-md" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-indigo-950 bg-white dark:bg-[#0b0b14] pt-6 pb-10 transition-colors mt-auto w-full">
        <div className="w-full px-4 sm:px-8 md:px-14 lg:px-20 space-y-6 sm:space-y-12">
      <div className="flex items-center justify-center text-xs text-slate-400 dark:text-indigo-300/50 pt-2 text-center">
  <p className="inline-flex items-center justify-center gap-1.5">
    <span>2026 PDF2Data — Made with</span>
    <HiHeart className="text-red-500 text-sm inline-block" />
    <span>Athenura</span>
  </p>
</div>
        </div>
      </footer>

    </div>
  );
}