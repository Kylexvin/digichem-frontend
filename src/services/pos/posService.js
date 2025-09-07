// src/services/pos/posService.js
import apiClient from '../utils/apiClient';

// Product Search Service
export const productService = {
  // Search products with enhanced filtering
  searchProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameters
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.inStock) queryParams.append('inStock', params.inStock);
      if (params.lowStock) queryParams.append('lowStock', params.lowStock);
      if (params.drugType) queryParams.append('drugType', params.drugType);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get(`/inventory/products?${queryParams.toString()}`);
      
      if (response.data.success) {
        return {
          success: true,
          products: response.data.data,
          pagination: response.data.pagination
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Product search error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to search products',
        products: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/inventory/products/${productId}`);
      
      if (response.data.success) {
        return {
          success: true,
          product: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Product not found');
      }
    } catch (error) {
      console.error('Get product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get product',
        product: null
      };
    }
  }
};

// Sales Service
export const salesService = {
  // Create a new sale
  createSale: async (saleData) => {
    try {
      const response = await apiClient.post('/pos/sales', saleData);
      
      if (response.data.success) {
        return {
          success: true,
          sale: response.data.data,
          message: response.data.message || 'Sale completed successfully'
        };
      } else {
        throw new Error(response.data.message || 'Failed to complete sale');
      }
    } catch (error) {
      console.error('Create sale error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to complete sale',
        sale: null
      };
    }
  },

  // Get sales history
  getSalesHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);

      const response = await apiClient.get(`/pos/sales?${queryParams.toString()}`);
      
      if (response.data.success) {
        return {
          success: true,
          sales: response.data.data,
          pagination: response.data.pagination
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch sales history');
      }
    } catch (error) {
      console.error('Get sales history error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch sales history',
        sales: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    }
  }
};

// Cart utilities
export const cartUtils = {
  // Calculate cart totals
  calculateTotals: (cartItems, vatRate = 0.16, discount = 0) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * vatRate;
    const total = subtotal + vat - discount;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      vat: parseFloat(vat.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  },

  // Format cart items for API
  formatCartForAPI: (cartItems) => {
    return cartItems.map(item => ({
      productId: item._id || item.id,
      quantity: item.quantity,
      // Include price for validation (optional)
      unitPrice: item.pricing?.sellingPricePerPack || item.price
    }));
  },

  // Validate cart before checkout
  validateCart: (cartItems) => {
    const errors = [];
    
    if (!cartItems || cartItems.length === 0) {
      errors.push('Cart is empty');
    }
    
    cartItems.forEach((item, index) => {
      if (!item._id && !item.id) {
        errors.push(`Item ${index + 1}: Missing product ID`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Invalid quantity`);
      }
      if (!item.price && !item.pricing?.sellingPricePerPack) {
        errors.push(`Item ${index + 1}: Missing price`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};