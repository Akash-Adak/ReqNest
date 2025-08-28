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
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

export default function ApiTesterTabs() {
  const { apiName } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [schema, setSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [schemaError, setSchemaError] = useState(null);
  const [updateAll, setUpdateAll] = useState(false);
  const [updateField, setUpdateField] = useState("id");

  const [endpoints, setEndpoints] = useState([
    { 
      id: 1, 
      label: "Create", 
      method: "POST", 
      path: `/data/${apiName}`, 
      description: "Create new document", 
      requiresBody: true,
      icon: <DocumentPlusIcon className="h-4 w-4" />
    },
    { 
      id: 2, 
      label: "List All", 
      method: "GET", 
      path: `/data/${apiName}`, 
      description: "Get all documents", 
      requiresBody: false,
      icon: <ListBulletIcon className="h-4 w-4" />
    },
    { 
      id: 3, 
      label: "Search", 
      method: "POST", 
      path: `/data/${apiName}/search`, 
      description: "Search by fields", 
      requiresBody: true,
      icon: <MagnifyingGlassIcon className="h-4 w-4" />
    },
    { 
      id: 4, 
      label: "Update", 
      method: "PUT", 
      path: `/data/${apiName}`, 
      description: "Update document(s) + _id must", 
      requiresBody: true,
      icon: <PencilSquareIcon className="h-4 w-4" />
    },
    { 
      id: 5, 
      label: "Delete", 
      method: "DELETE", 
      path: `/data/${apiName}/delete`, 
      description: "Delete document by criteria", 
      requiresBody: true,
      icon: <DeleteIcon className="h-4 w-4" />
    }
  ]);

  const [activeId, setActiveId] = useState(1);
  const [headersText, setHeadersText] = useState(`{
  "Content-Type": "application/json"
}`);
  const [baseUrl, setBaseUrl] = useState("http://localhost:8080");
  const [responses, setResponses] = useState({});
  const [busy, setBusy] = useState(false);
  const [requestBody, setRequestBody] = useState("{}");
  const [jsonError, setJsonError] = useState(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

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
    if (loggedInUser) {
      setUser(loggedInUser);

      setHeadersText(JSON.stringify({
        "Content-Type": "application/json",
        "X-API-KEY": loggedInUser.apiKey || loggedInUser.email,
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
        const sample = generateEmptyKeysFromSchema(parsed);
        setRequestBody(JSON.stringify(sample, null, 2));
        setSchemaError(null);
      })
      .catch((err) => setSchemaError(err.message || String(err)))
      .finally(() => setLoadingSchema(false));
  }, [apiName, baseUrl]);

  const active = endpoints.find((e) => e.id === activeId) || endpoints[0];

  const theme = darkMode
    ? { 
        background: "bg-gray-900", 
        text: "text-gray-100", 
        card: "bg-gray-800", 
        border: "border-gray-700", 
        input: "bg-gray-700 text-white border-gray-600 placeholder-gray-400", 
        button: "bg-blue-600 hover:bg-blue-700 text-white", 
        error: "bg-red-900 text-red-100", 
        success: "bg-green-900 text-green-100",
        sidebar: "bg-gray-800",
        tabActive: "bg-blue-500/20 text-blue-400 border-blue-500",
        tabInactive: "text-gray-400 hover:text-gray-200 border-transparent"
      }
    : { 
        background: "bg-gray-50", 
        text: "text-gray-800", 
        card: "bg-white", 
        border: "border-gray-200", 
        input: "bg-white text-gray-800 border-gray-300 placeholder-gray-500", 
        button: "bg-blue-600 hover:bg-blue-700 text-white", 
        error: "bg-red-100 text-red-800", 
        success: "bg-green-100 text-green-800",
        sidebar: "bg-gray-50",
        tabActive: "bg-blue-100 text-blue-700 border-blue-500",
        tabInactive: "text-gray-600 hover:text-gray-900 border-transparent"
      };

  function MethodBadge({ method }) {
    const colorMap = { 
      GET: "bg-green-100 text-green-800 border-green-200", 
      POST: "bg-blue-100 text-blue-800 border-blue-200", 
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      DELETE: "bg-red-100 text-red-800 border-red-200", 
      PATCH: "bg-purple-100 text-purple-800 border-purple-200" 
    };
    

    
    const colors = darkMode ? darkColorMap[method] || "bg-gray-900/30 text-gray-300 border-gray-700/30" 
                            : colorMap[method] || "bg-gray-100 text-gray-800 border-gray-200";
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-mono font-bold border ${colors}`}>
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
      
      if (diffHrs > 0) return `${diffHrs} hours ${diffMins} minutes`;
      return `${diffMins} minutes`;
    } catch (e) {
      return "24 hours";
    }
  }

  return (
    <div className={`min-h-screen ${theme.background} ${theme.text} transition-colors duration-200`}>
      {/* Header */}
      <div className={`border-b ${theme.border} ${theme.card} sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">API Playground — <span className="text-blue-600">{apiName}</span></h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <input 
                className={`border ${theme.input} px-3 py-1.5 rounded text-sm w-64 transition-colors`} 
                value={baseUrl} 
                onChange={(e) => setBaseUrl(e.target.value)} 
                placeholder="Backend base URL" 
              />
              
              
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Logged in as: {user.name || user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tier selection */}
       {user && (
        <div className={`mb-6 p-4 rounded-lg ${theme.card} border ${theme.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium mb-1">API Tier</h2>
              <p className="text-sm text-gray-500">
                Your current plan determines rate limits and features
              </p>
            </div>

            {/* Fixed display of tier */}
            <span className="px-3 py-1 rounded text-sm font-semibold border bg-gray-100">
              {user.tier}
            </span>
          </div>
        </div>
      )}


        {/* Rate limit banner */}
        {rateLimitExceeded && (
          <div className={`mb-6 p-4 rounded-lg border ${theme.border} ${theme.error} flex justify-between items-center`}>
            <div>
              <h3 className="font-medium">Rate Limit Exceeded</h3>
              <p className="text-sm mt-1">
                You've reached your API call limit. Please wait {formatRateLimitReset(rateLimitInfo?.reset)} or upgrade your plan for higher limits.
              </p>
            </div>
            <button 
              onClick={() => navigate("/plans")}
              className={`flex items-center ${theme.button} px-4 py-2 rounded text-sm`}
            >
              Upgrade Plan <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}

        {loadingSchema ? (
          <div className={`p-6 ${theme.card} rounded-lg border ${theme.border} flex items-center justify-center`}>
            <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
            Loading schema...
          </div>
        ) : schemaError ? (
          <div className={`p-6 rounded-lg border ${theme.border} ${theme.error}`}>
            <div className="font-bold">Error loading schema</div>
            <div className="mt-2 text-sm font-mono whitespace-pre-wrap">{schemaError}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className={`rounded-lg shadow-sm ${theme.border} border overflow-hidden`}>
                <div className={`p-4 border-b ${theme.border}`}>
                  <div className="flex justify-between items-center">
                    <strong className="text-sm">API Endpoints</strong>
                    <span className={`text-xs ${theme.input} px-2 py-1 rounded`}>{endpoints.length}</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {endpoints.map((ep) => (
                    <button
                      key={ep.id}
                      className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${ep.id === activeId ? theme.tabActive : theme.tabInactive} border-l-2`}
                      onClick={() => { setActiveId(ep.id); setUpdateAll(false); }}
                    >
                      <div className="mt-0.5">
                        {ep.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MethodBadge method={ep.method} />
                          <div className="font-medium text-sm truncate">{ep.label}</div>
                        </div>
                        <div className={`text-xs mt-1 truncate opacity-70`}>{ep.path}</div>
                        {ep.description && <div className={`text-xs mt-1 opacity-60`}>{ep.description}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-9 space-y-6">
              <div className={`rounded-lg shadow-sm ${theme.border} border p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">{active.label} Request</h2>
                  <div className="flex items-center">
                    <MethodBadge method={active.method} />
                    <span className="ml-2 text-sm font-mono opacity-70">{active.path}</span>
                  </div>
                </div>

                {/* Request section */}
                <div className="space-y-6">
                  {active?.method === "PUT" && (
                    <div className={`p-4 rounded-lg ${theme.card} border ${theme.border}`}>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="updateAll" 
                          checked={updateAll} 
                          onChange={(e) => setUpdateAll(e.target.checked)} 
                          className="mr-2 rounded"
                        />
                        <label htmlFor="updateAll" className="text-sm font-medium">Update all matching documents</label>
                      </div>
                      {updateAll && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium mb-1">Field to match</label>
                          <input 
                            type="text" 
                            value={updateField} 
                            onChange={(e) => setUpdateField(e.target.value)} 
                            className={`w-full ${theme.input} border ${theme.border} rounded px-3 py-2 text-sm`} 
                            placeholder="Field name (default: id)" 
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Request Headers</label>
                    <textarea 
                      rows={4} 
                      className={`w-full ${theme.input} border ${theme.border} rounded p-3 font-mono text-sm transition-colors`} 
                      value={headersText} 
                      onChange={(e) => setHeadersText(e.target.value)} 
                    />
                  </div>

                  {active?.requiresBody && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {active?.method === "GET" ? "Query Parameters" : "Request Body"}
                      </label>
                      <textarea 
                        rows={10} 
                        className={`w-full ${theme.input} border ${theme.border} rounded p-3 font-mono text-sm transition-colors`} 
                        value={requestBody} 
                        onChange={(e) => setRequestBody(e.target.value)} 
                        placeholder={JSON.stringify(schema?.example || {}, null, 2)} 
                      />
                      {jsonError && (
                        <div className={`mt-2 p-3 rounded text-sm ${theme.error}`}>
                          {jsonError}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={sendRequest} 
                      disabled={busy || rateLimitExceeded}
                      className={`${theme.button} px-4 py-2.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors`}
                    >
                      {busy ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4" />
                          Send {active?.method} Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Response section */}
              <div className={`rounded-lg shadow-sm ${theme.border} border overflow-hidden`}>
                <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
                  <h3 className="text-sm font-medium">Response History</h3>
                  <button 
                    className={`text-xs flex items-center gap-1 ${theme.text} opacity-70 hover:opacity-100 transition-opacity`} 
                    onClick={() => { if (active?.id && responses[active.id]) setResponses(prev => ({ ...prev, [active.id]: [] })); }}
                  >
                    <TrashIcon className="h-3 w-3" />
                    Clear history
                  </button>
                </div>
                
                <div className="p-6">
                  {(responses[active?.id] || []).length === 0 ? (
                    <div className={`rounded-lg p-8 text-center ${theme.card} border ${theme.border}`}>
                      <div className="text-sm opacity-70">No responses yet. Send a request to see results.</div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {(responses[active?.id] || []).map((r, idx) => (
                        <div key={idx} className={`border ${theme.border} rounded-lg overflow-hidden`}>
                          <div className={`px-4 py-3 flex items-center justify-between ${r.error ? theme.error : r.status >= 400 ? "bg-amber-100 text-red-800 dark:bg-amber-900/30 dark:text-amber-300" : theme.success}`}>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-mono">{new Date(r.timestamp).toLocaleTimeString()}</span>
                              {r.error ? (
                                <span className="font-medium">Error</span>
                              ) : (
                                <span className="font-mono font-medium">{r.status} {r.statusText}</span>
                              )}
                            </div>
                            <div className={`text-xs opacity-100 truncate max-w-xs`}>
                              {r.config?.method} {r.config?.url}
                            </div>
                          </div>
                          <div className={`p-4 overflow-x-auto`}>
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {r.error ? (
                                <>
                                  <div className="text-red-800 dark:text-red-400">{r.error}</div>
                                  {r.response && (
                                    <div className="mt-3">
                                      <div className="font-semibold">Status: {r.response.status}</div>
                                      <div className="mt-2">{JSON.stringify(r.response.data, null, 2)}</div>
                                    </div>
                                  )}
                                </>
                              ) : JSON.stringify(r.data, null, 2)}
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
  );
}