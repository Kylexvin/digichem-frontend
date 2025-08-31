import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  const { login, loading, error, clearError, isAuthenticated, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or default to owner dashboard
  const from = location.state?.from?.pathname || '/owner/dashboard';

  useEffect(() => {
    console.log('Login component - auth state:', { 
      isAuthenticated, 
      initialized, 
      loading,
      from 
    });
    
    // Only redirect if fully initialized and authenticated
    if (initialized && isAuthenticated && !redirecting) {
      console.log('Already authenticated, redirecting to:', from);
      setRedirecting(true);
      navigate(from, { replace: true });
    }
    
    // Clear any errors when component mounts
    if (error) {
      clearError();
    }
  }, [isAuthenticated, initialized, navigate, from, clearError, error, redirecting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    
    const result = await login(credentials);
    console.log('Login result:', result);
    
    if (result && result.success) {
      console.log('Login successful, setting redirecting state');
      setRedirecting(true);
      navigate(from, { replace: true });
    }
  };

  // Show loading if auth is initializing
  if (!initialized) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show redirect message if authenticated or redirecting
  if (isAuthenticated || redirecting) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Pharmacy POS</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              {typeof error === 'string' ? error : 'An error occurred during login'}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="login-button"
            disabled={loading || !credentials.email || !credentials.password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            <a href="/forgot-password" className="login-link">
              Forgot your password?
            </a>
          </p>
        </div>
        
        <div className="demo-credentials">
          <p>Demo: vinnykylex@gmail.com / @Vinnykylex254</p>
        </div>
      </div>
    </div>
  );
};

export default Login;