import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SupabaseAuthProvider, useSupabaseAuth } from './contexts/SupabaseAuthContext'
import SupabaseLogin from './components/auth/SupabaseLogin'
import SupabaseRegister from './components/auth/SupabaseRegister'
import SupabaseProtectedRoute from './components/auth/SupabaseProtectedRoute'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import EstatePlanningApp from './components/EstatePlanningApp'
import LandingPage from './components/LandingPage'
import BlogPage from './components/blog/BlogPage'
import EmailSignup from './components/EmailSignup'
import AdminPage from './components/admin/AdminPage'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

// Main App component with Supabase authentication  
function App() {
  console.log('🚀 App component rendering...')
  
  return (
    <ErrorBoundary>
      <SupabaseAuthProvider>
        <Router>
          <div className="App">
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/email-signup" element={<EmailSignup />} />
            
            {/* Authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route 
              path="/app/*" 
              element={
                <SupabaseProtectedRoute>
                  <EstatePlanningApp />
                </SupabaseProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/*" 
              element={
                <SupabaseProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </SupabaseProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </SupabaseAuthProvider>
    </ErrorBoundary>
  )
}

// Login page component
function LoginPage() {
  const { isAuthenticated, loading } = useSupabaseAuth()
  
  console.log('🔐 LoginPage - loading:', loading, 'isAuthenticated:', isAuthenticated())
  
  if (loading) {
    console.log('🔄 LoginPage showing loading spinner')
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="loading-spinner">
          <div className="spinner" style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite'
          }}></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    )
  }
  
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />
  }
  
  return <SupabaseLogin />
}

// Register page component
function RegisterPage() {
  const { isAuthenticated, loading } = useSupabaseAuth()
  
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
  
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />
  }
  
  return <SupabaseRegister />
}

export default App
