import React, { useState } from 'react'

const POAForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
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
  })

  const [specificPowers, setSpecificPowers] = useState([
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
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

      {/* Agent Information */}
      <div className="form-section">
        <h3>Agent Information (Attorney-in-Fact)</h3>
        <div className="form-group">
          <label className="form-label">Full Legal Name</label>
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
          <label className="form-label">Address</label>
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
            <label className="form-label">City</label>
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
            <label className="form-label">State</label>
            <input
              type="text"
              name="agentState"
              value={formData.agentState}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">ZIP Code</label>
            <input
              type="text"
              name="agentZip"
              value={formData.agentZip}
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
              name="agentPhone"
              value={formData.agentPhone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
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
            <label className="form-label">Scope of Authority</label>
            <select
              name="scope"
              value={formData.scope}
              onChange={handleInputChange}
              className="form-select"
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
          />
        </div>
      </div>

      {/* Specific Powers */}
      <div className="form-section">
        <h3>Specific Powers Granted</h3>
        <p className="form-help-text">
          Select the specific powers you want to grant to your agent:
        </p>
        
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

      {/* Limitations and Restrictions */}
      <div className="form-section">
        <h3>Limitations and Restrictions</h3>
        <div className="form-group">
          <label className="form-label">Limitations on Agent's Authority</label>
          <textarea
            name="limitations"
            value={formData.limitations}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Describe any specific limitations or restrictions on your agent's authority..."
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
            placeholder="Describe how your agent will be compensated for their services, if applicable..."
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
            placeholder="Any additional terms, conditions, or special provisions for the power of attorney..."
          />
        </div>
      </div>

      <button type="submit" className="form-button">
        Complete Power of Attorney
      </button>
    </form>
  )
}

export default POAForm
