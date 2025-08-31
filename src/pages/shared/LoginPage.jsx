import React, { useEffect } from 'react';
import Login from '../../components/shared/Authentication/Login';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log('LoginPage: Already authenticated, redirecting to dashboard');
      navigate('/owner/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <Login />;
};

export default LoginPage;