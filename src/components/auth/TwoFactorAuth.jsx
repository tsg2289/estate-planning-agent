import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Auth.css'

const TwoFactorAuth = ({ email, tempToken, onBack, isRegistration = false }) => {
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const { verify2FA, login, register } = useAuth()
  const navigate = useNavigate()

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code')
      return
    }

    setIsLoading(true)

    try {
      const result = await verify2FA(email, verificationCode, tempToken)
      
      if (result.success) {
        // 2FA successful - redirect to dashboard
        setError('')
        console.log('🎉 2FA successful! Redirecting to dashboard...')
        navigate('/dashboard')
      } else {
        setError(result.error || 'Verification failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setIsLoading(true)

    try {
      // For registration, we need to call register again
      // For login, we need to call login again
      if (isRegistration) {
        // This would need to be handled differently - maybe store registration data temporarily
        setError('Please go back and try registration again to get a new code.')
      } else {
        // For login, we can try to resend
        setError('Please go back and try logging in again to get a new code.')
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Two-Factor Authentication</h2>
          <p>Enter the 6-digit code sent to your email</p>
        </div>

        <div className="verification-info">
          <div className="email-display">
            <span className="email-icon">📧</span>
            <span className="email-text">{email}</span>
          </div>
          
          {timeLeft > 0 && (
            <div className="timer">
              <span className="timer-icon">⏰</span>
              <span className="timer-text">Code expires in: {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
              disabled={isLoading}
              className="verification-code-input"
            />
            <small className="form-help">
              Enter the 6-digit code sent to your email address
            </small>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="verification-actions">
          <button
            type="button"
            className="link-button"
            onClick={handleBack}
            disabled={isLoading}
          >
            ← Back to {isRegistration ? 'Registration' : 'Login'}
          </button>
          
          {canResend && (
            <button
              type="button"
              className="link-button resend-button"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Resend Code
            </button>
          )}
        </div>

        <div className="verification-help">
          <h4>Need Help?</h4>
          <ul>
            <li>Check your email inbox (and spam folder)</li>
            <li>Make sure you entered the correct email address</li>
            <li>The code expires in 10 minutes for security</li>
            <li>Contact support if you continue having issues</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-section">
          <div className="disclaimer-container">
            <div className="disclaimer-content">
              <h3>Security Notice</h3>
              <p>
                Two-factor authentication adds an extra layer of security to your account. 
                Never share your verification code with anyone, including our support team. 
                If you didn't request this code, please ignore this email and contact support immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorAuth
