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
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import axios from "axios";

export default function ApiList() {
const baseUrl = window._env_?.VITE_API_URL;
  const navigate = useNavigate();
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    ready: 0,
    documented: 0
  });

  // Fetch APIs from backend
  const fetchApis = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`${baseUrl}/apis`, { withCredentials: true })
      .then((res) => {
        const apiData = res.data || [];
        setApis(apiData);
        updateStats(apiData);
      })
      .catch((err) => {
        console.error("Error fetching APIs:", err);
        setError(err.response?.data?.error || err.message || "Failed to fetch APIs");
        setApis([]);
        updateStats([]);
      })
      .finally(() => setLoading(false));
  };

  const updateStats = (apiList) => {
    setStats({
      total: apiList.length,
      available: apiList.length,
      ready: apiList.filter(a => a?.schemaJson).length,
      documented: apiList.filter(a => a?.documentation).length
    });
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
      const updatedApis = apis.filter(a => a.id !== api.id);
      setApis(updatedApis);
      updateStats(updatedApis);
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
      doc.setFillColor(79, 70, 229);
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

  const handleAddNewApi = () => {
    navigate('/upload');
  };

  const handleTestApi = (apiName) => {
    navigate(`/test/${apiName}`);
  };

  const handleSdkSetup = (apiName) => {
    navigate(`/sdk/${apiName}`);
  };

  // 🚨 Block page if not logged in
  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
        <div className="bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center border border-indigo-500/20 max-w-md">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <ExclamationTriangleIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">Authentication Required</h2>
          <p className="text-gray-300 mb-4">Please log in to access the API Library and manage your APIs.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-white pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <ServerIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">API Library</h1>
                <p className="text-gray-300 mt-2">Manage and explore all your APIs in one centralized location</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchApis}
                disabled={loading}
                className="group p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
                aria-label="Refresh APIs"
              >
                <ArrowPathIcon className={`w-5 h-5 text-gray-400 group-hover:text-indigo-400 ${loading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={handleAddNewApi}
                className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <PlusIcon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Add New API</span>
              </button>
            </div>
          </div>

          {/* Search and User Info */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative w-full lg:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder="Search APIs by name..."
                className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-gray-800/50 text-gray-300 px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-700">
              <UserIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{userEmail}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<ServerIcon className="w-6 h-6" />} 
            label="Total APIs" 
            value={stats.total} 
            color="blue" 
          />
          <StatCard 
            icon={<CheckCircleIcon className="w-6 h-6" />} 
            label="Available" 
            value={stats.available} 
            color="green" 
          />
          <StatCard 
            icon={<PlayIcon className="w-6 h-6" />} 
            label="Ready to Test" 
            value={stats.ready} 
            color="purple" 
          />
          <StatCard 
            icon={<DocumentTextIcon className="w-6 h-6" />} 
            label="Documented" 
            value={stats.documented} 
            color="indigo" 
          />
        </div>

        {/* API List Content */}
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchApis} />
        ) : filteredApis.length === 0 ? (
          <EmptyState searchTerm={searchTerm} setSearchTerm={setSearchTerm} onAddNew={handleAddNewApi} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

/* --- UI Components --- */
function StatCard({ icon, label, value, color }) {
  const colorMap = {
    blue: { bg: "from-blue-500/10 to-blue-600/10", border: "border-blue-500/20", text: "text-blue-400" },
    green: { bg: "from-green-500/10 to-green-600/10", border: "border-green-500/20", text: "text-green-400" },
    purple: { bg: "from-purple-500/10 to-purple-600/10", border: "border-purple-500/20", text: "text-purple-400" },
    indigo: { bg: "from-indigo-500/10 to-indigo-600/10", border: "border-indigo-500/20", text: "text-indigo-400" }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} hover:shadow-lg transition-all duration-300 group hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <p className="text-gray-400 mt-4 font-medium">Loading your APIs...</p>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Failed to Load APIs</h3>
      <p className="text-red-200 mb-6 max-w-md mx-auto">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-red-500/20 text-red-200 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-red-500/30"
      >
        Try Again
      </button>
    </div>
  );
}

function EmptyState({ searchTerm, setSearchTerm, onAddNew }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-gray-700">
      <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
        <DocumentArrowDownIcon className="w-10 h-10 text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">
        {searchTerm ? "No matching APIs found" : "No APIs available"}
      </h3>
      <p className="text-gray-300 mb-8 max-w-md mx-auto">
        {searchTerm
          ? "Try adjusting your search term or clear the search to see all APIs."
          : "Get started by uploading your first API schema to explore and test its endpoints."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {searchTerm ? (
          <button
            onClick={() => setSearchTerm("")}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 border border-gray-600"
          >
            Clear Search
          </button>
        ) : (
          <button
            onClick={onAddNew}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            Add Your First API
          </button>
        )}
      </div>
    </div>
  );
}

function ApiCard({ api, deleting, downloading, deleteApi, downloadDocs, updateSchema, handleTestApi, handleSdkSetup }) {
  if (!api) return null;

  const hasSchema = !!api.schemaJson;

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 group hover:shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${hasSchema ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-gray-700 border border-gray-600'}`}>
              <ServerIcon className={`w-6 h-6 ${hasSchema ? 'text-indigo-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {api.name || 'Unnamed API'}
              </h3>
              {api.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{api.description}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => deleteApi(api)}
            disabled={deleting === api.id}
            className="p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 backdrop-blur-sm border border-red-500/20"
            aria-label={`Delete ${api.name || 'API'}`}
          >
            {deleting === api.id ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <XMarkIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            hasSchema 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${hasSchema ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            {hasSchema ? 'Ready' : 'No Schema'}
          </div>
          <div className="text-gray-400 text-sm">
            <ClockIcon className="w-4 h-4 inline mr-1" />
            Updated recently
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleTestApi(api.name)}
            disabled={!hasSchema}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
              hasSchema
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <PlayIcon className="w-4 h-4" />
            Test
          </button>

          <button
            onClick={() => updateSchema(api)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 border border-gray-600"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Update
          </button>

          <button
            onClick={() => downloadDocs(api)}
            disabled={downloading > 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 text-green-400 rounded-xl font-semibold hover:bg-green-500/20 hover:text-green-300 transition-all duration-300 transform hover:-translate-y-1 border border-green-500/20 disabled:opacity-50"
          >
            {downloading > 0 ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <DocumentArrowDownIcon className="w-4 h-4" />
            )}
            PDF
          </button>

          <button
            onClick={() => handleSdkSetup(api.name)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 text-purple-400 rounded-xl font-semibold hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300 transform hover:-translate-y-1 border border-purple-500/20"
          >
            <EyeIcon className="w-4 h-4" />
            SDK
          </button>
        </div>
      </div>
    </div>
  );
}