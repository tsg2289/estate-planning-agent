import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'
import ProgressIndicator from '../ProgressIndicator'

// California Counties List
const CALIFORNIA_COUNTIES = [
  'Alameda County',
  'Alpine County',
  'Amador County',
  'Butte County',
  'Calaveras County',
  'Colusa County',
  'Contra Costa County',
  'Del Norte County',
  'El Dorado County',
  'Fresno County',
  'Glenn County',
  'Humboldt County',
  'Imperial County',
  'Inyo County',
  'Kern County',
  'Kings County',
  'Lake County',
  'Lassen County',
  'Los Angeles County',
  'Madera County',
  'Marin County',
  'Mariposa County',
  'Mendocino County',
  'Merced County',
  'Modoc County',
  'Mono County',
  'Monterey County',
  'Napa County',
  'Nevada County',
  'Orange County',
  'Placer County',
  'Plumas County',
  'Riverside County',
  'Sacramento County',
  'San Benito County',
  'San Bernardino County',
  'San Diego County',
  'San Francisco County',
  'San Joaquin County',
  'San Luis Obispo County',
  'San Mateo County',
  'Santa Barbara County',
  'Santa Clara County',
  'Santa Cruz County',
  'Shasta County',
  'Sierra County',
  'Siskiyou County',
  'Solano County',
  'Sonoma County',
  'Stanislaus County',
  'Sutter County',
  'Tehama County',
  'Trinity County',
  'Tulare County',
  'Tuolumne County',
  'Ventura County',
  'Yolo County',
  'Yuba County'
]

