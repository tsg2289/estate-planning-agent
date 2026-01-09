'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user state
    const getInitialUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          // Create a minimal profile for demo purposes
          setProfile({
            id: user.id,
            email: user.email || '',
            full_name: user.email?.split('@')[0] || 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            avatar_url: null,
            consent_given_at: null,
            data_retention_until: null,
            email_verified: null,
            is_active: null,
            last_login: null,
            organization_id: null,
            preferences: null,
            privacy_policy_accepted_at: null,
            terms_of_service_accepted_at: null,
            two_factor_enabled: null,
          })
        }
      } catch (error) {
        console.warn('Auth initialization error:', error)
        // If there's a JSON parsing error or any other error, just set user to null
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Listen for auth changes
    let subscription: any
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          try {
            setUser(session?.user ?? null)
            
            if (session?.user) {
              // Create a minimal profile for demo purposes
              setProfile({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.email?.split('@')[0] || 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                avatar_url: null,
                consent_given_at: null,
                data_retention_until: null,
                email_verified: null,
                is_active: null,
                last_login: null,
                organization_id: null,
                preferences: null,
                privacy_policy_accepted_at: null,
                terms_of_service_accepted_at: null,
                two_factor_enabled: null,
              })
            } else {
              setProfile(null)
            }
            
            setLoading(false)
          } catch (error) {
            console.warn('Auth state change error:', error)
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
        }
      )
      subscription = data.subscription
    } catch (error) {
      console.warn('Auth subscription error:', error)
      setLoading(false)
    }

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe()
      }
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      console.warn('Sign in error:', error)
      return { data: null, error: { message: 'Failed to sign in. Please try again.' } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { data, error }
    } catch (error) {
      console.warn('Sign up error:', error)
      return { data: null, error: { message: 'Failed to sign up. Please try again.' } }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Sign out error:', error)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: { message: 'No user logged in' } }
    
    // For demo purposes, just update local state
    if (profile) {
      setProfile({ ...profile, ...updates })
    }
    
    return { data: profile, error: null }
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, profile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}