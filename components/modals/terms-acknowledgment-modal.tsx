'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { 
  ShieldCheckIcon, 
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface TermsAcknowledgmentModalProps {
  onAccept: () => void
  onDecline: () => void
}

export function TermsAcknowledgmentModal({ onAccept, onDecline }: TermsAcknowledgmentModalProps) {
  const [termsRead, setTermsRead] = useState(false)
  const [privacyRead, setPrivacyRead] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const canAccept = termsRead && privacyRead && termsAccepted && privacyAccepted

  const handleAccept = async () => {
    if (!canAccept || !user) return
    
    setLoading(true)
    try {
      const now = new Date().toISOString()
      
      // Try to update the profile with acceptance timestamps
      // This may fail if the column doesn't exist yet, but that's okay
      const { error } = await supabase
        .from('profiles')
        .update({
          terms_of_service_accepted_at: now,
          privacy_policy_accepted_at: now,
          consent_given_at: now,
          updated_at: now
        })
        .eq('id', user.id)
      
      if (error) {
        // Log warning but don't block - the terms-gate will use localStorage as fallback
        console.warn('Could not save terms acceptance to database:', error.message || error.code || 'Unknown error')
        console.info('Terms acceptance will be stored locally instead.')
      }
      
      // Always proceed - the TermsGate component handles localStorage fallback
      onAccept()
    } catch (error) {
      console.warn('Failed to save acceptance to database:', error)
      // Allow user to proceed - localStorage fallback in TermsGate will handle it
      onAccept()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <GlassCard className="p-8" variant="elevated">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Estate PlanPro
              </h2>
              <p className="text-gray-600">
                Before you continue, please review and accept our Terms of Service and Privacy Policy.
              </p>
            </div>

            {/* Terms Section */}
            <div className="space-y-6 mb-8">
              {/* Terms of Service */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Terms of Service</h3>
                  </div>
                  <Link
                    href="/terms"
                    target="_blank"
                    onClick={() => setTermsRead(true)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Read Terms →
                  </Link>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Our Terms of Service outline the rules and guidelines for using Estate PlanPro, 
                  including important disclaimers about legal advice.
                </p>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={!termsRead}
                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                  />
                  <span className={`text-sm ${!termsRead ? 'text-gray-400' : 'text-gray-700'}`}>
                    I have read and agree to the Terms of Service
                    {!termsRead && (
                      <span className="text-xs text-amber-600 ml-2">
                        (Please read the terms first)
                      </span>
                    )}
                  </span>
                </label>
                {termsRead && (
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Terms viewed
                  </div>
                )}
              </div>

              {/* Privacy Policy */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Privacy Policy</h3>
                  </div>
                  <Link
                    href="/privacy"
                    target="_blank"
                    onClick={() => setPrivacyRead(true)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Read Policy →
                  </Link>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Our Privacy Policy explains how we collect, use, and protect your personal information, 
                  including sensitive estate planning data.
                </p>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    disabled={!privacyRead}
                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                  />
                  <span className={`text-sm ${!privacyRead ? 'text-gray-400' : 'text-gray-700'}`}>
                    I have read and agree to the Privacy Policy
                    {!privacyRead && (
                      <span className="text-xs text-amber-600 ml-2">
                        (Please read the policy first)
                      </span>
                    )}
                  </span>
                </label>
                {privacyRead && (
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Policy viewed
                  </div>
                )}
              </div>
            </div>

            {/* Important Notice */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-8">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Estate PlanPro provides document templates and guidance but 
                does NOT provide legal advice. We strongly recommend consulting with a licensed attorney 
                before executing any estate planning documents.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <GlassButton
                onClick={onDecline}
                variant="secondary"
                className="flex-1"
              >
                Decline &amp; Sign Out
              </GlassButton>
              <GlassButton
                onClick={handleAccept}
                variant="primary"
                className="flex-1"
                disabled={!canAccept}
                loading={loading}
              >
                {canAccept ? 'Accept & Continue' : 'Please Read & Accept Both'}
              </GlassButton>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By clicking &quot;Accept &amp; Continue&quot;, you confirm that you are at least 18 years old 
              and legally capable of entering into binding agreements.
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
