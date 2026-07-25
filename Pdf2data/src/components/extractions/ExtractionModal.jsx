import { useEffect, useState } from "react";
import {
    getExtraction,
    downloadJson,
    downloadCsv,
    downloadExcel,
    downloadSql,
} from "../../services/extractionService";

import "./ExtractionModal.css";

export default function ExtractionModal({ id, onClose }) {

    const [data, setData] = useState(null);
    const [view, setView] = useState("form");

    useEffect(() => {
        loadExtraction();
    }, [id]);

    const loadExtraction = async () => {
        try {
            const result = await getExtraction(id);
            setData(result);
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) {
        return (
            <div className="modal-overlay">
                <div className="modal">
                    <h3>Loading...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>

            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <h2>{data.fileName}</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="tab-buttons">

                    <button
                        className={view === "form" ? "active" : ""}
                        onClick={() => setView("form")}
                    >
                        Form View
                    </button>

                    <button
                        className={view === "json" ? "active" : ""}
                        onClick={() => setView("json")}
                    >
                        JSON View
                    </button>

                </div>

                <div className="modal-body">

                    {view === "form" ? (

                        Object.entries(data.parsedFields || {}).map(
                            ([key, value]) => (

                                <div
                                    key={key}
                                    className="field-row"
                                >
                                    <strong>{key}</strong>

                                    <span>
                                        {typeof value === "object"
                                            ? JSON.stringify(value, null, 2)
                                            : String(value)}
                                    </span>

                                </div>

                            )
                        )

                    ) : (

                        <pre className="json-view">
                            {JSON.stringify(
                                data.parsedFields,
                                null,
                                2
                            )}
                        </pre>

                    )}

                </div>

                <div className="download-buttons">

                    <button onClick={() => downloadJson(id)}>
                        JSON
                    </button>

                    <button onClick={() => downloadCsv(id)}>
                        CSV
                    </button>

                    <button onClick={() => downloadExcel(id)}>
                        Excel
                    </button>

                    <button onClick={() => downloadSql(id)}>
                        SQL
                    </button>

                </div>

            </div>

        </div>
    );
}