import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../UI/Loading';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading, initialized } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - auth state:', {
    isAuthenticated,
    loading,
    initialized,
    user: user?.email,
    path: location.pathname
  });

  // Show loading only while auth is initializing
  if (loading || !initialized) {
    console.log('ProtectedRoute - showing loading (auth initializing)');
    return (
      <div className="protected-route-loading">
        <Loading text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute - not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    console.log('ProtectedRoute - role not allowed:', {
      userRole: user.role,
      requiredRoles
    });
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('ProtectedRoute - access granted');
  return children;
};

export default ProtectedRoute;