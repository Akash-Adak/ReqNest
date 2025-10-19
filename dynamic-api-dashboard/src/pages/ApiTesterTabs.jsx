import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  MoonIcon, 
  SunIcon, 
  ArrowPathIcon, 
  PlayIcon, 
  TrashIcon,
  DocumentPlusIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon as DeleteIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CodeBracketIcon
} from "@heroicons/react/24/outline";

export default function ApiTesterTabs() {

  const { apiName } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [schema, setSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [schemaError, setSchemaError] = useState(null);
  const [updateAll, setUpdateAll] = useState(false);
  const [updateField, setUpdateField] = useState("id");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 const baseUrl = import.meta.env.VITE_API_URL;
  const [endpoints, setEndpoints] = useState([
    { 
      id: 1, 
      label: "Create", 
      method: "POST", 
      path: `/data/${apiName}`, 
      description: "Create new document", 
      requiresBody: true,
      icon: <DocumentPlusIcon className="h-5 w-5" />,
      color: "emerald"
    },
    { 
      id: 2, 
      label: "List All", 
      method: "GET", 
      path: `/data/${apiName}`, 
      description: "Get all documents", 
      requiresBody: false,
      icon: <ListBulletIcon className="h-5 w-5" />,
      color: "blue"
    },
    { 
      id: 3, 
      label: "Search", 
      method: "POST", 
      path: `/data/${apiName}/search`, 
      description: "Search by fields", 
      requiresBody: true,
      icon: <MagnifyingGlassIcon className="h-5 w-5" />,
      color: "purple"
    },
    { 
      id: 4, 
      label: "Update", 
      method: "PUT", 
      path: `/data/${apiName}`, 
      description: "Update document(s) + _id must", 
      requiresBody: true,
      icon: <PencilSquareIcon className="h-5 w-5" />,
      color: "orange"
    },
    { 
      id: 5, 
      label: "Delete", 
      method: "DELETE", 
      path: `/data/${apiName}/delete`, 
      description: "Delete document by criteria", 
      requiresBody: true,
      icon: <DeleteIcon className="h-5 w-5" />,
      color: "red"
    }
  ]);

  const [activeId, setActiveId] = useState(1);
  const [headersText, setHeadersText] = useState(`{
  "Content-Type": "application/json"
}`);

  const [responses, setResponses] = useState({});
  const [busy, setBusy] = useState(false);
  const [requestBody, setRequestBody] = useState("{}");
  const [jsonError, setJsonError] = useState(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Generate empty request body from schema
  function generateEmptyKeysFromSchema(schema) {
    if (!schema?.properties) return {};
    const sample = {};
    for (const key of Object.keys(schema.properties)) {
      const prop = schema.properties[key];
      // Set appropriate empty values based on type
      if (prop.type === "string") sample[key] = "";
      else if (prop.type === "number") sample[key] = 0;
      else if (prop.type === "boolean") sample[key] = false;
      else if (prop.type === "array") sample[key] = [];
      else if (prop.type === "object") sample[key] = {};
      else sample[key] = null;
    }
    return sample;
  }

  // Fetch schema and set user headers
  useEffect(() => {
    setLoadingSchema(true);

    // Load logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    console.log("logged user",loggedInUser.apikey);
    if (loggedInUser) {
      setUser(loggedInUser);

      setHeadersText(JSON.stringify({
        "Content-Type": "application/json",
        "X-API-KEY": loggedInUser.apikey ,
        "X-USER-TIER": loggedInUser.tier
      }, null, 2));
    }

    if (!apiName) {
      setSchemaError("No API name specified in URL");
      setLoadingSchema(false);
      return;
    }

    fetch(`${baseUrl}/apis/${encodeURIComponent(apiName)}`, {
      headers: { "Accept": "application/json" },
      credentials: "include",
      redirect: "follow"
    })
      .then(async (res) => {
        if (res.redirected) {
          throw new Error("Unauthorized: redirected to login page");
        }
        
        // Check for rate limiting headers
        if (res.headers.get("X-RateLimit-Remaining") === "0") {
          setRateLimitExceeded(true);
          setRateLimitInfo({
            limit: res.headers.get("X-RateLimit-Limit"),
            reset: res.headers.get("X-RateLimit-Reset"),
            remaining: res.headers.get("X-RateLimit-Remaining")
          });
        }
        
        const text = await res.text();
        let data;
        try { 
          data = JSON.parse(text); 
        } catch { 
          throw new Error("Backend returned non-JSON:\n" + text); 
        }
        return data;
      })
      .then((data) => {
        if (!data?.schemaJson) throw new Error("Schema JSON missing from response");
        let parsed = typeof data.schemaJson === "string" ? JSON.parse(data.schemaJson) : data.schemaJson;
        if (parsed?.schemaJson) parsed = parsed.schemaJson;
        setSchema(parsed);
          generateAiSample(parsed).then((sample) => {
          setRequestBody(JSON.stringify(sample, null, 2));
           });

        setSchemaError(null);
      })
      .catch((err) => setSchemaError(err.message || String(err)))
      .finally(() => setLoadingSchema(false));
  }, [apiName, baseUrl]);

  const active = endpoints.find((e) => e.id === activeId) || endpoints[0];

  function MethodBadge({ method }) {
    const colorMap = { 
      GET: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border-green-500/30", 
      POST: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 border-blue-500/30", 
      PUT: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-200 border-yellow-500/30", 
      DELETE: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 border-red-500/30", 
      PATCH: "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-200 border-purple-500/30" 
    };
    
    const colors = colorMap[method] || "bg-gray-800/50 text-gray-300 border-gray-600/50";
    
    return (
      <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border backdrop-blur-sm shadow-lg ${colors}`}>
        {method}
      </span>
    );
  }

  // Send API request
  async function sendRequest() {
    setJsonError(null);
    setRateLimitExceeded(false);
    const ep = endpoints.find((x) => x.id === activeId);
    if (!ep) return;

    let parsedHeaders = {};
    try { 
      parsedHeaders = headersText ? JSON.parse(headersText) : {}; 
      if (typeof parsedHeaders !== "object" || Array.isArray(parsedHeaders)) { 
        setJsonError("Headers must be a JSON object"); 
        return; 
      } 
    } catch (err) { 
      setJsonError("Invalid headers JSON: " + err.message); 
      return; 
    }

    let requestData = {};
    if (ep.requiresBody) {
      try { requestData = requestBody ? JSON.parse(requestBody) : {}; } 
      catch (err) { setJsonError("Invalid request body JSON: " + err.message); return; }
    }

    let finalPath = ep.path;
    if (ep.id === 4 && requestData.id) {
      finalPath = finalPath.replace("{id}", encodeURIComponent(requestData.id));
      if (!updateAll) delete requestData.id;
    }

    const url = `${baseUrl}${finalPath}`;
    const method = ep.method.toUpperCase();
    const config = { 
      method, 
      url, 
      headers: { ...parsedHeaders }, 
      validateStatus: () => true, 
      timeout: 20000, 
      withCredentials: true 
    };
    
    if (ep.id === 4) config.params = { updateAll, field: updateField };
    if (method === "GET") config.params = { ...config.params, ...requestData }; 
    else config.data = requestData;

    setBusy(true);
    try {
      const res = await axios(config);
      
      // Check for rate limiting headers in response
      if (res.headers["x-ratelimit-remaining"] === "0") {
        setRateLimitExceeded(true);
        setRateLimitInfo({
          limit: res.headers["x-ratelimit-limit"],
          reset: res.headers["x-ratelimit-reset"],
          remaining: res.headers["x-ratelimit-remaining"]
        });
      }
      
      const record = { 
        timestamp: new Date().toISOString(), 
        status: res.status, 
        statusText: res.statusText, 
        headers: res.headers, 
        data: res.data, 
        config: { 
          url: res.config.url, 
          method: res.config.method, 
          params: res.config.params, 
          data: res.config.data 
        } 
      };
      
      setResponses(prev => { 
        const arr = prev[activeId] ? [record, ...prev[activeId]].slice(0, 10) : [record]; 
        return { ...prev, [activeId]: arr }; 
      });
    } catch (err) {
      const rec = { 
        timestamp: new Date().toISOString(), 
        error: err.message, 
        response: err.response ? { 
          status: err.response.status, 
          data: err.response.data,
          headers: err.response.headers 
        } : null 
      };
      
      // Check for rate limiting in error response
      if (err.response && err.response.headers["x-ratelimit-remaining"] === "0") {
        setRateLimitExceeded(true);
        setRateLimitInfo({
          limit: err.response.headers["x-ratelimit-limit"],
          reset: err.response.headers["x-ratelimit-reset"],
          remaining: err.response.headers["x-ratelimit-remaining"]
        });
      }
      
      setResponses(prev => { 
        const arr = prev[activeId] ? [rec, ...prev[activeId]].slice(0, 10) : [rec]; 
        return { ...prev, [activeId]: arr }; 
      });
    } finally { 
      setBusy(false); 
    }
  }

  function formatRateLimitReset(resetTimestamp) {
    if (!resetTimestamp) return "24 hours";
    
    try {
      const resetDate = new Date(parseInt(resetTimestamp) * 1000);
      const now = new Date();
      const diffMs = resetDate - now;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
      return `${diffMins}m`;
    } catch (e) {
      return "24h";
    }
  }

async function generateAiSample(schema) {
  try {
    const res = await axios.post(
      `${baseUrl}/api/schema/generate-test-data`,
      schema, 
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("AI suggestion failed", err);
    return generateEmptyKeysFromSchema(schema);
  }
}

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-colors duration-200">
      {/* Mouse follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-100 ease-out blur-sm"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,_119,_198,_0.1),_transparent_50%)] bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_105,_180,_0.1),_transparent_50%)]"></div>

      {/* Main content with proper navbar spacing */}
      <div className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-75 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                  <RocketLaunchIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                  API Playground
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-purple-300 font-semibold">{apiName}</span>
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span className="text-sm text-gray-400">Interactive Testing Environment</span>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200 rounded-2xl backdrop-blur-sm flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">{user.name || user.email}</span>
                  </div>
                )}
                {user && (
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-200 rounded-2xl backdrop-blur-sm flex items-center space-x-2">
                    <CpuChipIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{user.tier} Tier</span>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-400 font-mono bg-gray-800/50 px-3 py-2 rounded-xl border border-gray-700/50">
                {baseUrl}
              </div>
            </div>
          </div>

          {/* Rate limit banner */}
          {rateLimitExceeded && (
            <div className="mb-8 bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 rounded-2xl p-4 flex justify-between items-center backdrop-blur-xl shadow-xl">
              <div className="flex items-center space-x-3">
                <BoltIcon className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="font-bold text-white">Rate Limit Exceeded</h3>
                  <p className="text-red-200 text-sm">
                    Limit resets in {formatRateLimitReset(rateLimitInfo?.reset)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/plans")}
                className="group flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1"
              >
                Upgrade 
                <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          {loadingSchema ? (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 flex items-center justify-center shadow-xl">
              <div className="flex items-center space-x-3">
                <ArrowPathIcon className="h-6 w-6 animate-spin text-purple-400" />
                <span className="text-lg font-semibold text-white">Loading schema...</span>
              </div>
            </div>
          ) : schemaError ? (
            <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                <div className="font-bold text-white text-lg">Schema Loading Error</div>
              </div>
              <div className="text-red-200 text-sm font-mono bg-red-900/30 rounded-xl p-4 border border-red-500/30">
                {schemaError}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Sidebar - Responsive */}
              <div className="xl:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden shadow-xl sticky top-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
                  
                  <div className="relative p-4 border-b border-gray-700/50">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white">Endpoints</h3>
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-200 rounded-lg text-xs font-bold">
                        {endpoints.length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    {endpoints.map((ep, idx) => {
                      const isActive = ep.id === activeId;
                      
                      return (
                        <button
                          key={ep.id}
                          className={`w-full text-left p-4 transition-all flex items-center gap-3 hover:bg-white/5 group ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-r-2 border-purple-400 text-white' 
                              : 'text-gray-400 hover:text-white'
                          } ${idx !== endpoints.length - 1 ? 'border-b border-gray-700/30' : ''}`}
                          onClick={() => { setActiveId(ep.id); setUpdateAll(false); }}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : 'bg-gray-700 text-gray-300 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white'
                          }`}>
                            {React.cloneElement(ep.icon, { className: "w-4 h-4" })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <MethodBadge method={ep.method} />
                            </div>
                            <div className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>
                              {ep.label}
                            </div>
                            <div className="text-xs opacity-60 truncate">
                              {ep.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Main content - Responsive */}
              <div className="xl:col-span-3 space-y-6">
                {/* Request Panel */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r from-${active.color}-500 to-${active.color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
                          {active.icon}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{active.label}</h2>
                          <p className="text-gray-400 text-sm">{active.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MethodBadge method={active.method} />
                        <span className="text-xs font-mono text-gray-400 bg-gray-900/50 px-2 py-1 rounded-lg">
                          {active.path}
                        </span>
                      </div>
                    </div>

                    {/* Request Configuration */}
                    <div className="space-y-6">
                      {/* Update Mode Settings */}
                      {active?.method === "PUT" && (
                        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
                          <div className="flex items-center mb-3">
                            <input 
                              type="checkbox" 
                              id="updateAll" 
                              checked={updateAll} 
                              onChange={(e) => setUpdateAll(e.target.checked)} 
                              className="w-4 h-4 rounded focus:ring-purple-500 text-purple-500 bg-gray-800 border-gray-600 mr-3"
                            />
                            <label htmlFor="updateAll" className="text-sm font-semibold text-white">
                              Update all matching documents
                            </label>
                          </div>
                          {updateAll && (
                            <input 
                              type="text" 
                              value={updateField} 
                              onChange={(e) => setUpdateField(e.target.value)} 
                              className="w-full bg-gray-800/50 border border-gray-600/50 text-white rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
                              placeholder="Field name (default: id)" 
                            />
                          )}
                        </div>
                      )}

                      {/* Headers */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-3">Request Headers</label>
                        <textarea 
                          rows={3} 
                          className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-100 rounded-xl p-3 font-mono text-sm transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none" 
                          value={headersText} 
                          onChange={(e) => setHeadersText(e.target.value)} 
                        />
                      </div>

                      {/* Request Body */}
                      {active?.requiresBody && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-white">
                              {active?.method === "GET" ? "Query Parameters" : "Request Body"}
                            </label>
                            <button
                              className="group flex items-center gap-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500 hover:to-purple-500 border border-indigo-500/30 hover:border-indigo-500 text-indigo-200 hover:text-white px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300"
                              onClick={async () => {
                                const aiSample = await generateAiSample(schema);
                                setRequestBody(JSON.stringify(aiSample, null, 2));
                              }}
                            >
                              <SparklesIcon className="w-3 h-3" />
                              AI Suggest
                            </button>
                          </div>
                          
                          <textarea 
                            rows={8} 
                            className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-100 rounded-xl p-3 font-mono text-sm transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none" 
                            value={requestBody} 
                            onChange={(e) => setRequestBody(e.target.value)} 
                            placeholder={JSON.stringify(schema?.example || {}, null, 2)} 
                          />
                          
                          {jsonError && (
                            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 text-red-200">
                              <div className="flex items-center space-x-2 mb-1">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                <span className="font-bold text-sm">JSON Error</span>
                              </div>
                              <p className="text-xs">{jsonError}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Send Button */}
                      <div className="flex justify-end pt-2">
                        <button 
                          onClick={sendRequest} 
                          disabled={busy || rateLimitExceeded}
                          className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none"
                        >
                          {busy ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <PlayIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                              Send Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Panel */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
                  
                  {/* Response Header */}
                  <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CodeBracketIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-white">Response History</h3>
                      <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-200 rounded-lg text-xs font-bold">
                        {(responses[active?.id] || []).length}
                      </span>
                    </div>
                    <button 
                      className="group flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 px-3 py-1 rounded-lg" 
                      onClick={() => { if (active?.id && responses[active.id]) setResponses(prev => ({ ...prev, [active.id]: [] })); }}
                    >
                      <TrashIcon className="h-3 w-3 group-hover:scale-110 transition-transform" />
                      Clear
                    </button>
                  </div>
                  
                  {/* Response Content */}
                  <div className="relative p-6">
                    {(responses[active?.id] || []).length === 0 ? (
                      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-8 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <RocketLaunchIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-bold text-white mb-2">Ready to Test</div>
                        <div className="text-sm text-gray-400">Configure your request above and click "Send Request" to see results</div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {(responses[active?.id] || []).map((r, idx) => (
                          <div key={idx} className="border border-gray-700/50 rounded-xl overflow-hidden shadow-lg">
                            {/* Response Status Header */}
                            <div className={`px-4 py-3 flex items-center justify-between ${
                              r.error 
                                ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 border-b border-red-500/30' 
                                : r.status >= 400 
                                ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-b border-yellow-500/30' 
                                : 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-b border-green-500/30'
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-lg ${
                                  r.error 
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                                    : r.status >= 400 
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                }`}>
                                  {r.error ? (
                                    <ExclamationTriangleIcon className="w-3 h-3 text-white" />
                                  ) : r.status >= 400 ? (
                                    <ExclamationTriangleIcon className="w-3 h-3 text-white" />
                                  ) : (
                                    <CheckCircleIcon className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <ClockIcon className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs font-mono text-gray-300">
                                      {new Date(r.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  {r.error ? (
                                    <span className="font-bold text-red-200 text-sm">Request Failed</span>
                                  ) : (
                                    <span className="font-mono font-bold text-sm text-white">
                                      {r.status} {r.statusText}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs font-mono text-gray-400 bg-black/20 px-2 py-1 rounded-lg max-w-xs truncate">
                                {r.config?.method} {r.config?.url?.split('/').pop() || 'endpoint'}
                              </div>
                            </div>
                            
                            {/* Response Body */}
                            <div className="p-4 bg-gray-950/30">
                              <pre className="text-xs font-mono text-gray-100 overflow-x-auto whitespace-pre-wrap">
                                {r.error ? (
                                  <div>
                                    <div className="text-red-400 font-bold mb-2">Error:</div>
                                    <div className="text-red-300 mb-3">{r.error}</div>
                                    {r.response && (
                                      <div>
                                        <div className="text-yellow-400 font-bold mb-2">Response Details:</div>
                                        <div className="text-yellow-200 mb-1">Status: {r.response.status}</div>
                                        <div className="text-gray-300">
                                          {JSON.stringify(r.response.data, null, 2)}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  JSON.stringify(r.data, null, 2)
                                )}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}