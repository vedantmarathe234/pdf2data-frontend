import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlinePlus,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowsExpand,
  HiOutlineDocumentText,
  HiCheckCircle,
  HiOutlineChatAlt2,
  HiOutlineDownload,
  HiOutlineExclamation,
} from "react-icons/hi";
import { BsSend } from "react-icons/bs";
import { uploadAndExtract, exportDocument } from "../services/documentService";
import { getSessions } from "../services/chatService";
import { useToast } from "../context/ToastContext";

const PROMPT_EXAMPLES = [
  "Extract Data",
  "Extract tables",
  "Get all dates",
  "Extract names & emails",
  "Convert to JSON",
];

function fileTypeLabel(fileName = "") {
  return fileName.split(".").pop().slice(0, 3).toUpperCase();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState("");
  const [result, setResult] = useState(null); // ProcessingResponse
  const [activeTab, setActiveTab] = useState("Form View");
  const [previewUrl, setPreviewUrl] = useState(null);

  const [recentSessions, setRecentSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const fileInputRef = useRef(null);

  const loadRecentSessions = async () => {
    setSessionsLoading(true);
    try {
      const sessions = await getSessions();
      const sorted = [...sessions].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setRecentSessions(sorted.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    loadRecentSessions();
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

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
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
        prompt || "Extract all structured data"
      );
      setResult(response);
      setActiveTab("Form View");
      toast.success(`Extracted ${Object.keys(response.data || {}).length} fields from ${response.fileName}.`);
      loadRecentSessions();
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data ||
        error.message ||
        "Failed to extract document.";
      toast.error(typeof msg === "string" ? msg : "Failed to extract document.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!result) return;
    setExporting(format);
    try {
      await exportDocument(result.documentId, format);
      toast.success(`Exported as ${format.toUpperCase()}.`);
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting("");
    }
  };

  const confidencePct = result ? Math.round((result.overallConfidence || 0) * 100) : 0;

  return (
    <div className="space-y-6 pt-6">
      <div className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-[24px] p-8 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          What do you want to extract?
        </h2>
        <p className="mt-1.5 text-gray-500 text-sm">
          Ask anything about your document and get structured data in seconds.
        </p>
        <div className="mt-6 border border-gray-400 dark:border-slate-700 rounded-[24px] p-8 flex flex-col md:flex-row gap-8 bg-gray-50/50 dark:bg-slate-950/50">
          <div className="flex-1 flex flex-col justify-between gap-12">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to extract from this document?"
              className="w-full text-base outline-none text-gray-800 dark:text-gray-100 bg-transparent placeholder-gray-400 dark:placeholder-slate-600 focus:ring-0"
            />

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,image/*"
              />
              <button
                onClick={handleFileClick}
                className={`flex items-center gap-3 px-4 py-2 border rounded-full text-sm transition-colors duration-200 ${
                  file
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white dark:bg-slate-900 border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${file ? "bg-indigo-600" : "bg-indigo-50"}`}
                >
                  {file ? (
                    <HiCheckCircle className="text-white" size={14} />
                  ) : (
                    <HiOutlinePlus className="text-indigo-600" size={14} />
                  )}
                </div>
                <span className="font-medium">
                  {file ? file.name : "No file chosen"}
                </span>
              </button>
            </div>
          </div>

          <div className="hidden md:block w-px bg-gray-100"></div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Try these examples:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {PROMPT_EXAMPLES.map((item) => {
                  const isSelected = prompt.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handlePromptSuggestion(item)}
                      className={`px-4 py-2 rounded-full border text-sm transition-colors duration-200 ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-white dark:bg-slate-900 border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end mt-6 md:mt-0">
              <button
                onClick={handleExtract}
                disabled={loading}
                className="bg-[#6139ff] text-white px-7 py-2.5 rounded-full flex items-center gap-2.5 hover:bg-indigo-700 transition shadow-md shadow-indigo-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiOutlineSparkles size={16} />
                )}
                <span className="font-medium text-sm">
                  {loading ? "Extracting..." : "Extract"}
                </span>
                {!loading && <BsSend size={14} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        {/* Document preview */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 shadow-sm p-6 flex flex-col h-[700px]">
          <div className="flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Document Preview
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {file ? file.name : "No file selected"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-3 text-sm font-medium">
                <button className="hover:text-gray-900 transition">
                  <HiOutlineChevronLeft size={18} />
                </button>
                <span>1 / 1</span>
                <button className="hover:text-gray-900 transition">
                  <HiOutlineChevronRight size={18} />
                </button>
              </div>
              <button className="hover:text-gray-900 transition ml-2">
                <HiOutlineArrowsExpand size={18} />
              </button>
            </div>
          </div>

          <div className="mt-6 border border-gray-400 dark:border-slate-700 rounded-[24px] p-8 flex flex-col md:flex-row gap-8 bg-gray-50/50 dark:bg-slate-950/50 flex-1 relative">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full absolute inset-0 border-none rounded-[24px]"
                title="Document Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 p-8 text-center">
                <p className="text-sm">
                  Upload a PDF or image above to see the live preview here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Extraction result */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 shadow-sm p-6 flex flex-col h-[700px] overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Extraction Result
            </h2>

            {result && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  confidencePct >= 70
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {confidencePct}% confidence
              </span>
            )}
          </div>

          {result && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-[#6139ff] font-semibold">
                {result.documentType}
              </span>
              <button
                onClick={() => navigate(`/chat/${result.chatSessionId}`)}
                className="flex items-center gap-1.5 text-[#6139ff] font-semibold hover:underline"
              >
                <HiOutlineChatAlt2 size={14} /> Continue in Chat
              </button>
            </div>
          )}

          <div className="mt-4 flex border-b border-gray-200 dark:border-slate-700">
            {["Form View", "JSON View"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 pb-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "border-b-2 border-[#6139ff] text-[#6139ff]"
                    : "text-gray-500 hover:text-[#6139ff]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4 border border-gray-400 dark:border-slate-700 rounded-[24px] flex flex-col bg-gray-50/50 dark:bg-slate-950/50 overflow-hidden flex-1 relative">
            {!result ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-slate-400 text-center px-6">
                Results will appear here after extraction.
              </div>
            ) : activeTab === "Form View" ? (
              <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-3">
                {Object.entries(result.data || {}).map(([key, value]) => {
                  const conf = result.fieldConfidence?.[key];
                  return (
                    <div key={key} className="min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        {typeof conf === "number" && (
                          <span
                            className={`text-[10px] font-semibold ${
                              conf >= 0.7 ? "text-green-600" : "text-amber-600"
                            }`}
                          >
                            {Math.round(conf * 100)}%
                          </span>
                        )}
                      </div>

                      {value && typeof value === "object" ? (
                        <pre className="mt-2 p-3 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs overflow-auto max-h-40 custom-scrollbar whitespace-pre-wrap break-words">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        <p className="font-semibold dark:text-white mt-1 break-words">
                          {value === null || value === undefined || value === ""
                            ? "—"
                            : String(value)}
                        </p>
                      )}
                    </div>
                  );
                })}

                {result.validationIssues?.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-slate-700 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                      <HiOutlineExclamation size={14} /> Validation notes
                    </p>
                    {result.validationIssues.map((issue, i) => (
                      <div
                        key={i}
                        className={`text-xs rounded-lg px-3 py-2 ${
                          issue.severity === "ERROR"
                            ? "bg-red-50 text-red-600"
                            : issue.severity === "WARNING"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="font-semibold">{issue.field}:</span>{" "}
                        {issue.issue}
                      </div>
                    ))}
                  </div>
                )}

                {result.reasoning?.summary && (
                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-500 mb-1.5">
                      AI Reasoning
                    </p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">
                      {result.reasoning.summary}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <pre className="h-full overflow-auto custom-scrollbar rounded-xl bg-gray-100 dark:bg-slate-950 p-4 text-xs text-gray-800 dark:text-slate-200 whitespace-pre-wrap break-words">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>

          {result && (
            <div className="mt-4 flex gap-2 flex-shrink-0">
              {["json", "csv", "excel", "sql"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt)}
                  disabled={exporting === fmt}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:border-[#6139ff] hover:text-[#6139ff] transition disabled:opacity-50"
                >
                  <HiOutlineDownload size={13} />
                  {exporting === fmt ? "..." : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent documents (real sessions) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 shadow-sm p-6 flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Documents
            </h2>
            <button
              onClick={() => navigate("/history")}
              className="text-xs font-semibold text-[#6139ff] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="border border-gray-400 dark:border-slate-700 rounded-[24px] p-3 flex flex-col gap-1 bg-gray-50/50 dark:bg-slate-950/50 flex-1 overflow-y-auto custom-scrollbar">
            {sessionsLoading ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Loading...
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <p className="text-sm">No recent documents found.</p>
              </div>
            ) : (
              recentSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => navigate(`/chat/${session.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-[#1B253B] transition text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-indigo-500 shrink-0">
                      {fileTypeLabel(session.fileName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium dark:text-white text-sm truncate max-w-[130px]">
                        {session.title || session.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {session.pinned && (
                    <span className="text-[#6139ff] text-xs">★</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
