// useAuth.js - Optional separate hook file
// Since AuthContext.js already exports useAuth, this file is optional
// But you can use this if you prefer to separate concerns

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Additional auth-related custom hooks can go here
export const useAuthStatus = () => {
  const { isAuthenticated, loading, initialized } = useAuth();
  
  return {
    isAuthenticated,
    loading,
    initialized,
    isReady: initialized && !loading
  };
};

export const useUserRole = () => {
  const { user } = useAuth();
  return user?.role || null;
};

export const useRequireAuth = () => {
  const { isAuthenticated, initialized, loading } = useAuth();
  
  if (!initialized || loading) {
    return { loading: true };
  }
  
  return {
    loading: false,
    authenticated: isAuthenticated
  };
};