import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css';
import logo from '../../../assets/images/logos/logo3.png';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Improved navigation effect
  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case 'pharmacy_owner':
        navigate('/owner/dashboard', { replace: true });
        break;
      case 'attendant':
        navigate('/attendant/pos', { replace: true });
        break;
      default:
        Swal.fire('Error', 'Unknown role', 'error');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return;

    setIsSubmitting(true);
    try {
      const data = await login(credentials);
      
      // Show success message but don't navigate here
      // Navigation will be handled by the useEffect
      Swal.fire({
        icon: 'success',
        title: `Welcome, ${data.user.role}!`,
        text: 'You have successfully logged in.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message || 'Something went wrong'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-container">
        {/* Left Side - Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Hello</h1>
            <h2 className="welcome-subtitle">Welcome Back</h2>
            
            <div className="logo-section">
              <img src={logo} alt="KxByte Logo" className="kxbyte-logo" />
              <h3 className="pos-name">DigiChem POS</h3>
              <p className="pos-subtitle">by KxByte</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="login-header">
            <h2>Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting || !credentials.email || !credentials.password}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;