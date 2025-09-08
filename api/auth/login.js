import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { 
  findUserByEmail, 
  updateUser, 
  recordFailedLoginAttempt, 
  resetFailedLoginAttempts, 
  isAccountLocked 
} from '../lib/users.js'
import { sendVerificationCode, sendAccountLockoutEmail } from '../lib/email-service.js'

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

    // Check if account is locked before attempting password verification
    if (isAccountLocked(email)) {
      console.log('❌ Account is locked')
      return res.status(423).json({ 
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please reset your password or wait 30 minutes.',
        accountLocked: true,
        lockoutExpiry: user.lockoutExpiry
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.log('❌ Invalid password')
      
      // Record failed login attempt
      const updatedUser = recordFailedLoginAttempt(email)
      
      if (updatedUser && updatedUser.failedLoginAttempts >= 5) {
        console.log('🔒 Account locked after 5 failed attempts')
        
        // Send lockout notification email
        try {
          await sendAccountLockoutEmail(user.email, user.name)
          console.log('📧 Account lockout email sent')
        } catch (emailError) {
          console.error('❌ Failed to send lockout email:', emailError)
        }
        
        return res.status(423).json({ 
          success: false,
          message: 'Account has been locked due to 5 failed login attempts. Please check your email for password reset instructions.',
          accountLocked: true,
          lockoutExpiry: updatedUser.lockoutExpiry
        })
      }
      
      const remainingAttempts = 5 - (updatedUser?.failedLoginAttempts || 0)
      return res.status(401).json({ 
        success: false,
        message: `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before account lockout.`,
        failedAttempts: updatedUser?.failedLoginAttempts || 0,
        remainingAttempts
      })
    }

    // Reset failed login attempts on successful password verification
    resetFailedLoginAttempts(email)

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
