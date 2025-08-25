import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { validatePassword, getPasswordStrengthInfo } from '../../config/security'
import './Auth.css'

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
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
        // Registration successful - redirect to dashboard
        setError('')
        console.log('🎉 Registration successful! Redirecting to dashboard...')
        console.log('📍 Current location before redirect:', window.location.pathname)
        navigate('/dashboard')
        console.log('🔄 Navigate called, checking if redirect worked...')
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start building your estate plan today</p>
        </div>

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
      </div>
    </div>
  )
}

export default Register
