'use client'

import { useTheme } from '@/components/providers/theme-provider'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
      <ThemeButton 
        active={theme === 'light'} 
        onClick={() => setTheme('light')}
        title="Light mode"
      >
        <SunIcon className="w-4 h-4" />
      </ThemeButton>
      <ThemeButton 
        active={theme === 'system'} 
        onClick={() => setTheme('system')}
        title="System preference"
      >
        <ComputerDesktopIcon className="w-4 h-4" />
      </ThemeButton>
      <ThemeButton 
        active={theme === 'dark'} 
        onClick={() => setTheme('dark')}
        title="Dark mode"
      >
        <MoonIcon className="w-4 h-4" />
      </ThemeButton>
    </div>
  )
}

function ThemeButton({ 
  children, 
  active, 
  onClick, 
  title 
}: { 
  children: React.ReactNode
  active: boolean
  onClick: () => void
  title: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative p-2 rounded-full transition-colors ${
        active 
          ? 'text-primary-600 dark:text-primary-400' 
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
      }`}
    >
      {active && (
        <motion.div
          layoutId="theme-toggle-bg"
          className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-sm"
          transition={{ type: 'spring', duration: 0.3 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// Simple icon toggle version
export function ThemeToggleSimple() {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: resolvedTheme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {resolvedTheme === 'dark' ? (
          <MoonIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <SunIcon className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>
    </button>
  )
}
