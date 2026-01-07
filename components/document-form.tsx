'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { generateDocument, downloadDocument, generateFilename, DocumentType } from '@/lib/document-generation'
import { ArrowLeftIcon, DocumentArrowDownIcon, HomeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface DocumentFormProps {
  documentType: DocumentType
  onComplete: (documentType: DocumentType) => void
  onBack: () => void
}

interface FormData {
  [key: string]: any
}

const documentTitles = {
  will: 'Last Will & Testament',
  trust: 'Living Trust',
  poa: 'Power of Attorney',
  ahcd: 'Advance Healthcare Directive'
}

export function DocumentForm({ documentType, onComplete, onBack }: DocumentFormProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateDocument = async () => {
    try {
      setIsGenerating(true)
      
      // Validate required fields
      const requiredFields = getRequiredFields(documentType)
      const missingFields = requiredFields.filter(field => !formData[field])
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
        return
      }

      // Generate the document
      const blob = await generateDocument(documentType, formData)
      
      // Generate filename
      const personName = getPersonName(documentType, formData)
      const filename = generateFilename(documentType, personName)
      
      // Download the document
      downloadDocument(blob, filename)
      
      toast.success('Document generated and downloaded successfully!')
      onComplete(documentType)
      
    } catch (error) {
      console.error('Error generating document:', error)
      toast.error('Failed to generate document. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getPersonName = (type: DocumentType, data: FormData): string => {
    switch (type) {
      case 'will':
        return data.testatorName || ''
      case 'trust':
        return data.trustorName || ''
      case 'poa':
      case 'ahcd':
        return data.principalName || ''
      default:
        return ''
    }
  }

  const getRequiredFields = (type: DocumentType): string[] => {
    switch (type) {
      case 'will':
        return ['testatorName', 'testatorCity', 'testatorState', 'executorName']
      case 'trust':
        return ['trustorName', 'trusteeName', 'trustName']
      case 'poa':
        return ['principalName', 'principalCity', 'principalState', 'agentName']
      case 'ahcd':
        return ['principalName', 'healthCareAgent']
      default:
        return []
    }
  }

  const renderFormFields = () => {
    switch (documentType) {
      case 'will':
        return renderWillForm()
      case 'trust':
        return renderTrustForm()
      case 'poa':
        return renderPOAForm()
      case 'ahcd':
        return renderAHCDForm()
      default:
        return null
    }
  }

  const renderWillForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Full Name (Testator) *"
          value={formData.testatorName || ''}
          onChange={(e) => handleInputChange('testatorName', e.target.value)}
          placeholder="Enter your full legal name"
        />
        <GlassInput
          label="Marital Status"
          value={formData.maritalStatus || ''}
          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
          placeholder="e.g., Single, Married, Divorced"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassInput
          label="City *"
          value={formData.testatorCity || ''}
          onChange={(e) => handleInputChange('testatorCity', e.target.value)}
          placeholder="Your city"
        />
        <GlassInput
          label="State *"
          value={formData.testatorState || ''}
          onChange={(e) => handleInputChange('testatorState', e.target.value)}
          placeholder="Your state"
        />
        <GlassInput
          label="Zip Code"
          value={formData.testatorZip || ''}
          onChange={(e) => handleInputChange('testatorZip', e.target.value)}
          placeholder="Your zip code"
        />
      </div>

      <GlassInput
        label="Spouse Name (if married)"
        value={formData.spouseName || ''}
        onChange={(e) => handleInputChange('spouseName', e.target.value)}
        placeholder="Full name of spouse"
      />

      <GlassInput
        label="Children (comma-separated)"
        value={formData.children || ''}
        onChange={(e) => handleInputChange('children', e.target.value)}
        placeholder="e.g., John Doe, Jane Doe"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Executor Name *"
          value={formData.executorName || ''}
          onChange={(e) => handleInputChange('executorName', e.target.value)}
          placeholder="Person to execute your will"
        />
        <GlassInput
          label="Alternate Executor"
          value={formData.alternateExecutorName || ''}
          onChange={(e) => handleInputChange('alternateExecutorName', e.target.value)}
          placeholder="Backup executor"
        />
      </div>

      <GlassInput
        label="Guardian for Minor Children"
        value={formData.guardianName || ''}
        onChange={(e) => handleInputChange('guardianName', e.target.value)}
        placeholder="Guardian if you have minor children"
      />

      <GlassInput
        label="Trust Name"
        value={formData.trustName || ''}
        onChange={(e) => handleInputChange('trustName', e.target.value)}
        placeholder="Name of your trust (if applicable)"
      />
    </div>
  )

  const renderTrustForm = () => (
    <div className="space-y-6">
      <GlassInput
        label="Trust Name *"
        value={formData.trustName || ''}
        onChange={(e) => handleInputChange('trustName', e.target.value)}
        placeholder="e.g., The Smith Family Trust"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Trustor Name *"
          value={formData.trustorName || ''}
          onChange={(e) => handleInputChange('trustorName', e.target.value)}
          placeholder="Person creating the trust"
        />
        <GlassInput
          label="Trustee Name *"
          value={formData.trusteeName || ''}
          onChange={(e) => handleInputChange('trusteeName', e.target.value)}
          placeholder="Person managing the trust"
        />
      </div>

      <GlassInput
        label="Successor Trustee"
        value={formData.successorTrusteeName || ''}
        onChange={(e) => handleInputChange('successorTrusteeName', e.target.value)}
        placeholder="Backup trustee"
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Beneficiaries</label>
        <GlassInput
          label="Beneficiary 1 Name"
          value={formData.beneficiary1Name || ''}
          onChange={(e) => handleInputChange('beneficiary1Name', e.target.value)}
          placeholder="First beneficiary name"
        />
        <GlassInput
          label="Beneficiary 1 Share"
          value={formData.beneficiary1Share || ''}
          onChange={(e) => handleInputChange('beneficiary1Share', e.target.value)}
          placeholder="e.g., 50%, $100,000"
        />
        <GlassInput
          label="Beneficiary 2 Name"
          value={formData.beneficiary2Name || ''}
          onChange={(e) => handleInputChange('beneficiary2Name', e.target.value)}
          placeholder="Second beneficiary name"
        />
        <GlassInput
          label="Beneficiary 2 Share"
          value={formData.beneficiary2Share || ''}
          onChange={(e) => handleInputChange('beneficiary2Share', e.target.value)}
          placeholder="e.g., 50%, $100,000"
        />
      </div>
    </div>
  )

  const renderPOAForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Principal Name *"
          value={formData.principalName || ''}
          onChange={(e) => handleInputChange('principalName', e.target.value)}
          placeholder="Your full legal name"
        />
        <GlassInput
          label="Agent Name *"
          value={formData.agentName || ''}
          onChange={(e) => handleInputChange('agentName', e.target.value)}
          placeholder="Person you're appointing"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassInput
          label="City *"
          value={formData.principalCity || ''}
          onChange={(e) => handleInputChange('principalCity', e.target.value)}
          placeholder="Your city"
        />
        <GlassInput
          label="State *"
          value={formData.principalState || ''}
          onChange={(e) => handleInputChange('principalState', e.target.value)}
          placeholder="Your state"
        />
        <GlassInput
          label="County"
          value={formData.principalCounty || ''}
          onChange={(e) => handleInputChange('principalCounty', e.target.value)}
          placeholder="Your county"
        />
      </div>

      <GlassInput
        label="Successor Agent"
        value={formData.successorAgentName || ''}
        onChange={(e) => handleInputChange('successorAgentName', e.target.value)}
        placeholder="Backup agent"
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Powers</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.generalPowers || false}
              onChange={(e) => handleInputChange('generalPowers', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">General financial powers</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.immediatelyEffective || false}
              onChange={(e) => handleInputChange('immediatelyEffective', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Effective immediately</span>
          </label>
        </div>
      </div>

      <GlassInput
        label="Specific Powers (optional)"
        value={formData.specificPowers || ''}
        onChange={(e) => handleInputChange('specificPowers', e.target.value)}
        placeholder="List any specific powers to grant"
        className="min-h-[100px]"
      />
    </div>
  )

  const renderAHCDForm = () => (
    <div className="space-y-6">
      <GlassInput
        label="Principal Name *"
        value={formData.principalName || ''}
        onChange={(e) => handleInputChange('principalName', e.target.value)}
        placeholder="Your full legal name"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Healthcare Agent *"
          value={formData.healthCareAgent || ''}
          onChange={(e) => handleInputChange('healthCareAgent', e.target.value)}
          placeholder="Person to make healthcare decisions"
        />
        <GlassInput
          label="Agent Phone"
          value={formData.healthCareAgentPhone || ''}
          onChange={(e) => handleInputChange('healthCareAgentPhone', e.target.value)}
          placeholder="Agent's phone number"
        />
      </div>

      <GlassInput
        label="Agent Address"
        value={formData.healthCareAgentAddress || ''}
        onChange={(e) => handleInputChange('healthCareAgentAddress', e.target.value)}
        placeholder="Agent's full address"
      />

      <GlassInput
        label="Agent Email"
        value={formData.healthCareAgentEmail || ''}
        onChange={(e) => handleInputChange('healthCareAgentEmail', e.target.value)}
        placeholder="Agent's email address"
      />

      <GlassInput
        label="End-of-Life Wishes"
        value={formData.endOfLifeWishes || ''}
        onChange={(e) => handleInputChange('endOfLifeWishes', e.target.value)}
        placeholder="Describe your end-of-life care preferences"
        className="min-h-[100px]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Life-Sustaining Treatment</label>
          <select
            value={formData.lifeSustainingTreatment || 'default'}
            onChange={(e) => handleInputChange('lifeSustainingTreatment', e.target.value)}
            className="w-full px-3 py-2 bg-glass-200 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="default">Follow agent's decision</option>
            <option value="prolong">Prolong life</option>
            <option value="not-prolong">Do not prolong life</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pain Management</label>
          <select
            value={formData.painManagement || 'aggressive'}
            onChange={(e) => handleInputChange('painManagement', e.target.value)}
            className="w-full px-3 py-2 bg-glass-200 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="aggressive">Aggressive pain relief</option>
            <option value="moderate">Moderate pain relief</option>
            <option value="minimal">Minimal pain relief</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.personalOrganDonation || false}
            onChange={(e) => handleInputChange('personalOrganDonation', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">I consent to organ donation</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Primary Physician Name"
          value={formData.primaryPhysicianName || ''}
          onChange={(e) => handleInputChange('primaryPhysicianName', e.target.value)}
          placeholder="Your primary doctor's name"
        />
        <GlassInput
          label="Primary Physician Phone"
          value={formData.primaryPhysicianPhone || ''}
          onChange={(e) => handleInputChange('primaryPhysicianPhone', e.target.value)}
          placeholder="Doctor's phone number"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <GlassButton
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </GlassButton>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {documentTitles[documentType]}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Fill out the form below to generate your document
                  </p>
                </div>
              </div>
              
              {/* Home Button */}
              <Link href="/">
                <GlassButton variant="ghost" size="sm" className="flex items-center gap-2">
                  <HomeIcon className="w-4 h-4" />
                  Home
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-8">
            {renderFormFields()}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                * Required fields
              </div>
              <div className="flex gap-4">
                <GlassButton
                  onClick={onBack}
                  variant="secondary"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  onClick={handleGenerateDocument}
                  loading={isGenerating}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  Generate Document
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-yellow-700">
              This application is provided for informational and educational purposes only. It does not constitute legal advice, 
              nor does it create an attorney–client relationship. Estate planning laws vary by state, and each individual's 
              circumstances are unique. Any documents generated through this application should be carefully reviewed by a 
              licensed attorney in your jurisdiction before being signed or relied upon.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}