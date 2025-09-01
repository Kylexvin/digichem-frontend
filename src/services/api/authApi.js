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
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken });
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