import api from "./api";
import axios from "axios";

export const uploadAndExtract = async (file, prompt, chatSessionId) => {
  const formData = new FormData();
  
  formData.append("file", file);

  formData.append("prompt", prompt ? prompt.trim() : "");

  if (chatSessionId && chatSessionId !== "null" && chatSessionId !== "undefined") {
    formData.append("chatSessionId", chatSessionId);
  }

  const token = localStorage.getItem("token");

  const response = await axios.post(
    "http://localhost:8080/api/processing/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getExtractionData = async (documentId) => {
  const response = await api.get(`/export/json/${documentId}`);
  return response.data;
};

const triggerBrowserDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const EXPORT_META = {
  json: { path: "json", ext: "json" },
  csv: { path: "csv", ext: "csv" },
  excel: { path: "excel", ext: "xlsx" },
  sql: { path: "sql", ext: "sql" },
};


export const exportDocument = async (documentId, format) => {
  const meta = EXPORT_META[format];
  if (!meta) throw new Error(`Unsupported export format: ${format}`);

  const response = await api.get(`/export/${meta.path}/${documentId}`, {
    responseType: "blob",
  });

  triggerBrowserDownload(response.data, `document_${documentId}.${meta.ext}`);
};


export const getLearningSuggestions = async (documentType) => {
  const response = await api.get(`/learning/suggestions/${documentType}`);
  return response.data;
};
