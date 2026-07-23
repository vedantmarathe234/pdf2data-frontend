import api from "./api";

/**
 * Upload a document for AI extraction.
 * If chatSessionId is provided, the document is attached to that
 * existing chat session instead of creating a new one.
 */
export const uploadAndExtract = async (file, prompt, chatSessionId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("prompt", prompt || "Extract all structured data");
  if (chatSessionId) {
    formData.append("chatSessionId", chatSessionId);
  }

  const response = await api.post("/processing/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data; // ProcessingResponse
};

/**
 * Fetch the stored structured extraction result for a document
 * (backed by /api/export/json/{documentId}) so it can be rendered
 * inline instead of only being downloadable.
 */
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

/**
 * Download an extraction result in the given format.
 * format: "json" | "csv" | "excel" | "sql"
 */
export const exportDocument = async (documentId, format) => {
  const meta = EXPORT_META[format];
  if (!meta) throw new Error(`Unsupported export format: ${format}`);

  const response = await api.get(`/export/${meta.path}/${documentId}`, {
    responseType: "blob",
  });

  triggerBrowserDownload(response.data, `document_${documentId}.${meta.ext}`);
};

/**
 * AI-learned correction suggestions for a document type.
 */
export const getLearningSuggestions = async (documentType) => {
  const response = await api.get(`/learning/suggestions/${documentType}`);
  return response.data;
};
