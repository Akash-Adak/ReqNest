// src/components/Navbar.jsx
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
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

// Custom Logo Component
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#4F46E5" />
    <path d="M12 16L14.5 18.5L20 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 21H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/");
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white shadow-md border-b border-gray-200" 
        : "bg-white"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-3 group"
              >
                <div >
            
                  <img 
                    src="logo.png" 
                    alt="ReqNest Logo" 
                    className="h-8 w-auto" 
                  />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  ReqNest
                </span>
              </Link>
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink("/") 
                    ? "text-indigo-700 bg-indigo-50 shadow-sm" 
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                to="/apis"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink("/apis") 
                    ? "text-indigo-700 bg-indigo-50 shadow-sm" 
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                }`}
              >
                APIs
              </Link>
              <Link
                to="/plans"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActiveLink("/plans") 
                    ? "text-indigo-700 bg-indigo-50 shadow-sm" 
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                }`}
              >
                View Plans
              </Link>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-indigo-600 border-solid rounded-full animate-spin"></div>
              ) : user ? (
                <div className="relative ml-3">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:ring-2 hover:ring-indigo-100"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.picture || user.avatar_url ? (
                      <img
                        className="h-9 w-9 rounded-full ring-2 ring-white"
                        src={user.picture || user.avatar_url}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-white">
                        <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                    )}
                  </button>

                  {/* User dropdown menu */}
                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
            >
              <span className="sr-only">Open main menu</span>
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
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all ${
                isActiveLink("/") 
                  ? "text-indigo-700 bg-indigo-50 shadow-sm" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Home
            </Link>
            <Link
              to="/apis"
              className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all ${
                isActiveLink("/apis") 
                  ? "text-indigo-700 bg-indigo-50 shadow-sm" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ServerStackIcon className="h-5 w-5 mr-3" />
              APIs
            </Link>
            <Link
              to="/plans"
              className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all ${
                isActiveLink("/plans") 
                  ? "text-indigo-700 bg-indigo-50 shadow-sm" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <CreditCardIcon className="h-5 w-5 mr-3" />
              View Plans
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {loading ? (
              <div className="flex justify-center px-3 py-2">
                <div className="w-5 h-5 border-t-2 border-indigo-600 border-solid rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    {user.picture || user.avatar_url ? (
                      <img
                        className="h-10 w-10 rounded-full ring-2 ring-white"
                        src={user.picture || user.avatar_url}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-white">
                        <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircleIcon className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-3" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-all"
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
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md text-center"
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
  );
};

export default Navbar;