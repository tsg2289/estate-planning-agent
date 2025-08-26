import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'
import ProgressIndicator from '../ProgressIndicator'

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
    spouseName: '',
    childrenNames: '',
    trustName: '',
    trustDate: '',
    executorName: '',
    executorCity: '',
    executorState: '',
    executorPhone: '',
    executorEmail: '',
    alternateExecutorName: '',
    alternateExecutorCity: '',
    alternateExecutorState: '',
    alternateExecutorPhone: '',
    guardianName: '',
    guardianCity: '',
    guardianState: '',
    guardianPhone: '',
    alternateGuardianName: '',
    alternateGuardianCity: '',
    alternateGuardianState: '',
    alternateGuardianPhone: '',
    witness1Name: '',
    witness1Address: '',
    witness2Name: '',
    witness2Address: '',
    assets: [{ description: '', value: '', beneficiary: '' }],
    specificBequests: '',
    residualBeneficiaries: '',
    funeralWishes: '',
    additionalInstructions: ''
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
              <input
                type="text"
                name="testatorCounty"
                value={formData.testatorCounty}
                onChange={handleInputChange}
                className="form-input"
                required
              />
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
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Spouse's Full Name</label>
              <input
                type="text"
                name="spouseName"
                value={formData.spouseName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Leave blank if not married"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Children's Names</label>
              <input
                type="text"
                name="childrenNames"
                value={formData.childrenNames}
                onChange={handleInputChange}
                className="form-input"
                placeholder="List all children or 'none' if no children"
              />
            </div>
          </div>
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
          <h3>Executor (Personal Representative)</h3>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="executorName"
              value={formData.executorName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="executorPhone"
                value={formData.executorPhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="executorEmail"
                value={formData.executorEmail}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="executorCity"
                value={formData.executorCity}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="executorState"
                value={formData.executorState}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Alternate Executor Name</label>
              <input
                type="text"
                name="alternateExecutorName"
                value={formData.alternateExecutorName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Executor Phone</label>
              <input
                type="tel"
                name="alternateExecutorPhone"
                value={formData.alternateExecutorPhone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Alternate Executor City</label>
              <input
                type="text"
                name="alternateExecutorCity"
                value={formData.alternateExecutorCity}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Executor State</label>
              <input
                type="text"
                name="alternateExecutorState"
                value={formData.alternateExecutorState}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="form-section">
          <h3>Guardian for Minor Children</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Guardian Name</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Guardian Phone</label>
              <input
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Guardian City</label>
              <input
                type="text"
                name="guardianCity"
                value={formData.guardianCity}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Guardian State</label>
              <input
                type="text"
                name="guardianState"
                value={formData.guardianState}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Alternate Guardian Name</label>
              <input
                type="text"
                name="alternateGuardianName"
                value={formData.alternateGuardianName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Guardian Phone</label>
              <input
                type="tel"
                name="alternateGuardianPhone"
                value={formData.alternateGuardianPhone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Alternate Guardian City</label>
              <input
                type="text"
                name="alternateGuardianCity"
                value={formData.alternateGuardianCity}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Guardian State</label>
              <input
                type="text"
                name="alternateGuardianState"
                value={formData.alternateGuardianState}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Assets and Bequests */}
        <div className="form-section">
          <h3>Assets and Bequests</h3>
          
          <div className="form-group">
            <label className="form-label">Specific Bequests</label>
            <textarea
              name="specificBequests"
              value={formData.specificBequests}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="List any specific items you want to leave to particular people..."
            />
          </div>
          
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
        </div>

        <button type="submit" className="form-button">
          Complete Will
        </button>
      </form>
    </div>
  )
}

export default WillForm
