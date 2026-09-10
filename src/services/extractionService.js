import api from './api';

const EXTRACTION_API = "/extractions";
const EXPORT_API = "/export";
const PROCESSING_API = "/processing";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getExtractions = async () => {
  const response = await api.get(EXTRACTION_API, {
    headers: getHeaders(),
  });
  return response.data;
};

export const getExtraction = async (id) => {
  const response = await api.get(`${EXTRACTION_API}/${id}`, {
    headers: getHeaders(),
  });
  return response.data;
};

export const approveAndSaveExtraction = async (payload) => {
  const response = await api.post(`${PROCESSING_API}/approve-and-save`, payload, {
    headers: getHeaders(),
  });
  return response.data;
};

export const downloadJson = async (id) => {
  const response = await api.get(`${EXPORT_API}/json/${id}`, {
    headers: getHeaders(),
    responseType: "blob",
  });
  downloadFile(response, "json");
};

export const downloadCsv = async (id) => {
  const response = await api.get(`${EXPORT_API}/csv/${id}`, {
    headers: getHeaders(),
    responseType: "blob",
  });
  downloadFile(response, "csv");
};

export const downloadExcel = async (id) => {
  const response = await api.get(`${EXPORT_API}/excel/${id}`, {
    headers: getHeaders(),
    responseType: "blob",
  });
  downloadFile(response, "xlsx");
};

export const downloadSql = async (id) => {
  const response = await api.get(`${EXPORT_API}/sql/${id}`, {
    headers: getHeaders(),
    responseType: "blob",
  });
  downloadFile(response, "sql");
};

function downloadFile(response, extension) {
  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `document.${extension}`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}