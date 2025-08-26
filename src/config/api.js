// API Configuration for Estate Planning Agent
// This file centralizes all API endpoint configurations

// Force localhost for development, override any environment variables
const isDevelopment = import.meta.env.MODE === 'development';
const forceLocalhost = isDevelopment && !import.meta.env.VITE_FORCE_PRODUCTION;

const API_CONFIG = {
  // Base API URL - force localhost for development
  BASE_URL: forceLocalhost 
    ? 'http://localhost:3001/api' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api'),
  
  // Authentication endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY: '/auth/verify',
  },
  
  // Health check endpoint
  HEALTH: '/health',
  
  // Helper function to build full URLs
  buildUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
  
  // Helper function to get auth headers
  getAuthHeaders: (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }),
  
  // Helper function to get default headers
  getDefaultHeaders: () => ({
    'Content-Type': 'application/json'
  })
}

// Log the API configuration for debugging
console.log('🔧 API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  ENV: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_FORCE_PRODUCTION: import.meta.env.VITE_FORCE_PRODUCTION,
  isDevelopment,
  forceLocalhost,
  finalUrl: API_CONFIG.buildUrl('/auth/register')
});

export default API_CONFIG
