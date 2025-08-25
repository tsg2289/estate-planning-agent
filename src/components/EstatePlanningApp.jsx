import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import PlanChecklist from './PlanChecklist.jsx'
import ReviewPane from './ReviewPane.jsx'
import WillForm from './forms/WillForm.jsx'
import TrustForm from './forms/TrustForm.jsx'
import POAForm from './forms/POAForm.jsx'
import AHCDForm from './forms/AHCDForm.jsx'
import './EstatePlanningApp.css'

function EstatePlanningApp() {
  const [activeForm, setActiveForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [completedForms, setCompletedForms] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, logout } = useAuth()

  const handleFormSubmit = async (formType, data) => {
    setIsSubmitting(true)
    
    try {
      // Simulate a brief delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setFormData(prev => ({ ...prev, [formType]: data }))
      setCompletedForms(prev => [...prev, formType])
      setActiveForm(null)
      
      // Show success message
      showNotification(`Your ${getFormDisplayName(formType)} has been completed successfully!`, 'success')
    } catch (error) {
      console.error('Error submitting form:', error)
      showNotification('There was an error completing your form. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSelect = (formType) => {
    setActiveForm(formType)
  }

  const getFormDisplayName = (formType) => {
    const names = {
      will: 'Last Will & Testament',
      trust: 'Living Trust',
      poa: 'Power of Attorney',
      ahcd: 'Advance Health Care Directive'
    }
    return names[formType] || formType
  }

  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    // Add to page
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  const renderForm = () => {
    switch (activeForm) {
      case 'will':
        return <WillForm onSubmit={(data) => handleFormSubmit('will', data)} />
      case 'trust':
        return <TrustForm onSubmit={(data) => handleFormSubmit('trust', data)} />
      case 'poa':
        return <POAForm onSubmit={(data) => handleFormSubmit('poa', data)} />
      case 'ahcd':
        return <AHCDForm onSubmit={(data) => handleFormSubmit('ahcd', data)} />
      default:
        return null
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="estate-planning-app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Estate Planning Agent</h1>
            <p>Complete your estate planning documents step by step</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">Welcome, {user?.name || 'User'}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing your form...</p>
          </div>
        </div>
      )}
      
      <main className="app-main">
        <div className="app-layout">
          <PlanChecklist 
            onFormSelect={handleFormSelect}
            completedForms={completedForms}
          />
          
          <div className="forms-section">
            {activeForm ? (
              <div className="form-container">
                <button 
                  className="back-button"
                  onClick={() => setActiveForm(null)}
                  disabled={isSubmitting}
                >
                  ← Back to Checklist
                </button>
                {renderForm()}
              </div>
            ) : (
              <div className="welcome-message">
                <h2>Welcome to Estate Planning</h2>
                <p>Select a document type from the checklist to get started.</p>
                <p>Complete each form to build your comprehensive estate plan.</p>
              </div>
            )}
          </div>
          
          <ReviewPane 
            formData={formData}
            completedForms={completedForms}
          />
        </div>
      </main>

      {/* Disclaimer */}
      <section className="disclaimer-section">
        <div className="disclaimer-container">
          <div className="disclaimer-content">
            <h3>Disclaimer</h3>
            <p>
              This application is provided for informational and educational purposes only. It does not constitute legal advice, nor does it create an attorney–client relationship. Estate planning laws vary by state, and each individual's circumstances are unique. Any documents generated through this application should be carefully reviewed by a licensed attorney in your jurisdiction before being signed or relied upon.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EstatePlanningApp
