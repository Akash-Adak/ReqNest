import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
  KeyIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline";
import ServerStackIcon from '@mui/icons-material/Storage';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    apiCalls: 0,
    activeApis: 0,
    revenue: 0,
    uptime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        
        // In a real app, you would fetch from your actual API endpoints
        const [statsResponse, activityResponse, keysResponse] = await Promise.all([
          fetch("/api/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("/api/activity/recent", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("/api/keys", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // For demo purposes, we'll use mock data but structure it like real API calls
        if (statsResponse.ok) {
          // Simulate API response
          setStats({
            apiCalls: 124837,
            activeApis: 8,
            revenue: 1249.99,
            uptime: 99.98
          });
        }

        if (activityResponse.ok) {
          setRecentActivity([
            { id: 1, action: "API Call", target: "Weather API", time: "2 minutes ago", status: "success" },
            { id: 2, action: "Subscription", target: "Premium Plan", time: "5 hours ago", status: "success" },
            { id: 3, action: "Limit Warning", target: "Geocoding API", time: "12 hours ago", status: "warning" },
            { id: 4, action: "API Call", target: "Payment API", time: "1 day ago", status: "success" },
            { id: 5, action: "Updated Profile", target: "Account Settings", time: "2 days ago", status: "info" }
          ]);
        }

        if (keysResponse.ok) {
          // Load API keys from localStorage for demo
          const storedKeys = JSON.parse(localStorage.getItem("userApiKeys") || "[]");
          setApiKeys(storedKeys);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Generate new API key
  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      alert("Please enter a name for your API key");
      return;
    }

    try {
      setIsGeneratingKey(true);
      const token = localStorage.getItem("authToken");
      
      // In a real app, this would call your backend
      const response = await fetch("/api/keys/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newKeyName })
      });

      if (response.ok) {
        // For demo purposes, generate a mock API key
        const newKey = {
          id: Date.now(),
          name: newKeyName,
          key: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          created: new Date().toISOString(),
          lastUsed: null
        };

        const updatedKeys = [...apiKeys, newKey];
        setApiKeys(updatedKeys);
        localStorage.setItem("userApiKeys", JSON.stringify(updatedKeys));
        setNewKeyName("");
        
        alert(`API Key created successfully! Please copy it now as it won't be shown again: ${newKey.key}`);
      } else {
        throw new Error("Failed to generate API key");
      }
    } catch (error) {
      console.error("Error generating API key:", error);
      alert("Failed to generate API key. Please try again.");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key)
      .then(() => {
        alert("API key copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Revoke API key
  const revokeApiKey = async (keyId) => {
    if (!window.confirm("Are you sure you want to revoke this API key?")) return;

    try {
      const token = localStorage.getItem("authToken");
      
      // In a real app, this would call your backend
      const response = await fetch(`/api/keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedKeys = apiKeys.filter(key => key.id !== keyId);
        setApiKeys(updatedKeys);
        localStorage.setItem("userApiKeys", JSON.stringify(updatedKeys));
        alert("API key revoked successfully");
      } else {
        throw new Error("Failed to revoke API key");
      }
    } catch (error) {
      console.error("Error revoking API key:", error);
      alert("Failed to revoke API key. Please try again.");
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, isPositive = true }) => (
    <div className="group relative bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-2 flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${!isPositive && 'rotate-180'}`} />
                {change}
              </p>
            )}
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ action, target, time, status }) => {
    const statusColors = {
      success: "bg-green-500/20 text-green-400",
      warning: "bg-yellow-500/20 text-yellow-400",
      error: "bg-red-500/20 text-red-400",
      info: "bg-blue-500/20 text-blue-400"
    };

    return (
      <div className="flex items-center py-4 border-b border-gray-700/50 last:border-0 group">
        <div className={`flex-shrink-0 w-2 h-2 rounded-full ${statusColors[status]} mr-3`}></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {action} · <span className="text-gray-400">{target}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-gray-500 hover:text-purple-400">
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white pt-16">
      {/* Mouse follower */}
      <div 
        className="fixed w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-10 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Manage your APIs and monitor usage in real-time.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-700 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New API
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-xl border border-transparent text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all transform hover:-translate-y-0.5">
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total API Calls"
            value={stats.apiCalls.toLocaleString()}
            icon={GlobeAltIcon}
            change="+12.3%"
            isPositive={true}
          />
          <StatCard
            title="Active APIs"
            value={stats.activeApis}
            icon={ServerStackIcon}
            change="+2"
            isPositive={true}
          />
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={CurrencyDollarIcon}
            change="+5.2%"
            isPositive={true}
          />
          <StatCard
            title="Uptime %"
            value={`${stats.uptime}%`}
            icon={ChartBarIcon}
            change="+0.2%"
            isPositive={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Keys Management */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-purple-500/20 h-full">
              <div className="px-6 py-5 border-b border-gray-700/50">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <KeyIcon className="h-5 w-5 mr-2 text-purple-400" />
                  API Keys
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label htmlFor="key-name" className="block text-sm font-medium text-gray-400 mb-1">
                    Create New Key
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="key-name"
                      placeholder="Key name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="flex-1 bg-gray-700/50 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    />
                    <button
                      onClick={generateApiKey}
                      disabled={isGeneratingKey}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg disabled:opacity-50"
                    >
                      {isGeneratingKey ? "Generating..." : "Create"}
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-medium text-white mb-3">Your API Keys</h4>
                  {apiKeys.length === 0 ? (
                    <p className="text-gray-400 text-sm">No API keys yet. Create your first one!</p>
                  ) : (
                    <div className="space-y-3">
                      {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="bg-gray-700/30 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{apiKey.name}</p>
                              <p className="text-gray-400 text-sm mt-1">
                                Created: {new Date(apiKey.created).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => copyToClipboard(apiKey.key)}
                                className="text-gray-400 hover:text-white"
                                title="Copy API Key"
                              >
                                <DocumentDuplicateIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => revokeApiKey(apiKey.id)}
                                className="text-gray-400 hover:text-red-400"
                                title="Revoke API Key"
                              >
                                &times;
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center">
                            <span className="bg-gray-600 text-xs text-gray-300 px-2 py-1 rounded">
                              {apiKey.key.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-purple-500/20 h-full">
              <div className="px-6 py-5 border-b border-gray-700/50">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-purple-400" />
                  Recent Activity
                </h3>
              </div>
              <div className="px-6 divide-y divide-gray-700/50">
                {recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    action={activity.action}
                    target={activity.target}
                    time={activity.time}
                    status={activity.status}
                  />
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-900/50">
                <button className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  View all activity →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* API Usage */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-purple-400" />
              API Usage
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Weather API', usage: 75, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                { name: 'Payment API', usage: 42, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
                { name: 'Geocoding API', usage: 33, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
                { name: 'Image Processing', usage: 18, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' }
              ].map((api, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{api.name}</span>
                    <span>{api.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${api.color}`} 
                      style={{ width: `${api.usage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-purple-400" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">New user registered</p>
                  <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">API usage increased</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
            <button className="mt-4 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
              View all notifications →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;