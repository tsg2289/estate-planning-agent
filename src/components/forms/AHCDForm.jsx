import React, { useState } from 'react'

const AHCDForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
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
  })

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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
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
        </div>
        
        <div className="form-row">
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

      {/* Health Care Agent */}
      <div className="form-section">
        <h3>Health Care Agent (Health Care Proxy)</h3>
        <div className="form-group">
          <label className="form-label">Full Legal Name</label>
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
          <label className="form-label">Address</label>
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
            <label className="form-label">Phone</label>
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
            <label className="form-label">Email</label>
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
        <div className="form-group">
          <label className="form-label">Alternate Agent Name</label>
          <input
            type="text"
            name="alternateHealthCareAgent"
            value={formData.alternateHealthCareAgent}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        
        <div className="form-row">
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
      </div>

      {/* End-of-Life Decisions */}
      <div className="form-section">
        <h3>End-of-Life Decisions</h3>
        
        <div className="form-group">
          <label className="form-label">Life-Sustaining Treatment</label>
          <select
            name="lifeSustainingTreatment"
            value={formData.lifeSustainingTreatment}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="default">Use my agent's judgment</option>
            <option value="aggressive">Provide all available treatment</option>
            <option value="limited">Provide limited treatment</option>
            <option value="comfort-only">Provide comfort care only</option>
            <option value="withhold">Withhold life-sustaining treatment</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Artificial Nutrition and Hydration</label>
          <select
            name="artificialNutrition"
            value={formData.artificialNutrition}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="default">Use my agent's judgment</option>
            <option value="provide">Provide artificial nutrition and hydration</option>
            <option value="withhold">Withhold artificial nutrition and hydration</option>
            <option value="trial">Trial period, then reassess</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Pain Management</label>
          <select
            name="painManagement"
            value={formData.painManagement}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="aggressive">Aggressive pain management</option>
            <option value="moderate">Moderate pain management</option>
            <option value="minimal">Minimal pain management</option>
            <option value="default">Use my agent's judgment</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">End-of-Life Wishes</label>
          <textarea
            name="endOfLifeWishes"
            value={formData.endOfLifeWishes}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Describe your specific wishes for end-of-life care, including any religious or spiritual preferences..."
            required
          />
        </div>
      </div>

      {/* Organ Donation and Autopsy */}
      <div className="form-section">
        <h3>Organ Donation and Autopsy</h3>
        
        <div className="form-group">
          <label className="form-label">Organ and Tissue Donation</label>
          <select
            name="organDonation"
            value={formData.organDonation}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="no-preference">No preference stated</option>
            <option value="donate-all">Donate all organs and tissues</option>
            <option value="donate-specified">Donate specified organs only</option>
            <option value="do-not-donate">Do not donate any organs</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Autopsy</label>
          <select
            name="autopsy"
            value={formData.autopsy}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="no-preference">No preference stated</option>
            <option value="allow">Allow autopsy if requested</option>
            <option value="require">Require autopsy</option>
            <option value="prohibit">Prohibit autopsy</option>
          </select>
        </div>
      </div>

      {/* Funeral and Burial Wishes */}
      <div className="form-section">
        <h3>Funeral and Burial Wishes</h3>
        <div className="form-group">
          <label className="form-label">Funeral and Burial Preferences</label>
          <textarea
            name="funeralWishes"
            value={formData.funeralWishes}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Describe your preferences for funeral arrangements, burial, cremation, memorial services, or other end-of-life ceremonies..."
          />
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="form-section">
        <h3>Additional Instructions</h3>
        <div className="form-group">
          <label className="form-label">Additional Health Care Instructions</label>
          <textarea
            name="additionalInstructions"
            value={formData.additionalInstructions}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Any additional instructions, preferences, or concerns about your health care that you'd like to include..."
          />
        </div>
      </div>

      {/* Witnesses */}
      <div className="form-section">
        <h3>Witnesses</h3>
        <p className="form-help-text">
          This document must be witnessed by at least two adults who are not your health care agent, 
          alternate agent, or related to you by blood or marriage.
        </p>
        
        {formData.witnesses.map((witness, index) => (
          <div key={index} className="witness-item">
            <h4>Witness {index + 1}</h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={witness.name}
                  onChange={(e) => handleWitnessChange(index, 'name', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
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
              <label className="form-label">Address</label>
              <input
                type="text"
                value={witness.address}
                onChange={(e) => handleWitnessChange(index, 'address', e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            {formData.witnesses.length > 2 && (
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
        
        <button
          type="button"
          onClick={addWitness}
          className="add-button"
        >
          + Add Witness
        </button>
      </div>

      <button type="submit" className="form-button">
        Complete Advance Health Care Directive
      </button>
    </form>
  )
}

export default AHCDForm
