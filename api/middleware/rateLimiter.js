// Simple in-memory rate limiter for demonstration
// In production, use Redis or similar for distributed rate limiting

class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  // Clean up old entries
  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  // Check if request is allowed
  isAllowed(identifier, windowMs, maxRequests) {
    this.cleanup();
    
    const now = Date.now();
    const key = identifier;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    
    const data = this.requests.get(key);
    
    if (now > data.resetTime) {
      // Window has expired, reset
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }
    
    if (data.count >= maxRequests) {
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: data.resetTime 
      };
    }
    
    data.count++;
    return { 
      allowed: true, 
      remaining: maxRequests - data.count 
    };
  }
}

const rateLimiter = new RateLimiter();

// Rate limiting middleware factory
export const createRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // requests per window
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => req.ip || req.connection.remoteAddress
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const result = rateLimiter.isAllowed(key, windowMs, max);
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    
    if (!result.allowed) {
      res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      res.setHeader('Retry-After', Math.ceil((result.resetTime - Date.now()) / 1000));
      
      return res.status(429).json({
        success: false,
        message,
        error: 'RATE_LIMIT_EXCEEDED',
        resetTime: new Date(result.resetTime).toISOString()
      });
    }
    
    next();
  };
};

// Predefined rate limiters
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many API requests, please try again later.'
});

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many authentication attempts, please try again later.',
  keyGenerator: (req) => `${req.ip || req.connection.remoteAddress}-${req.body.email || 'unknown'}`
});

export const passwordResetRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many password reset requests, please try again later.',
  keyGenerator: (req) => `${req.ip || req.connection.remoteAddress}-${req.body.email || 'unknown'}`
});

export default rateLimiter;
