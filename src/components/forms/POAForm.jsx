import React, { useState } from 'react'
import { useFormProgress } from '../../hooks/useFormProgress'

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

const POAForm = ({ onSubmit }) => {
  const initialData = {
    principalName: '',
    principalAddress: '',
    principalCity: '',
    principalState: '',
    principalZip: '',
    principalPhone: '',
    principalEmail: '',
    agentName: '',
    agentAddress: '',
    agentCity: '',
    agentState: '',
    agentZip: '',
    agentPhone: '',
    agentEmail: '',
    hasCoAgent: false,
    coAgentName: '',
    coAgentAddress: '',
    coAgentCity: '',
    coAgentState: '',
    coAgentZip: '',
    coAgentPhone: '',
    coAgentEmail: '',
    agentsActSeparately: false,
    thirdPartyAcknowledgment: false,
    alternateAgents: [
      {
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: ''
      }
    ],
    scope: 'general',
    effectiveDate: '',
    terminationDate: '',
    specificPowers: [],
    allPowersSelected: false,
    incapacitationChoice: 'durable', // 'durable' or 'non-durable'
    limitations: ''
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

  const [statutoryPowers] = useState([
    { code: 'A', description: 'Real property transactions.' },
    { code: 'B', description: 'Tangible personal property transactions.' },
    { code: 'C', description: 'Stock and bond transactions.' },
    { code: 'D', description: 'Commodity and option transactions.' },
    { code: 'E', description: 'Banking and other financial institution transactions.' },
    { code: 'F', description: 'Business operating transactions.' },
    { code: 'G', description: 'Insurance and annuity transactions.' },
    { code: 'H', description: 'Estate, trust, and other beneficiary transactions.' },
    { code: 'I', description: 'Claims and litigation.' },
    { code: 'J', description: 'Personal and family maintenance.' },
    { code: 'K', description: 'Benefits from social security, medicare, medicaid, or other governmental programs, or civil or military service.' },
    { code: 'L', description: 'Retirement plan transactions.' },
    { code: 'M', description: 'Tax matters.' }
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePowerToggle = (powerCode) => {
    setFormData(prev => ({
      ...prev,
      specificPowers: prev.specificPowers.includes(powerCode)
        ? prev.specificPowers.filter(p => p !== powerCode)
        : [...prev.specificPowers, powerCode]
    }))
  }

  const handleAllPowersToggle = () => {
    setFormData(prev => ({
      ...prev,
      allPowersSelected: !prev.allPowersSelected,
      specificPowers: !prev.allPowersSelected ? [] : prev.specificPowers
    }))
  }

  const handleAlternateAgentChange = (index, field, value) => {
    const newAlternateAgents = [...formData.alternateAgents]
    newAlternateAgents[index][field] = value
    setFormData(prev => ({
      ...prev,
      alternateAgents: newAlternateAgents
    }))
  }

  const addAlternateAgent = () => {
    setFormData(prev => ({
      ...prev,
      alternateAgents: [...prev.alternateAgents, {
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

  const removeAlternateAgent = (index) => {
    setFormData(prev => ({
      ...prev,
      alternateAgents: prev.alternateAgents.filter((_, i) => i !== index)
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
      <form onSubmit={handleSubmit} className="poa-form">
        <h2>Power of Attorney</h2>
        
        {/* Principal Information */}
        <div className="form-section">
          <h3>Principal Information (You)</h3>
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
              <select
                name="principalState"
                value={formData.principalState}
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
              <select
                name="agentState"
                value={formData.agentState}
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
          
          {/* Co-Agent Option */}
          <div className="form-group">
            <label className="radio-label">
              <input
                type="checkbox"
                name="hasCoAgent"
                checked={formData.hasCoAgent}
                onChange={handleInputChange}
              />
              <span className="radio-text">Add a Co-Agent (second agent to serve together)</span>
            </label>
          </div>
          
          {/* Co-Agent Information - only show if hasCoAgent is true */}
          {formData.hasCoAgent && (
            <>
              <div className="form-group">
                <label className="form-label">Co-Agent Full Name</label>
                <input
                  type="text"
                  name="coAgentName"
                  value={formData.coAgentName}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasCoAgent}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Co-Agent Address</label>
                <input
                  type="text"
                  name="coAgentAddress"
                  value={formData.coAgentAddress}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasCoAgent}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Co-Agent City</label>
                  <input
                    type="text"
                    name="coAgentCity"
                    value={formData.coAgentCity}
                    onChange={handleInputChange}
                    className="form-input"
                    required={formData.hasCoAgent}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Co-Agent State</label>
                  <select
                    name="coAgentState"
                    value={formData.coAgentState}
                    onChange={handleInputChange}
                    className="form-input"
                    required={formData.hasCoAgent}
                  >
                    <option value="">Select State</option>
                    {US_STATES_AND_TERRITORIES.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Co-Agent ZIP Code</label>
                  <input
                    type="text"
                    name="coAgentZip"
                    value={formData.coAgentZip}
                    onChange={handleInputChange}
                    className="form-input"
                    required={formData.hasCoAgent}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Co-Agent Phone</label>
                  <input
                    type="tel"
                    name="coAgentPhone"
                    value={formData.coAgentPhone}
                    onChange={handleInputChange}
                    className="form-input"
                    required={formData.hasCoAgent}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Co-Agent Email</label>
                <input
                  type="email"
                  name="coAgentEmail"
                  value={formData.coAgentEmail}
                  onChange={handleInputChange}
                  className="form-input"
                  required={formData.hasCoAgent}
                />
              </div>
              
              {/* Joint vs Separate Action Option */}
              <div className="form-group">
                <label className="form-label">
                  How should your agents act?
                  <span 
                    title="IF YOU APPOINTED MORE THAN ONE AGENT AND YOU WANT EACH AGENT TO BE ABLE TO ACT ALONE WITHOUT THE OTHER AGENT JOINING, WRITE THE WORD 'SEPARATELY' IN THE BLANK SPACE ABOVE. IF YOU DO NOT INSERT ANY WORD IN THE BLANK SPACE, OR IF YOU INSERT"
                    style={{ 
                      marginLeft: '8px',
                      cursor: 'help',
                      color: '#667eea',
                      fontWeight: 'bold'
                    }}
                  >
                    ℹ️
                  </span>
                </label>
                
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="agentsActSeparately"
                      value="false"
                      checked={!formData.agentsActSeparately}
                      onChange={(e) => setFormData(prev => ({...prev, agentsActSeparately: e.target.value === 'true'}))}
                    />
                    <span className="radio-text">
                      <strong>Act Jointly</strong> - Both agents must agree and act together
                    </span>
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="agentsActSeparately"
                      value="true"
                      checked={formData.agentsActSeparately}
                      onChange={(e) => setFormData(prev => ({...prev, agentsActSeparately: e.target.value === 'true'}))}
                    />
                    <span className="radio-text">
                      <strong>Act Separately</strong> - Each agent can act alone without the other
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Alternate Agent Information */}
        <div className="form-section">
          <h3>Alternate Agent Information (Optional)</h3>
          <p className="form-help-text">
            If your primary agent is unable or unwilling to serve, these alternate agents will serve in the order listed.
          </p>
          
          {formData.alternateAgents.map((agent, index) => (
            <div key={index} className="alternate-agent-item">
              <div className="form-row" style={{ alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, flex: 1, textAlign: 'center' }}>
                  Alternate Agent {index + 1}
                </h4>
                {formData.alternateAgents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAlternateAgent(index)}
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
                  onChange={(e) => handleAlternateAgentChange(index, 'name', e.target.value)}
                  className="form-input"
                  placeholder="Leave blank if no alternate agent"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={agent.address}
                  onChange={(e) => handleAlternateAgentChange(index, 'address', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={agent.city}
                    onChange={(e) => handleAlternateAgentChange(index, 'city', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    value={agent.state}
                    onChange={(e) => handleAlternateAgentChange(index, 'state', e.target.value)}
                    className="form-input"
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
                    value={agent.zip}
                    onChange={(e) => handleAlternateAgentChange(index, 'zip', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={agent.phone}
                    onChange={(e) => handleAlternateAgentChange(index, 'phone', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={agent.email}
                  onChange={(e) => handleAlternateAgentChange(index, 'email', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={addAlternateAgent}
              className="add-button"
              style={{
                background: '#2ed573',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.background = '#26d065'}
              onMouseLeave={(e) => e.target.style.background = '#2ed573'}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span>
              Add Another Alternate Agent
            </button>
          </div>
        </div>

        {/* Power of Attorney Details */}
        <div className="form-section">
          <h3>Power of Attorney Details</h3>
          <div className="form-group">
            <label className="form-label">Effective Date</label>
            <input
              type="date"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleInputChange}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              required
            />
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
          
          <div className="form-group">
            <label className="form-label">Power of Attorney Durability</label>
            <p className="form-help-text">
              Choose whether this power of attorney should continue if you become incapacitated:
            </p>
            
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="incapacitationChoice"
                  value="durable"
                  checked={formData.incapacitationChoice === 'durable'}
                  onChange={handleInputChange}
                />
                <span className="radio-text">
                  <strong>Durable Power of Attorney</strong> - This power of attorney will continue to be effective even though I become incapacitated.
                </span>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="incapacitationChoice"
                  value="non-durable"
                  checked={formData.incapacitationChoice === 'non-durable'}
                  onChange={handleInputChange}
                />
                <span className="radio-text">
                  <strong>Non-Durable Power of Attorney</strong> - This power of attorney will cease to continue if I become incapacitated.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Specific Powers */}
        <div className="form-section">
          <h3>Specific Powers Granted</h3>
          <p className="form-help-text">
            Click which powers you wish to grant the agent.
          </p>
          
          <div className="statutory-powers">
            {statutoryPowers.map((power) => (
              <label key={power.code} className="statutory-power-checkbox">
                <input
                  type="checkbox"
                  checked={formData.specificPowers.includes(power.code)}
                  onChange={() => handlePowerToggle(power.code)}
                  disabled={formData.allPowersSelected}
                />
                <span className="power-code">({power.code})</span>
                <span className="power-description">{power.description}</span>
              </label>
            ))}
            
            {/* ALL POWERS option */}
            <label className="statutory-power-checkbox all-powers">
              <input
                type="checkbox"
                checked={formData.allPowersSelected}
                onChange={handleAllPowersToggle}
              />
              <span className="power-code">(N)</span>
              <span className="power-description"><strong>ALL OF THE POWERS LISTED ABOVE</strong></span>
            </label>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="form-section">
          <h3>Special Instructions</h3>
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

        {/* Third Party Acknowledgment */}
        <div className="form-section">
          <h3>Required Acknowledgment</h3>
          <div className="form-group">
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px', 
              backgroundColor: '#f9f9f9',
              marginBottom: '20px'
            }}>
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.6', 
                margin: '0 0 15px 0',
                color: '#333'
              }}>
                I agree that any third party who receives a copy of this document may act under it. Revocation 
                of the power of attorney is not effective as to a third party until the third party has actual knowledge of the 
                revocation. I agree to indemnify the third party for any claims that arise against the third party because of reliance 
                on this power of attorney.
              </p>
              
              <label className="radio-label" style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                marginTop: '15px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  name="thirdPartyAcknowledgment"
                  checked={formData.thirdPartyAcknowledgment}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    marginRight: '12px', 
                    marginTop: '2px',
                    transform: 'scale(1.2)'
                  }}
                />
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: '#333'
                }}>
                  I acknowledge and agree to the terms stated above regarding third party reliance on this Power of Attorney.
                </span>
              </label>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="form-button"
          disabled={!formData.thirdPartyAcknowledgment}
          style={{
            opacity: formData.thirdPartyAcknowledgment ? 1 : 0.6,
            cursor: formData.thirdPartyAcknowledgment ? 'pointer' : 'not-allowed'
          }}
        >
          Complete Power of Attorney
        </button>
      </form>
    </div>
  )
}

export default POAForm
