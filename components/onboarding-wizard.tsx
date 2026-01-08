'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  HomeIcon,
  UserGroupIcon,
  HeartIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface OnboardingWizardProps {
  onComplete: (recommendations: string[]) => void
  onSkip: () => void
}

interface Question {
  id: string
  question: string
  description: string
  icon: React.ElementType
  options: {
    value: string
    label: string
    description?: string
  }[]
  multiSelect?: boolean
}

const questions: Question[] = [
  {
    id: 'marital_status',
    question: 'What is your marital status?',
    description: 'This helps us understand your family situation.',
    icon: HeartIcon,
    options: [
      { value: 'single', label: 'Single', description: 'Never married' },
      { value: 'married', label: 'Married', description: 'Currently married' },
      { value: 'divorced', label: 'Divorced', description: 'Previously married' },
      { value: 'widowed', label: 'Widowed', description: 'Spouse has passed away' },
    ]
  },
  {
    id: 'children',
    question: 'Do you have any children?',
    description: 'This affects guardianship and inheritance planning.',
    icon: UserGroupIcon,
    options: [
      { value: 'none', label: 'No children' },
      { value: 'minor', label: 'Yes, minor children', description: 'Under 18 years old' },
      { value: 'adult', label: 'Yes, adult children', description: '18 years or older' },
      { value: 'both', label: 'Both minor and adult', description: 'Mix of ages' },
    ]
  },
  {
    id: 'assets',
    question: 'What types of assets do you have?',
    description: 'Select all that apply.',
    icon: BanknotesIcon,
    multiSelect: true,
    options: [
      { value: 'home', label: 'Real estate / Home' },
      { value: 'investments', label: 'Investments / Retirement accounts' },
      { value: 'business', label: 'Business ownership' },
      { value: 'vehicles', label: 'Vehicles' },
      { value: 'valuables', label: 'Jewelry / Collectibles' },
      { value: 'other', label: 'Other significant assets' },
    ]
  },
  {
    id: 'concerns',
    question: 'What are your primary concerns?',
    description: 'Select all that apply.',
    icon: ShieldCheckIcon,
    multiSelect: true,
    options: [
      { value: 'distribution', label: 'Asset distribution after death' },
      { value: 'probate', label: 'Avoiding probate' },
      { value: 'incapacity', label: 'Planning for incapacity' },
      { value: 'healthcare', label: 'Healthcare decisions' },
      { value: 'taxes', label: 'Minimizing estate taxes' },
      { value: 'guardianship', label: 'Naming guardians for children' },
    ]
  },
]

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleSelect = (value: string) => {
    if (currentQuestion.multiSelect) {
      const current = (answers[currentQuestion.id] as string[]) || []
      if (current.includes(value)) {
        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: current.filter(v => v !== value)
        }))
      } else {
        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: [...current, value]
        }))
      }
    } else {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }))
    }
  }

  const canProceed = () => {
    const answer = answers[currentQuestion.id]
    if (currentQuestion.multiSelect) {
      return Array.isArray(answer) && answer.length > 0
    }
    return !!answer
  }

  const handleNext = () => {
    if (isLastStep) {
      const recommendations = getRecommendations(answers)
      onComplete(recommendations)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id]
    if (currentQuestion.multiSelect) {
      return Array.isArray(answer) && answer.includes(value)
    }
    return answer === value
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <GlassCard className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Estate Planning Guide</h2>
                <p className="text-sm text-white/80">Let's find the right documents for you</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-white/70 mt-2">
              Step {currentStep + 1} of {questions.length}
            </p>
          </div>

          {/* Question Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <currentQuestion.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentQuestion.question}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentQuestion.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected(option.value)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected(option.value)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected(option.value) && (
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                          {option.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              {currentStep > 0 ? (
                <GlassButton variant="ghost" onClick={handleBack}>
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back
                </GlassButton>
              ) : (
                <GlassButton variant="ghost" onClick={onSkip}>
                  Skip for now
                </GlassButton>
              )}
            </div>
            
            <GlassButton 
              variant="primary" 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {isLastStep ? 'See Recommendations' : 'Continue'}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

function getRecommendations(answers: Record<string, string | string[]>): string[] {
  const recommendations: string[] = []
  
  // Everyone should have a will
  recommendations.push('will')
  
  // Trust recommendations
  const assets = answers.assets as string[] || []
  const concerns = answers.concerns as string[] || []
  
  if (
    assets.includes('home') || 
    assets.includes('business') ||
    assets.includes('investments') ||
    concerns.includes('probate')
  ) {
    recommendations.push('trust')
  }
  
  // POA recommendations
  if (
    concerns.includes('incapacity') ||
    assets.length > 2
  ) {
    recommendations.push('poa')
  }
  
  // AHCD recommendations
  if (concerns.includes('healthcare') || concerns.includes('incapacity')) {
    recommendations.push('ahcd')
  }
  
  // If no specific recommendations beyond will, add all basics
  if (recommendations.length === 1) {
    recommendations.push('poa', 'ahcd')
  }
  
  return recommendations
}

// Recommendations display component
export function RecommendationsDisplay({ 
  recommendations,
  onSelectDocument,
  onDismiss
}: { 
  recommendations: string[]
  onSelectDocument: (type: string) => void
  onDismiss: () => void
}) {
  const documentInfo: Record<string, { title: string; description: string; icon: React.ElementType }> = {
    will: {
      title: 'Last Will & Testament',
      description: 'Distribute your assets and name guardians for minor children',
      icon: DocumentTextIcon
    },
    trust: {
      title: 'Living Trust',
      description: 'Avoid probate and manage assets during your lifetime',
      icon: HomeIcon
    },
    poa: {
      title: 'Power of Attorney',
      description: 'Authorize someone to handle your financial affairs',
      icon: ShieldCheckIcon
    },
    ahcd: {
      title: 'Healthcare Directive',
      description: 'Document your healthcare wishes and appoint an agent',
      icon: HeartIcon
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Personalized Recommendations
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on your answers, we recommend these documents
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const info = documentInfo[rec]
          if (!info) return null
          
          return (
            <motion.button
              key={rec}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectDocument(rec)}
              className="w-full p-4 flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all group"
            >
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                <info.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">{info.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{info.description}</p>
              </div>
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                Recommended
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onDismiss}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          View all documents instead
        </button>
      </div>
    </GlassCard>
  )
}
