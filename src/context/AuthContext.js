// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brandingData, setBrandingData] = useState(null);

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      if (data.tokens) {
        localStorage.setItem("tokens", JSON.stringify(data.tokens));
        localStorage.setItem("user", JSON.stringify(data.user));
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
      console.error('Logout error (continuing anyway):', err);
    } finally {
      // Always clear local data regardless of API call success
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
      setUser(null);
      setError(null);
    }
  };

  const refresh = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      if (!tokens?.refreshToken) {
        console.log('No refresh token found, logging out');
        logout();
        return false;
      }
      
      const data = await authApi.refreshToken(tokens.refreshToken);
      
      if (data.success && data.tokens) {
        localStorage.setItem("tokens", JSON.stringify(data.tokens));
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
        console.log('Token refreshed successfully');
        return true;
      }
      throw new Error('Refresh response invalid');
    } catch (error) {
      console.error('Refresh token error:', error);
      // Don't immediately logout on refresh failure
      // Let the user continue and handle it on next API call
      return false;
    }
  };

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Treat parsing errors as expired
    }
  };

  // Helper function to check if token expires soon (within 5 minutes)
  const isTokenExpiringSoon = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= (currentTime + 300); // 5 minutes
    } catch (error) {
      return true;
    }
  };

  // Enhanced initialization
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (!tokens?.accessToken) {
          console.log('No access token found');
          setLoading(false);
          return;
        }
        
        // Check if access token is expired
        if (isTokenExpired(tokens.accessToken)) {
          console.log('Token expired on app load, attempting refresh...');
          
          if (tokens.refreshToken) {
            const refreshSuccess = await refresh();
            if (!refreshSuccess) {
              console.log('Refresh failed, clearing auth data');
              logout();
            }
          } else {
            console.log('No refresh token, logging out');
            logout();
          }
        } else {
          // Token is still valid, restore user data
          if (storedUser) {
            console.log('Restoring user from localStorage');
            setUser(storedUser);
          } else {
            // Extract user data from token payload as fallback
            try {
              const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
              const userData = {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
                tenantId: payload.tenantId,
                permissions: payload.permissions,
                firstName: payload.firstName || 'User',
                lastName: payload.lastName || ''
              };
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              console.log('Extracted user data from token');
            } catch (err) {
              console.error('Error extracting user from token:', err);
              logout();
            }
          }
        }
      } catch (error) {
        console.error('Init auth error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Auto-refresh token when needed
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        
        if (tokens?.accessToken) {
          if (isTokenExpiringSoon(tokens.accessToken)) {
            console.log('Token expiring soon, auto-refreshing...');
            const refreshSuccess = await refresh();
            if (!refreshSuccess) {
              console.log('Auto-refresh failed');
              // Don't logout immediately, let it be handled on next API call
            }
          }
        }
      } catch (error) {
        console.error('Error in auto-refresh check:', error);
      }
    }, 2 * 60 * 1000); // Check every 2 minutes instead of 5

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        refresh, 
        isAuthenticated, 
        isLoading: loading, 
        error, 
        clearError,
        brandingData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);