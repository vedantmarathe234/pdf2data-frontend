import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineChatAlt2,
  HiOutlineDownload,
  HiX,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlinePaperClip,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineTable,
  HiOutlineCode,
} from "react-icons/hi";
import { BsSendFill } from "react-icons/bs";
import { uploadAndExtract, exportDocument } from "../services/documentService";
import { approveAndSaveExtraction } from "../services/extractionService";
import { useToast } from "../context/ToastContext";

const SUGGESTED_PROMPTS = [
  "Extract Data",
  "Extract tables",
  "Get all dates",
  "Extract names & emails",
  "Convert to JSON",
];

const renderValue = (val) => {
  if (val === null || val === undefined || val === "") {
    return <span className="text-zinc-400 dark:text-zinc-500 italic">N/A</span>;
  }

  if (
    typeof val === "string" &&
    val.trim().startsWith("{") &&
    val.trim().endsWith("}")
  ) {
    try {
      return renderValue(JSON.parse(val));
    } catch (e) {}
  }

  if (Array.isArray(val)) {
    if (val.length === 0)
      return (
        <span className="text-zinc-400 dark:text-zinc-500 italic">
          Empty list
        </span>
      );
    return (
      <ul className="space-y-1.5 my-1 pl-3 border-l-2 border-zinc-300 dark:border-zinc-700">
        {val.map((item, idx) => (
          <li
            key={idx}
            className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
          >
            {typeof item === "object" ? renderValue(item) : String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof val === "object") {
    return (
      <div className="pl-3 border-l-2 border-zinc-300 dark:border-zinc-700 space-y-2 my-1.5">
        {Object.entries(val).map(([k, v]) => (
          <div
            key={k}
            className="text-sm flex flex-col sm:flex-row sm:items-start gap-1"
          >
            <span className="font-semibold text-zinc-500 dark:text-zinc-400 capitalize shrink-0 min-w-[95px]">
              {k.replace(/_/g, " ")}:
            </span>
            <div className="flex-1 text-zinc-800 dark:text-zinc-200">
              {renderValue(v)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="text-zinc-800 dark:text-zinc-100 font-medium text-sm">
      {String(val)}
    </span>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState("");
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedResult = localStorage.getItem("pdf2data_active_result");
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        console.error("Failed to parse saved extraction result", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(`${objectUrl}#toolbar=0&navpanes=0&scrollbar=0`);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      localStorage.removeItem("pdf2data_active_result");
    }
  };

  const handlePromptSuggestion = (suggestion) => {
    setPrompt((prev) => {
      if (prev.includes(suggestion)) {
        return prev
          .replace(suggestion, "")
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|\s*,\s*$/g, "")
          .trim();
      }
      return prev.length > 0 ? `${prev}, ${suggestion}` : suggestion;
    });
  };

  const handleExtract = async () => {
    if (!file) {
      toast.error("Please select a document first.");
      return;
    }

    setLoading(true);
    try {
      const response = await uploadAndExtract(
        file,
        prompt || "Extract all structured data verbatim",
      );

      const resultWithStatus = { ...response, isSaved: false };
      setResult(resultWithStatus);
      localStorage.setItem(
        "pdf2data_active_result",
        JSON.stringify(resultWithStatus),
      );

      toast.success("Extraction completed successfully!");
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data || error.message || "Failed to extract document.";
      toast.error(
        typeof msg === "string" ? msg : "Failed to extract document.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndSave = async () => {
    if (!result || !result.documentId) return;

    setSaving(true);
    try {
      await approveAndSaveExtraction({
        documentId: result.documentId,
        rawAiResponse: JSON.stringify(result.data),
        parsedFields: result.data,
      });

      const updatedResult = { ...result, isSaved: true };
      setResult(updatedResult);
      localStorage.setItem(
        "pdf2data_active_result",
        JSON.stringify(updatedResult),
      );

      toast.success("Extraction saved to database.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save extraction.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format) => {
    if (!result) return;
    setExporting(format);
    try {
      await exportDocument(result.documentId, format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error("Export failed.");
    } finally {
      setExporting("");
    }
  };

  const confidencePct = result
    ? Math.round((result.overallConfidence || 0.96) * 100)
    : 96;

  const resetDashboardState = () => {
    setFile(null);
    setPrompt("");
    setResult(null);
    setPreviewUrl(null);
    localStorage.removeItem("pdf2data_active_result");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    const handleReset = () => {
      resetDashboardState();
    };

    window.addEventListener("new-extraction-triggered", handleReset);
    return () => {
      window.removeEventListener("new-extraction-triggered", handleReset);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F4F5F8] dark:bg-[#09090b] p-4 sm:p-6 space-y-6">
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

      <div className="max-w-4xl mx-auto w-full space-y-3 pt-2">
        <div className="bg-white dark:bg-[#121215] rounded-3xl p-4 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything about your document..."
            className="w-full px-3 py-1.5 text-base bg-transparent outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          />

          <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,image/*"
              />

              {!file ? (
                <button
                  onClick={handleFileClick}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                >
                  <HiOutlinePaperClip size={16} />
                  <span>Attach Document</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold">
                  <HiOutlineDocumentText size={16} />
                  <span className="truncate max-w-[160px]">{file.name}</span>
                  <button
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                      setPreviewUrl(null);
                      localStorage.removeItem("pdf2data_active_result");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="hover:text-red-500 ml-1"
                  >
                    <HiX size={14} />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleExtract}
              disabled={loading || !file}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-3xl text-xs font-bold transition shadow-xs ${
                loading || !file
                  ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 cursor-not-allowed shadow-none"
                  : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white cursor-pointer"
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : result ? (
                <HiOutlineRefresh size={15} />
              ) : (
                <BsSendFill size={13} />
              )}
              <span>
                {loading ? "Extracting..." : result ? "Regenerate" : "Send"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar pt-1">
          {SUGGESTED_PROMPTS.map((p) => {
            const isSelected = prompt.toLowerCase().includes(p.toLowerCase());

            return (
              <button
                key={p}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setPrompt((prev) =>
                      prev
                        .replace(p, "")
                        .replace(/^,\s*|,\s*$/g, "")
                        .trim(),
                    );
                  } else {
                    setPrompt((prev) => (prev ? `${prev}, ${p}` : p));
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shadow-xs shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                    : "bg-white dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 hover:border-zinc-900 dark:hover:border-zinc-100"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
      {!file && !result ? (
        <div className="w-full max-w-4xl mx-auto py-8 space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Transform Unstructured PDFs into Clean Data
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Upload any document above to instantly extract tables, key-value
              pairs, dates, and entities with high accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div
              onClick={() =>
                setPrompt("Extract structured key-value pairs and summary")
              }
              className="p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-3xl shadow-xs hover:shadow-md transition cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition transform">
                <HiOutlineDocumentText size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition">
                  Key-Value Extraction
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Auto-detect invoice numbers, dates, addresses, and form
                  details into JSON.
                </p>
              </div>
            </div>

            <div
              onClick={() =>
                setPrompt("Extract all data tables verbatim as structured JSON")
              }
              className="p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-3xl shadow-xs hover:shadow-md transition cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition transform">
                <HiOutlineTable size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition">
                  Table Detection
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Parse complex grid structures and line-item tables without
                  losing formatting.
                </p>
              </div>
            </div>

            <div
              onClick={() =>
                setPrompt("Format extracted data for SQL database import")
              }
              className="p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-3xl shadow-xs hover:shadow-md transition cursor-pointer group space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition transform">
                <HiOutlineCode size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition">
                  Multi-Format Export
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Download your structured outputs instantly as JSON, CSV,
                  Excel, or SQL scripts.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-100/70 dark:bg-[#121215]/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                1
              </span>
              <span>Attach PDF or Image</span>
            </div>
            <div className="hidden sm:block text-zinc-300 dark:text-zinc-700">
              →
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                2
              </span>
              <span>Click Send to Extract</span>
            </div>
            <div className="hidden sm:block text-zinc-300 dark:text-zinc-700">
              →
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                3
              </span>
              <span>Export or Chat with File</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
          {/* Left: Document Viewer */}
          <div className="lg:col-span-6 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <HiOutlineDocumentText
                  className="text-zinc-700 dark:text-zinc-300"
                  size={20}
                />
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[280px]">
                  {file?.name || result?.fileName || "Document Preview"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-semibold">
                <button className="hover:text-zinc-800 dark:hover:text-zinc-200">
                  <HiOutlineChevronLeft size={18} />
                </button>
                <span>Page 1 / 1</span>
                <button className="hover:text-zinc-800 dark:hover:text-zinc-200">
                  <HiOutlineChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-zinc-50 dark:bg-[#09090b] rounded-2xl mt-3 relative overflow-hidden">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-none"
                  title="Document Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-zinc-400 dark:text-zinc-600 font-semibold">
                  Document Preview
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col h-[650px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Extracted Data
                </h3>
                {result && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-semibold whitespace-nowrap">
                    {confidencePct}% Confidence
                  </span>
                )}
              </div>

              {result && (
                <button
                  onClick={() => navigate(`/chat/${result.chatSessionId}`)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition whitespace-nowrap"
                >
                  <HiOutlineChatAlt2 size={15} />
                  <span>Continue in Chat</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {!result ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 text-center gap-3 p-6">
                  <div>
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      Document Attached
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      Click "Send" in the top bar to run AI extraction.
                    </p>
                  </div>
                </div>
              ) : (
                Object.entries(result.data || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3.5 bg-zinc-50/70 dark:bg-[#09090b] rounded-2xl border border-zinc-200 dark:border-zinc-800/80"
                  >
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider block mb-1">
                      {key.replace(/_/g, " ")}
                    </span>
                    <div className="text-sm">{renderValue(value)}</div>
                  </div>
                ))
              )}
            </div>

            {result && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleExtract}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-3xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition whitespace-nowrap"
                  >
                    <HiOutlineRefresh
                      size={14}
                      className={`inline mr-1.5 ${loading ? "animate-spin" : ""}`}
                    />
                    Re-generate
                  </button>

                  <button
                    onClick={handleApproveAndSave}
                    disabled={saving || result.isSaved}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-3xl text-xs font-semibold text-white transition whitespace-nowrap shadow-xs ${
                      result.isSaved
                        ? "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    <HiOutlineShieldCheck size={16} className="inline mr-1.5" />
                    {saving
                      ? "Saving..."
                      : result.isSaved
                        ? "Saved"
                        : "Approve & Save"}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1">
                    Export:
                  </span>
                  {["json", "csv", "excel", "sql"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      disabled={exporting === fmt}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition uppercase"
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
