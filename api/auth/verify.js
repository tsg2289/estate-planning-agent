import jwt from 'jsonwebtoken'
import { findUserById } from '../lib/users.js'

export default async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
    
    console.log('=== TOKEN VERIFICATION ===')
    console.log('Auth header:', authHeader)
    console.log('==========================')
    
    if (!token) {
      console.log('❌ No token provided')
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      const user = findUserById(decoded.userId)
      
      if (!user) {
        console.log('❌ User not found')
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token' 
        })
      }

      const response = {
        success: true,
        message: 'Token is valid',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
      
      console.log('✅ Token valid for user:', user.email)
      console.log('==========================')
      
      res.json(response)
      
    } catch (jwtError) {
      console.log('❌ Invalid token:', jwtError.message)
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      })
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}
