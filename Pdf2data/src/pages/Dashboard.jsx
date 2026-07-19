import { useState, useRef, useEffect } from "react";
import {
  HiOutlineSparkles,
  HiOutlinePlus,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowsExpand,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineUser,
  HiCheckCircle,
} from "react-icons/hi";
import { BsSend } from "react-icons/bs";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [activeTab, setActiveTab] = useState("Form View");
  const [recentDocs, setRecentDocs] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(`${objectUrl}#toolbar=0&navpanes=0&scrollbar=0`);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePromptSuggestion = (suggestion) => {
    setPrompt((prevPrompt) => {
      if (prevPrompt.includes(suggestion)) {
        return prevPrompt
          .replace(suggestion, "")
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|\s*,\s*$/g, "")
          .trim();
      } else {
        return prevPrompt.length > 0
          ? `${prevPrompt}, ${suggestion}`
          : suggestion;
      }
    });
  };

  const handleExtract = async () => {
    if (!file) {
      alert("Please select a document first.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt || "Extract all structured data");

    try {
      const response = await fetch(
        "http://localhost:8080/api/processing/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Extraction failed on the server.");

      const data = await response.json();
      setExtractedData(data);

      const fileExt = file.name.split(".").pop().toUpperCase();
      setRecentDocs((prev) => [
        {
          name: file.name,
          time: "Just now",
          pages: "1 page",
          type: fileExt.substring(0, 3),
          color: "bg-indigo-500",
        },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
      alert("Failed to extract document.");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex flex-wrap  gap-2.5">
                {[
                  "Extract Data",
                  "Extract tables",
                  "Get all dates",
                  "Extract names & emails",
                  "Convert to JSON",
                ].map((item) => {
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
                <span>1 / 2</span>
                <button className="hover:text-gray-900 transition">
                  <HiOutlineChevronRight size={18} />
                </button>
              </div>
              <button className="hover:text-gray-900 transition ml-2">
                <HiOutlineArrowsExpand size={18} />
              </button>
            </div>
          </div>

          <div className="mt-6 border border-gray-400 dark:border-slate-700 rounded-[24px] p-8 flex flex-col md:flex-row gap-8 bg-gray-50/50 dark:bg-slate-950/50 flex-1 relative ">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full absolute  inset-0 border-none"
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

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 shadow-sm p-6 flex flex-col h-[700px] overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Extraction Result
            </h2>

            {extractedData && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Success
              </span>
            )}
          </div>

          <div className="mt-6 flex border-b border-gray-200 dark:border-slate-700">
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

          <div className="mt-6 border border-gray-400 items-center justify-center dark:border-slate-700 rounded-[24px] flex flex-col md:flex-row gap-8 bg-gray-50/50 dark:bg-slate-950/50 overflow-hidden flex-1 relative">
            {!extractedData ? (
              <div className="text-sm text-gray-500 dark:text-slate-400 text-center">
                <p className="text-sm">
                  {" "}
                  Results will appear here after extraction.
                </p>
              </div>
            ) : activeTab === "Form View" ? (
              <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-3">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </p>

                    {typeof value === "object" ? (
                      <pre className="mt-2 p-3 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs overflow-auto max-h-40 custom-scrollbar whitespace-pre-wrap break-words">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <p className="font-semibold dark:text-white mt-1 break-words">
                        {String(value)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <pre
                className="h-full
            overflow-auto
            custom-scrollbar
            rounded-xl
            bg-gray-100
            dark:bg-slate-950
            p-4
            text-xs
            text-gray-800
            dark:text-slate-200
            whitespace-pre-wrap
            break-words"
              >
                {JSON.stringify(extractedData, null, 2)}
              </pre>
            )}
          </div>
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[24px] border border-gray-300 dark:border-slate-800 shadow-sm p-6 flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Documents
            </h2>
            <button
              className="
bg-white
dark:bg-slate-800
border
border-gray-200
dark:border-slate-700
text-gray-700
dark:text-slate-200
"
            >
              View all
            </button>
          </div>

          <div className="mt-6 border border-gray-400 items-center justify-center dark:border-slate-700 rounded-[24px] p-8 flex flex-col md:flex-row gap-8 bg-gray-50/50 dark:bg-slate-950/50 flex-1 relative">
            {recentDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 mt-10">
                <p className="text-sm">No recent documents found.</p>
              </div>
            ) : (
              recentDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-[#1B253B] transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold ${doc.color}`}
                    >
                      {doc.type}
                    </div>

                    <div>
                      <p className="font-medium dark:text-white text-sm truncate max-w-[120px]">
                        {doc.name}
                      </p>

                      <p className="text-xs text-gray-500">{doc.time}</p>
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">{doc.pages}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
