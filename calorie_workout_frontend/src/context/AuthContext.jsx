import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../api/client";

// PUBLIC_INTERFACE
/**
 * AuthContext provides authentication state and actions across the app.
 */
const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

// PUBLIC_INTERFACE
/**
 * Provider for authentication context. Wrap your app with this provider.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize client token
  useEffect(() => {
    apiClient.setToken(token || null);
  }, [token]);

  const loadMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await apiClient.get("/api/auth/me");
      setUser(me);
    } catch (_err) {
      // Token invalid or backend unavailable
      setUser(null);
      localStorage.removeItem("authToken");
      setToken(null);
      apiClient.setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  // PUBLIC_INTERFACE
  /** Log user in via email/password. */
  const login = useCallback(async (email, password) => {
    const res = await apiClient.post("/api/auth/login", { email, password });
    if (res && (res.token || res.accessToken)) {
      const tok = res.token || res.accessToken;
      localStorage.setItem("authToken", tok);
      setToken(tok);
      apiClient.setToken(tok);
      await loadMe();
      return true;
    }
    throw new Error("Invalid login response");
  }, [loadMe]);

  // PUBLIC_INTERFACE
  /** Register a new user and log them in. */
  const register = useCallback(async (name, email, password) => {
    await apiClient.post("/api/auth/register", { name, email, password });
    // Auto login after register
    await login(email, password);
    return true;
  }, [login]);

  // PUBLIC_INTERFACE
  /** Logout clears token and user. */
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    apiClient.setToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    await loadMe();
  }, [loadMe]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout,
    refreshUser,
  }), [user, token, loading, login, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
/** Hook to access auth context. */
export function useAuth() {
  return useContext(AuthContext);
}
