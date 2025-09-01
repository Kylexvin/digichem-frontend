// Local storage utilities with error handling
export const getStorageItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return null;
  }
};

export const setStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
  }
};

export const removeStorageItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

export const clearStorage = () => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};