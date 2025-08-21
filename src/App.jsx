import { useState } from 'react'
import './styles.css'
import PlanChecklist from './components/PlanChecklist.jsx'
import ReviewPane from './components/ReviewPane.jsx'
import WillForm from './components/forms/WillForm.jsx'
import TrustForm from './components/forms/TrustForm.jsx'
import POAForm from './components/forms/POAForm.jsx'
import AHCDForm from './components/forms/AHCDForm.jsx'

function App() {
  const [activeForm, setActiveForm] = useState(null)
  const [formData, setFormData] = useState({})
  const [completedForms, setCompletedForms] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Estate Planning Agent</h1>
        <p>Complete your estate planning documents step by step</p>
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
    </div>
  )
}

export default App
