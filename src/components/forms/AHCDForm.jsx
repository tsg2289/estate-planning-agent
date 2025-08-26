import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'
import ProgressIndicator from '../ProgressIndicator'

const AHCDForm = ({ onSubmit }) => {
  const initialData = {
    principalName: '',
    principalAddress: '',
    principalCity: '',
    principalState: '',
    principalZip: '',
    principalPhone: '',
    principalEmail: '',
    principalDOB: '',
    principalSSN: '',
    healthCareAgent: '',
    healthCareAgentAddress: '',
    healthCareAgentPhone: '',
    healthCareAgentEmail: '',
    alternateHealthCareAgent: '',
    alternateHealthCareAgentPhone: '',
    alternateHealthCareAgentEmail: '',
    endOfLifeWishes: '',
    lifeSustainingTreatment: 'default',
    artificialNutrition: 'default',
    artificialHydration: 'default',
    painManagement: 'aggressive',
    organDonation: 'no-preference',
    autopsy: 'no-preference',
    funeralWishes: '',
    additionalInstructions: '',
    witnesses: [{ name: '', address: '', phone: '' }]
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
  } = useFormProgress('ahcd', initialData)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleWitnessChange = (index, field, value) => {
    const newWitnesses = [...formData.witnesses]
    newWitnesses[index][field] = value
    setFormData(prev => ({
      ...prev,
      witnesses: newWitnesses
    }))
  }

  const addWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [...prev.witnesses, { name: '', address: '', phone: '' }]
    }))
  }

  const removeWitness = (index) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter((_, i) => i !== index)
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
    <div className="ahcd-form-container">
      <ProgressIndicator
        saveStatus={saveStatus}
        progressPercentage={progressPercentage}
        onSaveClick={saveProgress}
        onClearClick={handleClearProgress}
      />
      
      <form onSubmit={handleSubmit} className="ahcd-form">
        <h2>Advance Health Care Directive</h2>
        
        {/* Principal Information */}
        <div className="form-section">
          <h3>Your Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Legal Name</label>
              <input
                type="text"
                name="principalName"
                value={formData.principalName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="principalDOB"
                value={formData.principalDOB}
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
              name="principalAddress"
              value={formData.principalAddress}
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
                name="principalCity"
                value={formData.principalCity}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="principalState"
                value={formData.principalState}
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
                name="principalZip"
                value={formData.principalZip}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="principalPhone"
                value={formData.principalPhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="principalEmail"
                value={formData.principalEmail}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Social Security Number</label>
              <input
                type="text"
                name="principalSSN"
                value={formData.principalSSN}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Health Care Agent Information */}
        <div className="form-section">
          <h3>Health Care Agent Information</h3>
          <div className="form-group">
            <label className="form-label">Health Care Agent Name</label>
            <input
              type="text"
              name="healthCareAgent"
              value={formData.healthCareAgent}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Health Care Agent Address</label>
            <input
              type="text"
              name="healthCareAgentAddress"
              value={formData.healthCareAgentAddress}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Health Care Agent Phone</label>
              <input
                type="tel"
                name="healthCareAgentPhone"
                value={formData.healthCareAgentPhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Health Care Agent Email</label>
              <input
                type="email"
                name="healthCareAgentEmail"
                value={formData.healthCareAgentEmail}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Alternate Health Care Agent */}
        <div className="form-section">
          <h3>Alternate Health Care Agent (Optional)</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Alternate Agent Name</label>
              <input
                type="text"
                name="alternateHealthCareAgent"
                value={formData.alternateHealthCareAgent}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Leave blank if no alternate agent"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Agent Phone</label>
              <input
                type="tel"
                name="alternateHealthCareAgentPhone"
                value={formData.alternateHealthCareAgentPhone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Alternate Agent Email</label>
            <input
              type="email"
              name="alternateHealthCareAgentEmail"
              value={formData.alternateHealthCareAgentEmail}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        {/* End of Life Wishes */}
        <div className="form-section">
          <h3>End of Life Wishes</h3>
          <div className="form-group">
            <label className="form-label">End of Life Wishes</label>
            <textarea
              name="endOfLifeWishes"
              value={formData.endOfLifeWishes}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe your wishes for end-of-life care, comfort measures, and any specific requests..."
              required
            />
          </div>
        </div>

        {/* Treatment Preferences */}
        <div className="form-section">
          <h3>Treatment Preferences</h3>
          
          <div className="form-group">
            <label className="form-label">Life-Sustaining Treatment</label>
            <select
              name="lifeSustainingTreatment"
              value={formData.lifeSustainingTreatment}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="default">Use my agent's judgment</option>
              <option value="aggressive">Provide aggressive treatment</option>
              <option value="comfort">Provide comfort care only</option>
              <option value="specific">Follow specific instructions below</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Artificial Nutrition</label>
            <select
              name="artificialNutrition"
              value={formData.artificialNutrition}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="default">Use my agent's judgment</option>
              <option value="yes">Yes, provide artificial nutrition</option>
              <option value="no">No, do not provide artificial nutrition</option>
              <option value="temporary">Provide temporarily for recovery</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Artificial Hydration</label>
            <select
              name="artificialHydration"
              value={formData.artificialHydration}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="default">Use my agent's judgment</option>
              <option value="yes">Yes, provide artificial hydration</option>
              <option value="no">No, do not provide artificial hydration</option>
              <option value="temporary">Provide temporarily for recovery</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Pain Management</label>
            <select
              name="painManagement"
              value={formData.painManagement}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="aggressive">Aggressive pain management</option>
              <option value="moderate">Moderate pain management</option>
              <option value="minimal">Minimal pain management</option>
              <option value="default">Use my agent's judgment</option>
            </select>
          </div>
        </div>

        {/* Organ Donation and Autopsy */}
        <div className="form-section">
          <h3>Organ Donation and Autopsy</h3>
          
          <div className="form-group">
            <label className="form-label">Organ Donation</label>
            <select
              name="organDonation"
              value={formData.organDonation}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="no-preference">No preference</option>
              <option value="yes">Yes, donate my organs</option>
              <option value="no">No, do not donate my organs</option>
              <option value="specific">Specific organs only</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Autopsy</label>
            <select
              name="autopsy"
              value={formData.autopsy}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="no-preference">No preference</option>
              <option value="yes">Yes, allow autopsy</option>
              <option value="no">No, do not allow autopsy</option>
              <option value="circumstances">Allow under certain circumstances</option>
            </select>
          </div>
        </div>

        {/* Funeral Wishes */}
        <div className="form-section">
          <h3>Funeral and Burial Wishes</h3>
          <div className="form-group">
            <label className="form-label">Funeral and Burial Wishes</label>
            <textarea
              name="funeralWishes"
              value={formData.funeralWishes}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Any specific wishes for funeral arrangements, burial, cremation, or memorial services..."
            />
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="form-section">
          <h3>Additional Instructions</h3>
          <div className="form-group">
            <label className="form-label">Additional Instructions</label>
            <textarea
              name="additionalInstructions"
              value={formData.additionalInstructions}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Any other instructions, preferences, or special requests you'd like to include..."
            />
          </div>
        </div>

        {/* Witnesses */}
        <div className="form-section">
          <h3>Witnesses</h3>
          {formData.witnesses.map((witness, index) => (
            <div key={index} className="witness-item">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Witness Name</label>
                  <input
                    type="text"
                    value={witness.name}
                    onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Witness Phone</label>
                  <input
                    type="tel"
                    value={witness.phone}
                    onChange={(e) => handleWitnessChange(index, 'phone', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Witness Address</label>
                <input
                  type="text"
                  value={witness.address}
                  onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              {formData.witnesses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWitness(index)}
                  className="remove-button"
                >
                  Remove Witness
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addWitness} className="add-button">
            Add Witness
          </button>
        </div>

        <button type="submit" className="form-button">
          Complete Advance Health Care Directive
        </button>
      </form>
    </div>
  )
}

export default AHCDForm
