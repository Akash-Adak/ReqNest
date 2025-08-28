// src/pages/ApiDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeftIcon,
  ClipboardIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CodeBracketIcon,
  ChartBarIcon,
  CpuChipIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  ServerIcon,
  EyeIcon,
  EyeSlashIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Sidebar Navigation Component
const Sidebar = ({ activeTab, setActiveTab, apiName, status, environment, isSidebarOpen, setIsSidebarOpen }) => {
  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "schema", name: "Schema", icon: CodeBracketIcon },
    { id: "monitoring", name: "Monitoring", icon: CpuChipIcon },
    { id: "history", name: "History", icon: ClockIcon },
    { id: "testing", name: "Testing", icon: ArrowsRightLeftIcon },
    { id: "configuration", name: "Configuration", icon: ServerIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 pt-16 overflow-y-auto transition-transform duration-300 z-30 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold truncate">{apiName}</h2>
            <button 
              className="lg:hidden p-1 rounded-md hover:bg-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center mt-2">
            <div className={`h-2 w-2 rounded-full mr-2 ${status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-300 capitalize">{status}</span>
            <span className="ml-2 text-xs px-2 py-1 bg-gray-700 rounded-full">
              {environment}
            </span>
          </div>
        </div>
        <nav className="p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg mb-1 ${activeTab === tab.id
                  ? "bg-blue-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
                  }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
              >
                <Icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

// Main Content Component
export default function ApiDetails() {
  const { apiName } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [apiStatus, setApiStatus] = useState("active");
  const [environment, setEnvironment] = useState("production");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Calculate metrics from logs
  const calculateMetrics = (logs) => {
    if (!logs || logs.length === 0) {
      return {
        avgResponseTime: "0ms",
        errorRate: "0%",
        totalRequests: 0,
        successCount: 0,
        errorCount: 0,
        lastUpdated: new Date().toISOString()
      };
    }

    const totalRequests = logs.length;
    const successCount = logs.filter(log => log.status >= 200 && log.status < 300).length;
    const errorCount = totalRequests - successCount;
    const errorRate = totalRequests > 0 ? ((errorCount / totalRequests) * 100).toFixed(1) + '%' : '0%';
    
    const totalResponseTime = logs.reduce((sum, log) => sum + (log.responseTime || 0), 0);
    const avgResponseTime = totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) + 'ms' : '0ms';

    return {
      avgResponseTime,
      errorRate,
      totalRequests,
      successCount,
      errorCount,
      lastUpdated: new Date().toISOString()
    };
  };

  // Calculate usage data from logs
  const calculateUsageData = (logs) => {
    if (!logs || logs.length === 0) {
      return { today: 0, lastWeek: 0, lastMonth: 0 };
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const todayCount = logs.filter(log => new Date(log.timestamp) >= oneDayAgo).length;
    const lastWeekCount = logs.filter(log => new Date(log.timestamp) >= oneWeekAgo).length;
    const lastMonthCount = logs.filter(log => new Date(log.timestamp) >= oneMonthAgo).length;

    return {
      today: todayCount,
      lastWeek: lastWeekCount,
      lastMonth: lastMonthCount
    };
  };

  // Extract endpoints from logs
  const extractEndpoints = (logs) => {
    if (!logs || logs.length === 0) return [];
    
    const endpointsMap = {};
    logs.forEach(log => {
      if (log.url) {
        // Extract path from URL
        const urlObj = new URL(log.url);
        const path = urlObj.pathname;
        
        if (!endpointsMap[path]) {
          endpointsMap[path] = {
            method: log.operation || 'GET',
            path: path,
            description: `${log.operation} ${path}`,
            type: getOperationType(log.operation)
          };
        }
      }
    });
    
    return Object.values(endpointsMap);
  };

  // Determine operation type based on HTTP method
  const getOperationType = (operation) => {
    switch (operation) {
      case 'GET': return 'read';
      case 'POST': return 'create';
      case 'PUT': return 'update';
      case 'DELETE': return 'delete';
      default: return 'other';
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `http://localhost:8080/cloud-api/endpoints/${apiName}`,
        { withCredentials: true, timeout: 10000 }
      );
      console.log(res);
      const apiLogs = Array.isArray(res.data) ? res.data : [res.data];
      setLogs(apiLogs);
      
      // Set status and environment based on response
      if (res.data.status) setApiStatus(res.data.status);
      if (res.data.environment) setEnvironment(res.data.environment);
    } catch (err) {
      console.error("API fetch error:", err);
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. The server is taking too long to respond.");
      } else if (err.response?.status === 404) {
        setError(`API endpoint "${apiName}" not found.`);
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view this API.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to fetch API details. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [apiName]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied({...copied, [key]: true});
    setTimeout(() => setCopied({...copied, [key]: false}), 1500);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    } catch (e) {
      return timestamp;
    }
  };

  const formatJson = (data) => {
    if (!data) return "No data available";
    
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return data;
    }
  };

  const filterEndpointsByType = (type, endpoints) => {
    return endpoints.filter(endpoint => endpoint.type === type);
  };

  const renderTabContent = () => {
    const monitoringData = calculateMetrics(logs);
    const usageData = calculateUsageData(logs);
    const endpoints = extractEndpoints(logs);

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 mr-3 md:mr-4">
                    <ChartBarIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Total Requests</p>
                    <h3 className="text-xl md:text-2xl font-bold">{monitoringData.totalRequests.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100 mr-3 md:mr-4">
                    <CpuChipIcon className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Avg. Response Time</p>
                    <h3 className="text-xl md:text-2xl font-bold">{monitoringData.avgResponseTime}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-red-100 mr-3 md:mr-4">
                    <ExclamationTriangleIcon className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Error Rate</p>
                    <h3 className="text-xl md:text-2xl font-bold">{monitoringData.errorRate}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100 mr-3 md:mr-4">
                    <ClockIcon className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">Success Rate</p>
                    <h3 className="text-xl md:text-2xl font-bold">{((monitoringData.successCount / monitoringData.totalRequests) * 100).toFixed(1)}%</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.slice(0, 10).map((log, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            log.operation === 'GET' ? 'bg-blue-100 text-blue-800' :
                            log.operation === 'POST' ? 'bg-green-100 text-green-800' :
                            log.operation === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            log.operation === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.operation}
                          </span>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            log.status >= 200 && log.status < 300 ? 'bg-green-100 text-green-800' :
                            log.status >= 400 && log.status < 500 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {log.responseTime}ms
                        </td>
                        <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {log.userId ? log.userId.substring(0, 8) + '...' : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Endpoint Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Read Operations</h4>
                  <ul className="space-y-2">
                    {filterEndpointsByType("read", endpoints).map((endpoint, idx) => (
                      <li key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-2 ${
                          endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <span className="text-xs md:text-sm truncate">{endpoint.path}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Write Operations</h4>
                  <ul className="space-y-2">
                    {endpoints.filter(e => e.type !== "read").map((endpoint, idx) => (
                      <li key={idx} className="flex items-center p-2 bg-gray-50 rounded">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-2 ${
                          endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <span className="text-xs md:text-sm truncate">{endpoint.path}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "schema":
        return (
          <div className="space-y-6">
            {logs.length > 0 && logs[0].schema ? (
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">API Schema</h3>
                <div className="relative">
                  <button
                    onClick={() => handleCopy(formatJson(logs[0].schema), 'schema')}
                    className="absolute top-2 right-2 p-2 bg-gray-100 border rounded-md text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    title="Copy Schema"
                  >
                    {copied.schema ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <ClipboardIcon className="h-4 w-4" />
                    )}
                  </button>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs md:text-sm overflow-x-auto max-h-96">
                    {formatJson(logs[0].schema)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                <p className="text-gray-500">No schema available for this API.</p>
              </div>
            )}
          </div>
        );
      
      case "monitoring":
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">Requests Today</p>
                  <p className="text-xl md:text-2xl font-bold">{usageData.today.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">Requests This Week</p>
                  <p className="text-xl md:text-2xl font-bold">{usageData.lastWeek.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">Requests This Month</p>
                  <p className="text-xl md:text-2xl font-bold">{usageData.lastMonth.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-gray-100 h-32 md:h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Response Time Chart Visualization</p>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Endpoint Health</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Latency</th>
                      <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {endpoints.map((endpoint, idx) => {
                      const endpointLogs = logs.filter(log => {
                        try {
                          const urlObj = new URL(log.url);
                          return urlObj.pathname === endpoint.path;
                        } catch {
                          return false;
                        }
                      });
                      
                      const endpointMetrics = calculateMetrics(endpointLogs);
                      
                      return (
                        <tr key={idx}>
                          <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-2 ${
                              endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                              endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className="text-xs md:text-sm truncate max-w-xs">{endpoint.path}</span>
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Operational
                            </span>
                          </td>
                          <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm">{endpointMetrics.avgResponseTime}</td>
                          <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm">{endpointMetrics.errorRate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case "history":
        return (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">API Request History</h3>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          log.operation === 'GET' ? 'bg-blue-100 text-blue-800' :
                          log.operation === 'POST' ? 'bg-green-100 text-green-800' :
                          log.operation === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          log.operation === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.operation}
                        </span>
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          log.status >= 200 && log.status < 300 ? 'bg-green-100 text-green-800' :
                          log.status >= 400 && log.status < 500 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {log.responseTime}ms
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {log.userId ? log.userId.substring(0, 8) + '...' : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case "testing":
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Test Endpoints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Quick Test</h4>
                  <p className="text-xs md:text-sm text-gray-600 mb-4">Test the API with a sample request</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm hover:bg-blue-700 transition-colors">
                    Run Test
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Custom Request</h4>
                  <p className="text-xs md:text-sm text-gray-600 mb-4">Build and send a custom API request</p>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors">
                    Create Request
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Recent Test Results</h3>
              <div className="bg-gray-100 h-32 md:h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Test history and results will appear here</p>
              </div>
            </div>
          </div>
        );
      
      case "configuration":
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">API Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Rate Limiting</h4>
                    <p className="text-xs md:text-sm text-gray-600">100 requests per minute</p>
                  </div>
                  <button className="px-3 py-1 text-xs md:text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Caching</h4>
                    <p className="text-xs md:text-sm text-gray-600">Enabled (5 minutes)</p>
                  </div>
                  <button className="px-3 py-1 text-xs md:text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Logging</h4>
                    <p className="text-xs md:text-sm text-gray-600">Detailed logging enabled</p>
                  </div>
                  <button className="px-3 py-1 text-xs md:text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2 text-sm md:text-base">Deactivate API</h4>
                <p className="text-xs md:text-sm text-red-600 mb-4">Once deactivated, this API will no longer accept requests.</p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs md:text-sm hover:bg-red-700 transition-colors">
                  Deactivate API
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab to view details</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading API details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading API Details</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={fetchDetails}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiName={apiName}
        status={apiStatus}
        environment={environment}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="lg:ml-64 flex-1 pt-16">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden mr-4 p-2 rounded-md bg-white border text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">{apiName}</h1>
                <p className="text-xs md:text-sm text-gray-600">Comprehensive management for your API endpoint</p>
              </div>
            </div>
            <button
              onClick={fetchDetails}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 md:px-4 md:py-2 bg-white border rounded-lg text-xs md:text-sm"
              title="Refresh data"
            >
              <ArrowPathIcon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}