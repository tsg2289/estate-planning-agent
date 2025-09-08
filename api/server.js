import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, waitForInitialization } from './lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy for API endpoints
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  
  // HTTPS enforcement in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
});

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from data directory
app.use('/data', express.static(path.join(__dirname, '../data')));

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Trigger database initialization by calling getDatabase first
    getDatabase();
    
    // Wait for database to be ready
    await waitForInitialization();
    
    console.log('✅ Database ready, setting up routes...');
    
    // Import rate limiting middleware
    const { authRateLimit, passwordResetRateLimit } = await import('./middleware/rateLimiter.js');
    
    // Import the new database-based auth and email list handlers
    const registerModule = await import('./auth/register.js');
    app.post('/api/auth/register', authRateLimit, registerModule.default);
    
    const loginModule = await import('./auth/login.js');
    app.post('/api/auth/login', authRateLimit, loginModule.default);
    
    const verifyModule = await import('./auth/verify.js');
    app.get('/api/auth/verify', verifyModule.default);
    
    const verify2FAModule = await import('./auth/verify-2fa.js');
    app.post('/api/auth/verify-2fa', authRateLimit, verify2FAModule.default);
    
    const forgotPasswordModule = await import('./auth/forgot-password.js');
    app.post('/api/auth/forgot-password', passwordResetRateLimit, forgotPasswordModule.default);
    
    const resetPasswordModule = await import('./auth/reset-password.js');
    app.post('/api/auth/reset-password', authRateLimit, resetPasswordModule.default);
    
    const emailListModule = await import('./email-list.js');
    app.use('/api/email-list', emailListModule.default);
    
    const blogModule = await import('./blog.js');
    app.use('/api/blog', blogModule.default);
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        success: true,
        message: 'Estate Planning API is running with database backend',
        timestamp: new Date().toISOString(),
        features: [
          'User Authentication',
          'Two-Factor Authentication (2FA)',
          'Email List Management',
          'Blog System',
          'Database Storage',
          'Export Functionality'
        ]
      });
    });
    
    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Estate Planning API',
        version: '2.0.0',
        endpoints: {
          auth: '/api/auth/*',
          emailList: '/api/email-list/*',
          blog: '/api/blog/*',
          health: '/api/health'
        }
      });
    });
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 Estate Planning API running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
      console.log(`📧 Email list endpoints: http://localhost:${PORT}/api/email-list/*`);
      console.log(`💾 Database: SQLite with email list management`);
      console.log(`✅ Server ready to accept requests!`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
