// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      if (data.tokens) {
        localStorage.setItem("tokens", JSON.stringify(data.tokens));
        setUser(data.user || null);
      }
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("tokens");
      setUser(null);
    }
  };

  const refresh = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      if (!tokens?.refreshToken) return logout();
      const data = await authApi.refreshToken(tokens.refreshToken);
      if (data.tokens) localStorage.setItem("tokens", JSON.stringify(data.tokens));
    } catch {
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      if (!tokens?.accessToken) return;
      try {
        const data = await authApi.verifyToken();
        setUser(data.user || null);
      } catch {
        await refresh();
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh, isAuthenticated, isLoading: loading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
