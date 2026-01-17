// blog-frontend/src/lib/auth.js
// JWT authentication utilities

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';

/**
 * Get access token from localStorage
 */
export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set tokens in localStorage
 */
export function setTokens(accessToken, refreshToken) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }
}

/**
 * Clear tokens from localStorage
 */
export function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }
}

/**
 * Set user info in localStorage
 */
export function setUserInfo(userInfo) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }
}

/**
 * Get user info from localStorage
 */
export function getUserInfo() {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

// Legacy function names for backward compatibility
export function getToken() {
  return getAccessToken();
}

/**
 * Get user from localStorage (legacy alias)
 */
export function getUser() {
  return getUserInfo();
}

/**
 * Set tokens and user in localStorage (legacy)
 */
export function setAuth(data) {
  if (data.accessToken) {
    setTokens(data.accessToken, data.refreshToken);
  }
  if (data.user || data.admin) {
    setUserInfo(data.user || data.admin);
  }
}

/**
 * Clear authentication data (legacy)
 */
export function clearAuth() {
  clearTokens();
}

/**
 * Check if user is admin
 */
export function isAdmin() {
  const user = getUserInfo();
  return user?.role === 'admin' || user?.role === 'super-admin';
}

/**
 * Logout
 */
export function logout() {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}


