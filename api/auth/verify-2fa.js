import jwt from 'jsonwebtoken'
import { findUserById, updateUser } from '../lib/users.js'

export default async (req, res) => {
  try {
    const { userId, code } = req.body
    
    console.log('=== 2FA VERIFICATION ===')
    console.log('Body:', { userId, code })
    console.log('========================')
    
    if (!userId || !code) {
      console.log('❌ Validation failed - missing fields')
      return res.status(400).json({ 
        success: false,
        message: 'User ID and code are required' 
      })
    }

    const user = findUserById(userId)
    if (!user) {
      console.log('❌ User not found')
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }

    if (!user.twoFactorCode || !user.twoFactorCodeExpiry) {
      console.log('❌ No 2FA code found')
      return res.status(400).json({ 
        success: false,
        message: 'No two-factor authentication code found' 
      })
    }

    if (new Date() > new Date(user.twoFactorCodeExpiry)) {
      console.log('❌ 2FA code expired')
      return res.status(400).json({ 
        success: false,
        message: 'Two-factor authentication code has expired' 
      })
    }

    if (user.twoFactorCode !== code) {
      console.log('❌ Invalid 2FA code')
      return res.status(400).json({ 
        success: false,
        message: 'Invalid two-factor authentication code' 
      })
    }

    // Clear the 2FA code after successful verification
    user.twoFactorCode = null
    user.twoFactorCodeExpiry = null
    await updateUser(user.id, user)

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    const response = {
      success: true,
      message: 'Two-factor authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
    
    console.log('✅ 2FA verification successful')
    console.log('========================')
    
    res.json(response)
    
  } catch (error) {
    console.error('❌ 2FA verification error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}
