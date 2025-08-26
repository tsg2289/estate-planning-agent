import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'
import ProgressIndicator from '../ProgressIndicator'

const POAForm = ({ onSubmit }) => {
  const initialData = {
    principalName: '',
    principalAddress: '',
    principalCity: '',
    principalState: '',
    principalZip: '',
    principalPhone: '',
    principalEmail: '',
    principalSSN: '',
    principalDOB: '',
    agentName: '',
    agentAddress: '',
    agentCity: '',
    agentState: '',
    agentZip: '',
    agentPhone: '',
    agentEmail: '',
    alternateAgentName: '',
    alternateAgentAddress: '',
    alternateAgentPhone: '',
    alternateAgentEmail: '',
    scope: 'general',
    effectiveDate: '',
    terminationDate: '',
    specificPowers: [],
    limitations: '',
    compensation: '',
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
  } = useFormProgress('poa', initialData)

  const [specificPowers] = useState([
    'Real Estate Transactions',
    'Banking and Financial Transactions',
    'Tax Matters',
    'Insurance Matters',
    'Business Operations',
    'Legal Proceedings',
    'Healthcare Decisions',
    'Retirement Accounts',
    'Digital Assets',
    'Personal Property'
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePowerToggle = (power) => {
    setFormData(prev => ({
      ...prev,
      specificPowers: prev.specificPowers.includes(power)
        ? prev.specificPowers.filter(p => p !== power)
        : [...prev.specificPowers, power]
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
    <div className="poa-form-container">
      <ProgressIndicator
        saveStatus={saveStatus}
        progressPercentage={progressPercentage}
        onSaveClick={saveProgress}
        onClearClick={handleClearProgress}
      />
      
      <form onSubmit={handleSubmit} className="poa-form">
        <h2>Power of Attorney</h2>
        
        {/* Principal Information */}
        <div className="form-section">
          <h3>Principal Information (You)</h3>
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

        {/* Agent Information */}
        <div className="form-section">
          <h3>Agent Information (Your Representative)</h3>
          <div className="form-group">
            <label className="form-label">Agent Full Name</label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Agent Address</label>
            <input
              type="text"
              name="agentAddress"
              value={formData.agentAddress}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Agent City</label>
              <input
                type="text"
                name="agentCity"
                value={formData.agentCity}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Agent State</label>
              <input
                type="text"
                name="agentState"
                value={formData.agentState}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Agent ZIP Code</label>
              <input
                type="text"
                name="agentZip"
                value={formData.agentZip}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Agent Phone</label>
              <input
                type="tel"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Agent Email</label>
            <input
              type="email"
              name="agentEmail"
              value={formData.agentEmail}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Alternate Agent Information */}
        <div className="form-section">
          <h3>Alternate Agent Information (Optional)</h3>
          <div className="form-group">
            <label className="form-label">Alternate Agent Name</label>
            <input
              type="text"
              name="alternateAgentName"
              value={formData.alternateAgentName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Leave blank if no alternate agent"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Alternate Agent Address</label>
            <input
              type="text"
              name="alternateAgentAddress"
              value={formData.alternateAgentAddress}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Alternate Agent Phone</label>
              <input
                type="tel"
                name="alternateAgentPhone"
                value={formData.alternateAgentPhone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Agent Email</label>
              <input
                type="email"
                name="alternateAgentEmail"
                value={formData.alternateAgentEmail}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Power of Attorney Details */}
        <div className="form-section">
          <h3>Power of Attorney Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Scope</label>
              <select
                name="scope"
                value={formData.scope}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="general">General Power of Attorney</option>
                <option value="limited">Limited Power of Attorney</option>
                <option value="durable">Durable Power of Attorney</option>
                <option value="springing">Springing Power of Attorney</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Effective Date</label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Termination Date (Optional)</label>
            <input
              type="date"
              name="terminationDate"
              value={formData.terminationDate}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Leave blank if no termination date"
            />
          </div>
        </div>

        {/* Specific Powers */}
        <div className="form-section">
          <h3>Specific Powers Granted</h3>
          <p className="form-help-text">Select the specific powers you want to grant to your agent:</p>
          
          <div className="powers-grid">
            {specificPowers.map((power) => (
              <label key={power} className="power-checkbox">
                <input
                  type="checkbox"
                  checked={formData.specificPowers.includes(power)}
                  onChange={() => handlePowerToggle(power)}
                />
                <span className="power-label">{power}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div className="form-section">
          <h3>Limitations and Restrictions</h3>
          <div className="form-group">
            <label className="form-label">Limitations</label>
            <textarea
              name="limitations"
              value={formData.limitations}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe any limitations or restrictions on the agent's powers..."
            />
          </div>
        </div>

        {/* Compensation */}
        <div className="form-section">
          <h3>Agent Compensation</h3>
          <div className="form-group">
            <label className="form-label">Compensation Terms</label>
            <textarea
              name="compensation"
              value={formData.compensation}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe how and when the agent will be compensated for their services..."
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
          Complete Power of Attorney
        </button>
      </form>
    </div>
  )
}

export default POAForm
