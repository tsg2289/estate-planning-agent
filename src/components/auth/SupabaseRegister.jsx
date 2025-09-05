import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import './Auth.css'

const SupabaseRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp, configError, isAuthenticated } = useSupabaseAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/app', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Show configuration error if Supabase is not set up
  if (configError) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Configuration Required</h2>
          <div className="error-message">
            <p>{configError}</p>
            <p>To set up Supabase:</p>
            <ol style={{ textAlign: 'left', margin: '16px 0' }}>
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
              <li>Get your project URL and anon key from the project settings</li>
              <li>Create a <code>.env.local</code> file in your project root</li>
              <li>Add: <code>VITE_SUPABASE_URL=your_url_here</code></li>
              <li>Add: <code>VITE_SUPABASE_ANON_KEY=your_key_here</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <div className="auth-links">
            <a href="/" className="auth-link">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log('🚀 Starting signup process for:', formData.email)
      const { data, error } = await signUp(
        formData.email, 
        formData.password, 
        {
          full_name: formData.fullName
        }
      )
      
      console.log('📡 Signup response:', { data, error })
      
      if (error) {
        console.error('❌ Signup error:', error.message)
        setError(error.message)
      } else if (data?.user) {
        console.log('✅ User created successfully:', {
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          hasSession: !!data.session
        })
        setSuccess(true)
        // Don't call onSuccess immediately - user needs to confirm email
      } else {
        console.log('⚠️ Unexpected response: no user data')
        setError('Unexpected response from server. Please try again.')
      }
    } catch (err) {
      console.error('💥 Signup exception:', err)
      setError(err.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Check Your Email</h2>
          <div className="success-message">
            <p>
              We've sent a confirmation link to <strong>{formData.email}</strong>
            </p>
            <p>
              Please check your email and click the link to activate your account.
            </p>
            <p>
              <strong>Note:</strong> If you don't receive the email within a few minutes:
            </p>
            <ul style={{ textAlign: 'left', margin: '8px 0' }}>
              <li>Check your spam/junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Try signing up again if needed</li>
            </ul>
            <p>
              You can then return here to sign in once your email is confirmed.
            </p>
          </div>
          <div className="auth-links">
            <a href="/login" className="auth-link">
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
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
              required
              disabled={loading}
              placeholder="Create a password (min 6 characters)"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account?{' '}
            <a href="/login" className="auth-link">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SupabaseRegister
