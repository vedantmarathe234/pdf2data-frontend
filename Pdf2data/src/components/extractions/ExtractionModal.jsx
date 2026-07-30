import React, { useEffect, useState } from "react";
import { HiX, HiOutlineDownload, HiOutlineDocumentText } from "react-icons/hi";
import {
  getExtraction,
  downloadJson,
  downloadCsv,
  downloadExcel,
  downloadSql,
} from "../../services/extractionService";

import "./ExtractionModal.css";

const EXPORT_FORMATS = [
  { key: "json", label: "JSON", className: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white" },
  { key: "csv", label: "CSV", className: "bg-[#14B8A6] hover:bg-[#0D9488] text-white" },
  { key: "excel", label: "EXCEL", className: "bg-[#16A34A] hover:bg-[#15803D] text-white" },
  { key: "sql", label: "SQL", className: "bg-[#F97316] hover:bg-[#EA580C] text-white" },
];

const formatKey = (key) => {
  if (!key) return "";
  return key
    .replace(/^V_ed$/i, "V.ed")
    .replace(/^I_T_$/i, "I.T.")
    .replace(/^G_K_$/i, "G.K.")
    .replace(/_/g, " ");
};

export default function ExtractionModal({ id, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      loadExtraction();
    }
  }, [id]);

  const loadExtraction = async () => {
    try {
      const result = await getExtraction(id);

      let fields = result.parsedFields || result.data;
      if (!fields && result.rawJsonData) {
        try {
          fields =
            typeof result.rawJsonData === "string"
              ? JSON.parse(result.rawJsonData)
              : result.rawJsonData;
        } catch (e) {
          console.error("Failed to parse rawJsonData:", e);
        }
      }

      setData({
        fileName: result.fileName || result.title || "Extracted Document",
        parsedFields: fields || {},
      });
    } catch (err) {
      console.error("Failed to load extraction details:", err);
      setData({
        fileName: "Error Loading Document",
        parsedFields: {
          error: "Failed to fetch document details from server.",
        },
      });
    }
  };

  const handleDownload = (key) => {
    switch (key) {
      case "json":
        downloadJson(id);
        break;
      case "csv":
        downloadCsv(id);
        break;
      case "excel":
        downloadExcel(id);
        break;
      case "sql":
        downloadSql(id);
        break;
      default:
        break;
    }
  };

  const renderValue = (val) => {
    if (val === null || val === undefined || val === "") return "—";

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
      return (
        <ul className="simple-list">
          {val.map((item, idx) => (
            <li key={idx}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }

    if (typeof val === "object") {
      return (
        <div className="simple-object">
          {Object.entries(val).map(([k, v]) => (
            <div key={k} className="simple-object-row">
              <span className="key-label">{formatKey(k)}:</span>
              <span className="val-content">{renderValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    return String(val);
  };

  if (!data) {
    return (
      <div className="modal-overlay">
        <div className="modal loading-modal">
          <div className="loading-state text-[#1E1B4B] dark:text-[#E9E7F5]">
            Loading extraction details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="doc-icon-badge">
              <HiOutlineDocumentText size={20} />
            </div>
            <div>
              <h2>{data.fileName}</h2>
              <p className="modal-subtitle">Extracted Data Details</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <HiX size={18} />
          </button>
        </div>

        <div className="modal-body">
          {Object.entries(data.parsedFields || {}).map(([key, value]) => (
            <div key={key} className="simple-row">
              <div className="main-key">{formatKey(key)}</div>
              <div className="main-val">{renderValue(value)}</div>
            </div>
          ))}
        </div>

        <div className="download-footer">
          <div className="download-label">
            <HiOutlineDownload size={16} />
            <span>Download As:</span>
          </div>

          <div className="download-buttons flex items-center gap-2">
            {EXPORT_FORMATS.map((fmt) => (
              <button
                key={fmt.key}
                onClick={() => handleDownload(fmt.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${fmt.className}`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}