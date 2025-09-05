import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const SupabaseAuthContext = createContext({})

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [configError, setConfigError] = useState(null)

  useEffect(() => {
    console.log('SupabaseAuthContext: useEffect running, isSupabaseConfigured:', isSupabaseConfigured)
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.log('SupabaseAuthContext: Supabase not configured, setting error and stopping loading')
      setConfigError('Supabase not configured. Please set up your Supabase credentials.')
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      console.log('Getting initial session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        console.log('Initial session found:', session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            await loadUserProfile(session.user.id)
          } catch (error) {
            console.error('Error loading profile in initial session:', error)
            setProfile(null)
          }
        }
      }
      console.log('Setting loading to false after initial session check')
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        try {
          await loadUserProfile(session.user.id)
        } catch (error) {
          console.error('Error loading profile in auth state change:', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      
      // Always set loading to false after auth state change
      console.log('Setting loading to false after auth state change')
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    console.log('Loading user profile for:', userId)
    try {
      // Try profiles table first, fallback to users table
      let profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile loading timeout')), 5000)
      )

      let { data, error } = await Promise.race([profilePromise, timeoutPromise])

      // If profiles table doesn't exist or has permission issues, try users table
      if (error && (error.code === '42501' || error.message.includes('permission denied'))) {
        console.log('Profiles table not accessible, trying users table...')
        profilePromise = supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        const result = await Promise.race([profilePromise, timeoutPromise])
        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Error loading profile:', error)
        // Create a basic profile from user data if available
        setProfile({
          id: userId,
          full_name: null,
          preferences: {}
        })
      } else {
        console.log('Profile loaded successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Create a basic profile from user data if available
      setProfile({
        id: userId,
        full_name: null,
        preferences: {}
      })
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    console.log('SupabaseAuthContext: signIn called with email:', email)
    try {
      setLoading(true)
      console.log('Calling supabase.auth.signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      console.log('Supabase signIn response:', { data, error })
      
      if (error) {
        console.error('Supabase signIn error:', error)
        throw error
      }

      console.log('Sign in successful, returning data')
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    } finally {
      console.log('Setting loading to false in signIn')
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      setUser(null)
      setSession(null)
      setProfile(null)
      
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user) {
      throw new Error('No user logged in')
    }

    try {
      setLoading(true)
      
      // Try profiles table first, fallback to users table
      let { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      // If profiles table doesn't exist or has permission issues, try users table
      if (error && (error.code === '42501' || error.message.includes('permission denied'))) {
        console.log('Profiles table not accessible, trying users table...')
        const result = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) {
        throw error
      }

      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = () => {
    return profile?.preferences?.role === 'admin' || profile?.preferences?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'super_admin'
  }

  const isAuthenticated = () => {
    return !!user && !!session
  }

  const value = {
    user,
    session,
    profile,
    loading,
    configError,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isAuthenticated,
    loadUserProfile
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export default SupabaseAuthContext
