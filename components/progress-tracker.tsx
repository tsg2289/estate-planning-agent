'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

export type DocumentStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_review'

export interface DocumentProgress {
  type: string
  title: string
  status: DocumentStatus
  lastModified?: Date
  completedAt?: Date
}

interface ProgressTrackerProps {
  documents: DocumentProgress[]
  className?: string
}

const statusConfig = {
  not_started: {
    icon: DocumentTextIcon,
    color: 'text-gray-400 dark:text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    label: 'Not Started'
  },
  in_progress: {
    icon: ClockIcon,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'In Progress'
  },
  completed: {
    icon: CheckCircleSolidIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    label: 'Completed'
  },
  needs_review: {
    icon: ExclamationCircleIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    label: 'Needs Review'
  }
}

export function ProgressTracker({ documents, className = '' }: ProgressTrackerProps) {
  const completedCount = documents.filter(d => d.status === 'completed').length
  const totalCount = documents.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <GlassCard className={`p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Estate Plan Progress
          </h3>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            {progressPercentage}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {completedCount} of {totalCount} documents completed
        </p>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {documents.map((doc, index) => {
          const config = statusConfig[doc.status]
          const StatusIcon = config.icon
          
          return (
            <motion.div
              key={doc.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-xl ${config.bgColor} transition-all duration-200`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon className={`w-6 h-6 ${config.color}`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{doc.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{config.label}</p>
                </div>
              </div>
              
              {doc.completedAt && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(doc.completedAt).toLocaleDateString()}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-3">
            <CheckCircleSolidIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">
                🎉 Congratulations!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your estate plan is complete. Consider reviewing annually.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </GlassCard>
  )
}

// Mini version for dashboard header
export function ProgressTrackerMini({ documents }: { documents: DocumentProgress[] }) {
  const completedCount = documents.filter(d => d.status === 'completed').length
  const totalCount = documents.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${progressPercentage * 1.256} 126`}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
          {progressPercentage}%
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">Progress</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{completedCount}/{totalCount} done</p>
      </div>
    </div>
  )
}
