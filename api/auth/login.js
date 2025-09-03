import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findUserByEmail, updateUser } from '../lib/users.js'
import { sendVerificationCode } from '../lib/email-service.js'

export default async (req, res) => {
  try {
    const { email, password } = req.body
    
    console.log('=== LOGIN REQUEST ===')
    console.log('Headers:', req.headers)
    console.log('Body:', { email, passwordLength: password?.length })
    console.log('====================')
    
    if (!email || !password) {
      console.log('❌ Validation failed - missing fields')
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      })
    }

    const user = findUserByEmail(email)
    if (!user) {
      console.log('❌ User not found')
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.log('❌ Invalid password')
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      })
    }

    if (user.twoFactorEnabled) {
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString()
      user.twoFactorCode = twoFactorCode
      user.twoFactorCodeExpiry = new Date(Date.now() + 10 * 60 * 1000)
      await updateUser(user.id, user)

      try {
        await sendVerificationCode(user.email, twoFactorCode, user.name)
      } catch (emailError) {
        console.error('❌ Failed to send 2FA email:', emailError)
        // Continue anyway for demo purposes
      }

      console.log('✅ 2FA required')
      return res.json({ 
        success: true,
        message: 'Two-factor authentication required',
        requires2FA: true,
        userId: user.id
      })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    const response = {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
    
    console.log('✅ Login successful')
    console.log('====================')
    
    res.json(response)
    
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}
