import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Auth.css'

const Login = ({ onSwitchToRegister }) => {
  const location = useLocation()
  const assessmentAnswers = location.state?.assessmentAnswers || null
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Login successful - redirect to dashboard
        setError('')
        console.log('🎉 Login successful! Redirecting to dashboard...')
        navigate('/dashboard')
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your estate planning account</p>
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
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-section">
          <div className="disclaimer-container">
            <div className="disclaimer-content">
              <h3>Disclaimer</h3>
              <p>
                This application is provided for informational and educational purposes only. It does not constitute legal advice, nor does it create an attorney–client relationship. Estate planning laws vary by state, and each individual's circumstances are unique. Any documents generated through this application should be carefully reviewed by a licensed attorney in your jurisdiction before being signed or relied upon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
