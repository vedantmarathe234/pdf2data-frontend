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
          s.fileName?.toLowerCase().includes(q),
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
    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, pinned: !s.pinned } : s)),
    );
    try {
      await togglePinSession(session.id);
    } catch (err) {
      console.error(err);
      toast.error("Could not update pin.");
      load();
    }
  };

  const startRename = (session) => {
    setEditingId(session.id);
    setEditTitle(session.title || session.fileName);
  };

  const submitRename = async (session) => {
    const title = editTitle.trim();
    setEditingId(null);
    if (!title || title === session.title) return;

    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, title } : s)),
    );
    try {
      await renameSession(session.id, title);
      toast.success("Chat renamed.");
    } catch (err) {
      console.error(err);
      toast.error("Rename failed.");
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSession(deleteTarget.id);
      setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
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
    <div className="w-full min-h-screen bg-[#F4F5F8] dark:bg-[#09090b] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#121215] p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document or chat title..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 transition"
          />
        </div>

        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-2">
          {filtered.length} chat{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-zinc-400 dark:text-zinc-500 text-sm font-medium">
            Loading history...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-zinc-400 dark:text-zinc-500 text-sm font-medium">
            {search
              ? "No chats match your search."
              : "No chats yet — extract a document to get started."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#09090b]/40 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  <th className="py-4 px-4 w-12 text-center"></th>
                  <th className="py-4 px-6 font-bold">Chat</th>
                  <th className="py-4 px-6 font-bold">Document</th>
                  <th className="py-4 px-6 font-bold">Last updated</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
                {currentItems.map((session) => (
                  <tr
                    key={session.id}
                    className={`hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition group ${
                      session.pinned ? "bg-zinc-50/40 dark:bg-zinc-900/20" : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handlePin(session)}
                        className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-800 dark:hover:text-white transition cursor-pointer"
                        title={session.pinned ? "Unpin" : "Pin"}
                      >
                        {session.pinned ? (
                          <HiStar
                            size={18}
                            className="text-zinc-800 dark:text-zinc-200"
                          />
                        ) : (
                          <HiOutlineStar size={18} />
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 font-semibold text-zinc-800 dark:text-zinc-200">
                      {editingId === session.id ? (
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => submitRename(session)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") submitRename(session);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm outline-none bg-white dark:bg-[#09090b] text-zinc-800 dark:text-zinc-100"
                        />
                      ) : (
                        <span
                          onDoubleClick={() => startRename(session)}
                          className="cursor-text hover:text-zinc-900 dark:hover:text-white transition"
                        >
                          {session.title || "Untitled Chat"}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <HiOutlineDocumentText
                          size={18}
                          className="text-zinc-400 shrink-0"
                        />
                        <span className="truncate max-w-[200px] text-xs font-medium">
                          {session.fileName || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {session.updatedAt
                        ? new Date(session.updatedAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => startRename(session)}
                          title="Rename"
                          className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <HiOutlinePencil size={15} />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(session)}
                          title="Delete"
                          className="p-1.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                        >
                          <HiOutlineTrash size={15} />
                        </button>

                        <button
                          onClick={() => navigate(`/chat/${session.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition ml-1 cursor-pointer"
                        >
                          <HiOutlineChatAlt2 size={14} /> Open
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-end gap-6 bg-zinc-50/50 dark:bg-zinc-900/30">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Showing{" "}
              {filtered.length === 0 ? 0 : `${startIndex + 1}-${endIndex}`} of{" "}
              {filtered.length} items
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
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
                        ? "border border-zinc-800 dark:border-zinc-200 text-zinc-900 dark:text-white font-bold bg-zinc-100 dark:bg-zinc-800"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <HiChevronRight size={16} />
              </button>
            </div>

            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 cursor-pointer"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <HiChevronDown
                size={14}
                className="absolute right-2.5 top-2.5 text-zinc-400 pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this chat?"
        message={`"${deleteTarget?.title}" and its message history will be permanently removed.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
