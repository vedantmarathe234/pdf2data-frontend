import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlinePaperClip,
  HiOutlineDocumentText,
  HiOutlinePencil,
  HiOutlineTrash,
  HiStar,
  HiOutlineStar,
  HiArrowUp,
} from "react-icons/hi";
import {
  getSessionDetails,
  askQuestion,
  renameSession,
  togglePinSession,
  deleteSession,
} from "../services/chatService";
import {
  uploadAndExtract,
  getExtractionData,
  exportDocument,
} from "../services/documentService";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";

export default function ChatSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [session, setSession] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeDocId, setActiveDocId] = useState(null);
  const [extraction, setExtraction] = useState(null);
  const [extractionLoading, setExtractionLoading] = useState(false);

  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState("");

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const loadSession = useCallback(async () => {
    setLoadingSession(true);
    try {
      const data = await getSessionDetails(sessionId);
      setSession(data.session);
      setDocuments(data.documents || []);
      setMessages(data.messages || []);
      if (data.documents?.length) {
        setActiveDocId((prev) =>
          data.documents.some((d) => d.documentId === prev)
            ? prev
            : data.documents[data.documents.length - 1].documentId
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not load this chat.");
    } finally {
      setLoadingSession(false);
    }
  }, [sessionId, toast]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!activeDocId) {
      setExtraction(null);
      return;
    }
    setExtractionLoading(true);
    getExtractionData(activeDocId)
      .then(setExtraction)
      .catch((err) => {
        console.error(err);
        setExtraction(null);
      })
      .finally(() => setExtractionLoading(false));
  }, [activeDocId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || asking) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        role: "USER",
        message,
        createdAt: new Date().toISOString(),
      },
    ]);
    setAsking(true);

    try {
      const res = await askQuestion(sessionId, message);
      setMessages((prev) => [
        ...prev,
        {
          id: `local-reply-${Date.now()}`,
          role: "ASSISTANT",
          message: res.reply,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data || "Something went wrong. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        {
          id: `local-err-${Date.now()}`,
          role: "ASSISTANT",
          message: "⚠️ I couldn't process that. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  const handleAddDocument = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadAndExtract(
        file,
        "Extract all structured data",
        sessionId
      );
      toast.success(`${file.name} added to this chat.`);
      await loadSession();
      setActiveDocId(res.documentId);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || "Upload failed.";
      toast.error(typeof msg === "string" ? msg : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handlePin = async () => {
    if (!session) return;
    setSession((prev) => ({ ...prev, pinned: !prev.pinned }));
    try {
      await togglePinSession(sessionId);
    } catch (err) {
      console.error(err);
      toast.error("Could not update pin.");
    }
  };

  const submitTitle = async () => {
    setEditingTitle(false);
    const title = titleDraft.trim();
    if (!title || title === session?.title) return;
    setSession((prev) => ({ ...prev, title }));
    try {
      await renameSession(sessionId, title);
    } catch (err) {
      console.error(err);
      toast.error("Rename failed.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteSession(sessionId);
      toast.success("Chat deleted.");
      navigate("/history");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
      setDeleting(false);
    }
  };

  const handleExport = async (format) => {
    if (!activeDocId) return;
    setExporting(format);
    try {
      await exportDocument(activeDocId, format);
      toast.success(`Exported as ${format.toUpperCase()}.`);
    } catch (err) {
      console.error(err);
      toast.error("Export failed.");
    } finally {
      setExporting("");
    }
  };

  if (loadingSession) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm font-semibold">
        Loading chat session...
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-[#F4F5F8] dark:bg-[#09090b] p-4 sm:p-6 flex flex-col overflow-hidden">
      
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-button {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #27272a;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .dark * {
          scrollbar-color: #27272a transparent;
        }
      `}</style>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden h-full"> 
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0 bg-white dark:bg-[#121215]">
            <div className="min-w-0 flex-1">
              {editingTitle ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={submitTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitTitle();
                    if (e.key === "Escape") setEditingTitle(false);
                  }}
                  className="text-base font-bold w-full outline-none border-b border-zinc-400 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-white"
                />
              ) : (
                <h2
                  onDoubleClick={() => {
                    setTitleDraft(session?.title || "");
                    setEditingTitle(true);
                  }}
                  className="text-base font-bold text-zinc-900 dark:text-white truncate cursor-text"
                  title="Double-click to rename"
                >
                  {session?.title}
                </h2>
              )}
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                {session?.fileName}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePin}
                title={session?.pinned ? "Unpin" : "Pin"}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-amber-400 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                {session?.pinned ? (
                  <HiStar size={18} className="text-amber-400" />
                ) : (
                  <HiOutlineStar size={18} />
                )}
              </button>
              <button
                onClick={() => {
                  setTitleDraft(session?.title || "");
                  setEditingTitle(true);
                }}
                title="Rename"
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <HiOutlinePencil size={16} />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete"
                className="p-1.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
              >
                <HiOutlineTrash size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/80 overflow-x-auto shrink-0 bg-white dark:bg-[#121215]">
            {documents.map((doc) => (
              <button
                key={doc.documentId}
                onClick={() => setActiveDocId(doc.documentId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 cursor-pointer ${
                  activeDocId === doc.documentId
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <HiOutlineDocumentText size={15} />
                <span className="truncate max-w-[140px]">{doc.fileName}</span>
              </button>
            ))}
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-500 hover:border-zinc-800 dark:hover:border-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <HiOutlinePaperClip size={15} />
              <span>{uploading ? "Uploading..." : "Add Document"}</span>
            </button>
            <input
              type="file"
              accept=".pdf,image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAddDocument}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs font-medium">
                Ask anything about the document{documents.length > 1 ? "s" : ""} attached above.
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "USER"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-br-xs shadow-xs"
                      : "bg-zinc-100 dark:bg-[#09090b] text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800/80 rounded-bl-xs"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            {asking && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-[#09090b] border border-zinc-200/80 dark:border-zinc-800/80 text-sm text-zinc-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 shrink-0 space-y-2 bg-white dark:bg-[#121215]">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                disabled={asking}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={asking || !input.trim()}
                className="p-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 disabled:opacity-40 hover:bg-zinc-800 dark:hover:bg-white transition cursor-pointer shadow-xs"
              >
                <HiArrowUp size={16} />
              </button>
            </div>
            <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              AI responses may not always be accurate. Please verify important details.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[380px] bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 flex flex-col shadow-xs overflow-hidden shrink-0 h-full">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
            Extraction Result
          </h3>

          {!activeDocId ? (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              No document selected.
            </div>
          ) : extractionLoading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              Loading extraction...
            </div>
          ) : !extraction ? (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              No extraction data found.
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 min-h-0">
                {Object.entries(extraction).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 bg-zinc-50/80 dark:bg-[#09090b] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80"
                  >
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                      {key.replace(/_/g, " ")}
                    </span>
                    {value && typeof value === "object" ? (
                      <pre className="p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap break-words">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 break-words">
                        {value === null || value === undefined || value === ""
                          ? "—"
                          : String(value)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
                  Export:
                </span>
                {["json", "csv", "excel", "sql"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    disabled={exporting === fmt}
                    className="flex-1 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition uppercase cursor-pointer"
                  >
                    {exporting === fmt ? "..." : fmt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete this chat?"
        message="This chat and its message history will be permanently removed."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}