import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Database-based storage for production
import { addUser, findUserByEmail } from '../lib/users-db.js';

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check password complexity
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      });
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
      assessmentAnswers: req.body.assessmentAnswers || null
    };

    // Store user (in production, save to database)
    addUser({
      ...user,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
