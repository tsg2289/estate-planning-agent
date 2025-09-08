import { findUserByEmail, generatePasswordResetToken } from '../lib/users.js'
import { sendPasswordResetEmail } from '../lib/email-service.js'

export default async (req, res) => {
  try {
    const { email } = req.body
    
    console.log('=== FORGOT PASSWORD REQUEST ===')
    console.log('Email:', email)
    console.log('===============================')
    
    if (!email) {
      console.log('❌ Validation failed - missing email')
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      })
    }

    const user = findUserByEmail(email)
    if (!user) {
      console.log('❌ User not found, but returning success for security')
      // For security reasons, always return success even if user doesn't exist
      return res.json({ 
        success: true,
        message: 'If an account with that email exists, you will receive a password reset link shortly.' 
      })
    }

    // Generate password reset token
    const result = generatePasswordResetToken(email)
    if (!result) {
      console.log('❌ Failed to generate reset token')
      return res.status(500).json({ 
        success: false,
        message: 'Failed to generate reset token' 
      })
    }

    const { token } = result

    try {
      // Send password reset email
      const emailResult = await sendPasswordResetEmail(user.email, token, user.name)
      
      if (emailResult.success) {
        console.log('✅ Password reset email sent successfully')
      } else {
        console.error('❌ Failed to send reset email:', emailResult.error)
        return res.status(500).json({ 
          success: false,
          message: 'Failed to send reset email' 
        })
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError)
      return res.status(500).json({ 
        success: false,
        message: 'Failed to send reset email' 
      })
    }

    console.log('✅ Password reset request processed successfully')
    console.log('===============================')
    
    res.json({ 
      success: true,
      message: 'If an account with that email exists, you will receive a password reset link shortly.' 
    })
    
  } catch (error) {
    console.error('❌ Forgot password error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}
