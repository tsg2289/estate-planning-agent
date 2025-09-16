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
    healthCareAgent: '',
    healthCareAgentAddress: '',
    healthCareAgentPhone: '',
    healthCareAgentEmail: '',
    alternateHealthCareAgents: [
      {
        name: '',
        address: '',
        phone: '',
        email: ''
      }
    ],
    endOfLifeWishes: '',
    lifeSustainingTreatment: 'default',
    artificialNutrition: 'default',
    artificialHydration: 'default',
    painManagement: 'aggressive',
    agentCanDonateOrgans: false,
    agentCanAuthorizeAutopsy: false,
    agentCanDirectDisposition: false,
    agentAuthorityExceptions: '',
    immediateAuthorityEffective: false,
    endOfLifeChoice: '', // 'not-prolong' or 'prolong'
    painReliefExceptions: '',
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

  const handleAlternateHealthCareAgentChange = (index, field, value) => {
    const newAlternateAgents = [...formData.alternateHealthCareAgents]
    newAlternateAgents[index][field] = value
    setFormData(prev => ({
      ...prev,
      alternateHealthCareAgents: newAlternateAgents
    }))
  }

  const addAlternateHealthCareAgent = () => {
    setFormData(prev => ({
      ...prev,
      alternateHealthCareAgents: [...prev.alternateHealthCareAgents, {
        name: '',
        address: '',
        phone: '',
        email: ''
      }]
    }))
  }

  const removeAlternateHealthCareAgent = (index) => {
    setFormData(prev => ({
      ...prev,
      alternateHealthCareAgents: prev.alternateHealthCareAgents.filter((_, i) => i !== index)
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

        {/* Alternate Health Care Agents */}
        <div className="form-section">
          <h3>Alternate Health Care Agents (Optional)</h3>
          <p className="form-help-text">
            If your primary health care agent is unable or unwilling to serve, these alternate agents will serve in the order listed.
          </p>
          
          {formData.alternateHealthCareAgents.map((agent, index) => (
            <div key={index} className="alternate-agent-item">
              <div className="form-row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, flex: 1 }}>
                  Alternate Health Care Agent {index + 1}
                </h4>
                {formData.alternateHealthCareAgents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAlternateHealthCareAgent(index)}
                    className="remove-button"
                    style={{ 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={agent.name}
                  onChange={(e) => handleAlternateHealthCareAgentChange(index, 'name', e.target.value)}
                  className="form-input"
                  placeholder="Leave blank if no alternate agent"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={agent.address}
                  onChange={(e) => handleAlternateHealthCareAgentChange(index, 'address', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={agent.phone}
                    onChange={(e) => handleAlternateHealthCareAgentChange(index, 'phone', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={agent.email}
                    onChange={(e) => handleAlternateHealthCareAgentChange(index, 'email', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addAlternateHealthCareAgent}
            className="add-button"
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span>
            Add Another Alternate Agent
          </button>
        </div>

        {/* Agent Authority Exceptions */}
        <div className="form-section">
          <h3>Agent's Authority Limitations</h3>
          <div className="form-group">
            <label className="form-label">
              (1.2) AGENT'S AUTHORITY: My agent is authorized to make all physical and mental health care decisions for me, including decisions to provide, withhold, or withdraw artificial nutrition and hydration and all other forms of health care to keep me alive, except as I state here:
            </label>
            <textarea
              name="agentAuthorityExceptions"
              value={formData.agentAuthorityExceptions}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Enter any specific limitations or exceptions to your agent's authority..."
              rows="4"
            />
            <p className="form-help-text">
              Leave blank if you want your agent to have full authority without exceptions.
            </p>
          </div>
        </div>

        {/* Agent Authority Effectiveness */}
        <div className="form-section">
          <h3>When Agent's Authority Becomes Effective</h3>
          <div className="form-group">
            <p className="form-help-text">
              By default, your agent's authority becomes effective when your primary physician determines that you are unable to make your own health care decisions.
            </p>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="immediateAuthorityEffective"
                checked={formData.immediateAuthorityEffective}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  immediateAuthorityEffective: e.target.checked
                }))}
                className="form-checkbox"
              />
              <span className="form-checkbox-text">
                My agent's authority to make health care decisions for me takes effect immediately
              </span>
            </label>
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

        {/* Agent's Postdeath Authority */}
        <div className="form-section">
          <h3>Agent's Postdeath Authority</h3>
          <div className="form-group">
            <p className="form-help-text">
              My agent is authorized to donate:
            </p>
            
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="agentCanDonateOrgans"
                checked={formData.agentCanDonateOrgans}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  agentCanDonateOrgans: e.target.checked
                }))}
                className="form-checkbox"
              />
              <span className="form-checkbox-text">
                My organs, tissues, and parts
              </span>
            </label>
            
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="agentCanAuthorizeAutopsy"
                checked={formData.agentCanAuthorizeAutopsy}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  agentCanAuthorizeAutopsy: e.target.checked
                }))}
                className="form-checkbox"
              />
              <span className="form-checkbox-text">
                Authorize an autopsy
              </span>
            </label>
            
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="agentCanDirectDisposition"
                checked={formData.agentCanDirectDisposition}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  agentCanDirectDisposition: e.target.checked
                }))}
                className="form-checkbox"
              />
              <span className="form-checkbox-text">
                Direct disposition of my remains
              </span>
            </label>
          </div>
        </div>

        {/* Part 2 - End-of-Life Decisions */}
        <div className="form-section">
          <h3>Part 2 - End-of-Life Decisions</h3>
          <div className="form-group">
            <p className="form-help-text">
              Please select your preference for end-of-life care decisions:
            </p>
            
            <label className="form-checkbox-label">
              <input
                type="radio"
                name="endOfLifeChoice"
                value="not-prolong"
                checked={formData.endOfLifeChoice === 'not-prolong'}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="form-checkbox-text">
                <strong>(a) Choice Not To Prolong Life</strong><br />
                I do not want my life to be prolonged if (1) I have an incurable and irreversible condition that will result in my death within a relatively short time, (2) I become unconscious and, to a reasonable degree of medical certainty, I will not regain consciousness, or (3) the likely risks and burdens of treatment would outweigh the expected benefits.
              </span>
            </label>
            
            <label className="form-checkbox-label">
              <input
                type="radio"
                name="endOfLifeChoice"
                value="prolong"
                checked={formData.endOfLifeChoice === 'prolong'}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="form-checkbox-text">
                <strong>(b) Choice To Prolong Life</strong><br />
                I want my life to be prolonged as long as possible within the limits of generally accepted health care standards.
              </span>
            </label>
          </div>
        </div>

        {/* Pain Relief */}
        <div className="form-section">
          <h3>(2.2) Relief from Pain</h3>
          <div className="form-group">
            <label className="form-label">
              Except as I state in the following space, I direct that treatment for alleviation of pain or discomfort be provided at all times, even if it hastens my death:
            </label>
            <textarea
              name="painReliefExceptions"
              value={formData.painReliefExceptions}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Enter any specific exceptions or limitations to pain relief treatment..."
              rows="4"
            />
            <p className="form-help-text">
              Leave blank if you want pain relief treatment to be provided at all times without exceptions.
            </p>
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
