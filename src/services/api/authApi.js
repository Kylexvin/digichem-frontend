// src/api/authApi.js (Updated)
import axios from 'axios';
import { apiClient } from '../utils/apiClient';

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login API error:', error);

      if (error.response?.data) {
        const errData = error.response.data;
        error.message = errData.message || errData.error || error.message;
      }

      throw error;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/auth/logout', { refreshToken });
      return response;
    } catch (error) {
      console.error('Logout API error:', error.response?.data);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Refresh token API error:', error.response?.data);
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      return await apiClient.post('/auth/reset-password', { email });
    } catch (error) {
      console.error('Reset password API error:', error.response?.data);
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      return await apiClient.post('/auth/change-password', data);
    } catch (error) {
      console.error('Change password API error:', error.response?.data);
      throw error;
    }
  },
};