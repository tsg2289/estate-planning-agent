'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { DocumentForm } from '@/components/document-form'
import { ProgressTracker, ProgressTrackerMini, DocumentProgress } from '@/components/progress-tracker'
import { DocumentHistory, saveDocumentToHistory, DocumentRecord } from '@/components/document-history'
import { AIChatAssistant } from '@/components/ai-chat'
import { NotificationCenter, generateDefaultReminders, Notification } from '@/components/notifications'
import { ThemeToggleSimple } from '@/components/ui/theme-toggle'
import { OnboardingWizard, RecommendationsDisplay } from '@/components/onboarding-wizard'
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  HeartIcon,
  HomeIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export type DocumentType = 'will' | 'trust' | 'poa' | 'ahcd'

interface DocumentTypeInfo {
  id: DocumentType
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
}

const documentTypes: DocumentTypeInfo[] = [
  {
    id: 'will',
    title: 'Last Will & Testament',
    description: 'Distribute your assets and name guardians for minor children',
    icon: DocumentTextIcon,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'trust',
    title: 'Living Trust',
    description: 'Avoid probate and manage assets during your lifetime',
    icon: ShieldCheckIcon,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'poa',
    title: 'Power of Attorney',
    description: 'Authorize someone to handle your financial affairs',
    icon: ScaleIcon,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'ahcd',
    title: 'Advance Healthcare Directive',
    description: 'Document your healthcare wishes and appoint a healthcare agent',
    icon: HeartIcon,
    color: 'from-pink-500 to-pink-600'
  }
]

export default function DashboardPage() {
  const [activeDocument, setActiveDocument] = useState<DocumentType | null>(null)
  const [completedDocuments, setCompletedDocuments] = useState<Set<DocumentType>>(new Set())
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [recommendations, setRecommendations] = useState<string[] | null>(null)
  const [activeTab, setActiveTab] = useState<'documents' | 'history' | 'settings'>('documents')

  // Load saved state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if user has completed onboarding
      const hasOnboarded = localStorage.getItem('onboarding_complete')
      if (!hasOnboarded) {
        setShowOnboarding(true)
      }

      // Load completed documents
      const savedCompleted = localStorage.getItem('completed_documents')
      if (savedCompleted) {
        setCompletedDocuments(new Set(JSON.parse(savedCompleted)))
      }

      // Load notifications
      const savedNotifications = localStorage.getItem('notifications')
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      } else {
        setNotifications(generateDefaultReminders())
      }
    }
  }, [])

  // Save completed documents
  useEffect(() => {
    if (typeof window !== 'undefined' && completedDocuments.size > 0) {
      localStorage.setItem('completed_documents', JSON.stringify(Array.from(completedDocuments)))
    }
  }, [completedDocuments])

  const handleDocumentComplete = (documentType: DocumentType) => {
    setCompletedDocuments(prev => new Set(Array.from(prev).concat(documentType)))
    setActiveDocument(null)
    
    // Save to history
    saveDocumentToHistory({
      type: documentType,
      title: documentTypes.find(d => d.id === documentType)?.title || documentType,
      formData: {} // Form data would be passed from DocumentForm
    })
  }

  const handleBackToDashboard = () => {
    setActiveDocument(null)
  }

  const handleOnboardingComplete = (recs: string[]) => {
    setRecommendations(recs)
    setShowOnboarding(false)
    localStorage.setItem('onboarding_complete', 'true')
  }

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Get progress data
  const progressData: DocumentProgress[] = documentTypes.map(doc => ({
    type: doc.id,
    title: doc.title,
    status: completedDocuments.has(doc.id) ? 'completed' : 'not_started',
    completedAt: completedDocuments.has(doc.id) ? new Date() : undefined
  }))

  // Show onboarding wizard
  if (showOnboarding) {
    return (
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        onSkip={() => {
          setShowOnboarding(false)
          localStorage.setItem('onboarding_complete', 'true')
        }}
      />
    )
  }

  // Show document form
  if (activeDocument) {
    return (
      <DocumentForm
        documentType={activeDocument}
        onComplete={handleDocumentComplete}
        onBack={handleBackToDashboard}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <ProgressTrackerMini documents={progressData} />
              <NotificationCenter
                notifications={notifications}
                onDismiss={handleDismissNotification}
                onMarkAllRead={handleMarkAllRead}
              />
              <ThemeToggleSimple />
              <Link href="/">
                <GlassButton variant="ghost" size="sm" className="flex items-center gap-2">
                  <HomeIcon className="w-4 h-4" />
                  Home
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Estate Planning Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Create professional estate planning documents with our secure platform
          </p>
        </motion.div>

        {/* Show recommendations if available */}
        {recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <RecommendationsDisplay
              recommendations={recommendations}
              onSelectDocument={(type) => setActiveDocument(type as DocumentType)}
              onDismiss={() => setRecommendations(null)}
            />
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-1 bg-white/50 dark:bg-gray-800/50 rounded-xl w-fit">
          {[
            { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
            { id: 'history', label: 'History', icon: ChartBarIcon },
            { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {documentTypes.map((docType, index) => {
                  const Icon = docType.icon
                  const isCompleted = completedDocuments.has(docType.id)
                  
                  return (
                    <motion.div
                      key={docType.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard className="p-6 h-full hover:shadow-xl transition-all duration-300 group cursor-pointer" hover>
                        <div className="flex flex-col h-full">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${docType.color} text-white group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            {isCompleted && (
                              <span className="px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full">
                                ✓ Done
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {docType.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
                            {docType.description}
                          </p>
                          
                          <GlassButton
                            onClick={() => setActiveDocument(docType.id)}
                            variant={isCompleted ? "secondary" : "primary"}
                            className="w-full"
                          >
                            {isCompleted ? 'Edit' : 'Create'}
                          </GlassButton>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <DocumentHistory
                onLoadDocument={(doc: DocumentRecord) => setActiveDocument(doc.type)}
              />
            )}

            {activeTab === 'settings' && (
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your email preferences and notification settings.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Data Export
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Download all your documents and data.
                    </p>
                    <GlassButton variant="secondary" size="sm">
                      Export Data
                    </GlassButton>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      Delete Account
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      Permanently delete your account and all associated data.
                    </p>
                    <GlassButton variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                      Delete Account
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Column - Progress Tracker */}
          <div className="space-y-6">
            <ProgressTracker documents={progressData} />
            
            {/* Quick Actions */}
            {completedDocuments.size > 0 && (
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <GlassButton variant="primary" className="w-full justify-center">
                    📄 Download All
                  </GlassButton>
                  <GlassButton variant="secondary" className="w-full justify-center">
                    📧 Share with Attorney
                  </GlassButton>
                  <GlassButton variant="secondary" className="w-full justify-center">
                    🔄 Review Plan
                  </GlassButton>
                </div>
              </GlassCard>
            )}

            {/* AI Assistant Promo */}
            <GlassCard className="p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  AI Assistant
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get instant answers to your estate planning questions.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Click the chat bubble in the bottom-right corner to start.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Important Disclaimer
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              This application is provided for informational and educational purposes only. It does not constitute legal advice, 
              nor does it create an attorney–client relationship. Estate planning laws vary by state, and each individual's 
              circumstances are unique. Any documents generated through this application should be carefully reviewed by a 
              licensed attorney in your jurisdiction before being signed or relied upon.
            </p>
          </div>
        </motion.div>
      </div>

      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  )
}
