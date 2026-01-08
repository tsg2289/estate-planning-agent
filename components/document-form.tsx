'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { generateDocument, downloadDocument, generateFilename, DocumentType } from '@/lib/document-generation'
import { ArrowLeftIcon, DocumentArrowDownIcon, HomeIcon, BeakerIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { EmailDocumentModal } from '@/components/email-document'
import toast from 'react-hot-toast'

interface DocumentFormProps {
  documentType: DocumentType
  onComplete: (documentType: DocumentType) => void
  onBack: () => void
}

interface FormData {
  [key: string]: any
}

const documentTitles: Record<DocumentType, string> = {
  will: 'Last Will & Testament',
  trust: 'Living Trust',
  poa: 'Power of Attorney',
  ahcd: 'Advance Healthcare Directive',
  pet_trust: 'Pet Trust',
  hipaa: 'HIPAA Authorization',
  living_will: 'Living Will',
  beneficiary: 'Beneficiary Designation'
}

// Demo data for quick form filling during development/testing
const DEMO_DATA: Record<DocumentType, FormData> = {
  will: {
    testatorName: 'John Michael Smith',
    maritalStatus: 'Married',
    testatorCity: 'San Francisco',
    testatorState: 'California',
    testatorZip: '94102',
    spouseName: 'Sarah Elizabeth Smith',
    children: 'Emily Smith, Michael Smith Jr., David Smith',
    executorName: 'Robert James Johnson',
    alternateExecutorName: 'Mary Ann Williams',
    guardianName: 'David Richard Smith',
    trustName: 'The Smith Family Trust',
  },
  trust: {
    trustName: 'The Smith Family Revocable Living Trust',
    trustorName: 'John Michael Smith',
    trusteeName: 'John Michael Smith',
    successorTrusteeName: 'Sarah Elizabeth Smith',
    beneficiary1Name: 'Emily Grace Smith',
    beneficiary1Share: '33.33%',
    beneficiary2Name: 'Michael David Smith Jr.',
    beneficiary2Share: '33.33%',
  },
  poa: {
    principalName: 'John Michael Smith',
    agentName: 'Sarah Elizabeth Smith',
    principalCity: 'San Francisco',
    principalState: 'California',
    principalCounty: 'San Francisco County',
    successorAgentName: 'Robert James Johnson',
    generalPowers: true,
    immediatelyEffective: true,
    specificPowers: 'Banking and financial transactions, real estate management, tax matters, business operations, insurance claims, retirement accounts.',
  },
  ahcd: {
    principalName: 'John Michael Smith',
    healthCareAgent: 'Sarah Elizabeth Smith',
    healthCareAgentPhone: '(415) 555-1234',
    healthCareAgentAddress: '123 Main Street, San Francisco, CA 94102',
    healthCareAgentEmail: 'sarah.smith@email.com',
    endOfLifeWishes: 'If I am in an irreversible coma or persistent vegetative state with no reasonable chance of recovery, I do not wish to have my life artificially prolonged. I want to be kept comfortable and free of pain.',
    lifeSustainingTreatment: 'not-prolong',
    painManagement: 'aggressive',
    personalOrganDonation: true,
    primaryPhysicianName: 'Dr. Jennifer Martinez',
    primaryPhysicianPhone: '(415) 555-9876',
  },
  pet_trust: {
    trustorName: 'John Michael Smith',
    petName: 'Max',
    petBreed: 'Golden Retriever',
    petAge: '5 years',
    petDescription: 'Male, golden color, friendly disposition',
    trusteeName: 'Sarah Elizabeth Smith',
    successorTrusteeName: 'Robert James Johnson',
    caregiverName: 'Emily Smith',
    caregiverAddress: '456 Oak Street, San Francisco, CA 94103',
    caregiverPhone: '(415) 555-2345',
    alternateCaregiverName: 'Michael Smith Jr.',
    trustAmountDollars: '$50,000',
    careInstructions: 'Max requires daily walks, high-quality dog food, and annual veterinary checkups. He loves playing fetch and should have access to outdoor space.',
    vetName: 'Dr. Sarah Wilson, DVM',
    vetAddress: '789 Pet Care Lane, San Francisco, CA 94104',
    vetPhone: '(415) 555-3456',
    remainderBeneficiary: 'San Francisco SPCA',
  },
  hipaa: {
    patientName: 'John Michael Smith',
    dateOfBirth: '01/15/1975',
    patientAddress: '123 Main Street, San Francisco, CA 94102',
    patientPhone: '(415) 555-1234',
    authorizedPerson1Name: 'Sarah Elizabeth Smith',
    authorizedPerson1Relationship: 'Spouse',
    authorizedPerson1Phone: '(415) 555-2345',
    authorizedPerson2Name: 'Emily Smith',
    authorizedPerson2Relationship: 'Daughter',
    authorizedPerson2Phone: '(415) 555-3456',
    allRecords: true,
    purposeOfDisclosure: 'To allow my designated representatives to access my medical records for healthcare coordination and family planning purposes.',
    expirationDate: '12/31/2030',
  },
  living_will: {
    declarantName: 'John Michael Smith',
    withdrawTreatment: true,
    withdrawNutrition: true,
    pregnancyException: false,
    additionalInstructions: 'I wish to die peacefully and with dignity. Please ensure adequate pain management is provided.',
    witness1Name: 'Robert James Johnson',
    witness1Address: '789 Oak Street, San Francisco, CA 94105',
    witness2Name: 'Mary Ann Williams',
    witness2Address: '321 Pine Street, San Francisco, CA 94106',
  },
  beneficiary: {
    accountHolder: 'John Michael Smith',
    accountType: '401(k) Retirement Account',
    accountNumber: 'XXXX-1234',
    primaryBeneficiary1Name: 'Sarah Elizabeth Smith',
    primaryBeneficiary1Relationship: 'Spouse',
    primaryBeneficiary1DOB: '03/22/1977',
    primaryBeneficiary1SSN: 'XXX-XX-5678',
    primaryBeneficiary1Percentage: '100',
    contingentBeneficiary1Name: 'Emily Smith',
    contingentBeneficiary1Relationship: 'Daughter',
    contingentBeneficiary1DOB: '06/15/2005',
    contingentBeneficiary1SSN: 'XXX-XX-9012',
    contingentBeneficiary1Percentage: '50',
    contingentBeneficiary2Name: 'Michael Smith Jr.',
    contingentBeneficiary2Relationship: 'Son',
    contingentBeneficiary2DOB: '09/28/2007',
    contingentBeneficiary2SSN: 'XXX-XX-3456',
    contingentBeneficiary2Percentage: '50',
    perStirpes: true,
  },
}

export function DocumentForm({ documentType, onComplete, onBack }: DocumentFormProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Fill form with demo data for development/testing
  const fillDemoData = () => {
    setFormData(DEMO_DATA[documentType])
    toast.success('Demo data filled! You can now generate a test document.')
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
      
      // Store the blob for potential email sharing
      setGeneratedBlob(blob)
      
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
      case 'pet_trust':
        return data.trustorName || ''
      case 'poa':
      case 'ahcd':
      case 'living_will':
        return data.principalName || data.declarantName || ''
      case 'hipaa':
        return data.patientName || ''
      case 'beneficiary':
        return data.accountHolder || ''
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
      case 'pet_trust':
        return ['trustorName', 'petName', 'caregiverName', 'trusteeName']
      case 'hipaa':
        return ['patientName', 'authorizedPerson1Name']
      case 'living_will':
        return ['declarantName']
      case 'beneficiary':
        return ['accountHolder', 'accountType', 'primaryBeneficiary1Name']
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
      case 'pet_trust':
        return renderPetTrustForm()
      case 'hipaa':
        return renderHIPAAForm()
      case 'living_will':
        return renderLivingWillForm()
      case 'beneficiary':
        return renderBeneficiaryForm()
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

  // Pet Trust Form
  const renderPetTrustForm = () => (
    <div className="space-y-6">
      <GlassInput
        label="Trustor Name *"
        value={formData.trustorName || ''}
        onChange={(e) => handleInputChange('trustorName', e.target.value)}
        placeholder="Your full legal name"
      />

      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-4">🐾 Pet Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Pet Name *"
            value={formData.petName || ''}
            onChange={(e) => handleInputChange('petName', e.target.value)}
            placeholder="Your pet's name"
          />
          <GlassInput
            label="Species/Breed"
            value={formData.petBreed || ''}
            onChange={(e) => handleInputChange('petBreed', e.target.value)}
            placeholder="e.g., Golden Retriever"
          />
          <GlassInput
            label="Age"
            value={formData.petAge || ''}
            onChange={(e) => handleInputChange('petAge', e.target.value)}
            placeholder="e.g., 5 years"
          />
          <GlassInput
            label="Description"
            value={formData.petDescription || ''}
            onChange={(e) => handleInputChange('petDescription', e.target.value)}
            placeholder="Color, markings, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          label="Trustee Name *"
          value={formData.trusteeName || ''}
          onChange={(e) => handleInputChange('trusteeName', e.target.value)}
          placeholder="Person to manage trust funds"
        />
        <GlassInput
          label="Successor Trustee"
          value={formData.successorTrusteeName || ''}
          onChange={(e) => handleInputChange('successorTrusteeName', e.target.value)}
          placeholder="Backup trustee"
        />
      </div>

      <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-700">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4">👤 Primary Caregiver</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Caregiver Name *"
            value={formData.caregiverName || ''}
            onChange={(e) => handleInputChange('caregiverName', e.target.value)}
            placeholder="Person to care for your pet"
          />
          <GlassInput
            label="Caregiver Phone"
            value={formData.caregiverPhone || ''}
            onChange={(e) => handleInputChange('caregiverPhone', e.target.value)}
            placeholder="Contact phone"
          />
          <GlassInput
            label="Caregiver Address"
            value={formData.caregiverAddress || ''}
            onChange={(e) => handleInputChange('caregiverAddress', e.target.value)}
            placeholder="Full address"
            className="md:col-span-2"
          />
          <GlassInput
            label="Alternate Caregiver"
            value={formData.alternateCaregiverName || ''}
            onChange={(e) => handleInputChange('alternateCaregiverName', e.target.value)}
            placeholder="Backup caregiver"
            className="md:col-span-2"
          />
        </div>
      </div>

      <GlassInput
        label="Trust Funding Amount ($)"
        value={formData.trustAmountDollars || ''}
        onChange={(e) => handleInputChange('trustAmountDollars', e.target.value)}
        placeholder="e.g., 50,000"
      />

      <GlassInput
        label="Care Instructions"
        value={formData.careInstructions || ''}
        onChange={(e) => handleInputChange('careInstructions', e.target.value)}
        placeholder="Diet, exercise, medical needs, preferences..."
        className="min-h-[100px]"
      />

      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4">🏥 Veterinarian</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Vet Name"
            value={formData.vetName || ''}
            onChange={(e) => handleInputChange('vetName', e.target.value)}
            placeholder="Dr. Name, DVM"
          />
          <GlassInput
            label="Vet Phone"
            value={formData.vetPhone || ''}
            onChange={(e) => handleInputChange('vetPhone', e.target.value)}
            placeholder="Contact phone"
          />
          <GlassInput
            label="Vet Address"
            value={formData.vetAddress || ''}
            onChange={(e) => handleInputChange('vetAddress', e.target.value)}
            placeholder="Full address"
            className="md:col-span-2"
          />
        </div>
      </div>

      <GlassInput
        label="Remainder Beneficiary"
        value={formData.remainderBeneficiary || ''}
        onChange={(e) => handleInputChange('remainderBeneficiary', e.target.value)}
        placeholder="Who receives remaining funds after pet passes"
      />
    </div>
  )

  // HIPAA Authorization Form
  const renderHIPAAForm = () => (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-700">
        <h3 className="font-semibold text-red-800 dark:text-red-300 mb-4">📋 Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Patient Name *"
            value={formData.patientName || ''}
            onChange={(e) => handleInputChange('patientName', e.target.value)}
            placeholder="Your full legal name"
          />
          <GlassInput
            label="Date of Birth"
            value={formData.dateOfBirth || ''}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            placeholder="MM/DD/YYYY"
          />
          <GlassInput
            label="Phone"
            value={formData.patientPhone || ''}
            onChange={(e) => handleInputChange('patientPhone', e.target.value)}
            placeholder="Your phone number"
          />
          <GlassInput
            label="Address"
            value={formData.patientAddress || ''}
            onChange={(e) => handleInputChange('patientAddress', e.target.value)}
            placeholder="Your full address"
          />
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4">👥 Authorized Person 1 *</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassInput
            label="Name *"
            value={formData.authorizedPerson1Name || ''}
            onChange={(e) => handleInputChange('authorizedPerson1Name', e.target.value)}
            placeholder="Full name"
          />
          <GlassInput
            label="Relationship"
            value={formData.authorizedPerson1Relationship || ''}
            onChange={(e) => handleInputChange('authorizedPerson1Relationship', e.target.value)}
            placeholder="e.g., Spouse, Parent"
          />
          <GlassInput
            label="Phone"
            value={formData.authorizedPerson1Phone || ''}
            onChange={(e) => handleInputChange('authorizedPerson1Phone', e.target.value)}
            placeholder="Contact phone"
          />
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4">👥 Authorized Person 2 (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassInput
            label="Name"
            value={formData.authorizedPerson2Name || ''}
            onChange={(e) => handleInputChange('authorizedPerson2Name', e.target.value)}
            placeholder="Full name"
          />
          <GlassInput
            label="Relationship"
            value={formData.authorizedPerson2Relationship || ''}
            onChange={(e) => handleInputChange('authorizedPerson2Relationship', e.target.value)}
            placeholder="e.g., Child, Sibling"
          />
          <GlassInput
            label="Phone"
            value={formData.authorizedPerson2Phone || ''}
            onChange={(e) => handleInputChange('authorizedPerson2Phone', e.target.value)}
            placeholder="Contact phone"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Records to Release</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.allRecords || false}
              onChange={(e) => handleInputChange('allRecords', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">All medical records</span>
          </label>
        </div>
        {!formData.allRecords && (
          <GlassInput
            label="Specific Records"
            value={formData.specificRecords || ''}
            onChange={(e) => handleInputChange('specificRecords', e.target.value)}
            placeholder="Describe specific records to release"
          />
        )}
      </div>

      <GlassInput
        label="Purpose of Disclosure"
        value={formData.purposeOfDisclosure || ''}
        onChange={(e) => handleInputChange('purposeOfDisclosure', e.target.value)}
        placeholder="Why is this information being released?"
        className="min-h-[80px]"
      />

      <GlassInput
        label="Expiration Date"
        value={formData.expirationDate || ''}
        onChange={(e) => handleInputChange('expirationDate', e.target.value)}
        placeholder="MM/DD/YYYY"
      />
    </div>
  )

  // Living Will Form
  const renderLivingWillForm = () => (
    <div className="space-y-6">
      <GlassInput
        label="Declarant Name *"
        value={formData.declarantName || ''}
        onChange={(e) => handleInputChange('declarantName', e.target.value)}
        placeholder="Your full legal name"
      />

      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-4">🏥 Treatment Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.withdrawTreatment || false}
              onChange={(e) => handleInputChange('withdrawTreatment', e.target.checked)}
              className="rounded border-gray-300 w-5 h-5"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Withhold or withdraw life-sustaining treatment if in terminal condition
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.withdrawNutrition || false}
              onChange={(e) => handleInputChange('withdrawNutrition', e.target.checked)}
              className="rounded border-gray-300 w-5 h-5"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Withhold artificial nutrition and hydration
            </span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.pregnancyException || false}
              onChange={(e) => handleInputChange('pregnancyException', e.target.checked)}
              className="rounded border-gray-300 w-5 h-5"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Pregnancy exception (suspend directive during pregnancy)
            </span>
          </label>
        </div>
      </div>

      <GlassInput
        label="Additional Instructions"
        value={formData.additionalInstructions || ''}
        onChange={(e) => handleInputChange('additionalInstructions', e.target.value)}
        placeholder="Any other instructions for your care..."
        className="min-h-[100px]"
      />

      <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-300 mb-4">👥 Witnesses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <GlassInput
              label="Witness 1 Name"
              value={formData.witness1Name || ''}
              onChange={(e) => handleInputChange('witness1Name', e.target.value)}
              placeholder="Full name"
            />
            <GlassInput
              label="Witness 1 Address"
              value={formData.witness1Address || ''}
              onChange={(e) => handleInputChange('witness1Address', e.target.value)}
              placeholder="Full address"
            />
          </div>
          <div className="space-y-4">
            <GlassInput
              label="Witness 2 Name"
              value={formData.witness2Name || ''}
              onChange={(e) => handleInputChange('witness2Name', e.target.value)}
              placeholder="Full name"
            />
            <GlassInput
              label="Witness 2 Address"
              value={formData.witness2Address || ''}
              onChange={(e) => handleInputChange('witness2Address', e.target.value)}
              placeholder="Full address"
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Beneficiary Designation Form
  const renderBeneficiaryForm = () => (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
        <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-4">📊 Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassInput
            label="Account Holder *"
            value={formData.accountHolder || ''}
            onChange={(e) => handleInputChange('accountHolder', e.target.value)}
            placeholder="Your full legal name"
          />
          <GlassInput
            label="Account Type *"
            value={formData.accountType || ''}
            onChange={(e) => handleInputChange('accountType', e.target.value)}
            placeholder="e.g., 401(k), IRA, Life Insurance"
          />
          <GlassInput
            label="Account Number"
            value={formData.accountNumber || ''}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            placeholder="XXXX-1234 (partial for security)"
          />
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4">🥇 Primary Beneficiary *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Name *"
            value={formData.primaryBeneficiary1Name || ''}
            onChange={(e) => handleInputChange('primaryBeneficiary1Name', e.target.value)}
            placeholder="Full legal name"
          />
          <GlassInput
            label="Relationship"
            value={formData.primaryBeneficiary1Relationship || ''}
            onChange={(e) => handleInputChange('primaryBeneficiary1Relationship', e.target.value)}
            placeholder="e.g., Spouse, Child"
          />
          <GlassInput
            label="Date of Birth"
            value={formData.primaryBeneficiary1DOB || ''}
            onChange={(e) => handleInputChange('primaryBeneficiary1DOB', e.target.value)}
            placeholder="MM/DD/YYYY"
          />
          <GlassInput
            label="SSN (last 4)"
            value={formData.primaryBeneficiary1SSN || ''}
            onChange={(e) => handleInputChange('primaryBeneficiary1SSN', e.target.value)}
            placeholder="XXX-XX-1234"
          />
          <GlassInput
            label="Percentage"
            value={formData.primaryBeneficiary1Percentage || ''}
            onChange={(e) => handleInputChange('primaryBeneficiary1Percentage', e.target.value)}
            placeholder="e.g., 100"
            className="md:col-span-2"
          />
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-4">🥈 Contingent Beneficiary 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Name"
            value={formData.contingentBeneficiary1Name || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary1Name', e.target.value)}
            placeholder="Full legal name"
          />
          <GlassInput
            label="Relationship"
            value={formData.contingentBeneficiary1Relationship || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary1Relationship', e.target.value)}
            placeholder="e.g., Child, Sibling"
          />
          <GlassInput
            label="Date of Birth"
            value={formData.contingentBeneficiary1DOB || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary1DOB', e.target.value)}
            placeholder="MM/DD/YYYY"
          />
          <GlassInput
            label="SSN (last 4)"
            value={formData.contingentBeneficiary1SSN || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary1SSN', e.target.value)}
            placeholder="XXX-XX-1234"
          />
          <GlassInput
            label="Percentage"
            value={formData.contingentBeneficiary1Percentage || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary1Percentage', e.target.value)}
            placeholder="e.g., 50"
            className="md:col-span-2"
          />
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
        <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-4">🥈 Contingent Beneficiary 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput
            label="Name"
            value={formData.contingentBeneficiary2Name || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary2Name', e.target.value)}
            placeholder="Full legal name"
          />
          <GlassInput
            label="Relationship"
            value={formData.contingentBeneficiary2Relationship || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary2Relationship', e.target.value)}
            placeholder="e.g., Child, Sibling"
          />
          <GlassInput
            label="Date of Birth"
            value={formData.contingentBeneficiary2DOB || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary2DOB', e.target.value)}
            placeholder="MM/DD/YYYY"
          />
          <GlassInput
            label="SSN (last 4)"
            value={formData.contingentBeneficiary2SSN || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary2SSN', e.target.value)}
            placeholder="XXX-XX-1234"
          />
          <GlassInput
            label="Percentage"
            value={formData.contingentBeneficiary2Percentage || ''}
            onChange={(e) => handleInputChange('contingentBeneficiary2Percentage', e.target.value)}
            placeholder="e.g., 50"
            className="md:col-span-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.perStirpes || false}
            onChange={(e) => handleInputChange('perStirpes', e.target.checked)}
            className="rounded border-gray-300 w-5 h-5"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Per Stirpes:</strong> If a beneficiary predeceases me, their share passes to their descendants
          </span>
        </label>
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
              
              <div className="flex items-center gap-2">
                {/* Demo Data Button - for development/testing */}
                <GlassButton 
                  onClick={fillDemoData}
                  variant="secondary" 
                  size="sm" 
                  className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border-amber-300"
                >
                  <BeakerIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700">Fill Demo Data</span>
                </GlassButton>
                
                {/* Home Button */}
                <Link href="/">
                  <GlassButton variant="ghost" size="sm" className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4" />
                    Home
                  </GlassButton>
                </Link>
              </div>
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
                  onClick={() => setShowEmailModal(true)}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Share
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

        {/* Email Share Modal */}
        <EmailDocumentModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          documentType={documentType}
          documentTitle={documentTitles[documentType]}
        />

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