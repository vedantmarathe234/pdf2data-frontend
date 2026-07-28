import { useEffect, useState } from "react";
import {
  HiOutlineSearch,
  HiOutlineDotsVertical,
  HiOutlineDownload,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
} from "react-icons/hi";

import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";

import {
  getExtractions,
  downloadJson,
  downloadCsv,
  downloadExcel,
  downloadSql,
} from "../../services/extractionService";
import ExtractionModal from "./ExtractionModal";

export default function ExtractionPage() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getExtractions();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch extractions:", err);
      setDocuments([]);
    }
  };

  const filtered = documents
    .filter((doc) => {
      const fileName = doc.fileName || doc.title || "";
      const searchMatch = fileName.toLowerCase().includes(search.toLowerCase());

      const docStatus = (doc.status || "Success").toUpperCase();
      let statusMatch = statusFilter === "All";
      if (statusFilter === "Success") {
        statusMatch = docStatus === "SUCCESS" || docStatus === "COMPLETED";
      } else if (statusFilter === "Pending") {
        statusMatch = docStatus === "PENDING" || docStatus === "PROCESSING";
      } else if (statusFilter === "Failed") {
        statusMatch = docStatus === "FAILED" || docStatus === "ERROR";
      }

      const typeMatch = typeFilter === "All" || doc.documentType === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    })
    .sort((a, b) => {
      const dateA = a.extractedAt || a.processedAt || a.uploadDate || 0;
      const dateB = b.extractedAt || b.processedAt || b.uploadDate || 0;
      return new Date(dateB) - new Date(dateA);
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getFileIcon = (fileName = "") => {
    const extension = fileName.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return <FaFilePdf className="text-red-500 text-lg shrink-0" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500 text-lg shrink-0" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="text-emerald-500 text-lg shrink-0" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FaFileImage className="text-purple-500 text-lg shrink-0" />;
      default:
        return <FaFileAlt className="text-zinc-400 text-lg shrink-0" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F5F8] dark:bg-[#09090b] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#121215] p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
          <input
            type="text"
            placeholder="Search extractions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <option value="All">All Types</option>
            {[...new Set(documents.map((d) => d.documentType))]
              .filter(Boolean)
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#09090b]/40 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                <th className="py-4 px-6">Document</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Extracted At</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
              {currentItems.map((doc, idx) => {
                const docId = doc.documentId || doc.id;
                const uniqueKey = `${docId}_${idx}`;
                const dateStr =
                  doc.extractedAt || doc.processedAt || doc.uploadDate;

                const isFailed =
                  doc.status === "Failed" || doc.status === "ERROR";
                const isPending =
                  doc.status === "Pending" || doc.status === "PROCESSING";

                return (
                  <tr
                    key={uniqueKey}
                    onClick={() => setSelectedId(docId)}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.fileName)}
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white truncate max-w-[240px]">
                          {doc.fileName || "Untitled Document"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {doc.documentType || "GENERAL_DOCUMENT"}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isFailed
                            ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50"
                            : isPending
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                              : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
                        }`}
                      >
                        {doc.status || "Success"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {dateStr ? new Date(dateStr).toLocaleString() : "-"}
                    </td>

                    <td
                      className="py-4 px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === uniqueKey ? null : uniqueKey,
                            )
                          }
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                          <HiOutlineDotsVertical size={16} />
                        </button>

                        {activeDropdown === uniqueKey && (
                          <div
                            onMouseLeave={() => setActiveDropdown(null)}
                            className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-lg p-1.5 z-20 space-y-0.5 text-left"
                          >
                            <button
                              onClick={() => {
                                downloadJson(docId);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                            >
                              <HiOutlineDownload size={14} /> Download JSON
                            </button>
                            <button
                              onClick={() => {
                                downloadCsv(docId);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                            >
                              <HiOutlineDownload size={14} /> Download CSV
                            </button>
                            <button
                              onClick={() => {
                                downloadExcel(docId);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                            >
                              <HiOutlineDownload size={14} /> Download Excel
                            </button>
                            <button
                              onClick={() => {
                                downloadSql(docId);
                                setActiveDropdown(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                            >
                              <HiOutlineDownload size={14} /> Download SQL
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm"
                  >
                    No extractions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
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

      {selectedId && (
        <ExtractionModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
