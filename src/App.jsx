import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthPage from './components/auth/AuthPage'
import EstatePlanningApp from './components/EstatePlanningApp'
import LandingPage from './components/LandingPage'
import AdminPage from './components/admin/AdminPage'
import BlogPage from './components/blog/BlogPage'
import './styles.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <EstatePlanningApp />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
