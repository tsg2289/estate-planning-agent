import { useState, useEffect } from 'react'
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext'
import PlanChecklist from './PlanChecklist.jsx'
import ReviewPane from './ReviewPane.jsx'
import WillForm from './forms/WillForm.jsx'
import TrustForm from './forms/TrustForm.jsx'
import POAForm from './forms/POAForm.jsx'
import AHCDForm from './forms/AHCDForm.jsx'
import progressStorage from '../lib/progressStorage'
import HomeLink from './HomeLink.jsx'
import './EstatePlanningApp.css'

function EstatePlanningApp() {
  const [activeForm, setActiveForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [completedForms, setCompletedForms] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progressStatus, setProgressStatus] = useState({})
  const { user, signOut } = useSupabaseAuth()

  const logout = async () => {
    await signOut()
  }

  // Load progress status on mount
  useEffect(() => {
    const loadProgressStatus = () => {
      const status = progressStorage.getCompletionStatus()
      setProgressStatus(status)
      
      // Update completed forms based on progress
      const completed = Object.keys(status).filter(formType => status[formType].isCompleted)
      setCompletedForms(completed)
      
      // Load saved form data
      const allProgress = progressStorage.loadAllProgress()
      const loadedFormData = {}
      Object.keys(allProgress).forEach(formType => {
        if (allProgress[formType]?.data) {
          loadedFormData[formType] = allProgress[formType].data
        }
      })
      setFormData(loadedFormData)
    }

    loadProgressStatus()
  }, [])

  const handleFormSubmit = async (formType, data) => {
    setIsSubmitting(true)
    
    try {
      // Simulate a brief delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mark form as completed in progress storage
      await progressStorage.markCompleted(formType)
      
      setFormData(prev => ({ ...prev, [formType]: data }))
      setCompletedForms(prev => [...prev, formType])
      setActiveForm(null)
      
      // Update progress status
      const newStatus = progressStorage.getCompletionStatus()
      setProgressStatus(newStatus)
      
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

  const getOverallProgress = () => {
    const totalForms = 4
    const completedCount = completedForms.length
    return Math.round((completedCount / totalForms) * 100)
  }

  return (
    <div className="estate-planning-app">
      <HomeLink />
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Estate Planning Agent</h1>
            <p>Complete your estate planning documents step by step</p>
          </div>
          <div className="header-right">
            {user && (
              <div className="user-info">
                <span>Welcome, {user.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="overall-progress">
          <div className="progress-info">
            <span className="progress-text">Overall Progress: {getOverallProgress()}%</span>
            <span className="progress-count">{completedForms.length} of 4 forms completed</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getOverallProgress()}%` }}
            />
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
            progressStatus={progressStatus}
            activeForm={activeForm}
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
                <p>Select a document type from the checklist to build your comprehensive estate plan.</p>
              </div>
            )}
          </div>
          
          <ReviewPane 
            formData={formData}
            completedForms={completedForms}
            progressStatus={progressStatus}
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
