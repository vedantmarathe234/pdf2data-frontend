import React, { useEffect, useState } from "react";
import { fetchExtractionLogs, downloadExtractionFile } from "../services/adminService";
import { 
  HiOutlineSearch, 
  HiOutlineDownload, 
  HiOutlineDocumentText, 
  HiOutlineUser,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown
} from "react-icons/hi";

export default function AdminExtractions() {
  const [extractions, setExtractions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchExtractionLogs();
      setExtractions(data);
    } catch (err) {
      setError(err.message || "Failed to load extractions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = extractions.filter(
    (item) =>
      item.fileName?.toLowerCase().includes(search.toLowerCase()) ||
      item.username?.toLowerCase().includes(search.toLowerCase()) ||
      item.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            Extracted Documents
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Audit history of all processed PDFs across the platform
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <HiOutlineSearch size={18} className="absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by document or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 uppercase tracking-wider text-[10px] font-bold text-zinc-400 border-b border-zinc-200/80 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-6">Document Info</th>
                <th className="py-3.5 px-6">Owner / User</th>
                <th className="py-3.5 px-6">Processed On</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-zinc-400">
                    Loading records...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-zinc-400">
                    No extractions found.
                  </td>
                </tr>
              ) : (
                currentItems.map((row) => (
                  <tr key={row.documentId || row.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 font-bold">
                          <HiOutlineDocumentText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">
                            {row.fileName}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            ID: #{row.documentId || row.id} {row.fileSize ? `• ${(row.fileSize / 1024).toFixed(1)} KB` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-[10px]">
                          <HiOutlineUser size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">
                            {row.username}
                          </p>
                          <p className="text-[11px] text-zinc-400">{row.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-500">
                      {row.timestamp ? new Date(row.timestamp).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                        {row.status || "SUCCESS"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => downloadExtractionFile(row.documentId || row.id, row.fileName)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <HiOutlineDownload size={14} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-end gap-6 bg-zinc-50/50 dark:bg-zinc-900/30">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Showing {filtered.length === 0 ? 0 : `${startIndex + 1}-${endIndex}`} of {filtered.length} items
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <HiChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                    currentPage === page
                      ? "border border-amber-500/80 text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <HiChevronRight size={16} />
              </button>
            </div>

            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-1.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <HiChevronDown size={14} className="absolute right-2.5 top-2.5 text-zinc-400 pointer-events-none" />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}