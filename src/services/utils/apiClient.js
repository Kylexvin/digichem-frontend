// src/utils/apiClient.js
import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url} (with auth token)`);
    } else {
      console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url} (no auth token)`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and log responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const requestDetails = `${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`;
    
    if (error.response) {
      console.error(`❌ API Error: ${requestDetails} ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error(`❌ API Network Error: ${requestDetails}`, error.message);
    } else {
      console.error(`❌ API Setup Error: ${requestDetails}`, error.message);
    }
    
    // Handle 401 Unauthorized errors with token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      console.log('🔄 401 Unauthorized, attempting token refresh');
      
      if (isRefreshing) {
        console.log('⏳ Token refresh already in progress, queuing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        console.log('🔄 Calling refresh token endpoint');
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000 // 10 second timeout for refresh requests
          }
        );
        
        if (!response.data.tokens) {
          throw new Error('Invalid refresh response: missing tokens');
        }
        
        const newTokens = response.data.tokens;
        const accessToken = newTokens.accessToken;
        
        if (!accessToken || !newTokens.refreshToken) {
          throw new Error('Invalid tokens received from refresh');
        }
        
        console.log('✅ Token refresh successful');
        
        // Update localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        if (newTokens.expiresIn) {
          localStorage.setItem('tokenExpiresIn', newTokens.expiresIn);
        }
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Update the header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        
        // If refresh fails, clear auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiresIn');
        
        // Redirect to login only if we're not already on login page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/forgot-password')) {
          console.log('🔒 Redirecting to login due to auth failure');
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other specific error cases
    if (error.response?.status === 403) {
      console.error('🚫 Access forbidden - insufficient permissions');
    } else if (error.response?.status === 404) {
      console.error('🔍 Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('🔥 Server error occurred');
    }
    
    // For other errors, just reject
    return Promise.reject(error);
  }
);

// Add response data transformation if needed
apiClient.interceptors.response.use(
  (response) => {
    // You can transform response data here if needed
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { apiClient };