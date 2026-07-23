import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineDocumentText,
  HiStar,
  HiOutlinePlus,
} from "react-icons/hi";
import { getSessions } from "../services/chatService";
import { useToast } from "../context/ToastContext";

const COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
];

function colorFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function extLabel(fileName = "") {
  return fileName.split(".").pop().slice(0, 4).toUpperCase();
}

export default function Extractions() {
  const navigate = useNavigate();
  const toast = useToast();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getSessions();
        setSessions(
          [...data].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          )
        );
      } catch (err) {
        console.error(err);
        toast.error("Could not load extractions.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return sessions;
    const q = search.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.fileName?.toLowerCase().includes(q)
    );
  }, [sessions, search]);

  return (
    <div className="pt-6 pb-10 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-full max-w-sm">
          <HiOutlineSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search extractions..."
            className="w-full h-11 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:text-white"
          />
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-[#6139ff] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
        >
          <HiOutlinePlus size={16} /> New Extraction
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-gray-400 text-sm bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800">
          Loading extractions...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center text-gray-400 text-sm bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800">
          {search ? "No results match your search." : "No documents extracted yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((session) => (
            <button
              key={session.id}
              onClick={() => navigate(`/chat/${session.id}`)}
              className="text-left bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-2xl p-5 hover:border-[#6139ff] hover:shadow-md transition group relative"
            >
              {session.pinned && (
                <HiStar size={16} className="absolute top-4 right-4 text-amber-400" />
              )}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xs ${colorFor(session.fileName)}`}
              >
                {extLabel(session.fileName)}
              </div>
              <p className="mt-4 font-semibold text-gray-900 dark:text-white text-sm truncate">
                {session.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                <HiOutlineDocumentText size={14} /> {session.fileName}
              </p>
              <p className="text-[11px] text-gray-400 mt-3">
                Updated {new Date(session.updatedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
