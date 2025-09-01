// src/services/utils/apiClient.js
import axios from 'axios';

// Hardcoded backend URL
const BASE_URL = 'http://localhost:5000/api'; // change to production URL when needed

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // include cookies if your backend uses them
});

// Attach accessToken from localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens'));
      if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    } catch (err) {
      console.warn('Invalid tokens in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        if (!tokens?.refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: tokens.refreshToken,
        });

        localStorage.setItem('tokens', JSON.stringify(data.tokens));
        originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem('tokens');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
