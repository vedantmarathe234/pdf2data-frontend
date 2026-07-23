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

  const load = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      setSessions(
        [...data].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not load chat history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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

  const handlePin = async (session) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, pinned: !s.pinned } : s))
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
      prev.map((s) => (s.id === session.id ? { ...s, title } : s))
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
            placeholder="Search by document or chat title..."
            className="w-full h-11 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:text-white"
          />
        </div>
        <span className="text-sm text-gray-500 dark:text-slate-400">
          {sessions.length} chat{sessions.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            Loading history...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            {search ? "No chats match your search." : "No chats yet — extract a document to get started."}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-950/50 border-b border-gray-200 dark:border-slate-800">
              <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400">
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Chat</th>
                <th className="p-4 font-semibold">Document</th>
                <th className="p-4 font-semibold">Last updated</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="p-4">
                    <button
                      onClick={() => handlePin(session)}
                      className="text-gray-300 hover:text-amber-400 transition"
                      title={session.pinned ? "Unpin" : "Pin"}
                    >
                      {session.pinned ? (
                        <HiStar size={18} className="text-amber-400" />
                      ) : (
                        <HiOutlineStar size={18} />
                      )}
                    </button>
                  </td>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
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
                        className="px-2 py-1 rounded-lg border border-indigo-300 text-sm outline-none dark:bg-slate-800 dark:text-white"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startRename(session)}
                        className="cursor-text"
                      >
                        {session.title}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <HiOutlineDocumentText size={16} className="text-red-400" />
                      <span className="truncate max-w-[220px]">{session.fileName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-slate-400 text-sm">
                    {new Date(session.updatedAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startRename(session)}
                        title="Rename"
                        className="p-2 rounded-lg text-gray-400 hover:text-[#6139ff] hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                      >
                        <HiOutlinePencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(session)}
                        title="Delete"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/chat/${session.id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#6139ff]/10 text-[#6139ff] text-xs font-semibold hover:bg-[#6139ff] hover:text-white transition"
                      >
                        <HiOutlineChatAlt2 size={14} /> Open
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
