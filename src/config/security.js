// Security configuration for the Estate Planning Agent application

export const SECURITY_CONFIG = {
  // Content Security Policy directives
  CSP: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for React development
      "'unsafe-eval'", // Required for React development
      "https://unpkg.com",
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled components
      "https://fonts.googleapis.com",
      "https://unpkg.com",
      "https://cdn.jsdelivr.net"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    'media-src': [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    'object-src': ["'none'"],
    'frame-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  },

  // Security headers
  HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },

  // Permissions Policy (Feature Policy)
  PERMISSIONS_POLICY: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: [],
    usb: [],
    bluetooth: [],
    accelerometer: [],
    gyroscope: [],
    magnetometer: [],
    'ambient-light-sensor': [],
    'encrypted-media': [],
    'sync-xhr': [],
    midi: []
  },

  // Rate limiting configuration
  RATE_LIMITS: {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // limit each IP to 10 requests per windowMs
      message: 'Too many login attempts, please try again later.'
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // limit each IP to 3 password reset requests per hour
      message: 'Too many password reset requests, please try again later.'
    },
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests, please try again later.'
    }
  },

  // Account lockout configuration
  ACCOUNT_LOCKOUT: {
    maxAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    resetTokenExpiry: 60 * 60 * 1000 // 1 hour in milliseconds
  },

  // Password policy
  PASSWORD_POLICY: {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    maxLength: 128
  },

  // Session configuration
  SESSION: {
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 2 * 60 * 60 * 1000, // 2 hours before expiry
    secure: true, // HTTPS only in production
    httpOnly: true,
    sameSite: 'strict'
  }
};

// Helper function to generate CSP string
export const generateCSPString = () => {
  const cspDirectives = [];
  
  for (const [directive, sources] of Object.entries(SECURITY_CONFIG.CSP)) {
    if (sources.length === 0) {
      cspDirectives.push(directive);
    } else {
      cspDirectives.push(`${directive} ${sources.join(' ')}`);
    }
  }
  
  return cspDirectives.join('; ');
};

// Helper function to generate Permissions Policy string
export const generatePermissionsPolicyString = () => {
  const policies = [];
  
  for (const [feature, allowlist] of Object.entries(SECURITY_CONFIG.PERMISSIONS_POLICY)) {
    if (allowlist.length === 0) {
      policies.push(`${feature}=()`);
    } else {
      policies.push(`${feature}=(${allowlist.join(' ')})`);
    }
  }
  
  return policies.join(', ');
};

export default SECURITY_CONFIG;