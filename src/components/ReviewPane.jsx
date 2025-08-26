import React from 'react'
import { generateDocument, generateEstatePlanningPackage, downloadDocument, generateFilename } from '../lib/generateDocx.js'

const ReviewPane = ({ formData, completedForms }) => {
  const getFormSummary = (formType, data) => {
    if (!data) return null
    
    switch (formType) {
          case 'will':
      return {
        title: `${formData.testatorName ? formData.testatorName + "'S " : ''}POUR-OVER WILL`,
          summary: `Testator: ${data.testatorName || 'Not specified'}`,
          details: [
            `Executor: ${data.executorName || 'Not specified'}`,
            `Guardian: ${data.guardianName || 'Not specified'}`,
            `Trust: ${data.trustName || 'Not specified'}`
          ]
        }
      case 'trust':
        return {
          title: 'Living Trust',
          summary: `Trustor: ${data.trustorName || 'Not specified'}`,
          details: [
            `Trustee: ${data.trusteeName || 'Not specified'}`,
            `Beneficiaries: ${data.beneficiaries?.length || 0} people`,
            `Trust Type: ${data.trustType || 'Not specified'}`
          ]
        }
      case 'poa':
        return {
          title: 'Power of Attorney',
          summary: `Principal: ${data.principalName || 'Not specified'}`,
          details: [
            `Agent: ${data.agentName || 'Not specified'}`,
            `Scope: ${data.scope || 'Not specified'}`,
            `Effective Date: ${data.effectiveDate || 'Not specified'}`
          ]
        }
      case 'ahcd':
        return {
          title: 'Advance Health Care Directive',
          summary: `Principal: ${data.principalName || 'Not specified'}`,
          details: [
            `Health Care Agent: ${data.healthCareAgent || 'Not specified'}`,
            `End-of-Life: ${data.endOfLifeWishes || 'Not specified'}`,
            `Organ Donation: ${data.organDonation || 'Not specified'}`
          ]
        }
      default:
        return null
    }
  }

  const handleDownloadAll = async () => {
    try {
      // Show loading state
      const button = document.querySelector('.download-all-button')
      if (button) {
        button.textContent = 'Generating Documents...'
        button.disabled = true
      }

      // Generate the complete estate planning package
      const packageBlob = await generateEstatePlanningPackage(formData)
      
      // Download the package
      downloadDocument(packageBlob, 'Estate_Planning_Package.docx')
      
      // Reset button
      if (button) {
        button.textContent = 'Download All Documents'
        button.disabled = false
      }
    } catch (error) {
      console.error('Error downloading documents:', error)
      alert('Error generating documents. Please try again.')
      
      // Reset button on error
      const button = document.querySelector('.download-all-button')
      if (button) {
        button.textContent = 'Download All Documents'
        button.disabled = false
      }
    }
  }

  const handleDownloadIndividual = async (formType, data) => {
    try {
      // Show loading state
      const button = document.querySelector(`.download-${formType}-button`)
      if (button) {
        button.textContent = 'Generating...'
        button.disabled = true
      }

      // Generate individual document
      const documentBlob = await generateDocument(formType, data)
      
      // Generate filename
      const personName = data.testatorName || data.trustorName || data.principalName || 'Document'
      const filename = generateFilename(formType, personName)
      
      // Download the document
      downloadDocument(documentBlob, filename)
      
      // Reset button
      if (button) {
        button.textContent = 'Download'
        button.disabled = false
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Error generating document. Please try again.')
      
      // Reset button on error
      const button = document.querySelector(`.download-${formType}-button`)
      if (button) {
        button.textContent = 'Download'
        button.disabled = false
      }
    }
  }

  return (
    <div className="review-pane">
      <h2>Review & Progress</h2>
      
      {completedForms.length === 0 ? (
        <div className="review-empty">
          <p>No documents completed yet.</p>
          <p>Start by selecting a document type from the checklist.</p>
        </div>
      ) : (
        <>
          {completedForms.map((formType) => {
            const summary = getFormSummary(formType, formData[formType])
            if (!summary) return null
            
            return (
              <div key={formType} className="review-item">
                <h4>{summary.title}</h4>
                <p><strong>{summary.summary}</strong></p>
                {summary.details.map((detail, index) => (
                  <p key={index}>{detail}</p>
                ))}
                <div className="review-item-actions">
                  <span className="status">Completed</span>
                  <button 
                    className={`download-button download-${formType}-button`}
                    onClick={() => handleDownloadIndividual(formType, formData[formType])}
                  >
                    Download
                  </button>
                </div>
              </div>
            )
          })}
          
          <div className="review-actions">
            <button 
              className="form-button download-all-button"
              onClick={handleDownloadAll}
            >
              Download All Documents
            </button>
            
            <div className="completion-summary">
              <h4>Overall Progress</h4>
              <p>You've completed {completedForms.length} of 4 essential estate planning documents.</p>
              {completedForms.length === 4 && (
                <div className="completion-celebration">
                  <p>🎉 Congratulations! Your estate plan is complete.</p>
                  <p>Consider reviewing with an attorney for final validation.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewPane
