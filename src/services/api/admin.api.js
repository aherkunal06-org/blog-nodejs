// blog-frontend/src/services/api/admin.api.js
// Admin API service functions
import apiClient from '../../lib/api-client.js';

export const adminApi = {
  // Dashboard stats
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // Get all admins
  getAdmins: async () => {
    const response = await apiClient.get('/admin/get-admins');
    return response.data;
  },
};

export default adminApi;



