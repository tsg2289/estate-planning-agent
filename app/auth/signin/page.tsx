'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { Header } from '@/components/ui/header'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check for email confirmation status in URL params
  useEffect(() => {
    const confirmed = searchParams.get('confirmed')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (confirmed === 'true') {
      setConfirmationStatus('success')
      setConfirmationMessage('Your email has been verified! You can now sign in.')
      toast.success('Email verified successfully!')
    } else if (error) {
      setConfirmationStatus('error')
      if (error === 'confirmation_failed') {
        setConfirmationMessage(errorDescription || 'Email confirmation failed. Please try again or request a new confirmation link.')
      } else if (error === 'missing_code') {
        setConfirmationMessage('Invalid confirmation link. Please request a new one.')
      } else {
        setConfirmationMessage('An error occurred during confirmation.')
      }
      toast.error('Email confirmation failed')
    }
  }, [searchParams])

  // Save pending terms acceptance to database after login
  const savePendingTermsAcceptance = async (userId: string) => {
    try {
      const pendingAcceptance = localStorage.getItem('estate_planpro_terms_accepted')
      if (pendingAcceptance) {
        const { pendingAcceptance: isPending, termsAcceptedAt, privacyAcceptedAt } = JSON.parse(pendingAcceptance)
        
        if (isPending) {
          // Update the profile with acceptance timestamps
          await supabase
            .from('profiles')
            .update({
              terms_of_service_accepted_at: termsAcceptedAt,
              privacy_policy_accepted_at: privacyAcceptedAt,
              consent_given_at: termsAcceptedAt,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
          
          // Mark as no longer pending
          localStorage.setItem('estate_planpro_terms_accepted', JSON.stringify({
            userId,
            accepted: true,
            acceptedAt: termsAcceptedAt
          }))
        }
      }
    } catch (error) {
      console.warn('Could not save terms acceptance to database:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        toast.error(error.message)
      } else {
        // Save any pending terms acceptance
        if (data?.user?.id) {
          await savePendingTermsAcceptance(data.user.id)
        }
        
        toast.success('Welcome back!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header variant="minimal" />
      <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">EP</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                EstatePlan Pro
              </span>
            </Link>
          </div>

          <GlassCard className="p-8" variant="elevated">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your secure estate planning account</p>
            </div>

            {/* Email Confirmation Status Message */}
            {confirmationStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">{confirmationMessage}</p>
                </div>
              </motion.div>
            )}

            {confirmationStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{confirmationMessage}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <GlassInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={<EnvelopeIcon className="w-5 h-5" />}
                required
              />

              <div className="relative">
                <GlassInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={<LockClosedIcon className="w-5 h-5" />}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Sign In
              </GlassButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-primary-50/50 rounded-xl border border-primary-200/50">
              <p className="text-xs text-primary-700 text-center">
                🔒 Your connection is secured with bank-level encryption and SOC2 compliance
              </p>
            </div>
          </GlassCard>

          {/* Demo Account */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6"
          >
            <GlassCard className="p-4" variant="subtle">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Demo Account</p>
                <p className="text-xs text-gray-500">
                  Email: demo@estateplan.pro • Password: Demo123!
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}