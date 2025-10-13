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
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications] = useState([
    { 
      id: 1, 
      message: "New API request logged", 
      time: "2m ago", 
      read: false, 
      type: "info",
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />
    },
    { 
      id: 2, 
      message: "Subscription upgraded to Premium", 
      time: "1h ago", 
      read: true, 
      type: "success",
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu') && userMenuOpen) {
        setUserMenuOpen(false);
      }
      if (!e.target.closest('.notification-panel') && !e.target.closest('.notification-button')) {
        setNotificationOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-black/95 backdrop-blur-md shadow-2xl border-b border-white/10" 
          : "bg-black/90 backdrop-blur-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
<div className="flex-shrink-0 flex items-center">
  <Link to="/" className="flex items-center space-x-3">
    <img
      src="/logo.png"
      alt="ReqNest Logo"
      className="h-10 w-10 object-contain"
    />
    <span className="text-2xl font-black text-white">
      ReqNest
    </span>
  </Link>
</div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    isActiveLink("/") 
                      ? "text-white bg-white/20 border border-white/30" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center">
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Home
                  </div>
                </Link>
                
                <Link
                  to="/apis"
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    isActiveLink("/apis") 
                      ? "text-white bg-white/20 border border-white/30" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center">
                    <ServerStackIcon className="h-4 w-4 mr-2" />
                    APIs
                  </div>
                </Link>
                
                <Link
                  to="/plans"
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    isActiveLink("/plans") 
                      ? "text-white bg-white/20 border border-white/30" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center">
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    View Plans
                  </div>
                </Link>
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-2">
                {/* Notification Button */}
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setNotificationOpen(!notificationOpen)}
                      className="notification-button p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200 border border-transparent hover:border-white/20"
                    >
                      <div className="relative">
                        <BellIcon className="h-6 w-6" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white border border-white">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Notification Panel */}
                    {notificationOpen && (
                      <div className="notification-panel absolute right-0 mt-2 w-80 rounded-lg shadow-2xl py-2 bg-black border border-white/20 z-50">
                        <div className="px-4 py-3 border-b border-white/10">
                          <h3 className="text-sm font-bold text-white">Notifications</h3>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                              <BellIcon className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-400">No notifications</p>
                            </div>
                          ) : (
                            <div className="py-2">
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`px-4 py-3 border-b border-white/5 ${
                                    !notification.read ? "bg-blue-500/10" : ""
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {notification.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm ${
                                        notification.read ? "text-gray-300" : "text-white font-bold"
                                      }`}>
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                    </div>
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
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : user ? (
                  <div className="relative ml-3 user-menu">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center text-sm rounded-lg focus:outline-none border border-white/20 hover:border-white/40 transition-all duration-200"
                    >
                      {user.picture || user.avatar_url ? (
                        <img
                          className="h-10 w-10 rounded-lg"
                          src={user.picture || user.avatar_url}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-black" />
                        </div>
                      )}
                    </button>

                    {/* User dropdown menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-2xl py-2 bg-black border border-white/20 z-50">
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center">
                              <span className="text-black font-bold text-lg">{user.name?.charAt(0) || 'U'}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all border-b border-white/5"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <UserCircleIcon className="w-5 h-5 mr-3" />
                            Profile
                          </Link>
                          
                          <Link
                            to="/dashboard"
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all border-b border-white/5"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Cog6ToothIcon className="w-5 h-5 mr-3" />
                            Dashboard
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-gray-300 hover:text-white px-4 py-2 text-sm font-bold transition-all duration-200 border border-white/20 hover:border-white/40 rounded-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      className="px-6 py-2 bg-white text-black text-sm font-bold rounded-lg border border-white hover:bg-gray-100 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {user && (
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="notification-button p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200 border border-transparent hover:border-white/20"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="px-4 pt-4 pb-3 space-y-2">
              <Link
                to="/"
                className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-bold transition-all duration-200 ${
                  isActiveLink("/") 
                    ? "text-white bg-white/20 border border-white/30" 
                    : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                Home
              </Link>
              
              <Link
                to="/apis"
                className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-bold transition-all duration-200 ${
                  isActiveLink("/apis") 
                    ? "text-white bg-white/20 border border-white/30" 
                    : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ServerStackIcon className="h-5 w-5 mr-3" />
                APIs
              </Link>
              
              <Link
                to="/plans"
                className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-bold transition-all duration-200 ${
                  isActiveLink("/plans") 
                    ? "text-white bg-white/20 border border-white/30" 
                    : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <CreditCardIcon className="h-5 w-5 mr-3" />
                View Plans
              </Link>
            </div>

            <div className="pt-4 pb-3 border-t border-white/10">
              {user ? (
                <>
                  <div className="flex items-center px-5 py-3">
                    <div className="flex-shrink-0">
                      {user.picture || user.avatar_url ? (
                        <img
                          className="h-12 w-12 rounded-lg border border-white/20"
                          src={user.picture || user.avatar_url}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center border border-white/20">
                          <UserCircleIcon className="h-6 w-6 text-black" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-bold text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 px-2 space-y-2">
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-3" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-bold text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 px-2 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 rounded-lg text-base font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all text-center border border-white/20 hover:border-white/40"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 rounded-lg text-base font-bold text-white bg-white hover:bg-gray-100 transition-all text-center border border-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

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
    </>
  );
};

export default Navbar;