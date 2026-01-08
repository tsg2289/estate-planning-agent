'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { 
  DocumentTextIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  ClockIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export interface DocumentRecord {
  id: string
  type: 'will' | 'trust' | 'poa' | 'ahcd'
  title: string
  formData: Record<string, any>
  createdAt: string
  updatedAt: string
}

const documentTypeLabels = {
  will: 'Last Will & Testament',
  trust: 'Living Trust',
  poa: 'Power of Attorney',
  ahcd: 'Advance Healthcare Directive'
}

const documentTypeColors = {
  will: 'from-blue-500 to-blue-600',
  trust: 'from-purple-500 to-purple-600',
  poa: 'from-green-500 to-green-600',
  ahcd: 'from-pink-500 to-pink-600'
}

export function DocumentHistory({ 
  onLoadDocument 
}: { 
  onLoadDocument?: (doc: DocumentRecord) => void 
}) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = () => {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('document_history')
      if (saved) {
        setDocuments(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load documents:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id)
    setDocuments(updated)
    localStorage.setItem('document_history', JSON.stringify(updated))
    toast.success('Document deleted')
  }

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all saved documents?')) {
      setDocuments([])
      localStorage.removeItem('document_history')
      toast.success('All documents cleared')
    }
  }

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      </GlassCard>
    )
  }

  if (documents.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <FolderOpenIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Documents Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Documents you create will appear here for easy access.
        </p>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          Document History
        </h3>
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-red-500 hover:text-red-600"
        >
          Clear All
        </GlassButton>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${documentTypeColors[doc.type]} text-white`}>
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {doc.title || documentTypeLabels[doc.type]}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {documentTypeLabels[doc.type]}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Created: {new Date(doc.createdAt).toLocaleDateString()}
                    {doc.updatedAt !== doc.createdAt && (
                      <> • Updated: {new Date(doc.updatedAt).toLocaleDateString()}</>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onLoadDocument && (
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => onLoadDocument(doc)}
                      title="Edit Document"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                    </GlassButton>
                  )}
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(doc.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete Document"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}

// Helper function to save a document to history
export function saveDocumentToHistory(doc: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt'>) {
  if (typeof window === 'undefined') return

  try {
    const saved = localStorage.getItem('document_history')
    const documents: DocumentRecord[] = saved ? JSON.parse(saved) : []
    
    const newDoc: DocumentRecord = {
      ...doc,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    documents.unshift(newDoc)
    
    // Keep only last 50 documents
    const trimmed = documents.slice(0, 50)
    localStorage.setItem('document_history', JSON.stringify(trimmed))
    
    return newDoc
  } catch (e) {
    console.error('Failed to save document:', e)
  }
}
