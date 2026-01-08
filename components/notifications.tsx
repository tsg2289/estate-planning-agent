'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { 
  BellIcon, 
  XMarkIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export type NotificationType = 'info' | 'warning' | 'success' | 'reminder'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

const notificationConfig = {
  info: {
    icon: InformationCircleIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  success: {
    icon: CheckCircleIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  reminder: {
    icon: CalendarIcon,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
}

interface NotificationCenterProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
  onMarkAllRead: () => void
}

export function NotificationCenter({ 
  notifications, 
  onDismiss, 
  onMarkAllRead 
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 z-50"
            >
              <GlassCard className="overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs text-primary-500 hover:text-primary-600"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => {
                        const config = notificationConfig[notification.type]
                        const Icon = config.icon

                        return (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                              !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {notification.title}
                                  </p>
                                  <button
                                    onClick={() => onDismiss(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-400">
                                    {formatTimeAgo(notification.createdAt)}
                                  </span>
                                  {notification.actionUrl && (
                                    <a
                                      href={notification.actionUrl}
                                      className="text-xs text-primary-500 hover:text-primary-600"
                                    >
                                      {notification.actionLabel || 'View'}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Reminder settings component
export function ReminderSettings() {
  const [annualReview, setAnnualReview] = useState(true)
  const [lifeEvents, setLifeEvents] = useState(true)
  const [documentExpiry, setDocumentExpiry] = useState(true)

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reminder_settings', JSON.stringify({
        annualReview,
        lifeEvents,
        documentExpiry
      }))
    }
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <ClockIcon className="w-5 h-5" />
        Reminder Settings
      </h3>

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Annual Review Reminder</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Remind me to review my estate plan each year
            </p>
          </div>
          <Toggle checked={annualReview} onChange={setAnnualReview} />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Life Event Prompts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Suggest updates after major life changes
            </p>
          </div>
          <Toggle checked={lifeEvents} onChange={setLifeEvents} />
        </label>

        <label className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Document Expiry Alerts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alert when documents may need updating
            </p>
          </div>
          <Toggle checked={documentExpiry} onChange={setDocumentExpiry} />
        </label>
      </div>

      <div className="mt-6">
        <GlassButton onClick={handleSave} variant="primary" size="sm">
          Save Settings
        </GlassButton>
      </div>
    </GlassCard>
  )
}

// Toggle component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        animate={{ left: checked ? '1.5rem' : '0.25rem' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

// Helper function
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// Generate default reminders
export function generateDefaultReminders(): Notification[] {
  const now = new Date()
  
  return [
    {
      id: '1',
      type: 'reminder',
      title: 'Annual Review Due',
      message: 'It\'s been a year since you last reviewed your estate plan. Consider checking if any updates are needed.',
      createdAt: now,
      read: false,
      actionUrl: '/dashboard',
      actionLabel: 'Review Now'
    },
    {
      id: '2',
      type: 'info',
      title: 'Complete Your Plan',
      message: 'You haven\'t created all recommended documents yet. A complete estate plan includes a Will, Trust, POA, and Healthcare Directive.',
      createdAt: new Date(now.getTime() - 86400000),
      read: false,
      actionUrl: '/dashboard',
      actionLabel: 'View Documents'
    },
    {
      id: '3',
      type: 'success',
      title: 'Welcome to EstatePlan Pro',
      message: 'Thank you for choosing us for your estate planning needs. We\'re here to help protect your legacy.',
      createdAt: new Date(now.getTime() - 172800000),
      read: true
    }
  ]
}
