// src/context/AuthProvider.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { getApiUrl } from "../utils/apiUrl";

const AuthContext = createContext();

const USER_STORAGE_KEY = "user";
const USER_EXPIRY_KEY = "user_expiry";
const AUTH_TOKEN_KEY = "authToken";
const EXPIRY_TIME = 30 * 60 * 1000; // 30 min

const clearAuthCallbackParams = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

const getAuthCallbackToken = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

export const AuthProvider = ({ children }) => {
  const baseUrl = getApiUrl();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }, []);

  const handleLogoutCleanup = useCallback(() => {
    setUser(null);
    clearStorage();
  }, [clearStorage]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/api/user/me", { withCredentials: true });

      if (res.data?.name) {
        setUser(res.data);

        const expiryTime = Date.now() + EXPIRY_TIME;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
        localStorage.setItem(USER_EXPIRY_KEY, expiryTime.toString());
      } else {
        handleLogoutCleanup();
      }
    } catch (err) {
      console.error("Fetch user failed:", err);
      handleLogoutCleanup();
    }
  }, [handleLogoutCleanup]);

  const handleToken = useCallback(
    async (token) => {
      if (!token) {
        handleLogoutCleanup();
        return;
      }

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      await fetchUser();
    },
    [fetchUser, handleLogoutCleanup]
  );

  const loadUserFromStorage = useCallback(
    async () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const expiry = localStorage.getItem(USER_EXPIRY_KEY);
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const now = Date.now();

        if (storedUser && expiry && now < Number(expiry)) {
          setUser(JSON.parse(storedUser));
          return true;
        }

        if (storedToken) {
          await fetchUser();
          return true;
        }

        clearStorage();
        return false;
      } catch (e) {
        console.error("Error reading storage:", e);
        clearStorage();
        return false;
      }
    },
    [clearStorage, fetchUser]
  );

  useEffect(() => {
    const init = async () => {
      const token = getAuthCallbackToken();
      const params = new URLSearchParams(window.location.search);
      const loginSuccess = params.get("login") === "success";

      if (token) {
        try {
          await handleToken(token);
        } finally {
          clearAuthCallbackParams();
          setLoading(false);
        }
        return;
      }

      if (loginSuccess) {
        try {
          await fetchUser();
        } finally {
          clearAuthCallbackParams();
          setLoading(false);
        }
        return;
      }

      await loadUserFromStorage();
      setLoading(false);
    };

    init();
  }, [fetchUser, handleToken, loadUserFromStorage]);

  const login = (provider) => {
    handleLogoutCleanup();
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
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
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser, handleToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
