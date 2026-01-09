'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { Header } from '@/components/ui/header'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Terms and Privacy acceptance state
  const [termsRead, setTermsRead] = useState(false)
  const [privacyRead, setPrivacyRead] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  
  const { signUp } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    strength = Object.values(checks).filter(Boolean).length
    return { strength, checks }
  }

  const { strength, checks } = getPasswordStrength(formData.password)

  // Check if user can submit
  const canSubmit = termsRead && privacyRead && termsAccepted && privacyAccepted && strength >= 4

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!termsAccepted || !privacyAccepted) {
      toast.error('Please read and accept both the Terms of Service and Privacy Policy')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (strength < 4) {
      toast.error('Please choose a stronger password')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.fullName)
      
      if (error) {
        toast.error(error.message)
      } else {
        // Store terms acceptance in localStorage for immediate use
        // (Database update happens after email verification when profile is created)
        const now = new Date().toISOString()
        localStorage.setItem('estate_planpro_terms_accepted', JSON.stringify({
          pendingAcceptance: true,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
          email: formData.email
        }))
        
        toast.success('Account created! Please check your email to verify your account.')
        router.push('/auth/signin')
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Start your secure estate planning journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <GlassInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={<UserIcon className="w-5 h-5" />}
                required
              />

              <GlassInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={<EnvelopeIcon className="w-5 h-5" />}
                required
              />

              <div className="space-y-2">
                <div className="relative">
                  <GlassInput
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= strength
                              ? strength <= 2
                                ? 'bg-red-500'
                                : strength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(checks).map(([key, passed]) => (
                        <div key={key} className="flex items-center space-x-1">
                          {passed ? (
                            <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircleIcon className="w-3 h-3 text-gray-300" />
                          )}
                          <span className={passed ? 'text-green-600' : 'text-gray-400'}>
                            {key === 'length' && '8+ chars'}
                            {key === 'uppercase' && 'Uppercase'}
                            {key === 'lowercase' && 'Lowercase'}
                            {key === 'numbers' && 'Numbers'}
                            {key === 'special' && 'Special chars'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <GlassInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  icon={<LockClosedIcon className="w-5 h-5" />}
                  error={
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'Passwords do not match'
                      : undefined
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Terms of Service and Privacy Policy Acceptance */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-700 text-center">
                  Please read and accept our legal agreements
                </p>
                
                {/* Terms of Service */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="w-5 h-5 text-primary-600" />
                      <span className="text-sm font-medium text-gray-900">Terms of Service</span>
                    </div>
                    <Link
                      href="/terms"
                      target="_blank"
                      onClick={() => setTermsRead(true)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      Read Terms →
                    </Link>
                  </div>
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={!termsRead}
                      className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className={`text-xs ${!termsRead ? 'text-gray-400' : 'text-gray-600'}`}>
                      I have read and agree to the Terms of Service
                      {!termsRead && (
                        <span className="text-amber-600 ml-1">(read first)</span>
                      )}
                    </span>
                  </label>
                  {termsRead && (
                    <div className="flex items-center mt-1 text-xs text-green-600">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Viewed
                    </div>
                  )}
                </div>

                {/* Privacy Policy */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
                      <span className="text-sm font-medium text-gray-900">Privacy Policy</span>
                    </div>
                    <Link
                      href="/privacy"
                      target="_blank"
                      onClick={() => setPrivacyRead(true)}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      Read Policy →
                    </Link>
                  </div>
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      disabled={!privacyRead}
                      className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className={`text-xs ${!privacyRead ? 'text-gray-400' : 'text-gray-600'}`}>
                      I have read and agree to the Privacy Policy
                      {!privacyRead && (
                        <span className="text-amber-600 ml-1">(read first)</span>
                      )}
                    </span>
                  </label>
                  {privacyRead && (
                    <div className="flex items-center mt-1 text-xs text-green-600">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Viewed
                    </div>
                  )}
                </div>

                {/* Important Notice */}
                <p className="text-xs text-amber-700 text-center bg-amber-50 p-2 rounded-lg">
                  <strong>Note:</strong> Estate PlanPro provides document templates, not legal advice. 
                  Consult a licensed attorney for your specific situation.
                </p>
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={!canSubmit}
              >
                {canSubmit ? 'Create Account' : 'Please Complete All Steps Above'}
              </GlassButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-primary-50/50 rounded-xl border border-primary-200/50">
              <p className="text-xs text-primary-700 text-center">
                🔒 Your data is protected with AES-256 encryption and SOC2 compliance
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
      </div>
    </div>
  )
}