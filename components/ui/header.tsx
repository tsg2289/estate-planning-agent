'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { GlassButton } from '@/components/ui/glass-button'
import { ThemeToggleSimple } from '@/components/ui/theme-toggle'
import { 
  ArrowLeftIcon, 
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface HeaderProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  variant?: 'landing' | 'dashboard' | 'minimal'
  children?: React.ReactNode
}

export function Header({ 
  showBackButton = false, 
  backHref = '/', 
  backLabel = 'Back',
  variant = 'landing',
  children 
}: HeaderProps) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setLoggingOut(true)
    try {
      await signOut()
      // Clear any local storage related to terms acceptance
      localStorage.removeItem('estate_planpro_terms_accepted')
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  // Landing page style header
  if (variant === 'landing') {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                EstatePlan Pro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              ) : user ? (
                <>
                  <Link href="/dashboard">
                    <button className="px-4 py-2 text-gray-700 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-xl">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 backdrop-blur-xl"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    {loggingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <button className="px-4 py-2 text-gray-700 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-xl">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-pink-500/80 text-white rounded-xl hover:scale-105 transition-all duration-300 backdrop-blur-xl shadow-lg">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:bg-white/20 rounded-xl transition-all"
            >
              {showMobileMenu ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-white/20">
              {loading ? (
                <div className="px-4 py-2 text-gray-500">Loading...</div>
              ) : user ? (
                <div className="space-y-2">
                  <Link href="/dashboard" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-white/20 rounded-xl transition-all">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false)
                      handleSignOut()
                    }}
                    disabled={loggingOut}
                    className="w-full px-4 py-2 flex items-center gap-2 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    {loggingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/signin" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-white/20 rounded-xl transition-all">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setShowMobileMenu(false)}>
                    <button className="w-full px-4 py-2 text-left bg-gradient-to-r from-blue-500/80 to-pink-500/80 text-white rounded-xl transition-all">
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Dashboard style header
  if (variant === 'dashboard') {
    return (
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link 
                  href={backHref} 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{backLabel}</span>
                </Link>
              )}
              {!showBackButton && (
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">EP</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hidden sm:inline">
                    EstatePlan Pro
                  </span>
                </Link>
              )}
            </div>
            
            {/* Center - Optional children (for progress tracker, etc.) */}
            {children && (
              <div className="hidden lg:flex items-center">
                {children}
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggleSimple />
              
              {user && (
                <>
                  <Link href="/dashboard" className="hidden sm:block">
                    <GlassButton variant="ghost" size="sm" className="flex items-center gap-2">
                      <HomeIcon className="w-4 h-4" />
                      <span className="hidden md:inline">Dashboard</span>
                    </GlassButton>
                  </Link>
                  
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {loggingOut ? 'Signing out...' : 'Sign Out'}
                    </span>
                  </GlassButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Minimal header (for auth pages, etc.)
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-2xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              EstatePlan Pro
            </span>
          </Link>
          
          {user && (
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
