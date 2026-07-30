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
    <div className="min-h-screen bg-[#0b0b14] text-white p-6 sm:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-indigo-950/60">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Extracted Documents
            </h1>
            <p className="text-xs text-indigo-300/70 mt-1">
              Audit history of all processed PDFs across the platform
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <HiOutlineSearch size={18} className="absolute left-3.5 top-3 text-indigo-400/60" />
            <input
              type="text"
              placeholder="Search by document or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#121222] border border-indigo-950 rounded-2xl text-xs text-white placeholder-indigo-400/40 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-950/50 border border-red-900/80 text-red-400 text-xs font-medium rounded-2xl">
            {error}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-[#121222] border border-indigo-950/80 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-indigo-200/80">
              <thead className="bg-[#17172c] uppercase tracking-wider text-[10px] font-bold text-indigo-300/60 border-b border-indigo-950">
                <tr>
                  <th className="py-4 px-6">Document Info</th>
                  <th className="py-4 px-6">Owner / User</th>
                  <th className="py-4 px-6">Processed On</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/60">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-indigo-300/50">
                      Loading records...
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-indigo-300/50">
                      No extractions found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((row) => (
                    <tr key={row.documentId || row.id} className="hover:bg-purple-950/20 transition duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold">
                            <HiOutlineDocumentText size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {row.fileName}
                            </p>
                            <p className="text-[11px] text-indigo-300/50">
                              ID: #{row.documentId || row.id} {row.fileSize ? `• ${(row.fileSize / 1024).toFixed(1)} KB` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-950 border border-indigo-900 flex items-center justify-center text-indigo-300 font-bold text-[10px]">
                            <HiOutlineUser size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {row.username}
                            </p>
                            <p className="text-[11px] text-indigo-300/50">{row.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-indigo-300/70">
                        {row.timestamp ? new Date(row.timestamp).toLocaleString() : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 uppercase tracking-wider">
                          {row.status || "SUCCESS"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => downloadExtractionFile(row.documentId || row.id, row.fileName)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600 hover:text-white text-purple-300 font-semibold text-xs transition inline-flex items-center gap-1.5 cursor-pointer shadow-md"
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

          {/* Pagination Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-4 border-t border-indigo-950/80 flex items-center justify-end gap-6 bg-[#0f0f1d]">
              <p className="text-xs text-indigo-300/60">
                Showing {filtered.length === 0 ? 0 : `${startIndex + 1}-${endIndex}`} of {filtered.length} items
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-indigo-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <HiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      currentPage === page
                        ? "border border-purple-500 text-purple-300 font-bold bg-purple-600/20 shadow-xs"
                        : "text-indigo-300/60 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-indigo-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <HiChevronRight size={16} />
                </button>
              </div>

              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-[#18182f] border border-indigo-950 rounded-xl text-xs font-medium text-indigo-200 outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <HiChevronDown size={14} className="absolute right-2.5 top-2.5 text-indigo-400/60 pointer-events-none" />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}