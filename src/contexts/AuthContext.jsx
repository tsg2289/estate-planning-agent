import { createContext, useContext, useState, useEffect } from 'react'
import API_CONFIG from '../config/api.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const initializeAuth = async () => {
      // Temporarily disable API verification for testing
      // TODO: Re-enable when backend is working
      if (token) {
        // For now, just set loading to false without API call
        console.log('🔧 Token verification temporarily disabled for testing')
      }
      setLoading(false)
    }

    initializeAuth()
  }, [token])

  const login = async (email, password) => {
    // Temporarily disable API login for testing
    // TODO: Re-enable when backend is working
    console.log('🔧 Login temporarily disabled for testing')
    
    // Mock successful login for testing
    const mockUser = { email, name: email.split('@')[0], id: Date.now().toString() }
    const mockToken = 'mock-token-' + Date.now()
    
    localStorage.setItem('token', mockToken)
    setToken(mockToken)
    setUser(mockUser)
    
    return { success: true }
  }

  const register = async (email, password, name) => {
    // Temporarily disable API registration for testing
    // TODO: Re-enable when backend is working
    console.log('🔧 Registration temporarily disabled for testing')
    
    // Mock successful registration for testing
    const mockUser = { email, name, id: Date.now().toString() }
    const mockToken = 'mock-token-' + Date.now()
    
    localStorage.setItem('token', mockToken)
    setToken(mockToken)
    setUser(mockUser)
    
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const verify2FA = async (email, verificationCode, tempToken) => {
    // Temporarily disable 2FA verification for testing
    // TODO: Re-enable when backend is working
    console.log('🔧 2FA verification temporarily disabled for testing')
    
    // Mock successful 2FA verification for testing
    const mockUser = { email, name: email.split('@')[0], id: Date.now().toString() }
    const mockToken = 'mock-token-' + Date.now()
    
    localStorage.setItem('token', mockToken)
    setToken(mockToken)
    setUser(mockUser)
    
    return { success: true }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    verify2FA
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
