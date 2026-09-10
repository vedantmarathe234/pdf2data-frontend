import api from "./api";

export async function fetchAdminStats() {
  const response = await api.get("/admin/stats");
  return response.data;
}

export async function fetchExtractionLogs() {
  const response = await api.get("/admin/extractions");
  return response.data;
}

export async function fetchAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}

export async function downloadExtractionFile(extractionId, fileName) {
  const response = await api.get(`/admin/extractions/${extractionId}/download`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName || `extracted_doc_${extractionId}.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}