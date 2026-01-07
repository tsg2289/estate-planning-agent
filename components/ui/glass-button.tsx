'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-primary-500/80 to-secondary-500/80 text-white hover:from-primary-600/90 hover:to-secondary-600/90 shadow-lg hover:shadow-primary-500/25',
      secondary: 'bg-glass-200 text-gray-900 hover:bg-glass-100 border border-white/20 shadow-lg',
      ghost: 'bg-transparent text-gray-700 hover:bg-glass-200 border border-transparent hover:border-white/20',
      danger: 'bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white hover:from-red-600/90 hover:to-pink-600/90 shadow-lg hover:shadow-red-500/25',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        className={cn(
          'rounded-xl font-medium backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
          {children}
        </span>
      </button>
    )
  }
)

GlassButton.displayName = 'GlassButton'
export { GlassButton }