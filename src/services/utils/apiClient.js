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

// Global state to prevent multiple simultaneous refresh attempts
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

// Utility function to check if token is expired or about to expire
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Reduced buffer to 30 seconds to prevent premature refreshes
    return payload.exp <= (currentTime + 30);
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
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // Add timeout to prevent hanging requests
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
          
          if (isRefreshing) {
            // If refresh is already in progress, queue this request
            console.log('Refresh already in progress, queueing request...');
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          if (tokens.refreshToken) {
            isRefreshing = true;
            
            try {
              const refreshData = await refreshTokenDirect(tokens.refreshToken);
              
              if (refreshData.success && refreshData.tokens) {
                // Update stored tokens
                localStorage.setItem('tokens', JSON.stringify(refreshData.tokens));
                config.headers.Authorization = `Bearer ${refreshData.tokens.accessToken}`;
                processQueue(null, refreshData.tokens.accessToken);
                console.log('Token refreshed successfully');
              } else {
                throw new Error('Refresh response invalid');
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              processQueue(refreshError, null);
              localStorage.removeItem('tokens');
              localStorage.removeItem('user');
              
              // Don't redirect immediately, let the app handle it
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
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
      // Don't clear tokens here, let the response interceptor handle it
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
      
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ 
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err) => reject(err)
          });
        });
      }

      try {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        isRefreshing = true;
        console.log('401 error, attempting token refresh...');
        const refreshData = await refreshTokenDirect(tokens.refreshToken);

        if (refreshData.success && refreshData.tokens) {
          // Update stored tokens
          localStorage.setItem('tokens', JSON.stringify(refreshData.tokens));
          
          // Process queued requests
          processQueue(null, refreshData.tokens.accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshData.tokens.accessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response invalid');
        }
        
      } catch (refreshError) {
        console.error('Token refresh failed on 401:', refreshError);
        processQueue(refreshError, null);
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        
        // Only redirect for auth-related errors
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;