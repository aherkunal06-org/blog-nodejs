// blog-frontend/src/services/api/categories.api.js
// Categories API service functions
import apiClient from '../../lib/api-client.js';

export const categoriesApi = {
  // Get all categories
  getAll: async (params = {}) => {
    const response = await apiClient.get('/categories', { params });
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug) => {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data;
  },
};

export default categoriesApi;
