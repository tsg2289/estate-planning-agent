'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { TermsAcknowledgmentModal } from '@/components/modals/terms-acknowledgment-modal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface TermsGateProps {
  children: React.ReactNode
}

// Key for storing terms acceptance in localStorage as fallback
const TERMS_ACCEPTED_KEY = 'estate_planpro_terms_accepted'

export function TermsGate({ children }: TermsGateProps) {
  const { user, signOut, loading: authLoading } = useAuth()
  const [needsTermsAcceptance, setNeedsTermsAcceptance] = useState(false)
  const [checkingTerms, setCheckingTerms] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkTermsAcceptance = async () => {
      if (!user) {
        setCheckingTerms(false)
        return
      }

      // First check localStorage for client-side acceptance (fallback)
      const localAcceptance = localStorage.getItem(TERMS_ACCEPTED_KEY)
      if (localAcceptance) {
        const parsed = JSON.parse(localAcceptance)
        if (parsed.userId === user.id && parsed.accepted) {
          setNeedsTermsAcceptance(false)
          setCheckingTerms(false)
          return
        }
      }

      try {
        // Check if user has accepted both terms and privacy policy
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('terms_of_service_accepted_at, privacy_policy_accepted_at, consent_given_at')
          .eq('id', user.id)
          .single()

        if (error) {
          // Log the full error for debugging
          console.warn('Terms check - profile query failed:', error.message || error.code || 'Unknown error')
          
          // If the column doesn't exist or profile not found, require acceptance
          // But don't block if it's just a missing column - check localStorage
          if (error.code === 'PGRST116' || error.message?.includes('column')) {
            // Column might not exist yet, check localStorage
            setNeedsTermsAcceptance(!localAcceptance)
          } else {
            setNeedsTermsAcceptance(true)
          }
        } else {
          // Check if terms have been accepted
          // Also accept if consent_given_at is set (legacy acceptance)
          const hasAcceptedTerms = 
            profileData?.terms_of_service_accepted_at || 
            profileData?.consent_given_at
          const hasAcceptedPrivacy = 
            profileData?.privacy_policy_accepted_at || 
            profileData?.consent_given_at
          
          const needsAcceptance = !hasAcceptedTerms || !hasAcceptedPrivacy
          setNeedsTermsAcceptance(needsAcceptance)
        }
      } catch (error) {
        console.warn('Error checking terms:', error)
        // On error, check localStorage as fallback
        setNeedsTermsAcceptance(!localAcceptance)
      } finally {
        setCheckingTerms(false)
      }
    }

    if (!authLoading) {
      checkTermsAcceptance()
    }
  }, [user, authLoading, supabase])

  const handleAccept = () => {
    // Store acceptance in localStorage as fallback
    if (user) {
      localStorage.setItem(TERMS_ACCEPTED_KEY, JSON.stringify({
        userId: user.id,
        accepted: true,
        acceptedAt: new Date().toISOString()
      }))
    }
    setNeedsTermsAcceptance(false)
  }

  const handleDecline = async () => {
    await signOut()
    router.push('/auth/signin')
  }

  // Show loading state while checking auth and terms
  if (authLoading || checkingTerms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-200 rounded-xl mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // If user is logged in but hasn't accepted terms, show modal
  if (user && needsTermsAcceptance) {
    return (
      <>
        {children}
        <TermsAcknowledgmentModal 
          onAccept={handleAccept} 
          onDecline={handleDecline} 
        />
      </>
    )
  }

  return <>{children}</>
}
