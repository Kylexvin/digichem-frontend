// src/context/AuthContext.js (Updated with token refresh integration)
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../services/api/authApi';
import { scheduleTokenRefresh, cancelTokenRefresh } from '../services/utils/tokenRefreshScheduler'; // Fixed import path

const AuthContext = createContext();

const authReducer = (state, action) => {
  console.log('AuthReducer action:', action.type, action.payload);
  switch (action.type) {
    case 'INIT_START':
      return { 
        ...state, 
        loading: true, 
        initialized: false 
      };
    case 'INIT_COMPLETE':
      return { 
        ...state, 
        loading: false, 
        initialized: true 
      };
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        tokens: action.payload.tokens,
        error: null,
        initialized: true
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        tokens: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        loading: false,
        isAuthenticated: false, 
        user: null,
        tokens: null,
        error: null 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_TOKENS':
      return {
        ...state,
        tokens: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  loading: true, // Start with loading true
  initialized: false, // Add initialized flag
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing tokens on app load
  useEffect(() => {
    console.log('AuthProvider mounted, initializing auth state');
    
    const initializeAuth = async () => {
      dispatch({ type: 'INIT_START' });
      
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('userData');
        
        console.log('Checking stored auth data:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          hasUserData: !!userData 
        });
        
        if (accessToken && refreshToken && userData) {
          try {
            const user = JSON.parse(userData);
            const tokens = {
              accessToken,
              refreshToken,
              tokenType: 'Bearer',
              expiresIn: localStorage.getItem('tokenExpiresIn') || '15m'
            };
            
            console.log('Restoring auth state from storage for user:', user.email);
            
            // Schedule token refresh
            scheduleTokenRefresh();
            
            // Dispatch success and let the reducer handle initialization
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user, tokens } 
            });
            
          } catch (parseError) {
            console.error('Error parsing stored auth data:', parseError);
            clearAuthData();
            dispatch({ type: 'LOGIN_FAILURE', payload: null });
          }
        } else {
          console.log('No stored auth data found');
          dispatch({ type: 'LOGIN_FAILURE', payload: null });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Initialization failed' });
      } finally {
        // Always complete initialization
        setTimeout(() => {
          dispatch({ type: 'INIT_COMPLETE' });
        }, 100); // Small delay to ensure all state updates are processed
      }
    };

    initializeAuth();
  }, []);

  // Function to clear all auth data from storage
  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiresIn');
    console.log('Auth data cleared from storage');
  };

  // Function to store auth data
  const storeAuthData = (user, tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('tokenExpiresIn', tokens.expiresIn);
    console.log('Auth data stored in localStorage for:', user.email);
  };

  const login = async (credentials) => {
    console.log('Login attempt for:', credentials.email);
    dispatch({ type: 'LOGIN_START' });
    
    try {
      console.log('Calling authApi.login...');
      const response = await authApi.login(credentials);
      console.log('Login API response received:', {
        hasData: !!response.data,
        hasUser: !!response.data?.user,
        hasTokens: !!response.data?.tokens
      });
      
      // Check if the response has the expected structure
      if (!response.data || !response.data.user || !response.data.tokens) {
        throw new Error('Invalid API response structure');
      }
      
      const { user, tokens } = response.data;
      
      // Store auth data
      storeAuthData(user, tokens);
      
      // Schedule token refresh
      scheduleTokenRefresh();
      
      // Dispatch success
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, tokens } 
      });
      
      console.log('Login successful for:', user.email);
      return { success: true, user, tokens };
      
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('Login error message:', errorMessage);
      
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: errorMessage 
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    console.log('Logout initiated');
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Call logout API to invalidate tokens on server
      await authApi.logout();
      console.log('Logout API call successful');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side logout even if API call fails
    } finally {
      // Always clear client-side data
      clearAuthData();
      cancelTokenRefresh();
      dispatch({ type: 'LOGOUT' });
      console.log('Logout completed');
    }
  };

  const refreshAuthToken = async () => {
    console.log('Refreshing auth token');
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await authApi.refreshToken(refreshToken);
      const { tokens } = response;
      
      // Update stored tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('tokenExpiresIn', tokens.expiresIn);
      
      // Reschedule token refresh
      scheduleTokenRefresh();
      
      dispatch({
        type: 'UPDATE_TOKENS',
        payload: tokens
      });
      
      console.log('Token refresh successful');
      return tokens.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout the user
      logout();
      throw error;
    }
  };

  const clearError = () => {
    console.log('Clearing auth error');
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const value = {
    ...state,
    login,
    logout,
    refreshAuthToken,
    clearError,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};