// src/services/utils/apiClient.js
import axios from 'axios';

// Hardcoded backend URL
const BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Utility function to check if token is expired or about to expire
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token expires in next 2 minutes (120 seconds buffer)
    return payload.exp <= (currentTime + 120);
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Function to refresh token (avoiding circular dependency)
const refreshTokenDirect = async (refreshToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`, // Send in header, not body!
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

// Attach accessToken from localStorage and handle token expiration
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens'));
      
      if (tokens?.accessToken) {
        // Check if access token is expired or about to expire
        if (isTokenExpired(tokens.accessToken)) {
          console.log('Access token expired, refreshing...');
          
          if (tokens.refreshToken) {
            try {
              const refreshData = await refreshTokenDirect(tokens.refreshToken);
              
              if (refreshData.success && refreshData.tokens) {
                // Update stored tokens
                localStorage.setItem('tokens', JSON.stringify(refreshData.tokens));
                config.headers.Authorization = `Bearer ${refreshData.tokens.accessToken}`;
                console.log('Token refreshed successfully');
              } else {
                throw new Error('Refresh response invalid');
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              localStorage.removeItem('tokens');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          } else {
            throw new Error('No refresh token available');
          }
        } else {
          // Token is still valid, use it
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
      }
    } catch (err) {
      console.warn('Error handling tokens:', err);
      localStorage.removeItem('tokens');
      window.location.href = '/login';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get 401 and haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('401 error, attempting token refresh...');
        const refreshData = await refreshTokenDirect(tokens.refreshToken);

        if (refreshData.success && refreshData.tokens) {
          // Update stored tokens
          localStorage.setItem('tokens', JSON.stringify(refreshData.tokens));
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshData.tokens.accessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response invalid');
        }
        
      } catch (refreshError) {
        console.error('Token refresh failed on 401:', refreshError);
        localStorage.removeItem('tokens');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;