import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SupabaseAuthProvider, useSupabaseAuth } from './contexts/SupabaseAuthContext'
import SupabaseLogin from './components/auth/SupabaseLogin'
import SupabaseRegister from './components/auth/SupabaseRegister'
import SupabaseProtectedRoute from './components/auth/SupabaseProtectedRoute'
import EstatePlanningApp from './components/EstatePlanningApp'
import LandingPage from './components/LandingPage'
import BlogPage from './components/blog/BlogPage'
import EmailSignup from './components/EmailSignup'
import './App.css'

// Main App component with Supabase authentication
function App() {
  return (
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
                  <AdminDashboard />
                </SupabaseProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </SupabaseAuthProvider>
  )
}

// Login page component
function LoginPage() {
  const { isAuthenticated } = useSupabaseAuth()
  
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />
  }
  
  return <SupabaseLogin onSuccess={() => window.location.href = '/app'} />
}

// Register page component
function RegisterPage() {
  const { isAuthenticated } = useSupabaseAuth()
  
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />
  }
  
  return <SupabaseRegister onSuccess={() => window.location.href = '/app'} />
}

// Admin dashboard component (placeholder)
function AdminDashboard() {
  const { user, profile } = useSupabaseAuth()
  
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {profile?.full_name || user?.email}!</p>
      <p>This is a protected admin area.</p>
    </div>
  )
}

export default App
