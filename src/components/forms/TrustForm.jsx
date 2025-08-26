import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'
import ProgressIndicator from '../ProgressIndicator'

const TrustForm = ({ onSubmit }) => {
  const initialData = {
    trustorName: '',
    trustorAddress: '',
    trustorCity: '',
    trustorState: '',
    trustorZip: '',
    trustorPhone: '',
    trustorEmail: '',
    trustorSSN: '',
    trustorDOB: '',
    coTrustorName: '',
    coTrustorAddress: '',
    coTrustorPhone: '',
    coTrustorEmail: '',
    coTrustorSSN: '',
    coTrustorDOB: '',
    trusteeName: '',
    trusteeAddress: '',
    trusteePhone: '',
    trusteeEmail: '',
    alternateTrusteeName: '',
    alternateTrusteePhone: '',
    trustType: 'revocable',
    trustName: '',
    beneficiaries: [{ name: '', relationship: '', percentage: '', isMinor: false }],
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
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBeneficiaryChange = (index, field, value) => {
    const newBeneficiaries = [...formData.beneficiaries]
    newBeneficiaries[index][field] = value
    setFormData(prev => ({
      ...prev,
      beneficiaries: newBeneficiaries
    }))
  }

  const addBeneficiary = () => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, { name: '', relationship: '', percentage: '', isMinor: false }]
    }))
  }

  const removeBeneficiary = (index) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter((_, i) => i !== index)
    }))
  }

  const handleAssetChange = (index, field, value) => {
    const newAssets = [...formData.trustAssets]
    newAssets[index][field] = value
    setFormData(prev => ({
      ...prev,
      trustAssets: newAssets
    }))
  }

  const addAsset = () => {
    setFormData(prev => ({
      ...prev,
      trustAssets: [...prev.trustAssets, { description: '', value: '', type: '' }]
    }))
  }

  const removeAsset = (index) => {
    setFormData(prev => ({
      ...prev,
      trustAssets: prev.trustAssets.filter((_, i) => i !== index)
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
          <div className="form-row">
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
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="trustorDOB"
                value={formData.trustorDOB}
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
            <label className="form-label">Social Security Number</label>
            <input
              type="text"
              name="trustorSSN"
              value={formData.trustorSSN}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Co-Trustor Information */}
        <div className="form-section">
          <h3>Co-Trustor Information (if applicable)</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Co-Trustor Name</label>
              <input
                type="text"
                name="coTrustorName"
                value={formData.coTrustorName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Leave blank if no co-trustor"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Co-Trustor Date of Birth</label>
              <input
                type="date"
                name="coTrustorDOB"
                value={formData.coTrustorDOB}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Co-Trustor Address</label>
            <input
              type="text"
              name="coTrustorAddress"
              value={formData.coTrustorAddress}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Co-Trustor Phone</label>
              <input
                type="tel"
                name="coTrustorPhone"
                value={formData.coTrustorPhone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Co-Trustor Email</label>
              <input
                type="email"
                name="coTrustorEmail"
                value={formData.coTrustorEmail}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Co-Trustor Social Security Number</label>
            <input
              type="text"
              name="coTrustorSSN"
              value={formData.coTrustorSSN}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

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
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Alternate Trustee Name</label>
              <input
                type="text"
                name="alternateTrusteeName"
                value={formData.alternateTrusteeName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Trustee Phone</label>
              <input
                type="tel"
                name="alternateTrusteePhone"
                value={formData.alternateTrusteePhone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
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
          {formData.beneficiaries.map((beneficiary, index) => (
            <div key={index} className="beneficiary-item">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={beneficiary.name}
                    onChange={(e) => handleBeneficiaryChange(index, 'name', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    value={beneficiary.relationship}
                    onChange={(e) => handleBeneficiaryChange(index, 'relationship', e.target.value)}
                    className="form-input"
                    placeholder="e.g., Spouse, Child, Friend"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Percentage</label>
                  <input
                    type="text"
                    value={beneficiary.percentage}
                    onChange={(e) => handleBeneficiaryChange(index, 'percentage', e.target.value)}
                    className="form-input"
                    placeholder="e.g., 50%, 25%"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={beneficiary.isMinor}
                      onChange={(e) => handleBeneficiaryChange(index, 'isMinor', e.target.checked)}
                    />
                    Is Minor
                  </label>
                </div>
              </div>
              
              {formData.beneficiaries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBeneficiary(index)}
                  className="remove-button"
                >
                  Remove Beneficiary
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addBeneficiary} className="add-button">
            Add Beneficiary
          </button>
        </div>

        {/* Trust Assets */}
        <div className="form-section">
          <h3>Trust Assets</h3>
          {formData.trustAssets.map((asset, index) => (
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
              
              {formData.trustAssets.length > 1 && (
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
