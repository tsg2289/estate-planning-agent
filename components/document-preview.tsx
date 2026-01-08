'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { 
  XMarkIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

interface DocumentPreviewProps {
  isOpen: boolean
  onClose: () => void
  documentType: 'will' | 'trust' | 'poa' | 'ahcd' | 'pet_trust' | 'hipaa' | 'living_will' | 'beneficiary'
  formData: Record<string, any>
  onDownload: () => void
}

const documentTitles = {
  will: 'LAST WILL AND TESTAMENT',
  trust: 'REVOCABLE LIVING TRUST',
  poa: 'DURABLE POWER OF ATTORNEY',
  ahcd: 'ADVANCE HEALTHCARE DIRECTIVE'
}

export function DocumentPreview({ 
  isOpen, 
  onClose, 
  documentType, 
  formData, 
  onDownload 
}: DocumentPreviewProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setTimeout(() => setIsPrinting(false), 1000)
  }

  const renderPreviewContent = () => {
    switch (documentType) {
      case 'will':
        return renderWillPreview(formData)
      case 'trust':
        return renderTrustPreview(formData)
      case 'poa':
        return renderPOAPreview(formData)
      case 'ahcd':
        return renderAHCDPreview(formData)
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <EyeIcon className="w-6 h-6 text-primary-500" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Document Preview
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review before downloading
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  disabled={isPrinting}
                >
                  <PrinterIcon className="w-4 h-4 mr-1" />
                  Print
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={onDownload}
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                  Download
                </GlassButton>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-gray-950">
              <div 
                className="max-w-3xl mx-auto bg-white shadow-lg p-12 min-h-[800px] print:shadow-none print:p-0"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                {renderPreviewContent()}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function renderWillPreview(data: Record<string, any>) {
  return (
    <div className="text-gray-900 leading-relaxed">
      <h1 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
        {documentTitles.will}
      </h1>
      <h2 className="text-lg font-semibold text-center mb-8">
        OF {(data.testatorName || '[YOUR NAME]').toUpperCase()}
      </h2>

      <p className="mb-6 text-justify">
        I, <strong>{data.testatorName || '[YOUR NAME]'}</strong>, of{' '}
        <strong>{data.testatorCity || '[CITY]'}</strong>,{' '}
        <strong>{data.testatorState || '[STATE]'}</strong>, being of sound mind and memory, 
        do hereby declare this to be my Last Will and Testament, revoking all previous wills 
        and codicils made by me.
      </p>

      <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE I - FAMILY</h3>
      <p className="mb-4 text-justify">
        {data.maritalStatus === 'Married' ? (
          <>I am married to <strong>{data.spouseName || '[SPOUSE NAME]'}</strong>.</>
        ) : (
          <>I am currently {data.maritalStatus?.toLowerCase() || 'single'}.</>
        )}
      </p>
      {data.children && (
        <p className="mb-4 text-justify">
          My children are: <strong>{data.children}</strong>.
        </p>
      )}

      <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE II - EXECUTOR</h3>
      <p className="mb-4 text-justify">
        I appoint <strong>{data.executorName || '[EXECUTOR NAME]'}</strong> as the Executor 
        of this Will. If they are unable or unwilling to serve, I appoint{' '}
        <strong>{data.alternateExecutorName || '[ALTERNATE EXECUTOR]'}</strong> as alternate Executor.
      </p>

      {data.guardianName && (
        <>
          <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE III - GUARDIANSHIP</h3>
          <p className="mb-4 text-justify">
            If I have any minor children at the time of my death, I appoint{' '}
            <strong>{data.guardianName}</strong> as guardian of their persons and property.
          </p>
        </>
      )}

      <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE IV - DISTRIBUTION</h3>
      <p className="mb-4 text-justify">
        I direct that all my just debts, funeral expenses, and costs of administration be paid 
        from my estate. The remainder of my estate shall be distributed according to applicable 
        state law unless otherwise specified below.
      </p>

      <div className="mt-16 pt-8 border-t border-gray-300">
        <p className="mb-8">IN WITNESS WHEREOF, I have signed this Will on this _____ day of _______________, 20____.</p>
        
        <div className="mt-12">
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <p className="text-sm">{data.testatorName || '[YOUR NAME]'}, Testator</p>
        </div>

        <h4 className="text-md font-bold mt-12 mb-4">WITNESSES</h4>
        <p className="text-sm mb-8 text-gray-600">
          The foregoing instrument was signed, published, and declared by the above-named Testator 
          as their Last Will and Testament in our presence, and we, at their request and in their 
          presence and in the presence of each other, have subscribed our names as witnesses.
        </p>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <div className="border-b border-gray-400 mb-2"></div>
            <p className="text-sm">Witness 1 Signature</p>
            <div className="border-b border-gray-400 mt-4 mb-2"></div>
            <p className="text-sm">Print Name</p>
            <div className="border-b border-gray-400 mt-4 mb-2"></div>
            <p className="text-sm">Address</p>
          </div>
          <div>
            <div className="border-b border-gray-400 mb-2"></div>
            <p className="text-sm">Witness 2 Signature</p>
            <div className="border-b border-gray-400 mt-4 mb-2"></div>
            <p className="text-sm">Print Name</p>
            <div className="border-b border-gray-400 mt-4 mb-2"></div>
            <p className="text-sm">Address</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderTrustPreview(data: Record<string, any>) {
  return (
    <div className="text-gray-900 leading-relaxed">
      <h1 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
        {documentTitles.trust}
      </h1>
      <h2 className="text-lg font-semibold text-center mb-8">
        {data.trustName || '[TRUST NAME]'}
      </h2>

      <p className="mb-6 text-justify">
        This Revocable Living Trust Agreement (the "Trust") is made on this _____ day of 
        _______________, 20____, by <strong>{data.trustorName || '[TRUSTOR NAME]'}</strong> 
        (the "Trustor").
      </p>

      <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE I - TRUST CREATION</h3>
      <p className="mb-4 text-justify">
        The Trustor hereby creates this Trust and transfers the property listed in Schedule A 
        attached hereto. Additional property may be added to this Trust from time to time.
      </p>

      <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE II - TRUSTEE</h3>
      <p className="mb-4 text-justify">
        <strong>{data.trusteeName || '[TRUSTEE NAME]'}</strong> shall serve as Trustee. 
        If the Trustee is unable or unwilling to serve,{' '}
        <strong>{data.successorTrusteeName || '[SUCCESSOR TRUSTEE]'}</strong> shall serve as 
        Successor Trustee.
      </p>

      <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE III - BENEFICIARIES</h3>
      {data.beneficiary1Name && (
        <p className="mb-2">
          • <strong>{data.beneficiary1Name}</strong>: {data.beneficiary1Share || 'As determined by Trustee'}
        </p>
      )}
      {data.beneficiary2Name && (
        <p className="mb-2">
          • <strong>{data.beneficiary2Name}</strong>: {data.beneficiary2Share || 'As determined by Trustee'}
        </p>
      )}

      <h3 className="text-lg font-bold mt-8 mb-4">ARTICLE IV - REVOCABILITY</h3>
      <p className="mb-4 text-justify">
        This Trust is revocable. The Trustor reserves the right to revoke, amend, or modify 
        this Trust at any time during their lifetime.
      </p>

      <div className="mt-16 pt-8 border-t border-gray-300">
        <p className="mb-8">IN WITNESS WHEREOF, the Trustor has executed this Trust Agreement.</p>
        
        <div className="mt-12">
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <p className="text-sm">{data.trustorName || '[TRUSTOR NAME]'}, Trustor</p>
        </div>

        <div className="mt-8">
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <p className="text-sm">{data.trusteeName || '[TRUSTEE NAME]'}, Trustee</p>
        </div>
      </div>
    </div>
  )
}

function renderPOAPreview(data: Record<string, any>) {
  return (
    <div className="text-gray-900 leading-relaxed">
      <h1 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
        {documentTitles.poa}
      </h1>

      <p className="mb-6 text-justify">
        I, <strong>{data.principalName || '[YOUR NAME]'}</strong>, of{' '}
        <strong>{data.principalCity || '[CITY]'}</strong>,{' '}
        <strong>{data.principalCounty || '[COUNTY]'}</strong>,{' '}
        <strong>{data.principalState || '[STATE]'}</strong>, hereby appoint:
      </p>

      <p className="mb-6 text-center font-bold text-lg">
        {data.agentName || '[AGENT NAME]'}
      </p>

      <p className="mb-6 text-justify">
        as my Attorney-in-Fact ("Agent") to act in my name, place, and stead in any way which 
        I myself could do, if I were personally present, with respect to the following matters:
      </p>

      <h3 className="text-lg font-bold mt-8 mb-4">POWERS GRANTED</h3>
      {data.generalPowers && (
        <p className="mb-4 text-justify">
          ☑ <strong>General Financial Powers</strong>: My Agent shall have full power and authority 
          to manage all of my financial affairs, including but not limited to banking, investments, 
          real estate, and business transactions.
        </p>
      )}
      
      {data.specificPowers && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Specific Powers:</p>
          <p className="text-justify">{data.specificPowers}</p>
        </div>
      )}

      <h3 className="text-lg font-bold mt-8 mb-4">EFFECTIVE DATE</h3>
      <p className="mb-4 text-justify">
        {data.immediatelyEffective 
          ? 'This Power of Attorney is effective immediately upon execution.'
          : 'This Power of Attorney shall become effective upon my incapacity as certified by a licensed physician.'}
      </p>

      <h3 className="text-lg font-bold mt-8 mb-4">DURABILITY</h3>
      <p className="mb-4 text-justify">
        This Power of Attorney shall not be affected by my subsequent disability or incapacity.
      </p>

      {data.successorAgentName && (
        <>
          <h3 className="text-lg font-bold mt-8 mb-4">SUCCESSOR AGENT</h3>
          <p className="mb-4 text-justify">
            If my Agent is unable or unwilling to serve, I appoint{' '}
            <strong>{data.successorAgentName}</strong> as my Successor Agent.
          </p>
        </>
      )}

      <div className="mt-16 pt-8 border-t border-gray-300">
        <p className="mb-8">IN WITNESS WHEREOF, I have executed this Power of Attorney on this _____ day of _______________, 20____.</p>
        
        <div className="mt-12">
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <p className="text-sm">{data.principalName || '[YOUR NAME]'}, Principal</p>
        </div>

        <h4 className="text-md font-bold mt-12 mb-4">NOTARY ACKNOWLEDGMENT</h4>
        <p className="text-sm text-gray-600">
          State of ________________<br/>
          County of ________________<br/><br/>
          On this _____ day of _______________, 20____, before me, the undersigned notary public, 
          personally appeared {data.principalName || '[YOUR NAME]'}, proved to me on the basis of 
          satisfactory evidence to be the person whose name is subscribed to this instrument, and 
          acknowledged that they executed the same.
        </p>
        <div className="mt-8">
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <p className="text-sm">Notary Public</p>
        </div>
      </div>
    </div>
  )
}

function renderAHCDPreview(data: Record<string, any>) {
  return (
    <div className="text-gray-900 leading-relaxed">
      <h1 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
        {documentTitles.ahcd}
      </h1>

      <p className="mb-6 text-justify">
        I, <strong>{data.principalName || '[YOUR NAME]'}</strong>, being of sound mind, 
        willfully and voluntarily make this Advance Healthcare Directive.
      </p>

      <h3 className="text-lg font-bold mt-8 mb-4">PART I: HEALTHCARE AGENT</h3>
      <p className="mb-4 text-justify">
        I designate the following person as my Healthcare Agent to make healthcare decisions for me:
      </p>
      <div className="bg-gray-50 p-4 rounded mb-4">
        <p><strong>Name:</strong> {data.healthCareAgent || '[AGENT NAME]'}</p>
        <p><strong>Phone:</strong> {data.healthCareAgentPhone || '[PHONE]'}</p>
        <p><strong>Address:</strong> {data.healthCareAgentAddress || '[ADDRESS]'}</p>
        <p><strong>Email:</strong> {data.healthCareAgentEmail || '[EMAIL]'}</p>
      </div>

      <h3 className="text-lg font-bold mt-8 mb-4">PART II: HEALTHCARE INSTRUCTIONS</h3>
      
      <h4 className="font-semibold mt-4 mb-2">End-of-Life Decisions:</h4>
      <p className="mb-4 text-justify">
        {data.lifeSustainingTreatment === 'not-prolong' 
          ? 'I do NOT want my life prolonged if I have an incurable and irreversible condition that will result in my death within a relatively short time, or if I become unconscious and there is reasonable medical certainty that I will not regain consciousness.'
          : data.lifeSustainingTreatment === 'prolong'
          ? 'I WANT my life prolonged as long as possible within the limits of generally accepted health care standards.'
          : 'I want my Healthcare Agent to make end-of-life decisions on my behalf.'}
      </p>

      <h4 className="font-semibold mt-4 mb-2">Pain Management:</h4>
      <p className="mb-4 text-justify">
        I want {data.painManagement === 'aggressive' ? 'aggressive' : data.painManagement === 'moderate' ? 'moderate' : 'minimal'} pain 
        relief measures, even if they may hasten my death.
      </p>

      {data.endOfLifeWishes && (
        <>
          <h4 className="font-semibold mt-4 mb-2">Additional Instructions:</h4>
          <p className="mb-4 text-justify">{data.endOfLifeWishes}</p>
        </>
      )}

      <h3 className="text-lg font-bold mt-8 mb-4">PART III: ORGAN DONATION</h3>
      <p className="mb-4 text-justify">
        {data.personalOrganDonation 
          ? 'I CONSENT to donate my organs and tissues for transplantation upon my death.'
          : 'I do NOT consent to organ donation.'}
      </p>

      {data.primaryPhysicianName && (
        <>
          <h3 className="text-lg font-bold mt-8 mb-4">PRIMARY PHYSICIAN</h3>
          <p className="mb-4">
            <strong>Name:</strong> {data.primaryPhysicianName}<br/>
            <strong>Phone:</strong> {data.primaryPhysicianPhone || '[PHONE]'}
          </p>
        </>
      )}

      <div className="mt-16 pt-8 border-t border-gray-300">
        <p className="mb-8">I sign this Advance Healthcare Directive on this _____ day of _______________, 20____.</p>
        
        <div className="mt-12">
          <div className="border-b border-gray-400 w-64 mb-2"></div>
          <p className="text-sm">{data.principalName || '[YOUR NAME]'}</p>
        </div>

        <h4 className="text-md font-bold mt-12 mb-4">WITNESSES</h4>
        <p className="text-sm mb-8 text-gray-600">
          We declare that the person who signed this document, or asked another to sign on their 
          behalf, did so in our presence, that they appear to be of sound mind and under no duress, 
          fraud, or undue influence.
        </p>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <div className="border-b border-gray-400 mb-2"></div>
            <p className="text-sm">Witness 1 Signature</p>
            <div className="border-b border-gray-400 mt-4 mb-2"></div>
            <p className="text-sm">Print Name & Address</p>
          </div>
          <div>
            <div className="border-b border-gray-400 mb-2"></div>
            <p className="text-sm">Witness 2 Signature</p>
            <div className="border-b border-gray-400 mt-4 mb-2"></div>
            <p className="text-sm">Print Name & Address</p>
          </div>
        </div>
      </div>
    </div>
  )
}
