import React from 'react'
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext'
import { Navigate } from 'react-router-dom'

const SupabaseProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin, configError } = useSupabaseAuth()

  console.log('SupabaseProtectedRoute: user:', user, 'loading:', loading, 'configError:', configError)

  // Show configuration error if Supabase is not set up
  if (configError) {
    return (
      <div className="error-container">
        <div className="error-card">
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

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <a href="/" className="auth-link">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  // Check if email is verified (only in production)
  if (process.env.NODE_ENV === 'production' && !user.email_confirmed_at) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>Email Verification Required</h2>
          <p>
            Please check your email and click the confirmation link to verify your account.
          </p>
          <p>
            If you didn't receive the email, please check your spam folder or contact support.
          </p>
          <a href="/login" className="auth-link">
            Return to Sign In
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default SupabaseProtectedRoute
