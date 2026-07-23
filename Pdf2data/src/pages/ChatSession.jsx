import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiOutlinePaperClip,
  HiOutlineDocumentText,
  HiOutlinePencil,
  HiOutlineTrash,
  HiStar,
  HiOutlineStar,
  HiOutlineDownload,
  HiOutlineExclamation,
  HiArrowUp,
} from "react-icons/hi";
import { getSessionDetails, askQuestion, renameSession, togglePinSession, deleteSession } from "../services/chatService";
import { uploadAndExtract, getExtractionData, exportDocument } from "../services/documentService";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

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
      { id: `local-${Date.now()}`, role: "USER", message, createdAt: new Date().toISOString() },
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
      const msg = err.response?.data || "Something went wrong. Please try again.";
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
      <div className="pt-24 flex items-center justify-center text-gray-400 text-sm">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="pt-6 pb-6 flex h-[calc(100vh-140px)] gap-6">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
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
                className="text-lg font-bold w-full outline-none border-b border-indigo-300 dark:bg-slate-900 dark:text-white"
              />
            ) : (
              <h2
                onDoubleClick={() => {
                  setTitleDraft(session?.title || "");
                  setEditingTitle(true);
                }}
                className="text-lg font-bold text-gray-900 dark:text-white truncate"
                title="Double-click to rename"
              >
                {session?.title}
              </h2>
            )}
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              {session?.fileName}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePin}
              title={session?.pinned ? "Unpin" : "Pin"}
              className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition"
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
              className="p-2 rounded-lg text-gray-400 hover:text-[#6139ff] hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
            >
              <HiOutlinePencil size={16} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete"
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
            >
              <HiOutlineTrash size={16} />
            </button>
          </div>
        </div>

        {/* Document tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-slate-800 flex-wrap">
          {documents.map((doc) => (
            <button
              key={doc.documentId}
              onClick={() => setActiveDocId(doc.documentId)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                activeDocId === doc.documentId
                  ? "bg-[#6139ff] text-white"
                  : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <HiOutlineDocumentText
                className={activeDocId === doc.documentId ? "text-white" : "text-red-500"}
                size={16}
              />
              <span className="truncate max-w-[140px]">{doc.fileName}</span>
            </button>
          ))}
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 text-sm text-gray-500 hover:border-[#6139ff] hover:text-[#6139ff] transition disabled:opacity-50"
          >
            <HiOutlinePaperClip size={16} />
            {uploading ? "Uploading..." : "Add Document"}
          </button>
          <input
            type="file"
            accept=".pdf,image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAddDocument}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-10">
              Ask anything about the document{documents.length > 1 ? "s" : ""} above.
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "USER"
                    ? "bg-[#6139ff] text-white rounded-br-sm"
                    : "bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 border border-gray-100 dark:border-slate-700 rounded-bl-sm"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          {asking && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-t border-gray-100 dark:border-slate-800">
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 outline-none text-sm dark:text-white disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={asking || !input.trim()}
            className="p-3 rounded-full bg-[#6139ff] text-white disabled:opacity-40 hover:bg-indigo-700 transition"
          >
            <HiArrowUp size={16} />
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-400 pb-3">
          AI responses may not always be accurate. Please verify important information.
        </p>
      </div>

      {/* Extraction result panel */}
      <div className="w-[360px] bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 p-5 flex flex-col overflow-hidden">
        <h3 className="font-bold text-gray-900 dark:text-white">Extraction Result</h3>

        {!activeDocId ? (
          <p className="text-sm text-gray-400 mt-4">No document selected.</p>
        ) : extractionLoading ? (
          <p className="text-sm text-gray-400 mt-4">Loading...</p>
        ) : !extraction ? (
          <p className="text-sm text-gray-400 mt-4">No extraction data found.</p>
        ) : (
          <>
            <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
              {Object.entries(extraction).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-gray-500 capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  {value && typeof value === "object" ? (
                    <pre className="mt-1.5 p-3 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs overflow-auto max-h-40 custom-scrollbar whitespace-pre-wrap break-words">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm font-semibold dark:text-white mt-0.5 break-words">
                      {value === null || value === undefined || value === "" ? "—" : String(value)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2 flex-shrink-0">
              {["json", "csv", "excel", "sql"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt)}
                  disabled={exporting === fmt}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:border-[#6139ff] hover:text-[#6139ff] transition disabled:opacity-50"
                >
                  <HiOutlineDownload size={12} />
                  {exporting === fmt ? "..." : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </>
        )}
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
