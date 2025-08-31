// src/utils/tokenRefreshScheduler.js
import axios from 'axios';

let refreshTimeout = null;

export const scheduleTokenRefresh = () => {
  // Clear any existing timeout
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  const expiresIn = localStorage.getItem('tokenExpiresIn');
  if (!expiresIn) {
    console.log('No token expiration found, skipping refresh scheduling');
    return;
  }

  // Parse the expiration time (e.g., "15m" -> 15 minutes)
  const timeValue = parseInt(expiresIn);
  const unit = expiresIn.replace(timeValue.toString(), '').toLowerCase();
  
  let milliseconds = 0;
  
  switch (unit) {
    case 'm': // minutes
      milliseconds = timeValue * 60 * 1000;
      break;
    case 'h': // hours
      milliseconds = timeValue * 60 * 60 * 1000;
      break;
    case 'd': // days
      milliseconds = timeValue * 24 * 60 * 60 * 1000;
      break;
    default:
      milliseconds = 15 * 60 * 1000; // default to 15 minutes
  }

  // Refresh token 1 minute before expiration
  const refreshTime = Math.max(milliseconds - (60 * 1000), 5000); // At least 5 seconds
  
  console.log(`Scheduling token refresh in ${refreshTime / 1000} seconds`);
  
  refreshTimeout = setTimeout(async () => {
    try {
      await refreshToken();
      scheduleTokenRefresh(); // Schedule next refresh
    } catch (error) {
      console.error('Scheduled token refresh failed:', error);
      // Don't reschedule if refresh fails - will be handled by interceptor
    }
  }, refreshTime);
};

export const cancelTokenRefresh = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
    console.log('Token refresh scheduling cancelled');
  }
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.log('No refresh token available for automatic refresh');
    return;
  }

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.data || !response.data.tokens) {
      throw new Error('Invalid refresh response format');
    }

    const newTokens = response.data.tokens;
    
    // Validate tokens
    if (!newTokens.accessToken || !newTokens.refreshToken) {
      throw new Error('Invalid tokens received from refresh');
    }

    // Update localStorage
    localStorage.setItem('accessToken', newTokens.accessToken);
    localStorage.setItem('refreshToken', newTokens.refreshToken);
    
    if (newTokens.expiresIn) {
      localStorage.setItem('tokenExpiresIn', newTokens.expiresIn);
    }

    console.log('Token automatically refreshed successfully');
  } catch (error) {
    console.error('Automatic token refresh failed:', error);
    
    // Clear auth data if refresh fails consistently
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Refresh token invalid, clearing auth data');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('tokenExpiresIn');
    }
    
    throw error;
  }
};