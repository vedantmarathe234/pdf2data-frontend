import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  HiOutlineUpload, 
  HiOutlineLogout, 
  HiOutlineUserCircle,
  HiOutlineSparkles 
} from "react-icons/hi";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("Extract all tabular rows and key metadata fields.");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    } else {
      setUsername(storedUser || "User");
      setRole(storedRole || "USER");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndExtract = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");
    setExtractedData(null);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const response = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Server extraction failed.");

      const data = await response.json();
      setExtractedData(data);
    } catch (err) {
      setError(err.message || "Failed to parse document.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#eef1ff] flex flex-col font-sans tracking-tight antialiased">
      
      <header className="bg-white border-b border-gray-100 shadow-sm h-16 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-lg select-none">
            P2D
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">PDF2Data Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <HiOutlineUserCircle size={20} className="text-gray-400" />
            <span>{username}</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {role}
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-600 transition duration-200"
          >
            <HiOutlineLogout size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 lg:p-8 space-y-6">
        
     
        <section className="bg-white rounded-[24px] shadow-xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">Document Extraction</h2>
          <p className="text-xs text-gray-500 mt-1">Upload a document to automatically parse raw data structures.</p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleUploadAndExtract}>
            
            
            <div className="relative border-2 border-dashed border-gray-200 hover:border-indigo-400 transition rounded-xl bg-gray-50/50 p-6 text-center flex flex-col items-center justify-center cursor-pointer group">
              <input 
                type="file" 
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <HiOutlineUpload size={24} className="text-gray-400 group-hover:text-indigo-500 transition mb-1" />
              <span className="text-sm font-medium text-gray-700">
                {file ? file.name : "Choose or drag document here"}
              </span>
            </div>

          
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Extraction Rules</label>
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1.5 w-full h-11 px-4 text-sm bg-white rounded-xl border border-gray-200浏览 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.99] disabled:bg-indigo-400"
            >
              <HiOutlineSparkles size={16} />
              {loading ? "Extracting..." : "Process Document"}
            </button>
          </form>
        </section>

    
        {loading && (
          <div className="bg-white rounded-[24px] border border-gray-100 p-8 text-center flex flex-col items-center justify-center gap-3 shadow-md">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-xs font-semibold text-gray-600">Executing OCR and AI parsing layout maps...</span>
          </div>
        )}

     
        {extractedData && (
          <section className="bg-white rounded-[24px] shadow-xl border border-gray-100 p-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Extracted Results</h3>
              <span className="text-[11px] bg-green-50 text-green-700 font-bold px-2.5 py-0.5 rounded-full">
                Success
              </span>
            </div>
            
           
            <pre className="text-xs font-mono bg-gray-50 text-gray-800 p-4 rounded-xl border border-gray-100 overflow-x-auto max-h-60 leading-relaxed">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </section>
        )}

      </main>
    </div>
  );
}