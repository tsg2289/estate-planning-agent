import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'

// California Counties List
const CALIFORNIA_COUNTIES = [
  'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa',
  'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt', 'Imperial', 'Inyo',
  'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles', 'Madera', 'Marin', 'Mariposa',
  'Mendocino', 'Merced', 'Modoc', 'Mono', 'Monterey', 'Napa', 'Nevada', 'Orange',
  'Placer', 'Plumas', 'Riverside', 'Sacramento', 'San Benito', 'San Bernardino',
  'San Diego', 'San Francisco', 'San Joaquin', 'San Luis Obispo', 'San Mateo',
  'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou',
  'Solano', 'Sonoma', 'Stanislaus', 'Sutter', 'Tehama', 'Trinity', 'Tulare',
  'Tuolumne', 'Ventura', 'Yolo', 'Yuba'
]

// US States and Territories List
const US_STATES_AND_TERRITORIES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'American Samoa', 'District of Columbia', 'Guam', 'Northern Mariana Islands',
  'Puerto Rico', 'U.S. Virgin Islands'
]

const WillForm = ({ onSubmit }) => {
  const initialData = {
    testatorName: '',
    testatorAddress: '',
    testatorCity: '',
    testatorCounty: '',
    testatorState: '',
    testatorZip: '',
    testatorPhone: '',
    testatorEmail: '',
    isMarried: '',
    spouseName: '',
    hasChildren: '',
    childrenNames: [''],
    trustName: '',
    executorType: 'single', // 'single' or 'co-executors'
    executors: [{
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }],
    guardians: [{
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }],
    witnesses: [{
      name: '',
      address: '',
      city: '',
      county: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }, {
      name: '',
      address: '',
      city: '',
      county: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }],
    funeralWishes: '',
    additionalInstructions: '',
    attestationDate: ''
  }

  const {
    formData,
    setFormData,
    isLoading,
    saveStatus,
    progressPercentage,
    saveProgress,
    clearProgress,
    getSaveStatusMessage,
    getSaveStatusColor
  } = useFormProgress('will', initialData)

  // Ensure childrenNames, executors, guardians, and witnesses are always arrays (safety check)
  const safeFormData = {
    ...formData,
    childrenNames: Array.isArray(formData.childrenNames) ? formData.childrenNames : [''],
    executors: Array.isArray(formData.executors) ? formData.executors : [{
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }],
    guardians: Array.isArray(formData.guardians) ? formData.guardians : [{
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }],
    witnesses: Array.isArray(formData.witnesses) ? formData.witnesses : [{
      name: '',
      address: '',
      city: '',
      county: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }, {
      name: '',
      address: '',
      city: '',
      county: '',
      state: '',
      zip: '',
      phone: '',
      email: ''
    }]
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleChildNameChange = (index, value) => {
    const newChildrenNames = [...safeFormData.childrenNames]
    newChildrenNames[index] = value
    setFormData(prev => ({
      ...prev,
      childrenNames: newChildrenNames
    }))
  }

  const addChildName = () => {
    if (safeFormData.childrenNames.length < 10) {
      setFormData(prev => ({
        ...prev,
        childrenNames: [...(Array.isArray(prev.childrenNames) ? prev.childrenNames : ['']), '']
      }))
    }
  }

  const removeChildName = (index) => {
    if (safeFormData.childrenNames.length > 1) {
      setFormData(prev => ({
        ...prev,
        childrenNames: (Array.isArray(prev.childrenNames) ? prev.childrenNames : ['']).filter((_, i) => i !== index)
      }))
    }
  }

  // Handle executor changes
  const handleExecutorChange = (index, field, value) => {
    const newExecutors = [...safeFormData.executors]
    newExecutors[index] = { ...newExecutors[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      executors: newExecutors
    }))
  }

  // Add new executor
  const addExecutor = () => {
    if (safeFormData.executors.length < 5) {
      setFormData(prev => ({
        ...prev,
        executors: [...(Array.isArray(prev.executors) ? prev.executors : [{ name: '', address: '', city: '', state: '', zip: '', phone: '', email: '' }]), {
          name: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          email: ''
        }]
      }))
    }
  }

  // Remove executor
  const removeExecutor = (index) => {
    if (safeFormData.executors.length > 1) {
      setFormData(prev => ({
        ...prev,
        executors: (Array.isArray(prev.executors) ? prev.executors : [{ name: '', address: '', city: '', state: '', zip: '', phone: '', email: '' }]).filter((_, i) => i !== index)
      }))
    }
  }

  // Handle guardian changes
  const handleGuardianChange = (index, field, value) => {
    const newGuardians = [...safeFormData.guardians]
    newGuardians[index] = { ...newGuardians[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      guardians: newGuardians
    }))
  }

  // Add new guardian
  const addGuardian = () => {
    if (safeFormData.guardians.length < 5) {
      setFormData(prev => ({
        ...prev,
        guardians: [...(Array.isArray(prev.guardians) ? prev.guardians : [{ name: '', address: '', city: '', state: '', zip: '', phone: '', email: '' }]), {
          name: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          email: ''
        }]
      }))
    }
  }

  // Remove guardian
  const removeGuardian = (index) => {
    if (safeFormData.guardians.length > 1) {
      setFormData(prev => ({
        ...prev,
        guardians: (Array.isArray(prev.guardians) ? prev.guardians : [{ name: '', address: '', city: '', state: '', zip: '', phone: '', email: '' }]).filter((_, i) => i !== index)
      }))
    }
  }


  const handleWitnessChange = (index, field, value) => {
    const newWitnesses = [...safeFormData.witnesses]
    newWitnesses[index] = { ...newWitnesses[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      witnesses: newWitnesses
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Save final progress before submitting
    await saveProgress()
    
    // Mark as completed and submit
    onSubmit(formData)
  }

  const handleClearProgress = async () => {
    if (window.confirm('Are you sure you want to clear all saved progress? This action cannot be undone.')) {
      await clearProgress()
    }
  }

  if (isLoading) {
    return (
      <div className="form-loading">
        <div className="loading-spinner"></div>
        <p>Loading your saved progress...</p>
      </div>
    )
  }

  return (
    <div className="will-form-container">
      <form onSubmit={handleSubmit} className="will-form">
          <h2>{formData.testatorName ? `${formData.testatorName.toUpperCase()}'S POUR-OVER WILL` : 'Pour-Over Will'}</h2>
        
        {/* Testator Information */}
        <div className="form-section">
          <h3>Your Information</h3>
          <div className="form-group">
            <label className="form-label">Full Legal Name</label>
            <input
              type="text"
              name="testatorName"
              value={formData.testatorName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="testatorAddress"
              value={formData.testatorAddress}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="testatorCity"
                value={formData.testatorCity}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">County</label>
              <select
                name="testatorCounty"
                value={formData.testatorCounty}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select a County</option>
                {CALIFORNIA_COUNTIES.map(county => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State</label>
              <select
                name="testatorState"
                value={formData.testatorState}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select State</option>
                {US_STATES_AND_TERRITORIES.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input
                type="text"
                name="testatorZip"
                value={formData.testatorZip}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="testatorPhone"
                value={formData.testatorPhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="testatorEmail"
                value={formData.testatorEmail}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="form-section">
          <h3>Family Information</h3>
          
          {/* Marriage Status */}
          <div className="form-group marital-status-section">
            <label className="form-label marital-status-label">Marital Status</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isMarried"
                  value="married"
                  checked={formData.isMarried === 'married'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">Married</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isMarried"
                  value="single"
                  checked={formData.isMarried === 'single'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">Single</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isMarried"
                  value="divorced"
                  checked={formData.isMarried === 'divorced'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">Divorced</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isMarried"
                  value="widowed"
                  checked={formData.isMarried === 'widowed'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">Widowed</span>
              </label>
            </div>
          </div>

          {/* Conditional Spouse Name Field */}
          {formData.isMarried === 'married' && (
            <div className="form-group">
              <label className="form-label">Spouse's Full Name</label>
              <input
                type="text"
                name="spouseName"
                value={formData.spouseName}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Enter spouse's full legal name"
              />
            </div>
          )}
          
          {/* Children Status */}
          <div className="form-group">
            <label className="form-label">Do you have children?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasChildren"
                  value="yes"
                  checked={formData.hasChildren === 'yes'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">Have Children</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasChildren"
                  value="no"
                  checked={formData.hasChildren === 'no'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">No Children</span>
              </label>
            </div>
          </div>

          {/* Conditional Children Names Fields */}
          {formData.hasChildren === 'yes' && (
            <div className="form-group">
              <label className="form-label">Children's Names</label>
              {safeFormData.childrenNames.map((childName, index) => (
                <div key={index} className="child-name-input-group">
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => handleChildNameChange(index, e.target.value)}
                    className="form-input"
                    required
                    placeholder={`Child ${index + 1} full name`}
                  />
                  {safeFormData.childrenNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChildName(index)}
                      className="remove-child-button"
                      aria-label="Remove child"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {safeFormData.childrenNames.length < 10 && (
                <button
                  type="button"
                  onClick={addChildName}
                  className="add-child-button"
                >
                  + Add Another Child
                </button>
              )}
            </div>
          )}
        </div>

        {/* Trust Information */}
        <div className="form-section">
          <h3>Trust Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trust Name</label>
              <input
                type="text"
                name="trustName"
                value={formData.trustName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Executor Information */}
        <div className="form-section">
          <h3>Executors (Personal Representatives)</h3>
          
          {/* Executor Type Selection */}
          <div className="form-group executor-type-section">
            <label className="form-label">Executor Configuration</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="executorType"
                  value="single"
                  checked={formData.executorType === 'single'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">Single Executor (with successor)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="executorType"
                  value="co-executors"
                  checked={formData.executorType === 'co-executors'}
                  onChange={handleInputChange}
                  required
                />
                <span className="radio-text">Co-Executors (serve together)</span>
              </label>
            </div>
            <div className="executor-type-explanation">
              {formData.executorType === 'single' && (
                <p className="explanation-text">
                  <strong>Single Executor:</strong> One person serves as the primary executor. If they cannot serve, the successor executor takes over.
                </p>
              )}
              {formData.executorType === 'co-executors' && (
                <p className="explanation-text">
                  <strong>Co-Executors:</strong> Two people serve together as co-executors with equal authority. Both must agree on major decisions.
                </p>
              )}
            </div>
          </div>
          {safeFormData.executors.map((executor, index) => {
            let executorTitle = '';
            if (formData.executorType === 'co-executors') {
              if (index === 0) executorTitle = 'Co-Executor #1';
              else if (index === 1) executorTitle = 'Co-Executor #2';
              else executorTitle = `Successor Executor ${index - 1}`;
            } else {
              if (index === 0) executorTitle = 'Primary Executor';
              else executorTitle = `Successor Executor ${index}`;
            }
            
            return (
            <div key={index} className="executor-input-group">
              <div className="executor-header">
                <h4>{executorTitle}</h4>
                {/* Only show remove button for appropriate executors */}
                {((formData.executorType === 'single' && safeFormData.executors.length > 1 && index > 0) ||
                  (formData.executorType === 'co-executors' && safeFormData.executors.length > 2 && index > 1)) && (
                  <button
                    type="button"
                    onClick={() => removeExecutor(index)}
                    className="remove-executor-button"
                    aria-label="Remove executor"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={executor.name}
                  onChange={(e) => handleExecutorChange(index, 'name', e.target.value)}
                  className="form-input"
                  required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  placeholder={`${executorTitle} full name`}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={executor.address}
                  onChange={(e) => handleExecutorChange(index, 'address', e.target.value)}
                  className="form-input"
                  required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  placeholder="Street address"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={executor.city}
                    onChange={(e) => handleExecutorChange(index, 'city', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    value={executor.state}
                    onChange={(e) => handleExecutorChange(index, 'state', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  >
                    <option value="">Select State</option>
                    {US_STATES_AND_TERRITORIES.map((state, stateIndex) => (
                      <option key={stateIndex} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    value={executor.zip}
                    onChange={(e) => handleExecutorChange(index, 'zip', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={executor.phone}
                    onChange={(e) => handleExecutorChange(index, 'phone', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={executor.email}
                  onChange={(e) => handleExecutorChange(index, 'email', e.target.value)}
                  className="form-input"
                  required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                />
              </div>
            </div>
            );
          })}
          
          {/* Add Executor Button - conditional based on executor type */}
          {((formData.executorType === 'single' && safeFormData.executors.length < 5) ||
            (formData.executorType === 'co-executors' && safeFormData.executors.length === 1)) && (
            <button
              type="button"
              onClick={addExecutor}
              className="add-executor-button"
            >
              {formData.executorType === 'co-executors' && safeFormData.executors.length === 1
                ? '+ Add Co-Executor #2 (Required)'
                : '+ Add Successor Executor'
              }
            </button>
          )}
          
          {/* Add successor executors for co-executor setup */}
          {formData.executorType === 'co-executors' && safeFormData.executors.length >= 2 && safeFormData.executors.length < 5 && (
            <button
              type="button"
              onClick={addExecutor}
              className="add-executor-button"
            >
              + Add Successor Executor
            </button>
          )}
        </div>

        {/* Guardian Information */}
        <div className="form-section">
          <h3>Guardians for Minor Children</h3>
          {safeFormData.guardians.map((guardian, index) => (
            <div key={index} className="guardian-input-group">
              <div className="guardian-header">
                <h4>{index === 0 ? 'Primary Guardian' : `Guardian ${index + 1}`}</h4>
                {safeFormData.guardians.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGuardian(index)}
                    className="remove-guardian-button"
                    aria-label="Remove guardian"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={guardian.name}
                  onChange={(e) => handleGuardianChange(index, 'name', e.target.value)}
                  className="form-input"
                  required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  placeholder={`${index === 0 ? 'Primary' : 'Alternate'} guardian full name`}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={guardian.address}
                  onChange={(e) => handleGuardianChange(index, 'address', e.target.value)}
                  className="form-input"
                  required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  placeholder="Street address"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={guardian.city}
                    onChange={(e) => handleGuardianChange(index, 'city', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    value={guardian.state}
                    onChange={(e) => handleGuardianChange(index, 'state', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  >
                    <option value="">Select State</option>
                    {US_STATES_AND_TERRITORIES.map((state, stateIndex) => (
                      <option key={stateIndex} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    value={guardian.zip}
                    onChange={(e) => handleGuardianChange(index, 'zip', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={guardian.phone}
                    onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)}
                    className="form-input"
                    required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={guardian.email}
                  onChange={(e) => handleGuardianChange(index, 'email', e.target.value)}
                  className="form-input"
                  required={formData.executorType === 'co-executors' ? index < 2 : index === 0}
                />
              </div>
            </div>
          ))}
          
          {safeFormData.guardians.length < 5 && (
            <button
              type="button"
              onClick={addGuardian}
              className="add-guardian-button"
            >
              + Add Another Guardian
            </button>
          )}
        </div>

        {/* Assets and Bequests */}
        <div className="form-section">
          <h3>Assets and Bequests</h3>
          
          <div className="pour-over-explanation">
            <div className="info-box">
              <h4>🔒 Pour-Over Will Protection</h4>
              <p>
                All bequests will be poured over into your trust because wills are made public documents. 
                This protects your privacy by keeping the details of your estate distribution confidential 
                within your trust documents.
              </p>
              <p>
                Your will serves as a safety net to ensure any assets not already in your trust are 
                automatically transferred to your trust upon your death, where they will be distributed 
                according to your trust's private instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="form-section">
          <h3>Additional Instructions</h3>
          
          <div className="form-group">
            <label className="form-label">Funeral and Burial Wishes</label>
            <textarea
              name="funeralWishes"
              value={formData.funeralWishes}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Any specific wishes for funeral arrangements, burial, or cremation..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Additional Instructions</label>
            <textarea
              name="additionalInstructions"
              value={formData.additionalInstructions}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Any other instructions or wishes you'd like to include..."
            />
          </div>
        </div>

        {/* Witnesses */}
        <div className="form-section">
          <h3>Witnesses</h3>
          
          {safeFormData.witnesses.map((witness, index) => (
            <div key={index} className="witness-section">
              <h4>Witness #{index + 1}</h4>
              
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={witness.name || ''}
                  onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              {/* Address */}
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={witness.address || ''}
                  onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              {/* City and County */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={witness.city || ''}
                    onChange={(e) => handleWitnessChange(index, 'city', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">County</label>
                  <select
                    value={witness.county || ''}
                    onChange={(e) => handleWitnessChange(index, 'county', e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select County</option>
                    {CALIFORNIA_COUNTIES.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* State and ZIP */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    value={witness.state || ''}
                    onChange={(e) => handleWitnessChange(index, 'state', e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select State</option>
                    {US_STATES_AND_TERRITORIES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    value={witness.zip || ''}
                    onChange={(e) => handleWitnessChange(index, 'zip', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              {/* Phone and Email */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={witness.phone || ''}
                    onChange={(e) => handleWitnessChange(index, 'phone', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={witness.email || ''}
                    onChange={(e) => handleWitnessChange(index, 'email', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="form-group">
            <label className="form-label">Attestation Date</label>
            <input
              type="date"
              name="attestationDate"
              value={formData.attestationDate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Save Progress Button */}
        <div className="form-buttons">
          <button 
            type="button" 
            onClick={saveProgress} 
            className="form-button save-button"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Progress'}
          </button>
          
          <button type="submit" className="form-button">
            Complete Will
          </button>
        </div>
      </form>
    </div>
  )
}

export default WillForm
