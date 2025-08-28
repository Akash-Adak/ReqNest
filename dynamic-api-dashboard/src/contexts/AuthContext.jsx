import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../api";

const AuthContext = createContext();

const USER_STORAGE_KEY = "user";
const USER_EXPIRY_KEY = "user_expiry";
const EXPIRY_TIME = 30 * 60 * 1000; // 30 min
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 min

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);

  useEffect(() => {
    const init = async () => {
      const loaded = loadUserFromStorage();

      if (!loaded) {
        // full fetch if nothing valid in storage
        await fetchUser(false);
      } else {
        // background check, don’t block UI
        fetchUser(true);
        setLoading(false);
      }
    };

    init();
    return () => stopBackgroundRefresh();
  }, []);

  const clearStorage = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
  };

  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const expiry = localStorage.getItem(USER_EXPIRY_KEY);
      const now = Date.now();

      if (storedUser && expiry && now < Number(expiry)) {
        setUser(JSON.parse(storedUser));
        startBackgroundRefresh();
        return true;
      } else {
        clearStorage();
        return false;
      }
    } catch (e) {
      console.error("Error reading storage", e);
      clearStorage();
      return false;
    }
  };

  const fetchUser = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const res = await api.get("/api/user", { withCredentials: true });

      if (res.data?.name) {
        setUser(res.data);

        const expiryTime = Date.now() + EXPIRY_TIME;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
        localStorage.setItem(USER_EXPIRY_KEY, expiryTime.toString());

        startBackgroundRefresh();
      } else {
        handleLogoutCleanup();
      }
    } catch (err) {
      console.error("Fetch user failed:", err);
      if (!silent) handleLogoutCleanup();
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const startBackgroundRefresh = () => {
    if (refreshTimer.current) return; // already running
    refreshTimer.current = setInterval(() => {
      console.log("🔄 Background refresh triggered...");
      fetchUser(true);
    }, REFRESH_INTERVAL);
  };

  const stopBackgroundRefresh = () => {
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
      refreshTimer.current = null;
    }
  };

  const handleLogoutCleanup = () => {
    setUser(null);
    clearStorage();
    stopBackgroundRefresh();
  };

  const login = (provider) => {
    handleLogoutCleanup();
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const logout = async () => {
    try {
      await api.post("/api/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      handleLogoutCleanup();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
