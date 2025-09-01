export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Bad request');
      case 401:
        return new Error(data.message || 'Unauthorized access');
      case 403:
        return new Error(data.message || 'Access forbidden');
      case 404:
        return new Error(data.message || 'Resource not found');
      case 409:
        return new Error(data.message || 'Conflict occurred');
      case 422:
        return new Error(data.message || 'Validation failed');
      case 429:
        return new Error(data.message || 'Too many requests');
      case 500:
        return new Error(data.message || 'Internal server error');
      case 503:
        return new Error(data.message || 'Service unavailable');
      default:
        return new Error(data.message || `HTTP error: ${status}`);
    }
  } else if (error.request) {
    // Request was made but no response received
    return new Error('Network error. Please check your connection.');
  } else {
    // Something else happened
    return new Error(error.message || 'An unexpected error occurred');
  }
};