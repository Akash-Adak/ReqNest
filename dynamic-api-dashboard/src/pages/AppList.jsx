import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowPathIcon, 
  DocumentArrowDownIcon, 
  PlayIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ServerIcon,
  UserIcon,
  DocumentTextIcon,
  XMarkIcon,
  PencilSquareIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import axios from "axios";

export default function ApiList() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [deleting, setDeleting] = useState(null);

  // Fetch APIs from backend
  const fetchApis = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`${baseUrl}/apis`, { withCredentials: true })
      .then((res) => setApis(res.data || []))
      .catch((err) => {
        console.error("Error fetching APIs:", err);
        setError(err.response?.data?.error || err.message || "Failed to fetch APIs");
        setApis([]);
      })
      .finally(() => setLoading(false));
  };

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/user`, { withCredentials: true });
        setUserEmail(res.data.email);
      } catch {
        setUserEmail("");
      }
    };
    fetchUser();
  }, []);

  // Only fetch APIs after login
  useEffect(() => {
    if (userEmail) {
      fetchApis();
    }
  }, [userEmail]);

  const filteredApis = (apis || []).filter((api) =>
    api?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete API
  const deleteApi = async (api) => {
    if (!window.confirm(`Are you sure you want to delete the API "${api.name}"? This action cannot be undone.`)) {
      return;
    }
    setDeleting(api.id);
    try {
      await axios.delete(`${baseUrl}/apis/${api.name}`, { withCredentials: true });
      setApis(apis.filter(a => a.id !== api.id));
    } catch (err) {
      console.error("Error deleting API:", err);
      alert(err.response?.data?.error || "Failed to delete API.");
    } finally {
      setDeleting(null);
    }
  };

  const downloadDocs = async (api) => {
    if (!api?.name) {
      alert("Invalid API data");
      return;
    }

    setDownloading(prev => prev + 1);
    try {
      const res = await axios.get(`${baseUrl}/apis/${api.name}`, { withCredentials: true });
      const data = res.data;
      
      if (!data) {
        throw new Error("No API data received");
      }

      const schema = typeof data.schemaJson === "string" ? JSON.parse(data.schemaJson) : data.schemaJson;
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 15;

      // Header
      doc.setFont("helvetica", "normal");
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 30, "F");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text("API Documentation", pageWidth / 2, 18, { align: "center" });

      // API Details
      doc.setTextColor(0, 0, 0);
      yPosition = 40;
      doc.setFontSize(16);
      doc.setFillColor(243, 244, 246);
      doc.rect(10, yPosition, pageWidth - 20, 10, "F");
      doc.text("API Details", 15, yPosition + 7);
      yPosition += 15;

      doc.setFontSize(12);
      doc.text(`API Name: ${api.name || 'N/A'}`, 15, yPosition);
      yPosition += 8;

      if (api.description) {
        const splitDescription = doc.splitTextToSize(`Description: ${api.description}`, pageWidth - 30);
        doc.text(splitDescription, 15, yPosition);
        yPosition += splitDescription.length * 6;
      }

      doc.text(`ID: ${api.id || 'N/A'}`, 15, yPosition);
      yPosition += 8;
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, yPosition);
      yPosition += 15;

      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 15;
      }

      // API Schema
      doc.setFontSize(16);
      doc.setFillColor(243, 244, 246);
      doc.rect(10, yPosition, pageWidth - 20, 10, "F");
      doc.text("API Schema", 15, yPosition + 7);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont("courier", "normal");
      const formattedSchema = JSON.stringify(schema, null, 2);
      const splitSchema = doc.splitTextToSize(formattedSchema, pageWidth - 20);

      for (let i = 0; i < splitSchema.length; i++) {
        if (yPosition > pageHeight - 15) {
          doc.addPage();
          yPosition = 15;
        }
        doc.text(splitSchema[i], 15, yPosition);
        yPosition += 4;
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated by ReqNest - ${userEmail || "User"}`, pageWidth / 2, pageHeight - 10, { align: "center" });

      doc.save(`${api.name}-documentation.pdf`);
    } catch (err) {
      console.error("Error downloading docs:", err);
      alert("Failed to download documentation.");
    } finally {
      setDownloading(prev => prev - 1);
    }
  };

  const updateSchema = (api) => {
    navigate(`/upload`, { state: { existingApi: api } });
  };

  // Enhanced navigation with error handling
  const handleAddNewApi = () => {
    console.log("Navigating to /upload");
    navigate('/upload');
  };

  const handleTestApi = (apiName) => {
    console.log("Navigating to test:", apiName);
    navigate(`/test/${apiName}`);
  };

  const handleSdkSetup = (apiName) => {
    console.log("Navigating to SDK:", apiName);
    navigate(`/sdk/${apiName}`);
  };

  // 🚨 Block page if not logged in
  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center border border-purple-500/20">
          <h2 className="text-xl font-bold mb-2">Please log in to continue</h2>
          <p className="text-gray-300">You need to be authenticated to access the API Library.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white pt-16 relative z-10">
      <div className="max-w-7xl mx-auto p-6 relative z-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">API Library</h1>
              <p className="text-gray-300 mt-2">Explore and test all available APIs in one place</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchApis}
                disabled={loading}
                className="p-2.5 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300 transform hover:-translate-y-1 group"
                aria-label="Refresh APIs"
              >
                <ArrowPathIcon className={`h-5 w-5 text-purple-400 group-hover:text-white ${loading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={handleAddNewApi}
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <PlusIcon className="h-4 w-4 relative z-10" />
                <span className="relative z-10 font-bold">Add New API</span>
              </button>
            </div>
          </div>

          {/* Search + User Info */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search APIs by name..."
                className="pl-10 pr-4 py-3 w-full rounded-xl border border-purple-500/30 bg-gray-800/50 backdrop-blur-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-purple-500/20 text-purple-200 px-4 py-2 rounded-xl backdrop-blur-sm border border-purple-500/30">
              <UserIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{userEmail}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<EyeIcon className="h-6 w-6 text-blue-400" />} label="Total APIs" value={apis.length} color="blue" />
          <StatCard icon={<DocumentArrowDownIcon className="h-6 w-6 text-green-400" />} label="Available" value={filteredApis.length} color="green" />
          <StatCard icon={<PlayIcon className="h-6 w-6 text-purple-400" />} label="Ready to Test" value={apis.filter(a => a?.schemaJson).length} color="purple" />
          <StatCard icon={<DocumentTextIcon className="h-6 w-6 text-pink-400" />} label="Documented" value={downloading} color="pink" />
        </div>

        {/* API List */}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchApis} />
        ) : filteredApis.length === 0 ? (
          <EmptyState searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApis.map((api) => (
              <ApiCard
                key={api.id}
                api={api}
                deleting={deleting}
                downloading={downloading}
                deleteApi={deleteApi}
                downloadDocs={downloadDocs}
                updateSchema={updateSchema}
                handleTestApi={handleTestApi}
                handleSdkSetup={handleSdkSetup}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Small UI components for readability --- */
function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-700/20",
    green: "from-green-500/20 to-green-700/20",
    purple: "from-purple-500/20 to-purple-700/20",
    pink: "from-pink-500/20 to-pink-700/20"
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-purple-500/20 relative overflow-hidden group hover:scale-105 transition-all duration-300`}>
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorMap[color]}`}></div>
      <div className="relative z-10 flex items-center">
        <div className={`p-2 bg-${color}-500/20 rounded-xl backdrop-blur-sm`}>{icon}</div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 text-center">
      <p className="text-red-200 font-medium">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-500/20 text-red-200 rounded-xl hover:bg-red-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-red-500/30"
      >
        Try Again
      </button>
    </div>
  );
}

function EmptyState({ searchTerm, setSearchTerm }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 text-center border border-purple-500/20 shadow-lg">
      <DocumentArrowDownIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">
        {searchTerm ? "No matching APIs found" : "No APIs available"}
      </h3>
      <p className="text-gray-300 mb-4">
        {searchTerm
          ? "Try adjusting your search term or clear the search to see all APIs."
          : "Upload your first API schema to get started."}
      </p>
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-xl hover:bg-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-purple-500/30"
        >
          Clear Search
        </button>
      )}
    </div>
  );
}

function ApiCard({ api, deleting, downloading, deleteApi, downloadDocs, updateSchema, handleTestApi, handleSdkSetup }) {
  // Add safety checks for api properties
  if (!api) {
    return null; // Don't render if api is undefined/null
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 hover:shadow-2xl transition-all duration-300 hover:border-purple-500/50 relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      
      {/* Delete button */}
      <button
        onClick={() => deleteApi(api)}
        disabled={deleting === api.id}
        className="absolute top-3 right-3 p-1.5 bg-red-500/20 text-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/30 hover:text-white backdrop-blur-sm border border-red-500/30 disabled:opacity-50 z-10"
        aria-label={`Delete ${api.name || 'API'}`}
      >
        {deleting === api.id ? (
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
        ) : (
          <XMarkIcon className="h-4 w-4" />
        )}
      </button>

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-purple-500/20 text-purple-300 p-3 rounded-xl mr-4 backdrop-blur-sm border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors">
              <ServerIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">{api.name || 'Unnamed API'}</h3>
            </div>
          </div>
        </div>

        {api.description && (
          <p className="text-gray-300 text-sm mb-6 line-clamp-2">{api.description}</p>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => handleTestApi(api.name)}
              className="group relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PlayIcon className="h-4 w-4 relative z-10" />
              <span className="text-sm relative z-10 font-bold">Test API</span>
            </button>

            <button
              onClick={() => updateSchema(api)}
              className="group relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500/20 text-yellow-300 rounded-xl hover:bg-yellow-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-yellow-500/30 backdrop-blur-sm"
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span className="text-sm">Update Schema</span>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => downloadDocs(api)}
              disabled={downloading > 0}
              className="group relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-green-500/30 backdrop-blur-sm disabled:opacity-50"
            >
              {downloading > 0 ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </button>
            <button
              onClick={() => handleSdkSetup(api.name)}
              className="group relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-purple-500/30 backdrop-blur-sm"
            >
              <EyeIcon className="h-4 w-4" />
              SDK Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}