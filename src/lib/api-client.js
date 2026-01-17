// blog-frontend/src/lib/api-client.js
// Axios instance for API calls with security enhancements
import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth.js';
import { CONFIG } from '../config/constants.js';

const API_URL = CONFIG.API_URL;

// Request throttling to prevent rate limit issues
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

// Create axios instance with security configurations
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection indicator
  },
  withCredentials: true, // Send cookies with requests
  timeout: 30000, // 30 second timeout
  // Note: HTTPS enforcement is handled at the network level in production
});

// Request interceptor - add JWT token and security headers
apiClient.interceptors.request.use(
  async (config) => {
    // Throttle requests to prevent overwhelming the server
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    // Get token from auth utility
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp for request validation (helps prevent replay attacks)
    config.headers['X-Request-Time'] = Date.now().toString();

    // Force HTTPS in production (prevent mixed-content errors)
    if (CONFIG.IS_PRODUCTION) {
      const fullUrl = config.baseURL ? `${config.baseURL}${config.url || ''}` : config.url;
      if (fullUrl && fullUrl.startsWith('http://')) {
        // Replace HTTP with HTTPS to prevent mixed-content blocking
        const httpsUrl = fullUrl.replace('http://', 'https://');
        if (config.baseURL && config.baseURL.startsWith('http://')) {
          config.baseURL = config.baseURL.replace('http://', 'https://');
        }
        console.warn('Upgraded HTTP to HTTPS in production:', fullUrl, '->', httpsUrl);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          }, { 
            withCredentials: true,
            timeout: 10000, // 10 second timeout for refresh
          });

          const { accessToken } = response.data;
          if (accessToken) {
            setTokens(accessToken, refreshToken); // Update tokens using auth utility

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/user/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors with exponential backoff suggestion
    if (!error.response && error.request) {
      console.error('Network error:', error.message);
      // Could implement exponential backoff here if needed
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      if (retryAfter && typeof window !== 'undefined') {
        console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;


