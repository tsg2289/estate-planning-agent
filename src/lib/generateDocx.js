// Document generation utilities for creating Word documents
// This file handles the conversion of form data to DOCX format

import { getTemplate, populateTemplate } from './templates.js'

// Import docx library with error handling
let Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Spacing, BorderStyle

/**
 * Initialize the docx library
 * @returns {Promise<boolean>} - Whether the library was successfully loaded
 */
const initializeDocx = async () => {
  try {
    const docxModule = await import('docx')
    Document = docxModule.Document
    Packer = docxModule.Packer
    Paragraph = docxModule.Paragraph
    TextRun = docxModule.TextRun
    HeadingLevel = docxModule.HeadingLevel
    AlignmentType = docxModule.AlignmentType
    Spacing = docxModule.Spacing
    BorderStyle = docxModule.BorderStyle
    return true
  } catch (error) {
    console.warn('docx library not available:', error)
    return false
  }
}

/**
 * Check if the docx library is available
 * @returns {boolean} - Whether the library is available
 */
const isDocxAvailable = () => {
  return Document && Packer && Paragraph && TextRun
}

/**
 * Generate a Word document from form data
 * @param {string} documentType - Type of document (will, trust, poa, ahcd)
 * @param {Object} formData - Form data to populate the document
 * @returns {Promise<Blob>} - Generated Word document as a blob
 */
export const generateDocument = async (documentType, formData) => {
  try {
    // Initialize docx library if not already done
    if (!isDocxAvailable()) {
      const initialized = await initializeDocx()
      if (!initialized) {
        throw new Error('Document generation library not available. Please try refreshing the page.')
      }
    }

    // Get the appropriate template
    const template = getTemplate(documentType)
    
    // Format form data for document generation
    const formattedData = formatFormData(formData, documentType)
    
    // Populate template with formatted form data
    const populatedTemplate = populateTemplate(template, formattedData)
    
    // Create document sections
    const sections = await createDocumentSections(populatedTemplate, formattedData)
    
    // Create the document
    const doc = new Document({
      sections: sections,
      styles: {
        default: {
          document: {
            run: {
              font: 'Calibri',
              size: 24,
            },
            paragraph: {
              spacing: {
                line: 276,
                before: 0,
                after: 0,
              },
            },
          },
        },
      },
    })
    
    // Pack the document
    const blob = await Packer.toBlob(doc)
    return blob
    
  } catch (error) {
    console.error('Error generating document:', error)
    throw new Error(`Failed to generate ${documentType} document: ${error.message}`)
  }
}

/**
 * Create document sections from template
 * @param {Object} template - Populated template
 * @param {Object} formData - Form data
 * @returns {Array} - Array of document sections
 */