const TrustForm = ({ onSubmit }) => {
  const initialData = {
    trustorName: '',
    trustorAddress: '',
    trustorCity: '',
    trustorCounty: '',
    trustorState: 'California',
    trustorZip: '',
    trustorPhone: '',
    trustorEmail: '',
    hasSecondTrustor: false,
    secondTrustorName: '',
    secondTrustorRelationship: 'spouse',
    secondTrustorAddress: '',
    secondTrustorCity: '',
    secondTrustorCounty: '',
    secondTrustorState: 'California',
    secondTrustorZip: '',
    secondTrustorPhone: '',
    secondTrustorEmail: '',
    trusteeName: '',
    trusteeAddress: '',
    trusteeCity: '',
    trusteeCounty: '',
    trusteePhone: '',
    trusteeEmail: '',
    alternateTrustees: [{ name: '', address: '', city: '', county: '', state: 'California', zip: '', phone: '', email: '' }],
    trustType: 'revocable',
    trustName: '',
    children: [{ name: '', relationship: '', percentage: '' }],
    otherBeneficiaries: [{ name: '', relationship: '', percentage: '' }],
    specificGifts: [{ beneficiary: '', gift: '' }],
    trustAssets: [{ description: '', value: '', type: '' }],
    distributionTerms: '',
    trustPurpose: '',
    additionalProvisions: ''
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
  } = useFormProgress('trust', initialData)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleChildChange = (index, field, value) => {
    const newChildren = [...(formData.children || [])]
    if (newChildren[index]) {
      newChildren[index][field] = value
    }
    setFormData(prev => ({
      ...prev,
      children: newChildren
    }))
  }

  const addChild = () => {
    if ((formData.children || []).length < 10) {
      setFormData(prev => ({
        ...prev,
        children: [...(prev.children || []), { name: '', relationship: '', percentage: '' }]
      }))
    }
  }

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: (prev.children || []).filter((_, i) => i !== index)
    }))
  }

  const handleOtherBeneficiaryChange = (index, field, value) => {
    const newOtherBeneficiaries = [...(formData.otherBeneficiaries || [])]
    if (newOtherBeneficiaries[index]) {
      newOtherBeneficiaries[index][field] = value
    }
    setFormData(prev => ({
      ...prev,
      otherBeneficiaries: newOtherBeneficiaries
    }))
  }

  const addOtherBeneficiary = () => {
    setFormData(prev => ({
      ...prev,
      otherBeneficiaries: [...(prev.otherBeneficiaries || []), { name: '', relationship: '', percentage: '' }]
    }))
  }

  const removeOtherBeneficiary = (index) => {
    setFormData(prev => ({
      ...prev,
      otherBeneficiaries: (prev.otherBeneficiaries || []).filter((_, i) => i !== index)
    }))
  }

  const handleAssetChange = (index, field, value) => {
    const newAssets = [...(formData.trustAssets || [])]
    if (newAssets[index]) {
      newAssets[index][field] = value
    }
    setFormData(prev => ({
      ...prev,
      trustAssets: newAssets
    }))
  }

  const addAsset = () => {
    setFormData(prev => ({
      ...prev,
      trustAssets: [...(prev.trustAssets || []), { description: '', value: '', type: '' }]
    }))
  }

  const removeAsset = (index) => {
    setFormData(prev => ({
      ...prev,
      trustAssets: (prev.trustAssets || []).filter((_, i) => i !== index)
    }))
  }

  const handleSpecificGiftChange = (index, field, value) => {
    const newSpecificGifts = [...(formData.specificGifts || [])]
    if (newSpecificGifts[index]) {
      newSpecificGifts[index][field] = value
    }
    setFormData(prev => ({
      ...prev,
      specificGifts: newSpecificGifts
    }))
  }

  const addSpecificGift = () => {
    setFormData(prev => ({
      ...prev,
      specificGifts: [...(prev.specificGifts || []), { beneficiary: '', gift: '' }]
    }))
  }

  const removeSpecificGift = (index) => {
    setFormData(prev => ({
      ...prev,
      specificGifts: (prev.specificGifts || []).filter((_, i) => i !== index)
    }))
  }

  const handleAlternateTrusteeChange = (index, field, value) => {
    const newAlternateTrustees = [...(formData.alternateTrustees || [])]
    if (newAlternateTrustees[index]) {
      newAlternateTrustees[index][field] = value
    }
    setFormData(prev => ({
      ...prev,
      alternateTrustees: newAlternateTrustees
    }))
  }

  const addAlternateTrustee = () => {
    setFormData(prev => ({
      ...prev,
      alternateTrustees: [...(prev.alternateTrustees || []), { name: '', address: '', city: '', county: '', state: 'California', zip: '', phone: '', email: '' }]
    }))
  }

  const removeAlternateTrustee = (index) => {
    setFormData(prev => ({
      ...prev,
      alternateTrustees: (prev.alternateTrustees || []).filter((_, i) => i !== index)
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
    <div className="trust-form-container">
      <ProgressIndicator
        saveStatus={saveStatus}
        progressPercentage={progressPercentage}
        onSaveClick={saveProgress}
        onClearClick={handleClearProgress}
      />
      
      <form onSubmit={handleSubmit} className="trust-form">
        <h2>Living Trust</h2>
        
        {/* Trustor Information */}
        <div className="form-section">
          <h3>Trustor Information</h3>
          <div className="form-group">
            <label className="form-label">Full Legal Name</label>
            <input
              type="text"
              name="trustorName"
              value={formData.trustorName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="trustorAddress"
              value={formData.trustorAddress}
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
                name="trustorCity"
                value={formData.trustorCity}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">County</label>
              <select
                name="trustorCounty"
                value={formData.trustorCounty}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select County</option>
                {CALIFORNIA_COUNTIES.map((county, index) => (
                  <option key={index} value={county}>
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
                name="trustorState"
                value={formData.trustorState}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input
                type="text"
                name="trustorZip"
                value={formData.trustorZip}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="trustorPhone"
                value={formData.trustorPhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="trustorEmail"
              value={formData.trustorEmail}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                name="hasSecondTrustor"
                checked={formData.hasSecondTrustor}
                onChange={handleInputChange}
                style={{ marginRight: '8px' }}
              />
              Add Second Trustor (for joint trusts)
            </label>
          </div>
        </div>

        {/* Second Trustor Information */}
        {formData.hasSecondTrustor && (
          <div className="form-section">
            <h3>Second Trustor Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  name="secondTrustorName"
                  value={formData.secondTrustorName}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasSecondTrustor}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Relationship</label>
                <select
                  name="secondTrustorRelationship"
                  value={formData.secondTrustorRelationship}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasSecondTrustor}
                >
                  <option value="spouse">Spouse</option>
                  <option value="partner">Partner</option>
                  <option value="co-trustor">Co-Trustor</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="secondTrustorAddress"
                value={formData.secondTrustorAddress}
                onChange={handleInputChange}
                className="form-input"
                required={formData.hasSecondTrustor}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="secondTrustorCity"
                  value={formData.secondTrustorCity}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasSecondTrustor}
                />
              </div>
              <div className="form-group">
                <label className="form-label">County</label>
                <select
                  name="secondTrustorCounty"
                  value={formData.secondTrustorCounty}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasSecondTrustor}
                >
                  <option value="">Select County</option>
                  {CALIFORNIA_COUNTIES.map((county, index) => (
                    <option key={index} value={county}>
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
                  name="secondTrustorState"
                  value={formData.secondTrustorState}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasSecondTrustor}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  name="secondTrustorZip"
                  value={formData.secondTrustorZip}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasSecondTrustor}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="secondTrustorPhone"
                  value={formData.secondTrustorPhone}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasSecondTrustor}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="secondTrustorEmail"
                value={formData.secondTrustorEmail}
                onChange={handleInputChange}
                className="form-input"
                required={formData.hasSecondTrustor}
              />
            </div>
          </div>
        )}

        {/* Trustee Information */}
        <div className="form-section">
          <h3>Trustee Information</h3>
          <div className="form-group">
            <label className="form-label">Trustee Name</label>
            <input
              type="text"
              name="trusteeName"
              value={formData.trusteeName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Trustee Address</label>
            <input
              type="text"
              name="trusteeAddress"
              value={formData.trusteeAddress}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trustee City</label>
              <input
                type="text"
                name="trusteeCity"
                value={formData.trusteeCity}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trustee County</label>
              <select
                name="trusteeCounty"
                value={formData.trusteeCounty}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select County</option>
                {CALIFORNIA_COUNTIES.map((county, index) => (
                  <option key={index} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trustee Phone</label>
              <input
                type="tel"
                name="trusteePhone"
                value={formData.trusteePhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trustee Email</label>
              <input
                type="email"
                name="trusteeEmail"
                value={formData.trusteeEmail}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          {/* Alternate Trustees */}
          <h4>Alternate Trustees - Download</h4>
          {(formData.alternateTrustees || []).map((trustee, index) => (
            <div key={index} className="trustee-item">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={trustee.name}
                    onChange={(e) => handleAlternateTrusteeChange(index, 'name', e.target.value)}
                    className="form-input"
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={trustee.phone}
                    onChange={(e) => handleAlternateTrusteeChange(index, 'phone', e.target.value)}
                    className="form-input"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={trustee.address}
                  onChange={(e) => handleAlternateTrusteeChange(index, 'address', e.target.value)}
                  className="form-input"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={trustee.city}
                    onChange={(e) => handleAlternateTrusteeChange(index, 'city', e.target.value)}
                    className="form-input"
                    placeholder="Los Angeles"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">County</label>
                  <select
                    value={trustee.county}
                    onChange={(e) => handleAlternateTrusteeChange(index, 'county', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select County</option>
                    {CALIFORNIA_COUNTIES.map((county, countyIndex) => (
                      <option key={countyIndex} value={county}>
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
                    value={trustee.state || 'California'}
                    onChange={(e) => handleAlternateTrusteeChange(index, 'state', e.target.value)}
                    className="form-input"
                    placeholder="California"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    value={trustee.zip || ''}
                    onChange={(e) => handleAlternateTrusteeChange(index, 'zip', e.target.value)}
                    className="form-input"
                    placeholder="90210"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={trustee.email}
                  onChange={(e) => handleAlternateTrusteeChange(index, 'email', e.target.value)}
                  className="form-input"
                  placeholder="john@example.com"
                />
              </div>
              
              {(formData.alternateTrustees || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAlternateTrustee(index)}
                  className="remove-button"
                >
                  Remove Alternate Trustee
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addAlternateTrustee} className="add-button">
            Add Alternate Trustee
          </button>
        </div>

        {/* Trust Details */}
        <div className="form-section">
          <h3>Trust Details</h3>
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
              <label className="form-label">Trust Type</label>
              <select
                name="trustType"
                value={formData.trustType}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="revocable">Revocable Living Trust</option>
                <option value="irrevocable">Irrevocable Trust</option>
                <option value="charitable">Charitable Trust</option>
                <option value="special-needs">Special Needs Trust</option>
              </select>
            </div>
          </div>
        </div>

        {/* Beneficiaries */}
        <div className="form-section">
          <h3>Beneficiaries</h3>
          
          {/* Children Section */}
          <div className="beneficiary-subsection">
            <h4>Children</h4>
            <p className="form-description">
              Add your children as beneficiaries (up to 10 children).
            </p>
            {(formData.children || []).map((child, index) => (
              <div key={index} className="beneficiary-item">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Child's Name</label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                      className="form-input"
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <input
                      type="text"
                      value={child.relationship}
                      onChange={(e) => handleChildChange(index, 'relationship', e.target.value)}
                      className="form-input"
                      placeholder="e.g., Son, Daughter, Stepchild"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Percentage</label>
                  <input
                    type="text"
                    value={child.percentage}
                    onChange={(e) => handleChildChange(index, 'percentage', e.target.value)}
                    className="form-input"
                    placeholder="e.g., 50%, 25%, 33.33%"
                  />
                </div>
                
                {(formData.children || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="remove-button"
                  >
                    Remove Child
                  </button>
                )}
              </div>
            ))}
            
            {(formData.children || []).length < 10 && (
              <button type="button" onClick={addChild} className="add-button">
                Add Child ({(formData.children || []).length}/10)
              </button>
            )}
          </div>

          {/* Other Beneficiaries Section */}
          <div className="beneficiary-subsection">
            <h4>Other Beneficiaries</h4>
            <p className="form-description">
              Add other beneficiaries such as spouse, relatives, friends, or organizations.
            </p>
            {(formData.otherBeneficiaries || []).map((beneficiary, index) => (
              <div key={index} className="beneficiary-item">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={beneficiary.name}
                      onChange={(e) => handleOtherBeneficiaryChange(index, 'name', e.target.value)}
                      className="form-input"
                      placeholder="e.g., Jane Smith, Red Cross"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <input
                      type="text"
                      value={beneficiary.relationship}
                      onChange={(e) => handleOtherBeneficiaryChange(index, 'relationship', e.target.value)}
                      className="form-input"
                      placeholder="e.g., Spouse, Friend, Charity"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Percentage</label>
                  <input
                    type="text"
                    value={beneficiary.percentage}
                    onChange={(e) => handleOtherBeneficiaryChange(index, 'percentage', e.target.value)}
                    className="form-input"
                    placeholder="e.g., 50%, 25%"
                  />
                </div>
                
                {(formData.otherBeneficiaries || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOtherBeneficiary(index)}
                    className="remove-button"
                  >
                    Remove Beneficiary
                  </button>
                )}
              </div>
            ))}
            
            <button type="button" onClick={addOtherBeneficiary} className="add-button">
              Add Other Beneficiary
            </button>
          </div>
        </div>

        {/* Specific Gifts */}
        <div className="form-section">
          <h3>Specific Gifts (Optional)</h3>
          <p className="form-description">
            List any specific items or amounts you want to give to particular beneficiaries before the remainder is distributed.
          </p>
          {(formData.specificGifts || []).map((gift, index) => (
            <div key={index} className="gift-item">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Beneficiary Name</label>
                  <input
                    type="text"
                    value={gift.beneficiary}
                    onChange={(e) => handleSpecificGiftChange(index, 'beneficiary', e.target.value)}
                    className="form-input"
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specific Gift</label>
                  <input
                    type="text"
                    value={gift.gift}
                    onChange={(e) => handleSpecificGiftChange(index, 'gift', e.target.value)}
                    className="form-input"
                    placeholder="e.g., my wedding ring, $10,000"
                  />
                </div>
              </div>
              
              {(formData.specificGifts || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecificGift(index)}
                  className="remove-button"
                >
                  Remove Specific Gift
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addSpecificGift} className="add-button">
            Add Specific Gift
          </button>
        </div>

        {/* Trust Assets */}
        <div className="form-section">
          <h3>Trust Assets</h3>
          {(formData.trustAssets || []).map((asset, index) => (
            <div key={index} className="asset-item">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    value={asset.description}
                    onChange={(e) => handleAssetChange(index, 'description', e.target.value)}
                    className="form-input"
                    placeholder="e.g., House, Bank Account, Investment"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Value</label>
                  <input
                    type="text"
                    value={asset.value}
                    onChange={(e) => handleAssetChange(index, 'value', e.target.value)}
                    className="form-input"
                    placeholder="e.g., $500,000"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Asset Type</label>
                <input
                  type="text"
                  value={asset.type}
                  onChange={(e) => handleAssetChange(index, 'type', e.target.value)}
                  className="form-input"
                  placeholder="e.g., Real Estate, Financial, Personal Property"
                />
              </div>
              
              {(formData.trustAssets || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAsset(index)}
                  className="remove-button"
                >
                  Remove Asset
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addAsset} className="add-button">
            Add Asset
          </button>
        </div>

        {/* Distribution Terms */}
        <div className="form-section">
          <h3>Distribution Terms</h3>
          <div className="form-group">
            <label className="form-label">Distribution Terms</label>
            <textarea
              name="distributionTerms"
              value={formData.distributionTerms}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe how and when trust assets should be distributed to beneficiaries..."
              required
            />
          </div>
        </div>

        {/* Trust Purpose */}
        <div className="form-section">
          <h3>Trust Purpose</h3>
          <div className="form-group">
            <label className="form-label">Trust Purpose</label>
            <textarea
              name="trustPurpose"
              value={formData.trustPurpose}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe the purpose and goals of this trust..."
              required
            />
          </div>
        </div>

        {/* Additional Provisions */}
        <div className="form-section">
          <h3>Additional Provisions</h3>
          <div className="form-group">
            <label className="form-label">Additional Provisions</label>
            <textarea
              name="additionalProvisions"
              value={formData.additionalProvisions}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Any additional terms, conditions, or special provisions you'd like to include..."
            />
          </div>
        </div>

        <button type="submit" className="form-button">
          Complete Trust
        </button>
      </form>
    </div>
  )
}

export default TrustForm
