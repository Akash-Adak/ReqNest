import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ServerStackIcon,
  CreditCardIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BoltIcon,
  SparklesIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "New API request logged", 
      time: "2m ago", 
      read: false, 
      type: "info",
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" />
    },
    { 
      id: 2, 
      message: "Subscription upgraded to Premium", 
      time: "1h ago", 
      read: true, 
      type: "success",
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />
    },
    { 
      id: 3, 
      message: "Server maintenance scheduled", 
      time: "3h ago", 
      read: false, 
      type: "warning",
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
    },
    { 
      id: 4, 
      message: "API usage nearing limit", 
      time: "5h ago", 
      read: false, 
      type: "warning",
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
    },
    { 
      id: 5, 
      message: "New feature released: Analytics Dashboard", 
      time: "1d ago", 
      read: true, 
      type: "info",
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" />
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Toggle notification panel
  const handleToggleNotifications = () => {
    setNotificationOpen(!notificationOpen);
    setUserMenuOpen(false);
    
    // Mark all as read when opening
    if (!notificationOpen && unreadCount > 0) {
      const updatedNotifications = notifications.map(notif => ({
        ...notif,
        read: true
      }));
      setNotifications(updatedNotifications);
      toast.info("Marked all notifications as read");
    }
  };

  // Mark single notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setNotificationOpen(false);
    toast.success("All notifications cleared");
  };

  // Add a new notification (for demo purposes)
  const addDemoNotification = () => {
    const newNotification = {
      id: Date.now(),
      message: "New demo notification added",
      time: "Just now",
      read: false,
      type: "info",
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" />
    };
    
    setNotifications([newNotification, ...notifications]);
    toast.info("New notification received!");
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (e) => {
      // Close menus if clicked outside
      if (!e.target.closest('.user-menu') && userMenuOpen) {
        setUserMenuOpen(false);
      }
      if (!e.target.closest('.notification-panel') && !e.target.closest('.notification-button')) {
        setNotificationOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen, notificationOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mouse follower - smaller for navbar */}
      <div 
        className="fixed w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-10 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
        }}
      />

      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrolled 
          ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-purple-500/20" 
          : "bg-gray-900/80 backdrop-blur-sm"
      }`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20 opacity-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
       {/* Logo */}
<div className="flex-shrink-0 flex items-center">
  <Link 
    to="/" 
    className="flex items-center space-x-3 group"
  >
    <div className="relative">
      <img
        src="logo.png"   // put your actual logo path
        alt="ReqNest Logo"
        className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
      />
    </div>
    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
      ReqNest
    </span>
  </Link>
</div>


            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-2">
                <Link
                  to="/"
                  className={`group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                    isActiveLink("/") 
                      ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25" 
                      : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Home
                  </div>
                  {isActiveLink("/") && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
                
                <Link
                  to="/apis"
                  className={`group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                    isActiveLink("/apis") 
                      ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25" 
                      : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <ServerStackIcon className="h-4 w-4 mr-2" />
                    APIs
                  </div>
                  {isActiveLink("/apis") && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
                
                <Link
                  to="/plans"
                  className={`group relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                    isActiveLink("/plans") 
                      ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25" 
                      : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    View Plans
                  </div>
                  {isActiveLink("/plans") && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                {/* Notification Button */}
                {user && (
                  <div className="relative">
                    <button
                      onClick={handleToggleNotifications}
                      className="notification-button group relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="relative">
                        <BellIcon className="h-6 w-6" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-gray-900">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Notification Panel */}
                    {notificationOpen && (
                      <div className="notification-panel origin-top-right absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl py-2 bg-gray-800/95 backdrop-blur-xl ring-1 ring-purple-500/20 focus:outline-none z-50 border border-gray-700/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                        
                        <div className="relative px-4 py-3 border-b border-gray-700/50 flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white">Notifications</h3>
                          <div className="flex space-x-2">
                            <button 
                              onClick={addDemoNotification}
                              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Add Demo
                            </button>
                            {notifications.length > 0 && (
                              <button 
                                onClick={clearAllNotifications}
                                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                              >
                                Clear All
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="relative max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                              <BellIcon className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-400">No notifications yet</p>
                            </div>
                          ) : (
                            <div className="py-2">
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`px-4 py-3 hover:bg-white/5 transition-all cursor-pointer ${
                                    !notification.read ? "bg-blue-500/10" : ""
                                  }`}
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {notification.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm ${
                                        notification.read ? "text-gray-300" : "text-white font-medium"
                                      }`}>
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                    </div>
                                    {!notification.read && (
                                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {loading ? (
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
                  </div>
                ) : user ? (
                  <div className="relative ml-3 user-menu">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="group flex items-center text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="sr-only">Open user menu</span>
                      {user.picture || user.avatar_url ? (
                        <div className="relative">
                          <img
                            className="h-10 w-10 rounded-2xl ring-2 ring-purple-500/50 group-hover:ring-purple-500 transition-all"
                            src={user.picture || user.avatar_url}
                            alt={user.name}
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                        </div>
                      ) : (
                        <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-purple-500/50 group-hover:ring-purple-500 transition-all transform group-hover:rotate-12">
                          <UserCircleIcon className="h-6 w-6 text-white" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                        </div>
                      )}
                    </button>

                    {/* User dropdown menu */}
                    {userMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl py-2 bg-gray-800/95 backdrop-blur-xl ring-1 ring-purple-500/20 focus:outline-none z-50 border border-gray-700/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                        
                        <div className="relative px-4 py-3 border-b border-gray-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{user.name?.charAt(0) || 'U'}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{user.name}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative py-2">
                          <Link
                            to="/profile"
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <UserCircleIcon className="w-5 h-5 mr-3 group-hover:text-purple-400" />
                            Profile
                            <SparklesIcon className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          
                          <Link
                            to="/dashboard"
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Cog6ToothIcon className="w-5 h-5 mr-3 group-hover:text-purple-400" />
                            Dashboard
                            <SparklesIcon className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          
                          <div className="border-t border-gray-700/50 my-2"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 group-hover:text-red-400" />
                            Logout
                            <SparklesIcon className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-xl backdrop-blur-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      className="group relative px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative">Get Started</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile notification button */}
              {user && (
                <button
                  onClick={handleToggleNotifications}
                  className="notification-button relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-gray-900">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="group inline-flex items-center justify-center p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative">
                  {mobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900/98 backdrop-blur-xl border-t border-purple-500/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
            
            <div className="relative px-4 pt-4 pb-3 space-y-2">
              <Link
                to="/"
                className={`group flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isActiveLink("/") 
                    ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Home
                {isActiveLink("/") && (
                  <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </Link>
              
              <Link
                to="/apis"
                className={`group flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isActiveLink("/apis") 
                    ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ServerStackIcon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                APIs
                {isActiveLink("/apis") && (
                  <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </Link>
              
              <Link
                to="/plans"
                className={`group flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isActiveLink("/plans") 
                    ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <CreditCardIcon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                View Plans
                {isActiveLink("/plans") && (
                  <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            </div>

            <div className="pt-4 pb-3 border-t border-gray-700/50">
              {loading ? (
                <div className="flex justify-center px-4 py-4">
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
                  </div>
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center px-5 py-3">
                    <div className="flex-shrink-0">
                      {user.picture || user.avatar_url ? (
                        <img
                          className="h-12 w-12 rounded-xl ring-2 ring-purple-500/50"
                          src={user.picture || user.avatar_url}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-purple-500/50">
                          <UserCircleIcon className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-bold text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                    <div className="ml-auto w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="mt-3 px-2 space-y-2">
                    <Link
                      to="/profile"
                      className="group flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-3 group-hover:text-purple-400" />
                      Profile
                      <SparklesIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      className="group flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-3 group-hover:text-purple-400" />
                      Dashboard
                      <SparklesIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="group flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 group-hover:text-red-400" />
                      Logout
                      <SparklesIcon className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 px-2 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="group relative block w-full px-4 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transition-all transform hover:-translate-y-1 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">Get Started</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Toast Container for notifications */}
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

      <style>{`
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </>
  );
};

export default Navbar;