import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../lib/users-db.js';

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
    const { email, verificationCode, tempToken } = req.body;

    // Validation
    if (!email || !verificationCode || !tempToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Email, verification code, and temporary token are required' 
      });
    }

    // Verify the temporary token
    let decodedToken;
    try {
      decodedToken = jwt.verify(tempToken, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired temporary token' 
      });
    }

    // Check if the email matches the token
    if (decodedToken.email !== email) {
      return res.status(401).json({ 
        success: false,
        message: 'Email mismatch' 
      });
    }

    // Find user in database
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated' 
      });
    }

    // Verify the 2FA code (stored in tempToken payload)
    if (decodedToken.verificationCode !== verificationCode) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid verification code' 
      });
    }

    // Check if code has expired (10 minutes)
    const codeExpiry = decodedToken.codeExpiry;
    if (Date.now() > codeExpiry) {
      return res.status(401).json({ 
        success: false,
        message: 'Verification code has expired' 
      });
    }

    // Generate final JWT token
    const finalToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Two-factor authentication successful',
      user: userWithoutPassword,
      token: finalToken
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
