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

const EXPORT_FORMATS = [
  { key: "json", label: "JSON", className: "bg-[#7C3AED] hover:bg-[#6D28D9]" },
  { key: "csv", label: "CSV", className: "bg-[#14B8A6] hover:bg-[#0D9488]" },
  { key: "excel", label: "EXCEL", className: "bg-[#16A34A] hover:bg-[#15803D]" },
  { key: "sql", label: "SQL", className: "bg-[#F97316] hover:bg-[#EA580C]" },
];

const renderValue = (val) => {
  if (val === null || val === undefined || val === "") {
    return <span className="text-gray-400 dark:text-[#A5A1C4]/60 italic">N/A</span>;
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
        <span className="text-gray-400 dark:text-[#A5A1C4]/60 italic">
          Empty list
        </span>
      );
    return (
      <ul className="space-y-1.5 my-1 pl-3 border-l-2 border-gray-200 dark:border-[#332C57]">
        {val.map((item, idx) => (
          <li
            key={idx}
            className="text-sm text-gray-700 dark:text-[#D6D3E8] leading-relaxed"
          >
            {typeof item === "object" ? renderValue(item) : String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof val === "object") {
    return (
      <div className="pl-3 border-l-2 border-gray-200 dark:border-[#332C57] space-y-2 my-1.5">
        {Object.entries(val).map(([k, v]) => (
          <div
            key={k}
            className="text-sm flex flex-col sm:flex-row sm:items-start gap-1"
          >
            <span className="font-semibold text-gray-500 dark:text-[#A5A1C4] capitalize shrink-0 min-w-[95px]">
              {k.replace(/_/g, " ")}:
            </span>
            <div className="flex-1 text-gray-800 dark:text-[#E9E7F5]">
              {renderValue(v)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="text-gray-800 dark:text-white font-medium text-sm">
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
    <div className="w-full min-h-screen bg-[#F8F8FC] dark:bg-black/60 p-4 sm:p-5 space-y-4">
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
          background: #e5cef5;
          border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #332C57;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #D946EF;
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #e5cef5 transparent;
        }
        .dark * {
          scrollbar-color: #332C57 transparent;
        }
      `}</style>

      <div className="max-w-4xl mx-auto w-full space-y-2.5 pt-1">
        <div className="bg-white dark:bg-[#1E1A3B] rounded-3xl p-3.5 border border-gray-200/80 dark:border-[#332C57] shadow-xs space-y-2.5">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything about your document..."
            className="w-full px-3 py-1 text-sm bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-[#A5A1C4]/50"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#332C57]">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#251F47] text-gray-700 dark:text-[#E9E7F5] text-xs font-semibold hover:bg-gray-200 dark:hover:bg-[#2D2657] transition cursor-pointer"
                >
                  <HiOutlinePaperClip size={15} />
                  <span>Attach Document</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#251F47] border border-gray-300 dark:border-[#3D3868] text-gray-800 dark:text-[#E9E7F5] text-xs font-semibold">
                  <HiOutlineDocumentText size={15} />
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
                    <HiX size={13} />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleExtract}
              disabled={loading || !file}
              className={`flex items-center gap-2 px-5 py-2 rounded-3xl text-xs font-bold transition shadow-xs ${
                loading || !file
                  ? "bg-gray-200 dark:bg-[#251F47] text-gray-400 dark:text-[#A5A1C4]/40 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white cursor-pointer"
              }`}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : result ? (
                <HiOutlineRefresh size={14} />
              ) : (
                <BsSendFill size={12} />
              )}
              <span>
                {loading ? "Extracting..." : result ? "Regenerate" : "Send"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
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
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition shadow-xs shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white border-transparent"
                    : "bg-white dark:bg-[#1E1A3B] text-gray-700 dark:text-[#E9E7F5] border-gray-200/80 dark:border-[#332C57] hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#EC4899] hover:text-white hover:border-transparent"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {!file && !result ? (
        <div className="w-full max-w-4xl mx-auto py-6 space-y-6 animate-fadeIn">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Transform Unstructured PDFs into Clean Data
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-[#A5A1C4] max-w-xl mx-auto">
              Upload any document above to instantly extract tables, key-value
              pairs, dates, and entities with high accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left">
            <div
              onClick={() =>
                setPrompt("Extract structured key-value pairs and summary")
              }
              className="p-4 bg-white dark:bg-[#1E1A3B] border border-gray-200/80 dark:border-[#332C57] hover:border-[#8B5CF6] dark:hover:border-[#8B5CF6] rounded-3xl shadow-xs hover:shadow-md transition cursor-pointer group space-y-2.5"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center font-bold text-base group-hover:scale-105 transition transform">
                <HiOutlineDocumentText size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#C084FC] transition">
                  Key-Value Extraction
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-0.5 leading-relaxed">
                  Auto-detect invoice numbers, dates, addresses, and form
                  details into JSON.
                </p>
              </div>
            </div>

            <div
              onClick={() =>
                setPrompt("Extract all data tables verbatim as structured JSON")
              }
              className="p-4 bg-white dark:bg-[#1E1A3B] border border-gray-200/80 dark:border-[#332C57] hover:border-[#8B5CF6] dark:hover:border-[#8B5CF6] rounded-3xl shadow-xs hover:shadow-md transition cursor-pointer group space-y-2.5"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center font-bold text-base group-hover:scale-105 transition transform">
                <HiOutlineTable size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#C084FC] transition">
                  Table Detection
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-0.5 leading-relaxed">
                  Parse complex grid structures and line-item tables without
                  losing formatting.
                </p>
              </div>
            </div>

            <div
              onClick={() =>
                setPrompt("Format extracted data for SQL database import")
              }
              className="p-4 bg-white dark:bg-[#1E1A3B] border border-gray-200/80 dark:border-[#332C57] hover:border-[#8B5CF6] dark:hover:border-[#8B5CF6] rounded-3xl shadow-xs hover:shadow-md transition cursor-pointer group space-y-2.5"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white flex items-center justify-center font-bold text-base group-hover:scale-105 transition transform">
                <HiOutlineCode size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#C084FC] transition">
                  Multi-Format Export
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-0.5 leading-relaxed">
                  Download your structured outputs instantly as JSON, CSV,
                  Excel, or SQL scripts.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full max-w-7xl mx-auto">
          {/* Left: Document Viewer */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E1A3B] border border-gray-200/80 dark:border-[#332C57] rounded-3xl p-4 shadow-xs flex flex-col h-[580px]">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 dark:border-[#332C57]">
              <div className="flex items-center gap-2">
                <HiOutlineDocumentText
                  className="text-gray-700 dark:text-[#A5A1C4]"
                  size={18}
                />
                <span className="text-xs font-bold text-gray-800 dark:text-white truncate max-w-[280px]">
                  {file?.name || result?.fileName || "Document Preview"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 dark:text-[#A5A1C4]/60 text-xs font-semibold">
                <button className="hover:text-gray-800 dark:hover:text-white">
                  <HiOutlineChevronLeft size={16} />
                </button>
                <span>Page 1 / 1</span>
                <button className="hover:text-gray-800 dark:hover:text-white">
                  <HiOutlineChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-[#171331] rounded-2xl mt-2.5 relative overflow-hidden">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-none"
                  title="Document Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400 dark:text-[#A5A1C4]/50 font-semibold">
                  Document Preview
                </div>
              )}
            </div>
          </div>

          {/* Right: Extracted Data */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E1A3B] border border-gray-200/80 dark:border-[#332C57] rounded-3xl p-4 shadow-xs flex flex-col h-[580px]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#332C57] shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  Extracted Data
                </h3>
                {result && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold whitespace-nowrap">
                    {confidencePct}% Confidence
                  </span>
                )}
              </div>

              {result && (
                <button
                  onClick={() => navigate(`/chat/${result.chatSessionId}`)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-3xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white text-xs font-semibold transition whitespace-nowrap shadow-xs"
                >
                  <HiOutlineChatAlt2 size={14} />
                  <span>Continue in Chat</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-2.5 space-y-2.5">
              {!result ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-[#A5A1C4]/60 text-center gap-2 p-4">
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-[#E9E7F5]">
                      Document Attached
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-[#A5A1C4]/60 mt-0.5">
                      Click "Send" in the top bar to run AI extraction.
                    </p>
                  </div>
                </div>
              ) : (
                Object.entries(result.data || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 bg-[#8B5CF6]/5 dark:bg-[#171331] rounded-2xl border border-gray-200 dark:border-[#332C57]/80"
                  >
                    <span className="text-[11px] font-bold text-gray-800 dark:text-[#D6D3E8] uppercase tracking-wider block mb-1">
                      {key.replace(/_/g, " ")}
                    </span>
                    <div className="text-sm">{renderValue(value)}</div>
                  </div>
                ))
              )}
            </div>

            {result && (
              <div className="pt-2.5 border-t border-gray-100 dark:border-[#332C57] flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={handleExtract}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-3 py-1 rounded-3xl border border-gray-200 dark:border-[#3D3868] text-[11px] font-semibold text-gray-700 dark:text-[#E9E7F5] hover:bg-gray-100 dark:hover:bg-[#251F47] transition whitespace-nowrap"
                  >
                    <HiOutlineRefresh
                      size={13}
                      className={`inline mr-1 ${loading ? "animate-spin" : ""}`}
                    />
                    Re-generate
                  </button>

                  <button
                    onClick={handleApproveAndSave}
                    disabled={saving || result.isSaved}
                    className={`flex-1 sm:flex-none px-3.5 py-1 rounded-3xl text-[11px] font-semibold transition whitespace-nowrap shadow-xs flex items-center justify-center gap-1 ${
                      result.isSaved
                        ? "border border-[#EC4899]/40 text-[#EC4899] bg-transparent cursor-not-allowed"
                        : "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] text-white"
                    }`}
                  >
                    <HiOutlineShieldCheck size={14} />
                    {saving
                      ? "Saving..."
                      : result.isSaved
                        ? "Saved"
                        : "Approve & Save"}
                  </button>
                </div>

                <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-[#A5A1C4]/60 uppercase tracking-wider mr-1">
                    Export:
                  </span>
                  {EXPORT_FORMATS.map((fmt) => (
                    <button
                      key={fmt.key}
                      onClick={() => handleExport(fmt.key)}
                      disabled={exporting === fmt.key}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white transition uppercase ${fmt.className}`}
                    >
                      {fmt.label}
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