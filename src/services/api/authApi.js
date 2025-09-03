// src/services/api/authApi.js
import apiClient from '../utils/apiClient';

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      // Get refresh token from localStorage to send with logout request
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const refreshToken = tokens?.refreshToken;
      
      const response = await apiClient.post('/auth/logout', {
        refreshToken // Send refresh token in body as expected by backend
      });
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      // Don't throw error for logout - we're logging out anyway
      // Just log the error and return success
      return { success: true };
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      console.log('🔄 Making refresh token request...');
      console.log('RefreshToken preview:', refreshToken?.substring(0, 20) + '...');
      
      // Try direct fetch to isolate the issue
      const response = await fetch('http://localhost:5000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      
      console.log('✅ Refresh response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token refresh failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Refresh token error:', error);
      throw new Error(error.message || 'Token refresh failed');
    }
  },

  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  }
};