// blog-frontend/src/services/api/products.api.js
// Product API service functions
import apiClient from '../../lib/api-client.js';

export const productsApi = {
  // Get all products (indexed products)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/products/index', { params });
    return response.data;
  },

  // Get product by ID
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeatured: async () => {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },
};

export default productsApi;


