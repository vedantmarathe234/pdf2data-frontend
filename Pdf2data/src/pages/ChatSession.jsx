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
  HiChat,
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
    if (!sessionId) return;
    setLoadingSession(true);
    try {
      const data = await getSessionDetails(sessionId);
      setSession(data?.session || null);
      setDocuments(data?.documents || []);
      setMessages(data?.messages || []);
      
      if (data?.documents?.length > 0) {
        setActiveDocId((prev) =>
          data.documents.some((d) => d.documentId === prev)
            ? prev
            : data.documents[data.documents.length - 1].documentId
        );
      } else {
        setActiveDocId(null);
      }
    } catch (err) {
      console.error("Failed to load session details:", err);
      toast.error("Could not load this chat session.");
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
    let isMounted = true;
    setExtractionLoading(true);

    getExtractionData(activeDocId)
      .then((res) => {
        if (isMounted) setExtraction(res || null);
      })
      .catch((err) => {
        console.error("Failed to fetch extraction data:", err);
        if (isMounted) setExtraction(null);
      })
      .finally(() => {
        if (isMounted) setExtractionLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeDocId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || asking || !sessionId) return;

    setInput("");
    const userMsgId = `local-user-${Date.now()}`;
    const userMessageObj = {
      id: userMsgId,
      role: "USER",
      message: trimmedInput,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setAsking(true);

    try {
      const res = await askQuestion(sessionId, trimmedInput);
      const assistantMessageObj = {
        id: `local-assistant-${Date.now()}`,
        role: "ASSISTANT",
        message: res?.reply || "No response received from assistant.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessageObj]);
    } catch (err) {
      console.error("Failed to process question:", err);
      const errorMsg =
        err.response?.data?.message || err.response?.data || "Something went wrong. Please try again.";
      toast.error(typeof errorMsg === "string" ? errorMsg : "Request failed.");
      
      setMessages((prev) => [
        ...prev,
        {
          id: `local-err-${Date.now()}`,
          role: "ASSISTANT",
          message: "⚠️ I couldn't process your request right now. Please try again.",
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
    if (!file || !sessionId) return;

    setUploading(true);
    try {
      const res = await uploadAndExtract(file, "Extract all structured data", sessionId);
      toast.success(`${file.name} added successfully.`);
      await loadSession();
      if (res?.documentId) {
        setActiveDocId(res.documentId);
      }
    } catch (err) {
      console.error("Document upload error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Upload failed.";
      toast.error(typeof errorMsg === "string" ? errorMsg : "Document upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handlePin = async () => {
    if (!session || !sessionId) return;
    const previousPinnedState = session.pinned;
    setSession((prev) => ({ ...prev, pinned: !prev.pinned }));
    try {
      await togglePinSession(sessionId);
    } catch (err) {
      console.error("Failed to update pin state:", err);
      setSession((prev) => ({ ...prev, pinned: previousPinnedState }));
      toast.error("Could not update pin status.");
    }
  };

  const submitTitle = async () => {
    setEditingTitle(false);
    const newTitle = titleDraft.trim();
    if (!newTitle || newTitle === session?.title || !sessionId) return;

    const previousTitle = session.title;
    setSession((prev) => ({ ...prev, title: newTitle }));
    try {
      await renameSession(sessionId, newTitle);
      toast.success("Chat renamed successfully.");
    } catch (err) {
      console.error("Failed to rename session:", err);
      setSession((prev) => ({ ...prev, title: previousTitle }));
      toast.error("Failed to rename chat.");
    }
  };

  const handleDelete = async () => {
    if (!sessionId) return;
    setDeleting(true);
    try {
      await deleteSession(sessionId);
      toast.success("Chat session deleted.");
      navigate("/history");
    } catch (err) {
      console.error("Failed to delete session:", err);
      toast.error("Failed to delete chat session.");
      setDeleting(false);
    }
  };

  const handleExport = async (format) => {
    if (!activeDocId) {
      toast.error("No active document selected for export.");
      return;
    }
    setExporting(format);
    try {
      await exportDocument(activeDocId, format);
      toast.success(`Successfully exported as ${format.toUpperCase()}.`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export operation failed.");
    } finally {
      setExporting("");
    }
  };

  if (loadingSession) {
    return (
      <div className="w-full h-[calc(100vh-5rem)] bg-[#F8F8FC] dark:bg-[#0B0A10] flex items-center justify-center text-gray-400 dark:text-[#A5A1C4] text-sm font-medium transition-colors duration-200">
        Loading chat session...
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-5rem)] bg-[#F8F8FC] dark:bg-[#0B0A10] text-[#2D2A4A] dark:text-[#E9E7F5] p-6 lg:p-8 flex flex-col overflow-hidden transition-colors duration-200">
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

      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center justify-between px-1 shrink-0 h-8">
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
              className="text-sm font-bold w-full outline-none border-b border-gray-300 dark:border-[#3D3868] bg-transparent text-gray-900 dark:text-white"
            />
          ) : (
            <h1
              onDoubleClick={() => {
                setTitleDraft(session?.title || "");
                setEditingTitle(true);
              }}
              className="text-base font-bold text-[#1E1B4B] dark:text-white truncate cursor-text hover:text-purple-600 dark:hover:text-[#C084FC] transition"
              title="Double-click to rename"
            >
              {session?.title || "Chat"}
            </h1>
          )}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden">
          <div className="flex-1 flex flex-col bg-white dark:bg-[#1A1635] rounded-xl border border-[#E2E8F0] dark:border-[#332C57] shadow-xl overflow-hidden h-full transition-colors duration-200">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#E2E8F0] dark:border-[#332C57] overflow-x-auto shrink-0 bg-white dark:bg-[#1A1635] transition-colors duration-200">
              {documents.map((doc) => (
                <button
                  key={doc.documentId}
                  onClick={() => setActiveDocId(doc.documentId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 cursor-pointer ${
                    activeDocId === doc.documentId
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-md"
                      : "bg-gray-50 dark:bg-[#251F47] text-gray-600 dark:text-[#A5A1C4] border border-gray-200 dark:border-[#332C57] hover:border-[#8B5CF6]/50"
                  }`}
                >
                  <HiOutlineDocumentText size={13} />
                  <span className="truncate max-w-[140px]">{doc.fileName}</span>
                </button>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 dark:border-[#332C57] text-xs font-semibold text-gray-600 dark:text-[#A5A1C4] hover:border-[#8B5CF6] hover:text-gray-900 dark:hover:text-white transition disabled:opacity-50 shrink-0 cursor-pointer bg-gray-50/50 dark:bg-[#251F47]/50"
              >
                <HiOutlinePaperClip size={13} />
                <span>{uploading ? "Uploading..." : "+ Add"}</span>
              </button>
              <input
                type="file"
                accept=".pdf,image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAddDocument}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-2.5 my-auto">
                  <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white shadow-lg">
                      <HiChat size={18} />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-[#A5A1C4]">
                    Ask anything about the document attached above.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id || `msg-${Math.random()}`}
                    className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === "USER"
                          ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-br-xs shadow-md"
                          : "bg-gray-100 dark:bg-[#251F47] text-gray-900 dark:text-[#E9E7F5] border border-gray-200 dark:border-[#332C57] rounded-bl-xs shadow-md"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
              {asking && (
                <div className="flex justify-start">
                  <div className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-[#251F47] border border-gray-200 dark:border-[#332C57] text-xs text-gray-500 dark:text-[#A5A1C4] flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2.5 border-t border-[#E2E8F0] dark:border-[#332C57] shrink-0 space-y-1 bg-white dark:bg-[#1A1635] transition-colors duration-200">
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
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#251F47] border border-gray-200 dark:border-[#332C57] outline-none text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#A5A1C4]/50 transition disabled:opacity-60 focus:border-[#8B5CF6]"
                />
                <button
                  onClick={handleSend}
                  disabled={asking || !input.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white disabled:opacity-40 transition cursor-pointer shadow-md"
                >
                  <HiArrowUp size={15} />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 dark:text-[#A5A1C4]/60 font-medium">
                AI responses may not always be accurate.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-[340px] bg-white dark:bg-[#1A1635] rounded-xl border border-[#E2E8F0] dark:border-[#332C57] p-3 flex flex-col shadow-xl overflow-hidden shrink-0 h-full transition-colors duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#332C57] shrink-0">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white tracking-wide">
                Extraction Result
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePin}
                  title={session?.pinned ? "Unpin" : "Pin"}
                  className="p-1 rounded-lg text-gray-500 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#251F47] transition cursor-pointer"
                >
                  {session?.pinned ? (
                    <HiStar size={14} className="text-purple-600 dark:text-[#C084FC]" />
                  ) : (
                    <HiOutlineStar size={14} />
                  )}
                </button>
                <button
                  onClick={() => {
                    setTitleDraft(session?.title || "");
                    setEditingTitle(true);
                  }}
                  title="Rename"
                  className="p-1 rounded-lg text-gray-500 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#251F47] transition cursor-pointer"
                >
                  <HiOutlinePencil size={14} />
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  title="Delete"
                  className="p-1 rounded-lg text-gray-500 dark:text-[#A5A1C4] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                >
                  <HiOutlineTrash size={14} />
                </button>
              </div>
            </div>

            {!activeDocId ? (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400 dark:text-[#A5A1C4]/60 font-medium">
                No document selected.
              </div>
            ) : extractionLoading ? (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400 dark:text-[#A5A1C4]/60 font-medium">
                Loading extraction...
              </div>
            ) : !extraction ? (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400 dark:text-[#A5A1C4]/60 font-medium">
                No extraction data found.
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto my-2 space-y-2 pr-1 min-h-0">
                  {Object.entries(extraction).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-2 bg-gray-50 dark:bg-[#251F47] rounded-xl border border-gray-200 dark:border-[#332C57] shadow-sm"
                    >
                      <span className="text-[10px] font-bold text-gray-500 dark:text-[#A5A1C4]/70 uppercase tracking-wider block mb-0.5">
                        {key.replace(/_/g, " ")}
                      </span>
                      {value && typeof value === "object" ? (
                        <pre className="p-1.5 rounded-lg bg-white dark:bg-[#120F24] border border-gray-200 dark:border-[#332C57] text-[10px] font-mono text-gray-800 dark:text-[#E9E7F5] overflow-x-auto whitespace-pre-wrap break-words">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-xs font-semibold text-gray-900 dark:text-white break-words">
                          {value === null || value === undefined || value === ""
                            ? "—"
                            : String(value)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-[#E2E8F0] dark:border-[#332C57] flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-[#A5A1C4]/60 uppercase tracking-wider mr-1">
                    Export:
                  </span>
                  {[
                    { key: "json", label: "JSON", className: "bg-[#7C3AED] hover:bg-[#6D28D9]" },
                    { key: "csv", label: "CSV", className: "bg-[#14B8A6] hover:bg-[#0D9488]" },
                    { key: "excel", label: "EXCEL", className: "bg-[#16A34A] hover:bg-[#15803D]" },
                    { key: "sql", label: "SQL", className: "bg-[#F97316] hover:bg-[#EA580C]" },
                  ].map((fmt) => (
                    <button
                      key={fmt.key}
                      onClick={() => handleExport(fmt.key)}
                      disabled={exporting === fmt.key}
                      className={`flex-1 py-1 px-1 rounded-md text-[10px] font-bold text-white transition uppercase cursor-pointer ${fmt.className}`}
                    >
                      {exporting === fmt.key ? "..." : fmt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
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