'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { MapPinIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'Washington D.C.' },
]

// State-specific requirements
export const STATE_REQUIREMENTS: Record<string, {
  witnessCount: number
  notaryRequired: boolean
  selfProvingAffidavit: boolean
  holographicWillAllowed: boolean
  notes: string[]
}> = {
  CA: {
    witnessCount: 2,
    notaryRequired: false,
    selfProvingAffidavit: true,
    holographicWillAllowed: true,
    notes: ['Witnesses must be at least 18 years old', 'Holographic (handwritten) wills are valid']
  },
  NY: {
    witnessCount: 2,
    notaryRequired: false,
    selfProvingAffidavit: true,
    holographicWillAllowed: false,
    notes: ['Witnesses must sign within 30 days', 'Video wills are not valid']
  },
  TX: {
    witnessCount: 2,
    notaryRequired: false,
    selfProvingAffidavit: true,
    holographicWillAllowed: true,
    notes: ['Holographic wills must be entirely in testator\'s handwriting', 'No witnesses required for holographic wills']
  },
  FL: {
    witnessCount: 2,
    notaryRequired: true,
    selfProvingAffidavit: true,
    holographicWillAllowed: false,
    notes: ['Notarization required for self-proving affidavit', 'Electronic wills allowed under certain conditions']
  },
  // Add more states as needed...
  DEFAULT: {
    witnessCount: 2,
    notaryRequired: false,
    selfProvingAffidavit: true,
    holographicWillAllowed: false,
    notes: ['Standard requirements apply', 'Consult a local attorney for state-specific requirements']
  }
}

interface StateSelectorProps {
  value: string
  onChange: (state: string) => void
  className?: string
}

export function StateSelector({ value, onChange, className = '' }: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedState = US_STATES.find(s => s.code === value)
  
  const filteredStates = US_STATES.filter(state => 
    state.name.toLowerCase().includes(search.toLowerCase()) ||
    state.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900 dark:text-white">
            {selectedState ? selectedState.name : 'Select your state'}
          </span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Search states..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredStates.map(state => (
                <button
                  key={state.code}
                  onClick={() => {
                    onChange(state.code)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === state.code ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <span className="text-gray-900 dark:text-white">{state.name}</span>
                  {value === state.code && (
                    <CheckIcon className="w-5 h-5 text-primary-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Display state requirements
export function StateRequirements({ stateCode }: { stateCode: string }) {
  const requirements = STATE_REQUIREMENTS[stateCode] || STATE_REQUIREMENTS.DEFAULT
  const state = US_STATES.find(s => s.code === stateCode)

  return (
    <GlassCard className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <MapPinIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900 dark:text-blue-100">
            {state?.name || 'State'} Requirements
          </h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• {requirements.witnessCount} witnesses required</li>
            {requirements.notaryRequired && <li>• Notarization required</li>}
            {requirements.selfProvingAffidavit && <li>• Self-proving affidavit recommended</li>}
            {requirements.holographicWillAllowed && <li>• Handwritten (holographic) wills allowed</li>}
          </ul>
          {requirements.notes.length > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {requirements.notes[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
