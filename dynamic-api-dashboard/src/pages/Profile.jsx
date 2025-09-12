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
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { 
  GitHub as GitHubIcon, 
  Google as GoogleIcon 
} from '@mui/icons-material';

const Profile = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
    }
  }, [user]);

  if (!user) return null;

  // Determine provider
  const provider = user.avatar_url ? 'GitHub' : 'Google';
  const providerIcon = provider === 'GitHub' ? <GitHubIcon /> : <GoogleIcon />;

  const handleSave = async () => {
    // Here you would typically make an API call to save the changes
    console.log('Saving profile data:', formData);
    setEditMode(false);
    // Show success message
  };

  const handleCancel = () => {
    // Reset form data to original values
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

  const handleNotificationChange = (setting, value) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'account', label: 'Account', icon: CogIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'usage', label: 'Usage & Billing', icon: ChartBarIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 pb-12">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-75 animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                <UserCircleIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                Profile Settings
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden shadow-xl sticky top-24">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
              
              <div className="relative p-6">
                {/* User Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-xl">
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
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mt-3">{user.name || user.login}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {providerIcon}
                    <span className="text-sm text-gray-400">{provider}</span>
                  </div>
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
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
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
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
              
              <div className="relative p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                        <p className="text-gray-400">Update your personal details and profile information.</p>
                      </div>
                      
                      {!editMode ? (
                        <button
                          onClick={() => setEditMode(true)}
                          className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 transform hover:-translate-y-1"
                        >
                          <PencilSquareIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 transform hover:-translate-y-1"
                          >
                            <CheckIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="group flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                          >
                            <XMarkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                            className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-200">
                            {formData.name || 'Not provided'}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Email Address</label>
                        <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-400 flex items-center gap-2">
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
                            className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-200 min-h-[80px]">
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
                              className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="City, Country"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-200 flex items-center gap-2">
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
                              className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-200">
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
                              className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="Company name"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-200 flex items-center gap-2">
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
                              className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="Your job title"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-200 flex items-center gap-2">
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
                              className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="Your phone number"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-900/30 rounded-xl px-4 py-3 text-gray-200 flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            {formData.phone || 'Not provided'}
                          </div>
                        )}
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
                            className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none"
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
                            className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                          </select>
                        </div>
                      </div>

                      {/* Theme */}
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Theme</label>
                        <div className="relative">
                          <SparklesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={formData.theme}
                            onChange={(e) => handleInputChange('theme', e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none"
                          >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                      <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
                      <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
                        <p className="text-red-200 mb-4">Deleting your account is permanent and cannot be undone.</p>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-8">Security Settings</h2>
                    
                    <div className="space-y-6">
                      {/* Password */}
                      <div className="bg-gray-900/30 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <KeyIcon className="w-5 h-5 text-purple-400" />
                            <h3 className="font-bold text-white">Password</h3>
                          </div>
                          <button className="text-purple-400 hover:text-purple-300 font-medium">
                            Change Password
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm">Last changed: 3 months ago</p>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="bg-gray-900/30 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
                            <h3 className="font-bold text-white">Two-Factor Authentication</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 text-sm font-medium">Disabled</span>
                            <button className="text-purple-400 hover:text-purple-300 font-medium">
                              Enable
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                      </div>

                      {/* Active Sessions */}
                      <div className="bg-gray-900/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <EyeIcon className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">Active Sessions</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Chrome on Windows</p>
                              <p className="text-gray-400 text-sm">New York, USA • Now</p>
                            </div>
                            <button className="text-red-400 hover:text-red-300 text-sm">
                              Revoke
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Safari on macOS</p>
                              <p className="text-gray-400 text-sm">San Francisco, USA • 2 hours ago</p>
                            </div>
                            <button className="text-red-400 hover:text-red-300 text-sm">
                              Revoke
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-8">Notification Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-900/30 rounded-xl p-5">
                        <h3 className="font-bold text-white mb-4">Email Notifications</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Email Updates</p>
                              <p className="text-gray-400 text-sm">Product updates and announcements</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications.emailUpdates}
                                onChange={(e) => handleNotificationChange('emailUpdates', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">API Alerts</p>
                              <p className="text-gray-400 text-sm">API usage and limit notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications.apiAlerts}
                                onChange={(e) => handleNotificationChange('apiAlerts', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Security Alerts</p>
                              <p className="text-gray-400 text-sm">Important security notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications.securityAlerts}
                                onChange={(e) => handleNotificationChange('securityAlerts', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Marketing Emails</p>
                              <p className="text-gray-400 text-sm">Promotions and special offers</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications.marketingEmails}
                                onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
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
                      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-5 border border-purple-500/20">
                        <div className="flex items-center gap-3 mb-4">
                          <RocketLaunchIcon className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">Current Plan</h3>
                        </div>
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">Pro</p>
                        <p className="text-gray-400 text-sm">$29/month • Next billing: Jan 15, 2024</p>
                      </div>

                      {/* API Usage */}
                      <div className="bg-gray-900/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <ChartBarIcon className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">API Usage</h3>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <p className="text-gray-400 text-sm">65% of 10,000 requests used this month</p>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-gray-900/30 rounded-xl p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CreditCardIcon className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white">Payment Methods</h3>
                        </div>
                        <button className="text-purple-400 hover:text-purple-300 font-medium">
                          Add Payment Method
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                              <CreditCardIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white">Visa ending in 4242</p>
                              <p className="text-gray-400 text-sm">Expires 12/2024</p>
                            </div>
                          </div>
                          <button className="text-red-400 hover:text-red-300 text-sm">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="bg-gray-900/30 rounded-xl p-5">
                      <h3 className="font-bold text-white mb-4">Billing History</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <p className="text-white">Pro Plan - December 2023</p>
                            <p className="text-gray-400 text-sm">December 15, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">$29.00</p>
                            <p className="text-green-400 text-sm">Paid</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <p className="text-white">Pro Plan - November 2023</p>
                            <p className="text-gray-400 text-sm">November 15, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">$29.00</p>
                            <p className="text-green-400 text-sm">Paid</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;