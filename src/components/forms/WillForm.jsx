import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'
import ProgressIndicator from '../ProgressIndicator'

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
    testatorSSN: '',
    testatorDOB: '',
    isMarried: '',
    spouseName: '',
    hasChildren: '',
    childrenNames: [''],
    trustName: '',
    trustDate: '',
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
    witness1Name: '',
    witness1Address: '',
    witness2Name: '',
    witness2Address: '',
    assets: [{ description: '', value: '', beneficiary: '' }],
    hasSpecialBequests: '',
    specificBequests: [{
      name: '',
      relation: '',
      property: ''
    }],
    residualBeneficiaries: '',
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

  // Ensure childrenNames, executors, guardians, and specificBequests are always arrays (safety check)
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
    specificBequests: Array.isArray(formData.specificBequests) ? formData.specificBequests : [{
      name: '',
      relation: '',
      property: ''
    }]
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAssetChange = (index, field, value) => {
    const newAssets = [...formData.assets]
    newAssets[index][field] = value
    setFormData(prev => ({
      ...prev,
      assets: newAssets
    }))
  }

  const addAsset = () => {
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, { description: '', value: '', beneficiary: '' }]
    }))
  }

  const removeAsset = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
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

  // Handle specific bequest changes
  const handleBequestChange = (index, field, value) => {
    const newBequests = [...safeFormData.specificBequests]
    newBequests[index] = { ...newBequests[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      specificBequests: newBequests
    }))
  }

  // Add new specific bequest
  const addBequest = () => {
    if (safeFormData.specificBequests.length < 15) {
      setFormData(prev => ({
        ...prev,
        specificBequests: [...(Array.isArray(prev.specificBequests) ? prev.specificBequests : [{ name: '', relation: '', property: '' }]), {
          name: '',
          relation: '',
          property: ''
        }]
      }))
    }
  }

  // Remove specific bequest
  const removeBequest = (index) => {
    if (safeFormData.specificBequests.length > 1) {
      setFormData(prev => ({
        ...prev,
        specificBequests: (Array.isArray(prev.specificBequests) ? prev.specificBequests : [{ name: '', relation: '', property: '' }]).filter((_, i) => i !== index)
      }))
    }
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
      <ProgressIndicator
        saveStatus={saveStatus}
        progressPercentage={progressPercentage}
        onSaveClick={saveProgress}
        onClearClick={handleClearProgress}
      />
      
              <form onSubmit={handleSubmit} className="will-form">
          <h2>{formData.testatorName ? `${formData.testatorName.toUpperCase()}'S POUR-OVER WILL` : 'Pour-Over Will'}</h2>
        
        {/* Testator Information */}
        <div className="form-section">
          <h3>Your Information</h3>
          <div className="form-row">
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
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="testatorDOB"
                value={formData.testatorDOB}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
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
              <input
                type="text"
                name="testatorState"
                value={formData.testatorState}
                onChange={handleInputChange}
                className="form-input"
                required
              />
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
          <div className="form-group">
            <label className="form-label">Marital Status</label>
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
            <div className="form-group">
              <label className="form-label">Trust Date</label>
              <input
                type="date"
                name="trustDate"
                value={formData.trustDate}
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
          {safeFormData.executors.map((executor, index) => (
            <div key={index} className="executor-input-group">
              <div className="executor-header">
                <h4>{index === 0 ? 'Primary Executor' : `Executor ${index + 1}`}</h4>
                {safeFormData.executors.length > 1 && (
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
                  required={index === 0}
                  placeholder={`${index === 0 ? 'Primary' : 'Alternate'} executor full name`}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={executor.address}
                  onChange={(e) => handleExecutorChange(index, 'address', e.target.value)}
                  className="form-input"
                  required={index === 0}
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
                    required={index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={executor.state}
                    onChange={(e) => handleExecutorChange(index, 'state', e.target.value)}
                    className="form-input"
                    required={index === 0}
                  />
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
                    required={index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={executor.phone}
                    onChange={(e) => handleExecutorChange(index, 'phone', e.target.value)}
                    className="form-input"
                    required={index === 0}
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
                  required={index === 0}
                />
              </div>
            </div>
          ))}
          
          {safeFormData.executors.length < 5 && (
            <button
              type="button"
              onClick={addExecutor}
              className="add-executor-button"
            >
              + Add Another Executor
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
                  required={index === 0}
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
                  required={index === 0}
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
                    required={index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={guardian.state}
                    onChange={(e) => handleGuardianChange(index, 'state', e.target.value)}
                    className="form-input"
                    required={index === 0}
                  />
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
                    required={index === 0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={guardian.phone}
                    onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)}
                    className="form-input"
                    required={index === 0}
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
                  required={index === 0}
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
          
          <div className="form-group">
            <label className="form-label">Special Bequests</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasSpecialBequests"
                  value="no"
                  checked={formData.hasSpecialBequests === 'no'}
                  onChange={handleInputChange}
                />
                <span className="radio-text">No Special Bequests</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasSpecialBequests"
                  value="yes"
                  checked={formData.hasSpecialBequests === 'yes'}
                  onChange={handleInputChange}
                />
                <span className="radio-text">Have Special Bequests</span>
              </label>
            </div>
          </div>

          {formData.hasSpecialBequests === 'yes' && (
            <div className="form-group">
              <label className="form-label">Special Bequests Details</label>
              {safeFormData.specificBequests.map((bequest, index) => (
                <div key={index} className="bequest-input-group">
                  <div className="bequest-header">
                    <h4>Bequest {index + 1}</h4>
                    {safeFormData.specificBequests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBequest(index)}
                        className="remove-bequest-button"
                        aria-label="Remove bequest"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Beneficiary Name</label>
                      <input
                        type="text"
                        value={bequest.name}
                        onChange={(e) => handleBequestChange(index, 'name', e.target.value)}
                        className="form-input"
                        required
                        placeholder="Full name of beneficiary"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Relation to You</label>
                      <input
                        type="text"
                        value={bequest.relation}
                        onChange={(e) => handleBequestChange(index, 'relation', e.target.value)}
                        className="form-input"
                        required
                        placeholder="e.g., son, daughter, friend"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Property/Item Given</label>
                    <textarea
                      value={bequest.property}
                      onChange={(e) => handleBequestChange(index, 'property', e.target.value)}
                      className="form-textarea"
                      required
                      placeholder="Describe the specific property, item, or amount being given..."
                      rows="3"
                    />
                  </div>
                </div>
              ))}
              
              {safeFormData.specificBequests.length < 15 && (
                <button
                  type="button"
                  onClick={addBequest}
                  className="add-bequest-button"
                >
                  + Add Another Bequest
                </button>
              )}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Residual Beneficiaries</label>
            <textarea
              name="residualBeneficiaries"
              value={formData.residualBeneficiaries}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Who should receive the remainder of your estate after specific bequests..."
              required
            />
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
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Witness #1 Name</label>
              <input
                type="text"
                name="witness1Name"
                value={formData.witness1Name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Witness #1 Address</label>
              <input
                type="text"
                name="witness1Address"
                value={formData.witness1Address}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Witness #2 Name</label>
              <input
                type="text"
                name="witness2Name"
                value={formData.witness2Name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Witness #2 Address</label>
              <input
                type="text"
                name="witness2Address"
                value={formData.witness2Address}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
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

        <button type="submit" className="form-button">
          Complete Will
        </button>
      </form>
    </div>
  )
}

export default WillForm
