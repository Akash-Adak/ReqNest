import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserCircleIcon, 
  PencilSquareIcon, 
  CheckIcon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  CreditCardIcon,
  ChartBarIcon,
  ClockIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  CogIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    title: '',
    phone: '',
    timezone: 'UTC',
    language: 'English',
    theme: 'dark'
  });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    apiAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.login || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.blog || user.website || '',
        company: user.company || '',
        title: user.title || '',
        phone: user.phone || '',
        timezone: user.timezone || 'UTC',
        language: user.language || 'English',
        theme: user.theme || 'dark'
      });
      
      // Load notifications preferences
      if (user.notificationPreferences) {
        setNotifications(user.notificationPreferences);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!', {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />
      });
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.', {
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
      });
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || user.login || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.blog || user.website || '',
      company: user.company || '',
      title: user.title || '',
      phone: user.phone || '',
      timezone: user.timezone || 'UTC',
      language: user.language || 'English',
      theme: user.theme || 'dark'
    });
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = async (setting, value) => {
    const newNotifications = {
      ...notifications,
      [setting]: value
    };
    setNotifications(newNotifications);
    
    try {
      await updateProfile({ notificationPreferences: newNotifications });
      toast.success('Notification preferences updated!', {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />
      });
    } catch (error) {
      toast.error('Failed to update notifications', {
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
      });
    }
  };

  const handlePasswordChange = async () => {
    // This would typically open a modal or navigate to password change page
    toast.info('Password change functionality would be implemented here');
  };

  const handleTwoFactorToggle = async () => {
    try {
      // Simulate 2FA setup
      toast.info('Two-factor authentication setup would be implemented here');
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // await deleteAccount();

        toast.info('Account deletion would be implemented here');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'account', label: 'Account', icon: CogIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'usage', label: 'Usage & Billing', icon: ChartBarIcon }
  ];

  // Mock data for demonstration
  const usageData = {
    plan: 'Pro',
    price: '$29',
    nextBilling: 'Jan 15, 2024',
    apiUsage: 65,
    apiLimit: 10000,
    activeSessions: [
      { device: 'Chrome on Windows', location: 'New York, USA', time: 'Now' },
      { device: 'Safari on macOS', location: 'San Francisco, USA', time: '2 hours ago' }
    ],
    billingHistory: [
      { description: 'Pro Plan - December 2023', date: 'December 15, 2023', amount: '$29.00', status: 'Paid' },
      { description: 'Pro Plan - November 2023', date: 'November 15, 2023', amount: '$29.00', status: 'Paid' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 pb-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <UserCircleIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-black text-white">
                  Profile Settings
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>

            {activeTab === 'profile' && !editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl sticky top-24">
              <div className="p-6">
                {/* User Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-lg mx-auto">
                      {user.picture || user.avatar_url ? (
                        <img
                          src={user.picture || user.avatar_url}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mt-3">{user.name || user.login}</h3>
                  <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                </div>

                {/* Navigation Tabs */}
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                          isActive 
                            ? 'bg-purple-600 text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                        <p className="text-gray-400">Update your personal details and profile information.</p>
                      </div>
                      
                      {editMode && (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <CheckIcon className="w-4 h-4" />
                            )}
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Full Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-200">
                            {formData.name || 'Not provided'}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Email Address</label>
                        <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-400 flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4" />
                          {user.email || 'Not provided'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                      </div>

                      {/* Bio */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-white mb-2">Bio</label>
                        {editMode ? (
                          <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-200 min-h-[80px]">
                            {formData.bio || 'No bio provided'}
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Location</label>
                        {editMode ? (
                          <div className="relative">
                            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="City, Country"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-200 flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            {formData.location || 'Not provided'}
                          </div>
                        )}
                      </div>

                      {/* Website */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Website</label>
                        {editMode ? (
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="url"
                              value={formData.website}
                              onChange={(e) => handleInputChange('website', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-200">
                            {formData.website ? (
                              <a 
                                href={formData.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                <LinkIcon className="w-4 h-4" />
                                {formData.website}
                              </a>
                            ) : (
                              'Not provided'
                            )}
                          </div>
                        )}
                      </div>

                      {/* Company */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Company</label>
                        {editMode ? (
                          <div className="relative">
                            <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="Company name"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-200 flex items-center gap-2">
                            <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                            {formData.company || 'Not provided'}
                          </div>
                        )}
                      </div>

                      {/* Job Title */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Job Title</label>
                        {editMode ? (
                          <div className="relative">
                            <AcademicCapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="Your job title"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-200 flex items-center gap-2">
                            <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                            {formData.title || 'Not provided'}
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Phone Number</label>
                        {editMode ? (
                          <div className="relative">
                            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="Your phone number"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-700 rounded-lg px-4 py-3 text-gray-200 flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            {formData.phone || 'Not provided'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Other tabs remain similar but with real functionality */}
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-8">Security Settings</h2>
                    
                    <div className="space-y-6">
                      {/* Password */}
                      <div className="bg-gray-700 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <KeyIcon className="w-5 h-5 text-purple-400" />
                            <div>
                              <h3 className="font-bold text-white">Password</h3>
                              <p className="text-gray-400 text-sm">Last changed: 3 months ago</p>
                            </div>
                          </div>
                          <button 
                            onClick={handlePasswordChange}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="bg-gray-700 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
                            <div>
                              <h3 className="font-bold text-white">Two-Factor Authentication</h3>
                              <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <button 
                            onClick={handleTwoFactorToggle}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Enable 2FA
                          </button>
                        </div>
                      </div>

                      {/* Active Sessions */}
                      <div className="bg-gray-700 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <EyeIcon className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">Active Sessions</h3>
                        </div>
                        <div className="space-y-3">
                          {usageData.activeSessions.map((session, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                              <div>
                                <p className="text-white">{session.device}</p>
                                <p className="text-gray-400 text-sm">{session.location} • {session.time}</p>
                              </div>
                              <button className="text-red-400 hover:text-red-300 text-sm">
                                Revoke
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Usage & Billing Tab */}
                {activeTab === 'usage' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-8">Usage & Billing</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Current Plan */}
                      <div className="bg-purple-600 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <RocketLaunchIcon className="w-5 h-5 text-white" />
                          <h3 className="font-bold text-white">Current Plan</h3>
                        </div>
                        <p className="text-2xl font-black text-white mb-2">{usageData.plan}</p>
                        <p className="text-purple-200 text-sm">{usageData.price}/month • Next billing: {usageData.nextBilling}</p>
                      </div>

                      {/* API Usage */}
                      <div className="bg-gray-700 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <ChartBarIcon className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">API Usage</h3>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                            style={{width: `${usageData.apiUsage}%`}}
                          ></div>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {usageData.apiUsage}% of {usageData.apiLimit.toLocaleString()} requests used this month
                        </p>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="bg-gray-700 rounded-xl p-5">
                      <h3 className="font-bold text-white mb-4">Billing History</h3>
                      
                      <div className="space-y-3">
                        {usageData.billingHistory.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                            <div>
                              <p className="text-white">{item.description}</p>
                              <p className="text-gray-400 text-sm">{item.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white">{item.amount}</p>
                              <p className="text-green-400 text-sm">{item.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab - with real toggle functionality */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-8">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-700 rounded-xl p-5">
                        <h3 className="font-bold text-white mb-4">Email Notifications</h3>
                        
                        <div className="space-y-4">
                          {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                <p className="text-gray-400 text-sm">
                                  {key === 'emailUpdates' && 'Product updates and announcements'}
                                  {key === 'apiAlerts' && 'API usage and limit notifications'}
                                  {key === 'securityAlerts' && 'Important security notifications'}
                                  {key === 'marketingEmails' && 'Promotions and special offers'}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={value}
                                  onChange={(e) => handleNotificationChange(key, e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Timezone */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Timezone</label>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={formData.timezone}
                            onChange={(e) => handleInputChange('timezone', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none"
                          >
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Time (EST)</option>
                            <option value="PST">Pacific Time (PST)</option>
                            <option value="CET">Central European Time (CET)</option>
                          </select>
                        </div>
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Language</label>
                        <div className="relative">
                          <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={formData.language}
                            onChange={(e) => handleInputChange('language', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-600">
                      <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
                      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                        <p className="text-red-200 mb-4">Deleting your account is permanent and cannot be undone.</p>
                        <button 
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Profile;