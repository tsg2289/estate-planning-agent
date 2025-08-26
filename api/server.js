import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, waitForInitialization } from './lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
    
    // Import the new database-based auth and email list handlers
    const registerModule = await import('./auth/register.js');
    app.post('/api/auth/register', registerModule.default);
    
    const loginModule = await import('./auth/login.js');
    app.post('/api/auth/login', loginModule.default);
    
    const verifyModule = await import('./auth/verify.js');
    app.get('/api/auth/verify', verifyModule.default);
    
    const emailListModule = await import('./email-list.js');
    app.use('/api/email-list', emailListModule.default);
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        success: true,
        message: 'Estate Planning API is running with database backend',
        timestamp: new Date().toISOString(),
        features: [
          'User Authentication',
          'Email List Management',
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
