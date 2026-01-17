// blog-frontend/src/services/api/auth.api.js
// Auth API service functions
import apiClient from '../../lib/api-client.js';
import { setTokens, setUserInfo } from '../../lib/auth.js';

export const authApi = {
  // User login
  login: async (email, password, type = 'user') => {
    const response = await apiClient.post('/auth/login', { email, password, type });
    if (response.data.success && response.data.accessToken) {
      setTokens(response.data.accessToken, response.data.refreshToken);
      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    }
    return response.data;
  },

  // Admin login (with OTP support)
  adminLogin: async (usernameOrEmail, password = null, otpToken = null) => {
    const credentials = {
      type: 'admin',
    };
    
    // Check if it's email or username
    if (usernameOrEmail.includes('@')) {
      credentials.email = usernameOrEmail;
    } else {
      credentials.username = usernameOrEmail;
    }
    
    // Add password or OTP token
    if (password) {
      credentials.password = password;
    } else if (otpToken) {
      credentials.otpToken = otpToken;
    }
    
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.success && response.data.accessToken) {
      setTokens(response.data.accessToken, response.data.refreshToken);
      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    }
    return response.data;
  },

  // Register
  register: async (email, password, name) => {
    const response = await apiClient.post('/auth/register', { email, password, name });
    if (response.data.success && response.data.accessToken) {
      setTokens(response.data.accessToken, response.data.refreshToken);
      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    }
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    if (response.data.success && response.data.accessToken) {
      setTokens(response.data.accessToken, refreshToken);
    }
    return response.data;
  },

  // Send OTP (admin)
  sendOTP: async (mobile) => {
    const response = await apiClient.post('/auth/admin/send-otp', { mobile });
    return response.data;
  },

  // Verify OTP (admin)
  verifyOTP: async (mobile, otp) => {
    const response = await apiClient.post('/auth/admin/verify-otp', { mobile, otp });
    return response.data;
  },
};

export default authApi;


