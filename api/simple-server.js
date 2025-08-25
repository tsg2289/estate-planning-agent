const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Simple register endpoint
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log('=== REGISTRATION REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('Body:', { email, name, passwordLength: password?.length });
    console.log('===========================');
    
    if (!email || !password || !name) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    
    // For now, just return success
    const response = {
      success: true,
      message: 'User created successfully',
      user: { email, name, id: Date.now().toString() },
      token: 'demo-token-' + Date.now()
    };
    
    console.log('✅ Sending response:', response);
    console.log('===========================');
    
    res.status(201).json(response);
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Simple API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Register: http://localhost:${PORT}/api/auth/register`);
});
