import axios from "axios";

const EXTRACTION_API = "http://localhost:8080/api/extractions";
const EXPORT_API = "http://localhost:8080/api/export";

const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// =======================
// Get Extraction History
// =======================

export const getExtractions = async () => {

    const response = await axios.get(EXTRACTION_API, {
        headers: getHeaders(),
    });

    return response.data;
};

// =======================
// Export Functions
// =======================

export const downloadJson = async (id) => {

    const response = await axios.get(`${EXPORT_API}/json/${id}`, {
        headers: getHeaders(),
        responseType: "blob",
    });

    downloadFile(response, "json");
};

export const downloadCsv = async (id) => {

    const response = await axios.get(`${EXPORT_API}/csv/${id}`, {
        headers: getHeaders(),
        responseType: "blob",
    });

    downloadFile(response, "csv");
};

export const downloadExcel = async (id) => {

    const response = await axios.get(`${EXPORT_API}/excel/${id}`, {
        headers: getHeaders(),
        responseType: "blob",
    });

    downloadFile(response, "xlsx");
};

export const downloadSql = async (id) => {

    const response = await axios.get(`${EXPORT_API}/sql/${id}`, {
        headers: getHeaders(),
        responseType: "blob",
    });

    downloadFile(response, "sql");
};

// =======================
// Common Download Helper
// =======================

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