import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import HomeLink from '../HomeLink'
import './Auth.css'

const SupabaseLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, configError, isAuthenticated } = useSupabaseAuth()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Login attempt with email:', formData.email)

    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      console.log('Sign in result:', { data, error })
      
      if (error) {
        console.error('Login error:', error)
        setError(error.message)
      } else if (data?.user) {
        console.log('Login successful, user:', data.user)
        // Check if email is confirmed (only in production)
        if (process.env.NODE_ENV === 'production' && !data.user.email_confirmed_at) {
          setError('Please check your email and click the confirmation link before signing in.')
        } else {
          console.log('Email confirmed or in development mode, redirecting to app')
          navigate('/app', { replace: true })
        }
      } else {
        console.log('No user data returned')
        setError('Login failed - no user data returned')
      }
    } catch (err) {
      console.error('Login exception:', err)
      setError(err.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <HomeLink />
      <div className="auth-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="auth-link">
              Sign up here
            </a>
          </p>
          <p>
            <a href="/forgot-password" className="auth-link">
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SupabaseLogin
