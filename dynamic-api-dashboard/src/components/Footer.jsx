import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
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
  const baseUrl=import.meta.env.
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
  const baseUrl = import.meta.env.VITE_API_URL;
  const [responses, setResponses] = useState({});
  const [busy, setBusy] = useState(false);
  const [requestBody, setRequestBody] = useState("{}");
  const [jsonError, setJsonError] = useState(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Generate empty request body from schema
  const generateEmptyKeysFromSchema = (schema) => {
    if (!schema?.properties) return {};
    const sample = {};
    for (const key of Object.keys(schema.properties)) {
      const prop = schema.properties[key];
      if (prop.type === "string") sample[key] = "";
      else if (prop.type === "number") sample[key] = 0;
      else if (prop.type === "boolean") sample[key] = false;
      else if (prop.type === "array") sample[key] = [];
      else if (prop.type === "object") sample[key] = {};
      else sample[key] = null;
    }
    return sample;
  };

  // Fetch schema and set user headers
  useEffect(() => {
    setLoadingSchema(true);

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      setHeadersText(JSON.stringify({
        "Content-Type": "application/json",
        "X-API-KEY": loggedInUser.apikey,
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

  const MethodBadge = ({ method }) => {
    const colorMap = { 
      GET: "bg-green-500 text-white", 
      POST: "bg-blue-500 text-white", 
      PUT: "bg-yellow-500 text-black", 
      DELETE: "bg-red-500 text-white", 
      PATCH: "bg-purple-500 text-white" 
    };
    
    const colors = colorMap[method] || "bg-gray-500 text-white";
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold font-mono ${colors}`}>
        {method}
      </span>
    );
  };

  // Send API request
  const sendRequest = async () => {
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
      try { 
        requestData = requestBody ? JSON.parse(requestBody) : {}; 
      } catch (err) { 
        setJsonError("Invalid request body JSON: " + err.message); 
        return; 
      }
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
  };

  const formatRateLimitReset = (resetTimestamp) => {
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
  };

  const generateAiSample = async (schema) => {
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
  };

  const getColorClass = (color) => {
    const colorMap = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colorMap[color] || 'bg-purple-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-100 pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <RocketLaunchIcon className="w-7 h-7 text-white" />
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
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">{user.name || user.email}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-purple-300 font-semibold">{user.tier} Tier</span>
                </div>
              )}
              <div className="text-sm text-gray-400 font-mono bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                {baseUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Rate limit banner */}
        {rateLimitExceeded && (
          <div className="mb-6 bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <BoltIcon className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="font-bold text-white">Rate Limit Exceeded</h3>
                <p className="text-red-200 text-sm">
                  Limit resets in {formatRateLimitReset(rateLimitInfo?.reset)}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/plans")}
              className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
            >
              Upgrade 
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}

        {loadingSchema ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <ArrowPathIcon className="h-6 w-6 animate-spin text-purple-400" />
              <span className="text-lg font-semibold text-white">Loading schema...</span>
            </div>
          </div>
        ) : schemaError ? (
          <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              <div className="font-bold text-white text-lg">Schema Loading Error</div>
            </div>
            <div className="text-red-200 text-sm font-mono bg-red-900/30 rounded-lg p-4 border border-red-500/30">
              {schemaError}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Endpoints Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-bold text-white flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Endpoints
                  </h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {endpoints.map((ep) => {
                    const isActive = ep.id === activeId;
                    return (
                      <button
                        key={ep.id}
                        className={`w-full text-left p-4 transition-all duration-200 flex items-center gap-3 group ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-r-2 border-purple-400' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                        onClick={() => { 
                          setActiveId(ep.id); 
                          setUpdateAll(false); 
                        }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isActive 
                            ? `bg-gradient-to-r ${getColorClass(ep.color)} text-white` 
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

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Request Panel */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                <div className="p-6">
                  {/* Request Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getColorClass(active.color)} rounded-lg flex items-center justify-center`}>
                        {active.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{active.label}</h2>
                        <p className="text-gray-400 text-sm">{active.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MethodBadge method={active.method} />
                      <span className="text-xs font-mono text-gray-400 bg-gray-700/50 px-2 py-1 rounded border border-gray-600">
                        {active.path}
                      </span>
                    </div>
                  </div>

                  {/* Request Configuration */}
                  <div className="space-y-4">
                    {/* Update Mode Settings */}
                    {active?.method === "PUT" && (
                      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center mb-3">
                          <input 
                            type="checkbox" 
                            id="updateAll" 
                            checked={updateAll} 
                            onChange={(e) => setUpdateAll(e.target.checked)} 
                            className="w-4 h-4 rounded focus:ring-purple-500 text-purple-500 bg-gray-600 border-gray-500 mr-3"
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
                            className="w-full bg-gray-600 border border-gray-500 text-white rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500" 
                            placeholder="Field name (default: id)" 
                          />
                        )}
                      </div>
                    )}

                    {/* Headers */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Request Headers</label>
                      <textarea 
                        rows={3} 
                        className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-lg p-3 font-mono text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none" 
                        value={headersText} 
                        onChange={(e) => setHeadersText(e.target.value)} 
                      />
                    </div>

                    {/* Request Body */}
                    {active?.requiresBody && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-semibold text-white">
                            {active?.method === "GET" ? "Query Parameters" : "Request Body"}
                          </label>
                          <button
                            className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300"
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
                          rows={6} 
                          className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-lg p-3 font-mono text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none" 
                          value={requestBody} 
                          onChange={(e) => setRequestBody(e.target.value)} 
                          placeholder={JSON.stringify(schema?.example || {}, null, 2)} 
                        />
                        
                        {jsonError && (
                          <div className="mt-2 p-3 rounded-lg bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 text-red-200">
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
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                      >
                        {busy ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <PlayIcon className="h-4 w-4" />
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Panel */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                <div className="p-6">
                  {/* Response Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <CodeBracketIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-white">Response History</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded text-xs font-bold border border-green-500/30">
                        {(responses[active?.id] || []).length}
                      </span>
                    </div>
                    <button 
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-all duration-300 hover:bg-gray-700/50 px-3 py-1 rounded-lg border border-gray-600 hover:border-gray-500" 
                      onClick={() => { 
                        if (active?.id && responses[active.id]) {
                          setResponses(prev => ({ ...prev, [active.id]: [] })); 
                        }
                      }}
                    >
                      <TrashIcon className="h-3 w-3" />
                      Clear
                    </button>
                  </div>
                  
                  {/* Response Content */}
                  <div>
                    {(responses[active?.id] || []).length === 0 ? (
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-8 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <RocketLaunchIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-bold text-white mb-2">Ready to Test</div>
                        <div className="text-sm text-gray-400">Configure your request above and click "Send Request" to see results</div>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {(responses[active?.id] || []).map((r, idx) => (
                          <div key={idx} className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700/30">
                            {/* Response Status Header */}
                            <div className={`px-3 py-2 flex items-center justify-between ${
                              r.error 
                                ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 border-b border-red-500/30' 
                                : r.status >= 400 
                                ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-b border-yellow-500/30' 
                                : 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-b border-green-500/30'
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center ${
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
                              <div className="text-xs font-mono text-gray-400 bg-black/20 px-2 py-1 rounded max-w-xs truncate">
                                {r.config?.method} {r.config?.url?.split('/').pop() || 'endpoint'}
                              </div>
                            </div>
                            
                            {/* Response Body */}
                            <div className="p-3 bg-gray-800/30">
                              <pre className="text-xs font-mono text-gray-100 overflow-x-auto whitespace-pre-wrap">
                                {r.error ? (
                                  <div>
                                    <div className="text-red-400 font-bold mb-1">Error:</div>
                                    <div className="text-red-300 mb-2">{r.error}</div>
                                    {r.response && (
                                      <div>
                                        <div className="text-yellow-400 font-bold mb-1">Response Details:</div>
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
          </div>
        )}
      </div>
    </div>
  );
}