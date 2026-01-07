'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'subtle'
  hover?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true 
}: GlassCardProps) {
  const variants = {
    default: 'bg-glass-200 backdrop-blur-xl border border-white/20',
    elevated: 'bg-glass-100 backdrop-blur-2xl border border-white/30 shadow-2xl',
    subtle: 'bg-glass-300 backdrop-blur-lg border border-white/10',
  }

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        hover && 'hover:bg-glass-100 hover:scale-[1.02] hover:shadow-xl',
        className
      )}
    >
      {children}
    </div>
  )
}