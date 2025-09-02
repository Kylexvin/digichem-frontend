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
      // Send refresh token in request body (matches backend expectation)
      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
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