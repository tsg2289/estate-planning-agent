import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { validatePassword, getPasswordStrengthInfo } from '../../config/security'
import TwoFactorAuth from './TwoFactorAuth'
import './Auth.css'

const Register = ({ onSwitchToLogin }) => {
  const location = useLocation()
  const assessmentAnswers = location.state?.assessmentAnswers || null
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [show2FA, setShow2FA] = useState(false)
  const [tempToken, setTempToken] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Check password strength when password changes
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const checkPasswordStrength = (password) => {
    const validation = validatePassword(password)
    return validation.strength
  }

  const getPasswordStrengthText = (strength) => {
    return getPasswordStrengthInfo(strength)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Enhanced validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join('. '))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      console.log('🚀 Calling register function...')
      const result = await register(formData.email, formData.password, formData.name)
      console.log('📡 Register result:', result)
      
      if (result.success) {
        if (result.requires2FA) {
          // 2FA required - show 2FA component
          setTempToken(result.tempToken)
          setShow2FA(true)
          setError('')
        } else {
          // Registration successful - redirect to dashboard
          setError('')
          console.log('🎉 Registration successful! Redirecting to dashboard...')
          console.log('📍 Current location before redirect:', window.location.pathname)
          navigate('/dashboard')
          console.log('🔄 Navigate called, checking if redirect worked...')
        }
      } else {
        console.error('❌ Registration failed:', result.error)
        setError(result.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      console.error('💥 Registration error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show 2FA component if needed
  if (show2FA) {
    return (
      <TwoFactorAuth
        email={formData.email}
        tempToken={tempToken}
        onBack={() => {
          setShow2FA(false)
          setTempToken('')
          setError('')
        }}
        isRegistration={true}
      />
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start building your estate plan today</p>
        </div>

        {assessmentAnswers && (
          <div className="assessment-summary">
            <h3>Your Estate Planning Needs</h3>
            <div className="assessment-grid">
              <div className="assessment-item">
                <span className="assessment-icon">📜</span>
                <div className="assessment-details">
                  <strong>Will:</strong> {assessmentAnswers.hasWill === true ? 'You have one' : assessmentAnswers.hasWill === false ? 'You need one' : 'You\'re unsure'}
                </div>
              </div>
              <div className="assessment-item">
                <span className="assessment-icon">🏛️</span>
                <div className="assessment-details">
                  <strong>Trust:</strong> {assessmentAnswers.hasTrust === true ? 'You have one' : assessmentAnswers.hasTrust === false ? 'You need one' : 'You\'re unsure'}
                </div>
              </div>
              <div className="assessment-item">
                <span className="assessment-icon">⚖️</span>
                <div className="assessment-details">
                  <strong>Power of Attorney:</strong> {assessmentAnswers.hasPOA === true ? 'You have one' : assessmentAnswers.hasPOA === false ? 'You need one' : 'You\'re unsure'}
                </div>
              </div>
              <div className="assessment-item">
                <span className="assessment-icon">🏥</span>
                <div className="assessment-details">
                  <strong>Healthcare Directive:</strong> {assessmentAnswers.hasAHD === true ? 'You have one' : assessmentAnswers.hasAHD === false ? 'You need one' : 'You\'re unsure'}
                </div>
              </div>
            </div>
            <p className="assessment-note">
              We'll help you create the documents you need based on your assessment.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
            <div className="password-strength">
              <div className="strength-bars">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`strength-bar ${passwordStrength >= level ? 'filled' : ''}`}
                    style={{
                      backgroundColor: passwordStrength >= level ? getPasswordStrengthText(passwordStrength).color : '#e2e8f0'
                    }}
                  />
                ))}
              </div>
              <small style={{ color: getPasswordStrengthText(passwordStrength).color }}>
                {formData.password && `${getPasswordStrengthText(passwordStrength).text} • `}
                Must be at least 8 characters with uppercase, lowercase, numbers, and special characters
              </small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-section">
          <div className="disclaimer-container">
            <div className="disclaimer-content">
              <h3>Disclaimer</h3>
              <p>
                This application is provided for informational and educational purposes only. It does not constitute legal advice, nor does it create an attorney–client relationship. Estate planning laws vary by state, and each individual's circumstances are unique. Any documents generated through this application should be consistently reviewed by a licensed attorney in your jurisdiction before being signed or relied upon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
