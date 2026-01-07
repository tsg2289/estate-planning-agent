'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { DocumentForm } from '@/components/document-form'
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  HeartIcon,
  HomeIcon,
  ArrowLeftIcon
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

  const handleDocumentComplete = (documentType: DocumentType) => {
    setCompletedDocuments(prev => new Set([...prev, documentType]))
    setActiveDocument(null)
  }

  const handleBackToDashboard = () => {
    setActiveDocument(null)
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <GlassCard className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            {/* Home Link */}
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            
            {/* Home Button */}
            <Link href="/">
              <GlassButton variant="ghost" size="sm" className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4" />
                Home
              </GlassButton>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Estate Planning Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Create professional estate planning documents with our secure platform
            </p>
            
            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex-1 max-w-md bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedDocuments.size / documentTypes.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {completedDocuments.size} of {documentTypes.length} completed
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Document Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {documentTypes.map((docType) => {
            const Icon = docType.icon
            const isCompleted = completedDocuments.has(docType.id)
            
            return (
              <GlassCard key={docType.id} className="p-8 hover:scale-105 transition-transform duration-200">
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${docType.color} text-white flex-shrink-0`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {docType.title}
                      </h3>
                      {isCompleted && (
                        <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {docType.description}
                    </p>
                    <GlassButton
                      onClick={() => setActiveDocument(docType.id)}
                      variant={isCompleted ? "secondary" : "primary"}
                      size="lg"
                      className="w-full"
                    >
                      {isCompleted ? 'Edit Document' : 'Create Document'}
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* Quick Actions */}
        {completedDocuments.size > 0 && (
          <GlassCard className="p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <GlassButton variant="primary" size="lg">
                📄 Download All Documents
              </GlassButton>
              <GlassButton variant="secondary" size="lg">
                📧 Share with Attorney
              </GlassButton>
              <GlassButton variant="secondary" size="lg">
                📅 Schedule Review
              </GlassButton>
            </div>
          </GlassCard>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
          <p className="text-sm text-yellow-700">
            This application is provided for informational and educational purposes only. It does not constitute legal advice, 
            nor does it create an attorney–client relationship. Estate planning laws vary by state, and each individual's 
            circumstances are unique. Any documents generated through this application should be carefully reviewed by a 
            licensed attorney in your jurisdiction before being signed or relied upon.
          </p>
        </div>
      </div>
    </div>
  )
}