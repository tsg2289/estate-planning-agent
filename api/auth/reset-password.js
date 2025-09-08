import bcrypt from 'bcryptjs'
import { validatePasswordResetToken, resetPassword } from '../lib/users.js'

export default async (req, res) => {
  try {
    const { token, newPassword } = req.body
    
    console.log('=== RESET PASSWORD REQUEST ===')
    console.log('Token:', token ? 'provided' : 'missing')
    console.log('New Password:', newPassword ? 'provided' : 'missing')
    console.log('==============================')
    
    if (!token || !newPassword) {
      console.log('❌ Validation failed - missing fields')
      return res.status(400).json({ 
        success: false,
        message: 'Reset token and new password are required' 
      })
    }

    // Validate password strength
    if (newPassword.length < 6) {
      console.log('❌ Password too short')
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      })
    }

    // Validate the reset token
    const user = validatePasswordResetToken(token)
    if (!user) {
      console.log('❌ Invalid or expired token')
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      })
    }

    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      
      // Reset the password and clear the token
      const updatedUser = resetPassword(token, hashedPassword)
      
      if (!updatedUser) {
        console.log('❌ Failed to reset password')
        return res.status(500).json({ 
          success: false,
          message: 'Failed to reset password' 
        })
      }

      console.log('✅ Password reset successful')
      console.log('✅ Account unlocked')
      console.log('==============================')
      
      res.json({ 
        success: true,
        message: 'Password has been reset successfully. Your account is now unlocked and you can log in with your new password.' 
      })
      
    } catch (hashError) {
      console.error('❌ Password hashing error:', hashError)
      return res.status(500).json({ 
        success: false,
        message: 'Failed to process new password' 
      })
    }
    
  } catch (error) {
    console.error('❌ Reset password error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}
