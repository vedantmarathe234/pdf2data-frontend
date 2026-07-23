import { useEffect, useState } from "react";
import {
    HiOutlineSearch,
    HiOutlineDotsVertical,
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

import "../../styles/extraction.css";

export default function ExtractionPage() {

    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getExtractions();
            setDocuments(data);
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = documents.filter((doc) => {

        const searchMatch =
            doc.fileName.toLowerCase().includes(search.toLowerCase());

        const statusMatch =
            statusFilter === "All" ||
            doc.status === statusFilter;

        const typeMatch =
            typeFilter === "All" ||
            doc.documentType === typeFilter;

        return searchMatch && statusMatch && typeMatch;
    });

    const getFileIcon = (fileName) => {

        const extension = fileName
            .split(".")
            .pop()
            .toLowerCase();

        switch (extension) {

            case "pdf":
                return <FaFilePdf className="pdf-icon" />;

            case "doc":
            case "docx":
                return <FaFileWord className="word-icon" />;

            case "xls":
            case "xlsx":
                return <FaFileExcel className="excel-icon" />;

            case "jpg":
            case "jpeg":
            case "png":
                return <FaFileImage className="image-icon" />;

            default:
                return <FaFileAlt className="default-icon" />;
        }
    };

    return (

        <div className="page">

            <div className="toolbar">

                <div className="search-box">

                    <HiOutlineSearch />

                    <input
                        placeholder="Search extractions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="filters">

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All</option>
                        <option>Success</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>

                        {[...new Set(documents.map((d) => d.documentType))]
                            .filter(Boolean)
                            .map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))}
                    </select>

                </div>

            </div>

            <table>

                <thead>

                <tr>
                    <th>Document</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Extracted At</th>
                    <th>Action</th>
                </tr>

                </thead>

                <tbody>

                {filtered.map((doc) => (

                    <tr key={doc.documentId}>

                        <td>

                            <div className="document-cell">

                                {getFileIcon(doc.fileName)}

                                <div>

                                    <div className="filename">
                                        {doc.fileName}
                                    </div>

                                </div>

                            </div>

                        </td>

                        <td>
                            {doc.documentType || "-"}
                        </td>

                        <td>

                            <span
                                className={`badge ${
                                    doc.status === "Success"
                                        ? "success"
                                        : doc.status === "Failed"
                                            ? "failed"
                                            : "pending"
                                }`}
                            >
                                {doc.status}
                            </span>

                        </td>

                        <td>

                            {doc.extractedAt
                                ? new Date(doc.extractedAt).toLocaleString()
                                : "-"}

                        </td>

                        <td>

                            <div className="dropdown">

                                <button className="action">

                                    <HiOutlineDotsVertical />

                                </button>

                                <div className="dropdown-content">

                                    <button
                                        onClick={() =>
                                            downloadJson(doc.documentId)
                                        }
                                    >
                                        Download JSON
                                    </button>

                                    <button
                                        onClick={() =>
                                            downloadCsv(doc.documentId)
                                        }
                                    >
                                        Download CSV
                                    </button>

                                    <button
                                        onClick={() =>
                                            downloadExcel(doc.documentId)
                                        }
                                    >
                                        Download Excel
                                    </button>

                                    <button
                                        onClick={() =>
                                            downloadSql(doc.documentId)
                                        }
                                    >
                                        Download SQL
                                    </button>

                                </div>

                            </div>

                        </td>

                    </tr>

                ))}

                {filtered.length === 0 && (

                    <tr>

                        <td
                            colSpan="5"
                            style={{ textAlign: "center" }}
                        >
                            No extractions found.
                        </td>

                    </tr>

                )}

                </tbody>

            </table>

        </div>

    );
}