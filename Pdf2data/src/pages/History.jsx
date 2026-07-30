import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineDocumentText,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChatAlt2,
  HiStar,
  HiOutlineStar,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
} from "react-icons/hi";
import {
  getSessions,
  renameSession,
  togglePinSession,
  deleteSession,
} from "../services/chatService";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";

export default function History() {
  const navigate = useNavigate();
  const toast = useToast();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load chat history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...sessions];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.fileName?.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
  }, [sessions, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePin = async (session) => {
    const sessionId = session.id || session._id;
    setSessions((prev) =>
      prev.map((s) => ((s.id || s._id) === sessionId ? { ...s, pinned: !s.pinned } : s))
    );
    try {
      await togglePinSession(sessionId);
    } catch (err) {
      console.error(err);
      toast.error("Could not update pin.");
      load();
    }
  };

  const startRename = (session) => {
    const sessionId = session.id || session._id;
    setEditingId(sessionId);
    setEditTitle(session.title || session.fileName);
  };

  const submitRename = async (session) => {
    const sessionId = session.id || session._id;
    const title = editTitle.trim();
    setEditingId(null);
    if (!title || title === session.title) return;

    setSessions((prev) =>
      prev.map((s) => ((s.id || s._id) === sessionId ? { ...s, title } : s))
    );
    try {
      await renameSession(sessionId, title);
      toast.success("Chat renamed.");
    } catch (err) {
      console.error(err);
      toast.error("Rename failed.");
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const sessionId = deleteTarget.id || deleteTarget._id;

    setDeleting(true);
    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => (s.id || s._id) !== sessionId));
      toast.success("Chat deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="w-full h-full min-h-0 bg-[#F8F8FC] dark:bg-[#0B0A10] p-4 sm:p-6 flex flex-col gap-4 overflow-hidden box-border">
      <style>{`
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #332C57;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }
        .dark * {
          scrollbar-color: #332C57 transparent;
        }
      `}</style>

      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1635] p-4 rounded-3xl border border-[#E2E8F0] dark:border-[#332C57] shadow-xs shrink-0">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#A5A1C4] text-lg" />
          <input
            type="text"
            placeholder="Search by document or chat title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F8F8FC] dark:bg-[#251F47] border border-[#E2E8F0] dark:border-[#332C57] rounded-xl outline-none focus:ring-2 focus:ring-[#7C3AED] text-[#1E1B4B] dark:text-[#E9E7F5] placeholder-[#64748B] dark:placeholder-[#A5A1C4] transition"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 px-1">
          <h1 className="text-sm font-bold text-[#1E1B4B] dark:text-white truncate sm:hidden">
            Chat History
          </h1>
          <span className="text-xs font-semibold text-[#64748B] dark:text-[#A5A1C4]">
            {filtered.length} chat{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#1A1635] rounded-3xl border border-[#E2E8F0] dark:border-[#332C57] shadow-xs flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="h-full flex items-center justify-center text-[#64748B] dark:text-[#A5A1C4] text-sm font-medium">
              Loading history...
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[#64748B] dark:text-[#A5A1C4] text-sm font-medium text-center px-4">
              {search
                ? "No chats match your search."
                : "No chats yet — extract a document to get started."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#F8F8FC] dark:bg-[#1A1635]">
                <tr className="border-b border-[#E2E8F0] dark:border-[#332C57] text-[11px] font-bold text-[#64748B] dark:text-[#A5A1C4] uppercase tracking-wider">
                  <th className="py-4 px-6 w-12 text-center bg-[#F8F8FC]/90 dark:bg-[#1A1635]/90 backdrop-blur-xs"></th>
                  <th className="py-4 px-6 font-bold w-[45%] bg-[#F8F8FC]/90 dark:bg-[#1A1635]/90 backdrop-blur-xs">Chat</th>
                  <th className="py-4 px-6 font-bold bg-[#F8F8FC]/90 dark:bg-[#1A1635]/90 backdrop-blur-xs">Document</th>
                  <th className="py-4 px-6 font-bold bg-[#F8F8FC]/90 dark:bg-[#1A1635]/90 backdrop-blur-xs">Last updated</th>
                  <th className="py-4 px-6 font-bold text-right bg-[#F8F8FC]/90 dark:bg-[#1A1635]/90 backdrop-blur-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#332C57]/60 text-sm">
                {currentItems.map((session) => {
                  const sessionId = session.id || session._id;
                  return (
                    <tr
                      key={sessionId}
                      className={`hover:bg-[#F8F8FC]/80 dark:hover:bg-[#251F47]/40 transition group ${
                        session.pinned ? "bg-purple-50/50 dark:bg-[#251F47]/20" : ""
                      }`}
                    >
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handlePin(session)}
                          className="text-[#64748B] dark:text-[#A5A1C4]/40 hover:text-[#1E1B4B] dark:hover:text-white transition cursor-pointer"
                          title={session.pinned ? "Unpin" : "Pin"}
                        >
                          {session.pinned ? (
                            <HiStar size={18} className="text-[#7C3AED] dark:text-[#C084FC]" />
                          ) : (
                            <HiOutlineStar size={18} />
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 font-semibold text-[#1E1B4B] dark:text-[#E9E7F5]">
                        {editingId === sessionId ? (
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => submitRename(session)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") submitRename(session);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="w-full min-w-[240px] px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#332C57] text-xs outline-none bg-white dark:bg-[#251F47] text-[#1E1B4B] dark:text-[#E9E7F5]"
                          />
                        ) : (
                          <span
                            onDoubleClick={() => startRename(session)}
                            className="cursor-text hover:text-[#7C3AED] dark:hover:text-[#C084FC] transition block truncate max-w-xl"
                            title="Double-click to rename"
                          >
                            {session.title || session.fileName || "Untitled Chat"}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-[#64748B] dark:text-[#A5A1C4]">
                        <div className="flex items-center gap-2">
                          <HiOutlineDocumentText
                            size={16}
                            className="text-[#64748B] dark:text-[#A5A1C4]/60 shrink-0"
                          />
                          <span className="truncate max-w-[200px] text-xs font-medium">
                            {session.fileName || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-[#64748B] dark:text-[#A5A1C4] whitespace-nowrap">
                        {session.updatedAt
                          ? new Date(session.updatedAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startRename(session)}
                            title="Rename"
                            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#A5A1C4] hover:text-[#1E1B4B] dark:hover:text-white hover:bg-[#F8F8FC] dark:hover:bg-[#251F47] transition cursor-pointer"
                          >
                            <HiOutlinePencil size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(session)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#A5A1C4] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                          >
                            <HiOutlineTrash size={16} />
                          </button>

                          <button
                            onClick={() => navigate(`/chat/${sessionId}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition ml-1 cursor-pointer shadow-xs"
                          >
                            <HiOutlineChatAlt2 size={14} /> Open
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[#E2E8F0] dark:border-[#332C57] flex items-center justify-end gap-6 bg-[#F8F8FC]/50 dark:bg-[#1A1635]/30 shrink-0">
            <p className="text-xs text-[#64748B] dark:text-[#A5A1C4]">
              Showing{" "}
              {filtered.length === 0 ? 0 : `${startIndex + 1}-${endIndex}`} of{" "}
              {filtered.length} items
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 text-[#64748B] dark:text-[#A5A1C4] hover:text-[#1E1B4B] dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <HiChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 rounded-lg text-xs transition cursor-pointer ${
                      currentPage === page
                        ? "border border-[#7C3AED] text-[#7C3AED] dark:text-[#C084FC] font-bold bg-[#F3E8FF] dark:bg-[#251F47]"
                        : "text-[#64748B] dark:text-[#A5A1C4] hover:text-[#1E1B4B] dark:hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 text-[#64748B] dark:text-[#A5A1C4] hover:text-[#1E1B4B] dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <HiChevronRight size={16} />
              </button>
            </div>

            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 bg-white dark:bg-[#251F47] border border-[#E2E8F0] dark:border-[#332C57] rounded-xl text-xs font-medium text-[#1E1B4B] dark:text-[#E9E7F5] outline-none focus:ring-2 focus:ring-[#7C3AED] cursor-pointer"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <HiChevronDown
                size={14}
                className="absolute right-2.5 top-2.5 text-[#64748B] dark:text-[#A5A1C4] pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this chat?"
        message={`"${deleteTarget?.title || deleteTarget?.fileName || "Untitled"}" and its message history will be permanently removed.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}