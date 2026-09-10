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
    <div>
      <div className="max-w-7xl w-full mx-auto flex flex-col flex-1 space-y-4">
        
        {/* Header and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-200 dark:border-[#332C57] shrink-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Extracted Documents
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#A5A1C4] mt-0.5">
              Audit history of all processed PDFs across the platform
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <HiOutlineSearch size={18} className="absolute left-3.5 top-2.5 text-gray-400 dark:text-[#A5A1C4]/60" />
            <input
              type="text"
              placeholder="Search by document or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1E1A3B] border border-gray-200 dark:border-[#332C57] rounded-2xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#A5A1C4]/40 outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition shadow-xs"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-medium rounded-2xl shadow-xs shrink-0">
            {error}
          </div>
        )}

        {/* Fixed Table Container */}
        <div className="bg-white dark:bg-[#1E1A3B] border border-gray-200 dark:border-[#332C57] rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col flex-1 overflow-hidden">
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <table className="w-full text-left text-xs text-gray-600 dark:text-[#E9E7F5]">
              <thead className="bg-gray-50 dark:bg-[#251F47] uppercase tracking-wider text-[10px] font-bold text-gray-500 dark:text-[#A5A1C4] border-b border-gray-200 dark:border-[#332C57] sticky top-0">
                <tr>
                  <th className="py-3 px-6">Document Info</th>
                  <th className="py-3 px-6">Owner / User</th>
                  <th className="py-3 px-6">Processed On</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#332C57]/60">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400 dark:text-[#A5A1C4]/50">
                      Loading records...
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400 dark:text-[#A5A1C4]/50">
                      No extractions found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((row) => (
                    <tr key={row.documentId || row.id} className="hover:bg-purple-50/50 dark:hover:bg-[#251F47]/50 transition duration-150">
                      <td className="py-2.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-[#251F47] border border-purple-200 dark:border-[#3D3868] text-[#8B5CF6] flex items-center justify-center shrink-0 font-bold">
                            <HiOutlineDocumentText size={16} />
                          </div>
                          <div className="truncate max-w-xs">
                            <p className="font-bold text-gray-900 dark:text-white truncate">
                              {row.fileName}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-[#A5A1C4]/60 truncate">
                              ID: #{row.documentId || row.id} {row.fileSize ? `• ${(row.fileSize / 1024).toFixed(1)} KB` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#251F47] border border-gray-200 dark:border-[#3D3868] flex items-center justify-center text-[#8B5CF6] font-bold text-[10px] shrink-0">
                            <HiOutlineUser size={13} />
                          </div>
                          <div className="truncate max-w-xs">
                            <p className="font-bold text-gray-900 dark:text-white truncate">
                              {row.username}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-[#A5A1C4]/60 truncate">{row.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-6 text-gray-500 dark:text-[#A5A1C4] whitespace-nowrap">
                        {row.timestamp ? new Date(row.timestamp).toLocaleString() : "N/A"}
                      </td>
                      <td className="py-2.5 px-6 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          {row.status || "SUCCESS"}
                        </span>
                      </td>
                      <td className="py-2.5 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => downloadExtractionFile(row.documentId || row.id, row.fileName)}
                          className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-[#251F47] border border-purple-200 dark:border-[#3D3868] hover:bg-[#8B5CF6] hover:text-white dark:hover:bg-[#8B5CF6] text-[#8B5CF6] dark:text-[#C084FC] font-semibold text-xs transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
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

          {/* Fixed Footer Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 dark:border-[#332C57] flex items-center justify-end gap-6 bg-gray-50/50 dark:bg-[#1E1A3B] shrink-0 mt-auto">
              <p className="text-xs text-gray-500 dark:text-[#A5A1C4]">
                Showing {filtered.length === 0 ? 0 : `${startIndex + 1}-${endIndex}`} of {filtered.length} items
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-400 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <HiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      currentPage === page
                        ? "border border-[#8B5CF6] text-[#8B5CF6] dark:text-[#C084FC] font-bold bg-purple-50 dark:bg-[#251F47]"
                        : "text-gray-500 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-gray-400 dark:text-[#A5A1C4] hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <HiChevronRight size={16} />
                </button>
              </div>

              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none pl-3 pr-8 py-1 bg-white dark:bg-[#251F47] border border-gray-200 dark:border-[#332C57] rounded-xl text-xs font-medium text-gray-700 dark:text-[#E9E7F5] outline-none focus:border-[#8B5CF6] cursor-pointer"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <HiChevronDown size={14} className="absolute right-2.5 top-2 text-gray-400 dark:text-[#A5A1C4]/60 pointer-events-none" />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}