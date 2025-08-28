import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Google, GitHub, Logout, AccountCircle, Email,
  CalendarToday, WorkspacePremium, Security,
  Edit, Upgrade, TrendingUp, Speed, CheckCircle,
  ArrowForward, Language, Notifications, Payment
} from '@mui/icons-material';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/user", { credentials: "include" }),
      fetch("http://localhost:8080/api/user/stats", { credentials: "include" })
    ])
    .then(async ([userRes, statsRes]) => {
      if (userRes.status === 401) throw new Error("Unauthorized – Please log in");
      if (!userRes.ok) throw new Error("Failed to fetch profile");
      if (!statsRes.ok) throw new Error("Failed to fetch stats");

      const userData = await userRes.json();
      const statsData = await statsRes.json();
      setUserData(userData);
      setStats(statsData);
      setEditForm({
        name: userData.name || user.name || "",
        email: userData.email || user.email || ""
      });
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call to update user details
    console.log("Updating user:", editForm);
    // For demo purposes, we'll just update local state
    setUserData({...userData, ...editForm});
    setEditing(false);
  };

  const handleUpgradePlan = () => {
    navigate("/plans");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse text-xl text-indigo-600">Loading your dashboard...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  const provider = user.avatar_url ? 'GitHub' : 'Google';
  const { tier = "FREE", planExpiry, lastLogin } = userData;
  const now = new Date();
  const expired = planExpiry ? new Date(planExpiry) < now : false;

  // Plan details for display
  const planDetails = {
    FREE: {
      name: "Free Plan",
      color: "gray",
      features: ["100 API calls/day", "Basic analytics", "Email support"],
      price: "$0/month",
      upgradeText: "Upgrade to Premium"
    },
    PREMIUM: {
      name: "Premium Plan",
      color: "purple",
      features: ["1,000 API calls/day", "Advanced analytics", "Priority support", "Faster response times"],
      price: "$19/month",
      upgradeText: "Upgrade to Pro"
    },
    PRO: {
      name: "Pro Plan",
      color: "blue",
      features: ["10,000 API calls/day", "Full analytics dashboard", "24/7 phone support", "Custom endpoints"],
      price: "$49/month",
      upgradeText: "Manage Subscription"
    }
  };

  const currentPlan = planDetails[tier] || planDetails.FREE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition"
          >
            <Logout fontSize="small" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              <button 
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
              >
                <Edit fontSize="small" /> {editing ? "Cancel" : "Edit"}
              </button>
            </div>
            
            {!editing ? (
              <div className="flex gap-6">
                <div className="relative">
                  <img 
                    src={user.picture || user.avatar_url} 
                    className="h-32 w-32 rounded-full border-4 border-indigo-100" 
                    alt="Profile"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1 rounded-full">
                    {provider === 'Google' ? <Google fontSize="small" /> : <GitHub fontSize="small" />}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-medium text-gray-800">{userData.name || user.name || user.login}</h3>
                  <p className="text-gray-500 flex items-center mt-2">
                    <Email className="h-5 w-5 mr-2" /> {userData.email || user.email}
                  </p>
                  {lastLogin && (
                    <p className="text-gray-500 flex items-center mt-2">
                      <CalendarToday className="h-5 w-5 mr-2" /> Last login: {new Date(lastLogin).toLocaleString()}
                    </p>
                  )}
                  <p className="text-gray-500 flex items-center mt-2">
                    <Security className="h-5 w-5 mr-2" /> Signed in with {provider}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>

          {/* Subscription */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Subscription Plan</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${tier === "PREMIUM" ? "bg-purple-100 text-purple-800" : tier === "PRO" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                {tier}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">{currentPlan.name}</h3>
              <p className="text-2xl font-bold text-gray-900">{currentPlan.price}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Plan Features:</h4>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {expired ? (
              <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                Your plan expired on {new Date(planExpiry).toLocaleDateString()}
              </div>
            ) : planExpiry && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                Plan active until {new Date(planExpiry).toLocaleDateString()}
              </div>
            )}
            
            <button 
              onClick={handleUpgradePlan}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition shadow-md mb-3 flex items-center justify-center gap-2"
            >
              <Upgrade fontSize="small" /> {currentPlan.upgradeText}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              Upgrade for more features and higher limits
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">API Usage Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">API Calls Today</h3>
                    <p className="text-2xl font-bold text-gray-800">{stats.callsToday}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Out of {tier === "FREE" ? "100" : tier === "PREMIUM" ? "1,000" : "10,000"} daily limit</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">Success Rate</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.successRate ? stats.successRate.toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Successful API responses</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <Speed className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">Avg. Response Time</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.avgResponseTime ? stats.avgResponseTime.toFixed(1) : 0} ms
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Lower is better</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <Language className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">API Documentation</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Explore our comprehensive API documentation to make the most of our services.</p>
            <button className="text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
              View Documentation <ArrowForward fontSize="small" />
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Notifications className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Notification Settings</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Manage your email preferences and notification settings.</p>
            <button className="text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
              Configure <ArrowForward fontSize="small" />
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-4">
                <Payment className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Billing History</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-4">View your payment history and download invoices.</p>
            <button className="text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
              View History <ArrowForward fontSize="small" />
            </button>
          </div>
        </div>

        {/* Activity */}
        {stats?.recentActivity && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
              <p className="text-sm text-gray-500 mt-1">Your last 10 API calls</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                      <th className="pb-3">Endpoint</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recentActivity.map((act, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-4 text-sm font-medium text-gray-900">{act.endpoint}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            act.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            act.method === 'POST' ? 'bg-green-100 text-green-800' :
                            act.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            act.method === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {act.method}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500">{new Date(act.timestamp).toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${act.status < 400 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}