// blog-frontend/src/config/constants.js
// Configuration constants for the application
// Uses environment variables with fallbacks for development

// Helper to ensure HTTPS in production
const ensureHttps = (url) => {
  if (!url) return url;
  // In production, force HTTPS if not already
  if (process.env.NODE_ENV === 'Production' && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

// Get API URL from environment or use default
const getApiUrl = () => {
  const defaultUrl = process.env.NODE_ENV === 'Production'
    ? 'https://blog-api.ipshopy.com/api/v1'
    : 'https://blog-api.ipshopy.com/api/v1';

  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = envUrl || defaultUrl;

  // Ensure HTTPS in production
  return ensureHttps(url);
};

// Get Base URL from environment or use default
const getBaseUrl = () => {
  const defaultUrl = process.env.NODE_ENV === 'production'
    ? 'https://mobile-api.ipshopy.com'
    : 'https://mobile-api.ipshopy.com';

  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const url = envUrl || defaultUrl;

  // Ensure HTTPS in production
  return ensureHttps(url);
};

// Get Image Base URL from environment or use default
const getImageBaseUrl = () => {
  const defaultUrl = process.env.NODE_ENV === 'production'
    ? 'https://blog-api.ipshopy.com/cache/images'
    : 'https://blog-api.ipshopy.com/cache/images';

  const envUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const url = envUrl || defaultUrl;

  // Ensure HTTPS in production
  return ensureHttps(url);
};

export const CONFIG = {
  // Backend API URL (public endpoints for site)
  API_URL: getApiUrl(),

  // Frontend base URL
  BASE_URL: getBaseUrl(),

  // Image serving URL (backend cache/images endpoint)
  IMAGE_BASE_URL: getImageBaseUrl(),

  // Environment
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

export default CONFIG;

