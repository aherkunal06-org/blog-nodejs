// blog-frontend/src/services/api/events.api.js
// Events API service functions
import apiClient from '../../lib/api-client.js';

export const eventsApi = {
  // Get upcoming events
  getUpcoming: async (params = {}) => {
    const response = await apiClient.get('/events/upcoming', { params });
    return response.data;
  },

  // Get all events
  getAll: async (params = {}) => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },

  // Get event by ID
  getById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },
};

export default eventsApi;


