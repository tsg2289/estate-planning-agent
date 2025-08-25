// Security Configuration
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  
  // Session settings
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  TOKEN_EXPIRY: '7d', // JWT token expiry
  
  // Rate limiting (for future implementation)
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
}

// Password validation function
export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`)
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  }
}

// Calculate password strength (0-5)
export const calculatePasswordStrength = (password) => {
  let strength = 0
  
  if (password.length >= SECURITY_CONFIG.PASSWORD_MIN_LENGTH) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return strength
}

// Get password strength text and color
export const getPasswordStrengthInfo = (strength) => {
  if (strength <= 1) return { text: 'Very Weak', color: '#e53e3e', class: 'very-weak' }
  if (strength <= 2) return { text: 'Weak', color: '#dd6b20', class: 'weak' }
  if (strength <= 3) return { text: 'Fair', color: '#d69e2e', class: 'fair' }
  if (strength <= 4) return { text: 'Good', color: '#38a169', class: 'good' }
  return { text: 'Strong', color: '#2f855a', class: 'strong' }
}

// Session management
export const SESSION_MANAGEMENT = {
  // Check if session is expired
  isSessionExpired: (lastActivity) => {
    if (!lastActivity) return true
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivity
    return timeSinceLastActivity > SECURITY_CONFIG.SESSION_TIMEOUT
  },
  
  // Update last activity timestamp
  updateLastActivity: () => {
    localStorage.setItem('lastActivity', Date.now().toString())
  },
  
  // Get last activity timestamp
  getLastActivity: () => {
    const lastActivity = localStorage.getItem('lastActivity')
    return lastActivity ? parseInt(lastActivity) : null
  }
}

// Security utilities
export const SECURITY_UTILS = {
  // Sanitize user input (basic XSS prevention)
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },
  
  // Generate secure random string
  generateSecureToken: (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}
