// blog-frontend/src/services/api/blogs.api.js
// Blog API service functions
import apiClient from '../../lib/api-client.js';

export const blogsApi = {
  // Get all blogs
  getAll: async (params = {}) => {
    const response = await apiClient.get('/blogs', { params });
    return response.data;
  },

  // Get blog by slug
  getBySlug: async (slug) => {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data;
  },

  // Get featured blog (latest or popular)
  getFeatured: async (type = 'latest') => {
    const response = await apiClient.get('/blogs/featured', { params: { type } });
    return response.data;
  },

  // Get blogs with products (diverse mode)
  getWithProducts: async (params = {}) => {
    const response = await apiClient.get('/blogs/with-products', { params });
    return response.data;
  },

  // Get trending categories
  getTrendingCategories: async (limit = 10) => {
    const response = await apiClient.get('/blogs/categories/trending', { params: { limit } });
    return response.data;
  },

  // Create blog
  create: async (formData) => {
    const response = await apiClient.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update blog
  update: async (id, formData) => {
    const response = await apiClient.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete blog
  delete: async (id) => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  },
};

export default blogsApi;