const createDocumentSections = async (template, formData) => {
  const children = []
  
  // Add title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: template.title,
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 400,
        after: 400,
      },
    })
  )
  
  // Add sections with proper formatting
  for (let i = 0; i < template.sections.length; i++) {
    const section = template.sections[i]
    
    if (section.content && section.content.trim()) {
      // Handle different section types
      if (section.name && section.name.includes('article')) {
        // Article headers - combine with next section content
        const nextSection = template.sections[i + 1]
        if (nextSection && nextSection.content) {
          // Split the next section content to get the heading
          const lines = nextSection.content.trim().split('\n')
          const heading = lines[0]
          const remainingContent = lines.slice(1).join('\n')
          
          // Create combined article header with heading on same line
          children.push(
            new Paragraph({
              children: [
                                 new TextRun({
                   text: section.content.trim(), // ARTICLE I, II, III, etc.
                   bold: true,
                   size: 28,
                   underline: {},
                 }),
                new TextRun({
                  text: ' - ',
                  size: 28,
                }),
                new TextRun({
                  text: heading, // The heading text
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: {
                before: 300,
                after: 200,
              },
            })
          )
          
          // Add remaining content if any
          if (remainingContent.trim()) {
            const remainingLines = remainingContent.trim().split('\n')
            remainingLines.forEach((line, index) => {
              if (line.trim()) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line.trim(),
                        size: 24,
                      }),
                    ],
                    spacing: {
                      before: index === 0 ? 100 : 0,
                      after: index === remainingLines.length - 1 ? 200 : 0,
                    },
                  })
                )
              }
            })
          }
          
          // Skip the next section since we've already processed it
          i++
        } else {
          // Fallback if no next section
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: section.content.trim(),
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: {
                before: 300,
                after: 200,
              },
            })
          )
        }
      } else if (section.name && section.name.includes('signature')) {
        // Signature section - make it bold and centered
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content.trim(),
                bold: true,
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 400,
              after: 200,
            },
          })
        )
      } else if (section.name && section.name.includes('attestation')) {
        // Attestation clause - make it bold
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content.trim(),
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: 300,
              after: 200,
            },
          })
        )
      } else if (!template.sections[i - 1]?.name?.includes('article')) {
        // Regular content - only process if not already handled by article section
        const lines = section.content.trim().split('\n')
        lines.forEach((line, index) => {
          if (line.trim()) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line.trim(),
                    size: 24,
                  }),
                ],
                spacing: {
                  before: index === 0 ? 200 : 0,
                  after: index === lines.length - 1 ? 200 : 0,
                },
              })
            )
          }
        })
      }
    }
  }
  
  return [
    {
      properties: {
        page: {
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: children,
    },
  ]
}

/**
 * Generate a comprehensive estate planning package
 * @param {Object} allFormData - Object containing all completed forms
 * @returns {Promise<Blob>} - Combined document package
 */
export const generateEstatePlanningPackage = async (allFormData) => {
  try {
    // Initialize docx library if not already done
    if (!isDocxAvailable()) {
      const initialized = await initializeDocx()
      if (!initialized) {
        throw new Error('Document generation library not available. Please try refreshing the page.')
      }
    }

    const documents = []
    
    // Generate individual documents
    for (const [type, data] of Object.entries(allFormData)) {
      if (data && Object.keys(data).length > 0) {
        const doc = await generateDocument(type, data)
        documents.push({ type, document: doc, data })
      }
    }
    
    // For now, return the first document as a placeholder
    // In a full implementation, you might want to combine them or create a zip file
    if (documents.length > 0) {
      return documents[0].document
    } else {
      throw new Error('No completed forms found')
    }
    
  } catch (error) {
    console.error('Error generating estate planning package:', error)
    throw new Error(`Failed to generate estate planning package: ${error.message}`)
  }
}

/**
 * Download a generated document
 * @param {Blob} blob - Document blob
 * @param {string} filename - Name for the downloaded file
 */
export const downloadDocument = (blob, filename) => {
  try {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading document:', error)
    throw new Error('Failed to download document')
  }
}

/**
 * Generate filename based on document type and date
 * @param {string} documentType - Type of document
 * @param {string} personName - Name of the person
 * @returns {string} - Formatted filename
 */
export const generateFilename = (documentType, personName) => {
  const date = new Date().toISOString().split('T')[0]
  const cleanName = personName.replace(/[^a-zA-Z0-9]/g, '_')
  
  const typeNames = {
    will: 'Last_Will_and_Testament',
    trust: 'Living_Trust_Agreement',
    poa: 'Power_of_Attorney',
    ahcd: 'Advance_Health_Care_Directive'
  }
  
  return `${typeNames[documentType]}_${cleanName}_${date}.docx`
}

/**
 * Validate form data before document generation
 * @param {Object} formData - Form data to validate
 * @param {string} documentType - Type of document
 * @returns {Object} - Validation result
 */
export const validateFormData = (formData, documentType) => {
  const errors = []
  
  // Basic validation - check for required fields
  if (!formData || typeof formData !== 'object') {
    errors.push('Form data is required')
    return { isValid: false, errors }
  }
  
  // Document-specific validation
  switch (documentType) {
    case 'will':
      if (!formData.testatorName) errors.push('Testator name is required')
      if (!formData.executorName) errors.push('Executor name is required')
      break
      
    case 'trust':
      if (!formData.trustorName) errors.push('Trustor name is required')
      if (!formData.trusteeName) errors.push('Trustee name is required')
      break
      
    case 'poa':
      if (!formData.principalName) errors.push('Principal name is required')
      if (!formData.agentName) errors.push('Agent name is required')
      break
      
    case 'ahcd':
      if (!formData.principalName) errors.push('Principal name is required')
      if (!formData.healthCareAgent) errors.push('Health care agent is required')
      break
      
    default:
      errors.push('Unknown document type')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Format form data for document generation
 * @param {Object} formData - Raw form data
 * @param {string} documentType - Type of document
 * @returns {Object} - Formatted data for templates
 */
export const formatFormData = (formData, documentType) => {
  const formatted = { ...formData }
  
  // Add current date
  formatted.currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Document-specific formatting
  switch (documentType) {
    case 'will':
      // Calculate age if DOB is provided
      if (formData.testatorDOB) {
        const birthDate = new Date(formData.testatorDOB)
        const today = new Date()
        formatted.testatorAge = today.getFullYear() - birthDate.getFullYear()
      }
      
      // Format family status based on marriage choice
      if (formData.isMarried === 'yes' && formData.spouseName) {
        formatted.familyStatus = `I am married to ${formData.spouseName}.`
      } else {
        formatted.familyStatus = 'I am not married.'
      }
      break
      
    case 'trust':
      // Format trust type description
      const trustTypeDescriptions = {
        'revocable': 'the trustor can modify or revoke the trust during their lifetime',
        'irrevocable': 'the trustor cannot modify or revoke the trust once created',
        'testamentary': 'the trust is created through a will and takes effect after death',
        'special-needs': 'the trust is designed to provide for beneficiaries with special needs'
      }
      formatted.trustTypeDescription = trustTypeDescriptions[formData.trustType] || ''
      break
      
    case 'poa':
      // Format scope description
      const scopeDescriptions = {
        'general': 'the agent has broad authority to act on your behalf',
        'limited': 'the agent has authority limited to specific matters',
        'durable': 'the agent\'s authority continues even if you become incapacitated',
        'springing': 'the agent\'s authority only takes effect under specific conditions'
      }
      formatted.scopeDescription = scopeDescriptions[formData.scope] || ''
      break
  }
  
  return formatted
}
