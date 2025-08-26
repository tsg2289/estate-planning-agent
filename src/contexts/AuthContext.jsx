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
      if (token) {
        try {
                const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.AUTH.VERIFY), {
        headers: API_CONFIG.getAuthHeaders(token)
      })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token')
            setToken(null)
          }
        } catch (error) {
          console.error('Error verifying token:', error)
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [token])

  const login = async (email, password) => {
    try {
      console.log('🔐 Starting login for:', email)
      
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.AUTH.LOGIN), {
        method: 'POST',
        headers: API_CONFIG.getDefaultHeaders(),
        body: JSON.stringify({ email, password })
      })

      console.log('📡 Login response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Login failed:', error)
        throw new Error(error.message || 'Login failed')
      }

      const responseData = await response.json()
      console.log('✅ Login response:', responseData)
      
      // Check if 2FA is required
      if (responseData.requires2FA) {
        console.log('🔐 2FA required, returning temp token')
        return { 
          success: true, 
          requires2FA: true, 
          tempToken: responseData.tempToken,
          user: responseData.user
        }
      }
      
      const { user: userData, token: newToken } = responseData
      
      if (userData && newToken) {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        console.log('🎉 User logged in successfully!')
        return { success: true }
      } else {
        console.error('❌ Missing user data or token in login response')
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password, name) => {
    try {
      console.log('🚀 Starting registration for:', email)
      
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.AUTH.REGISTER), {
        method: 'POST',
        headers: API_CONFIG.getDefaultHeaders(),
        body: JSON.stringify({ email, password, name })
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Registration failed:', error)
        throw new Error(error.message || 'Registration failed')
      }

      const responseData = await response.json()
      console.log('✅ Registration response:', responseData)
      
      // Check if 2FA is required
      if (responseData.requires2FA) {
        console.log('🔐 2FA required for registration, returning temp token')
        return { 
          success: true, 
          requires2FA: true, 
          tempToken: responseData.tempToken,
          user: responseData.user
        }
      }
      
      const { user: userData, token: newToken } = responseData
      
      if (userData && newToken) {
        console.log('🔐 Setting user data and token...')
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        console.log('🎉 User registered and logged in successfully!')
        console.log('👤 Current user state:', userData)
        console.log('🔑 Current token state:', newToken)
        return { success: true }
      } else {
        console.error('❌ Missing user data or token in response')
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (error) {
      console.error('❌ Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const verify2FA = async (email, verificationCode, tempToken) => {
    try {
      console.log('🔐 Starting 2FA verification for:', email)
      
      const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.AUTH.VERIFY_2FA), {
        method: 'POST',
        headers: API_CONFIG.getDefaultHeaders(),
        body: JSON.stringify({ email, verificationCode, tempToken })
      })

      console.log('📡 2FA verification response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ 2FA verification failed:', error)
        throw new Error(error.message || '2FA verification failed')
      }

      const responseData = await response.json()
      console.log('✅ 2FA verification response:', responseData)
      
      const { user: userData, token: newToken } = responseData
      
      if (userData && newToken) {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
        console.log('🎉 2FA verification successful!')
        return { success: true }
      } else {
        console.error('❌ Missing user data or token in 2FA response')
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (error) {
      console.error('❌ 2FA verification error:', error)
      return { success: false, error: error.message }
    }
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
