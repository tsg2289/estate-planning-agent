// API Configuration for Estate Planning Agent
// This file centralizes all API endpoint configurations

const API_CONFIG = {
  // Base API URL - uses environment variable or falls back to localhost
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
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

export default API_CONFIG
