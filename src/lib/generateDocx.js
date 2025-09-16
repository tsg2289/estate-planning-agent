// Document generation utilities for creating Word documents
// This file handles the conversion of form data to DOCX format

import { getTemplate, populateTemplate } from './templates.js'

// Import docx library with error handling
let Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Spacing, BorderStyle, Footer, PageNumber

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
    Footer = docxModule.Footer
    PageNumber = docxModule.PageNumber
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
      sections: sections.map(section => ({
        ...section,
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
      })),
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
  
  // For trust documents, don't add the main title here since it's handled in title_header section
  if (!template.title.includes('REVOCABLE LIVING TRUST')) {
    // Add title for non-trust documents
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: template.title.toUpperCase(),
            bold: true,
            size: 32,
            color: "2E75B6", // Blue color to match the image
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 200,
        },
      })
    )
  }
  
  // Add sections with proper formatting
  for (let i = 0; i < template.sections.length; i++) {
    const section = template.sections[i]
    
    if (section.content && section.content.trim()) {
      // Handle page breaks
      if (section.content.trim() === 'PAGE_BREAK') {
        // Page breaks are handled at the section level, skip content processing
        continue
      }
      
      // Handle trust document sections specifically
      if (template.title.includes('REVOCABLE LIVING TRUST')) {
        if (section.name === 'title_header') {
          // Trust title header - special formatting
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      bold: true,
                      size: index === 0 ? 32 : 28,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    before: index === 0 ? 200 : 100,
                    after: index === lines.length - 1 ? 400 : 100,
                  },
                })
              )
            }
          })
        } else if (section.name && section.name.startsWith('article_')) {
          // Article sections - parse the content to separate header from body
          const lines = section.content.trim().split('\n').filter(line => line.trim())
          
          if (lines.length > 0) {
            // First line is the article header
            const articleHeader = lines[0]
            
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: articleHeader,
                    bold: true,
                    size: 28,
                    underline: {},
                  }),
                ],
                spacing: {
                  before: 400,
                  after: 200,
                },
              })
            )
            
            // Add blank line after header
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: '',
                    size: 12,
                  }),
                ],
                spacing: {
                  before: 0,
                  after: 100,
                },
              })
            )
            
            // Remaining lines are the content
            const contentLines = lines.slice(1)
            contentLines.forEach((line, index) => {
              if (line.trim()) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line.trim(),
                        size: 24,
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                      before: 0,
                      after: line.trim() === '' ? 0 : 100,
                    },
                  })
                )
              }
            })
          }
        } else if (section.name === 'notary_acknowledgment') {
          // Notary section - bold header
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      bold: index === 0, // Make first line (header) bold
                      size: 24,
                    }),
                  ],
                  alignment: index === 0 ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
                  spacing: {
                    before: index === 0 ? 400 : 0,
                    after: 100,
                  },
                })
              )
            }
          })
        } else if (section.name === 'schedule_a') {
          // Schedule A - bold header
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      bold: index === 0, // Make first line (header) bold
                      size: 24,
                    }),
                  ],
                  alignment: index === 0 ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
                  spacing: {
                    before: index === 0 ? 400 : 0,
                    after: 100,
                  },
                })
              )
            }
          })
        } else {
          // Regular trust content sections
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              const isSignatureLine = line.includes('Trustor') && line.includes(',') && !line.includes('Grantor:')
              
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      size: 24,
                      bold: line.includes('IN WITNESS WHEREOF') || isSignatureLine,
                    }),
                  ],
                  alignment: isSignatureLine ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
                  spacing: {
                    before: index === 0 ? 200 : 0,
                    after: line.includes('IN WITNESS WHEREOF') ? 200 : 100,
                  },
                })
              )
            }
          })
        }
      } else {
        // Handle other document types (will, poa, etc.)
        if (section.name === 'statutory_notice') {
          // Special formatting for POA statutory notice to match exact layout
          const content = section.content.trim()
          
          // First line: "(California Probate Code Section 4401)" - centered
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "(California Probate Code Section 4401)",
                  size: 24,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 200,
                after: 200,
              },
            })
          )
          
          // NOTICE text - split into bold "NOTICE:" and regular text
          const noticeText = "NOTICE: THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING. THEY ARE EXPLAINED IN THE UNIFORM STATUTORY FORM POWER OF ATTORNEY ACT (CALIFORNIA PROBATE CODE SECTIONS 4400–4465). THE POWERS LISTED IN THIS DOCUMENT DO NOT INCLUDE ALL POWERS THAT ARE AVAILABLE UNDER THE PROBATE CODE. ADDITIONAL POWERS AVAILABLE UNDER THE PROBATE CODE MAY BE ADDED BY SPECIFICALLY LISTING THEM UNDER THE SPECIAL INSTRUCTIONS SECTION OF THIS DOCUMENT. IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTHCARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO."
          
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "NOTICE:",
                  size: 24,
                  bold: true,
                }),
                new TextRun({
                  text: " THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING. THEY ARE EXPLAINED IN THE UNIFORM STATUTORY FORM POWER OF ATTORNEY ACT (CALIFORNIA PROBATE CODE SECTIONS 4400–4465). THE POWERS LISTED IN THIS DOCUMENT DO NOT INCLUDE ALL POWERS THAT ARE AVAILABLE UNDER THE PROBATE CODE. ADDITIONAL POWERS AVAILABLE UNDER THE PROBATE CODE MAY BE ADDED BY SPECIFICALLY LISTING THEM UNDER THE SPECIAL INSTRUCTIONS SECTION OF THIS DOCUMENT. IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTHCARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO.",
                  size: 24,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: {
                before: 0,
                after: 300,
              },
            })
          )
        } else if (section.name === 'appointment_form') {
          // Special formatting for appointment form section
          const content = section.content.trim()
          const lines = content.split('\n').filter(line => line.trim())
          
          lines.forEach((line, index) => {
            const trimmedLine = line.trim()
            if (trimmedLine) {
              // Check if this is one of the instruction lines that needs extra spacing
              const isInstructionLine = trimmedLine.startsWith('TO GRANT ALL') || 
                                       trimmedLine.startsWith('TO GRANT ONE OR MORE') || 
                                       trimmedLine.startsWith('TO WITHHOLD A POWER')
              
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: trimmedLine,
                      size: 24,
                    }),
                  ],
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: {
                    before: isInstructionLine ? 240 : (index === 0 ? 200 : 0),
                    after: isInstructionLine ? 240 : (index === lines.length - 1 ? 200 : 0),
                  },
                })
              )
            }
          })
        } else {
          // Handle other sections with standard formatting
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      size: 24,
                      bold: line.includes('ARTICLE') || line.includes('WITNESS'),
                    }),
                  ],
                  alignment: AlignmentType.JUSTIFIED,
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
  }
  
  // Split content into sections based on page breaks
  const sections = []
  let currentSectionChildren = []
  let pageBreakFound = false
  
  for (let i = 0; i < template.sections.length; i++) {
    const section = template.sections[i]
    
    if (section.content && section.content.trim() === 'PAGE_BREAK') {
      // Create a section with current children
      if (currentSectionChildren.length > 0) {
        sections.push({
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
          children: currentSectionChildren,
        })
        currentSectionChildren = []
      }
      pageBreakFound = true
    }
  }
  
  // Add remaining children as the final section (or only section if no page breaks)
  if (children.length > 0) {
    if (pageBreakFound) {
      // Split children based on where we are in the template processing
      const notaryCertificateIndex = template.sections.findIndex(s => s.name === 'notary_certificate')
      if (notaryCertificateIndex !== -1) {
        // Find where notary certificate content starts in children array
        const notaryStartIndex = children.findIndex(child => 
          child.children && child.children[0] && 
          child.children[0].text && 
          child.children[0].text.includes('CERTIFICATE OF ACKNOWLEDGMENT')
        )
        
        if (notaryStartIndex !== -1) {
          // Add main document section
          sections.push({
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
            children: children.slice(0, notaryStartIndex),
          })
          
          // Add notary certificate as separate page
          sections.push({
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
            children: children.slice(notaryStartIndex),
          })
        } else {
          // Fallback - add all children to one section
          sections.push({
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
          })
        }
      } else {
        sections.push({
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
        })
      }
    } else {
      // No page breaks, single section
      sections.push({
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
      })
    }
  }
  
  return sections
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
      if (formData.isMarried === 'married' && formData.spouseName) {
        formatted.familyStatus = `I am married to ${formData.spouseName}.`
      } else if (formData.isMarried === 'single') {
        formatted.familyStatus = 'I am single.'
      } else if (formData.isMarried === 'divorced') {
        formatted.familyStatus = 'I am divorced.'
      } else if (formData.isMarried === 'widowed') {
        formatted.familyStatus = 'I am widowed.'
      } else {
        formatted.familyStatus = 'I am not married.'
      }
      
      // Format children status based on children choice
      if (formData.hasChildren === 'yes' && formData.childrenNames) {
        // Filter out empty names and join with commas
        const childrenList = Array.isArray(formData.childrenNames) 
          ? formData.childrenNames.filter(name => name.trim() !== '').join(', ')
          : formData.childrenNames
        
        if (childrenList) {
          formatted.childrenStatus = `I have the following children: ${childrenList}.`
        } else {
          formatted.childrenStatus = 'I have no children.'
        }
      } else {
        formatted.childrenStatus = 'I have no children.'
      }
      
      // Format executors for document
      if (Array.isArray(formData.executors) && formData.executors.length > 0) {
        const primaryExecutor = formData.executors[0]
        
        // Primary executor info
        formatted.executorName = primaryExecutor.name || ''
        formatted.executorAddress = primaryExecutor.address || ''
        formatted.executorCity = primaryExecutor.city || ''
        formatted.executorState = primaryExecutor.state || ''
        formatted.executorZip = primaryExecutor.zip || ''
        formatted.executorPhone = primaryExecutor.phone || ''
        formatted.executorEmail = primaryExecutor.email || ''
        
        // Alternate executor info (second executor if exists)
        if (formData.executors.length > 1) {
          const alternateExecutor = formData.executors[1]
          formatted.alternateExecutorName = alternateExecutor.name || ''
          formatted.alternateExecutorAddress = alternateExecutor.address || ''
          formatted.alternateExecutorCity = alternateExecutor.city || ''
          formatted.alternateExecutorState = alternateExecutor.state || ''
          formatted.alternateExecutorZip = alternateExecutor.zip || ''
          formatted.alternateExecutorPhone = alternateExecutor.phone || ''
        } else {
          // Clear alternate executor fields if no second executor
          formatted.alternateExecutorName = ''
          formatted.alternateExecutorAddress = ''
          formatted.alternateExecutorCity = ''
          formatted.alternateExecutorState = ''
          formatted.alternateExecutorZip = ''
          formatted.alternateExecutorPhone = ''
        }
      }
      
      // Format guardians for document
      if (Array.isArray(formData.guardians) && formData.guardians.length > 0) {
        const primaryGuardian = formData.guardians[0]
        
        // Primary guardian info
        formatted.guardianName = primaryGuardian.name || ''
        formatted.guardianAddress = primaryGuardian.address || ''
        formatted.guardianCity = primaryGuardian.city || ''
        formatted.guardianState = primaryGuardian.state || ''
        formatted.guardianZip = primaryGuardian.zip || ''
        formatted.guardianPhone = primaryGuardian.phone || ''
        formatted.guardianEmail = primaryGuardian.email || ''
        
        // Alternate guardian info (second guardian if exists)
        if (formData.guardians.length > 1) {
          const alternateGuardian = formData.guardians[1]
          formatted.alternateGuardianName = alternateGuardian.name || ''
          formatted.alternateGuardianAddress = alternateGuardian.address || ''
          formatted.alternateGuardianCity = alternateGuardian.city || ''
          formatted.alternateGuardianState = alternateGuardian.state || ''
          formatted.alternateGuardianZip = alternateGuardian.zip || ''
          formatted.alternateGuardianPhone = alternateGuardian.phone || ''
          formatted.alternateGuardianEmail = alternateGuardian.email || ''
        } else {
          // Clear alternate guardian fields if no second guardian
          formatted.alternateGuardianName = ''
          formatted.alternateGuardianAddress = ''
          formatted.alternateGuardianCity = ''
          formatted.alternateGuardianState = ''
          formatted.alternateGuardianZip = ''
          formatted.alternateGuardianPhone = ''
          formatted.alternateGuardianEmail = ''
        }
      }
      
      // Format special bequests for document
      if (formData.hasSpecialBequests === 'no') {
        formatted.specialBequestsText = 'My Residual Estate will be received by the Beneficiaries with no special bequests.'
      } else if (formData.hasSpecialBequests === 'yes' && Array.isArray(formData.specificBequests)) {
        // Filter out empty bequests and format them
        const validBequests = formData.specificBequests.filter(bequest => 
          bequest.name && bequest.name.trim() !== '' && 
          bequest.property && bequest.property.trim() !== ''
        )
        
        if (validBequests.length > 0) {
          const bequestsList = validBequests.map((bequest, index) => {
            const relation = bequest.relation && bequest.relation.trim() !== '' 
              ? ` (my ${bequest.relation})` 
              : ''
            return `${index + 1}. To ${bequest.name}${relation}: ${bequest.property}`
          }).join('\n')
          
          formatted.specialBequestsText = `I make the following special bequests:\n\n${bequestsList}`
        } else {
          formatted.specialBequestsText = 'My Residual Estate will be received by the Beneficiaries with no special bequests.'
        }
      } else {
        formatted.specialBequestsText = 'My Residual Estate will be received by the Beneficiaries with no special bequests.'
      }
      
      // Format attestation date
      if (formData.attestationDate) {
        const attestationDate = new Date(formData.attestationDate)
        formatted.attestationDate = attestationDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } else {
        formatted.attestationDate = '___ day of _______, 20__'
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
      
      // Use the county fields directly (now dropdown selections)
      formatted.trustorCounty = formData.trustorCounty || 'County'
      formatted.trusteeCity = formData.trusteeCity || formData.trustorCity || 'City'
      formatted.trusteeCounty = formData.trusteeCounty || formatted.trustorCounty
      
      // Format trust date for display
      if (formData.trustDate) {
        const trustDate = new Date(formData.trustDate)
        formatted.trustDateFormatted = trustDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } else {
        formatted.trustDateFormatted = '__________, 20__'
      }
      
      // Handle multiple trustors
      if (formData.hasSecondTrustor && formData.secondTrustorName) {
        formatted.trustorInfo = `Trustor, ${formData.trustorName}, of ${formData.trustorCity}, ${formData.trustorCounty}, California ("Trustor") and
Trustor, ${formData.secondTrustorName}, of ${formData.secondTrustorCity}, ${formData.secondTrustorCounty}, California ("Trustor") establish
this Revocable Living Trust Agreement this ___day of _______, 20__.`
        
        // Update trust name to include both trustors
        const firstTrustorLastName = formData.trustorName.split(' ').pop()
        const secondTrustorLastName = formData.secondTrustorName.split(' ').pop()
        formatted.trustorName = `${firstTrustorLastName} and ${secondTrustorLastName} Family`
      } else {
        formatted.trustorInfo = `Trustor, ${formData.trustorName}, of ${formData.trustorCity}, ${formData.trustorCounty}, California ("Trustor") establish
this Revocable Living Trust Agreement this ___day of _______, 20__.`
      }
      
      // Format successor trustee information
      formatted.successorTrusteeList = formatSuccessorTrustees(formData.alternateTrustees)
      
      // Extract primary and alternate successor trustees for Article 3
      if (formData.alternateTrustees && formData.alternateTrustees.length > 0) {
        const primaryTrustee = formData.alternateTrustees[0]
        formatted.successorTrusteePrimary = primaryTrustee && primaryTrustee.name ? primaryTrustee.name : '[Name of Successor Trustee]'
        
        if (formData.alternateTrustees.length > 1) {
          const alternateTrustee = formData.alternateTrustees[1]
          formatted.successorTrusteeAlternate = alternateTrustee && alternateTrustee.name ? alternateTrustee.name : '[Alternate Successor Trustee]'
        } else {
          formatted.successorTrusteeAlternate = '[Alternate Successor Trustee]'
        }
      } else {
        formatted.successorTrusteePrimary = '[Name of Successor Trustee]'
        formatted.successorTrusteeAlternate = '[Alternate Successor Trustee]'
      }
      
      // Format specific gifts from specificGifts array
      formatted.specificGifts = formatSpecificGifts(formData.specificGifts)
      
      // Format residue distribution from children and other beneficiaries
      formatted.residueDistribution = formatResidueDistribution(formData.children, formData.otherBeneficiaries)
      
      // Format trust assets list for Schedule A
      formatted.trustAssetsList = formatTrustAssetsList(formData.trustAssets)
      
      break
      
    case 'ahcd':
      // Format alternate health care agent details
      if (formData.alternateHealthCareAgents && Array.isArray(formData.alternateHealthCareAgents)) {
        const validAlternateAgents = formData.alternateHealthCareAgents.filter(agent => agent.name && agent.name.trim())
        
        if (validAlternateAgents.length > 0) {
          let alternateAgentDetails = ''
          
          if (validAlternateAgents.length === 1) {
            const agent = validAlternateAgents[0]
            formatted.alternateHealthCareAgent = agent.name
            
            // Add address and contact info
            const agentInfo = []
            if (agent.address && agent.address.trim()) {
              agentInfo.push(`Address: ${agent.address}`)
            }
            if (agent.phone && agent.phone.trim()) {
              agentInfo.push(`Phone: ${agent.phone}`)
            }
            if (agent.email && agent.email.trim()) {
              agentInfo.push(`Email: ${agent.email}`)
            }
            
            if (agentInfo.length > 0) {
              alternateAgentDetails = ` ${agentInfo.join(', ')}.`
            }
          } else {
            // Multiple alternate agents
            const agentNames = validAlternateAgents.map(agent => agent.name).join(', ')
            formatted.alternateHealthCareAgent = agentNames
            
            alternateAgentDetails = ' The alternate agents will serve in the following order:\n\n'
            validAlternateAgents.forEach((agent, index) => {
              alternateAgentDetails += `${index + 1}. ${agent.name}`
              
              const agentInfo = []
              if (agent.address && agent.address.trim()) {
                agentInfo.push(`Address: ${agent.address}`)
              }
              if (agent.phone && agent.phone.trim()) {
                agentInfo.push(`Phone: ${agent.phone}`)
              }
              if (agent.email && agent.email.trim()) {
                agentInfo.push(`Email: ${agent.email}`)
              }
              
              if (agentInfo.length > 0) {
                alternateAgentDetails += ` - ${agentInfo.join(', ')}`
              }
              
              alternateAgentDetails += '\n'
            })
          }
          
          formatted.alternateHealthCareAgentDetails = alternateAgentDetails
        } else {
          formatted.alternateHealthCareAgent = ''
          formatted.alternateHealthCareAgentDetails = ''
        }
      }
      // Legacy support for old single alternate agent format
      else if (formData.alternateHealthCareAgent && formData.alternateHealthCareAgent.trim()) {
        formatted.alternateHealthCareAgent = formData.alternateHealthCareAgent
        
        let alternateAgentDetails = ''
        
        // Add address if provided
        if (formData.alternateHealthCareAgentAddress && formData.alternateHealthCareAgentAddress.trim()) {
          alternateAgentDetails += ` Address: ${formData.alternateHealthCareAgentAddress}.`
        }
        
        // Add contact information
        const contactInfo = []
        if (formData.alternateHealthCareAgentPhone && formData.alternateHealthCareAgentPhone.trim()) {
          contactInfo.push(`Phone: ${formData.alternateHealthCareAgentPhone}`)
        }
        if (formData.alternateHealthCareAgentEmail && formData.alternateHealthCareAgentEmail.trim()) {
          contactInfo.push(`Email: ${formData.alternateHealthCareAgentEmail}`)
        }
        
        if (contactInfo.length > 0) {
          alternateAgentDetails += ` ${contactInfo.join(', ')}.`
        }
        
        formatted.alternateHealthCareAgentDetails = alternateAgentDetails
      } else {
        formatted.alternateHealthCareAgent = ''
        formatted.alternateHealthCareAgentDetails = ''
      }
      
      // Format primary health care agent with address
      if (formData.healthCareAgent && formData.healthCareAgent.trim()) {
        let primaryAgentText = formData.healthCareAgent
        
        // Add address if provided
        if (formData.healthCareAgentAddress && formData.healthCareAgentAddress.trim()) {
          primaryAgentText += `, ${formData.healthCareAgentAddress}`
        }
        
        // Add contact information if available
        const contactInfo = []
        if (formData.healthCareAgentPhone && formData.healthCareAgentPhone.trim()) {
          contactInfo.push(`Phone: ${formData.healthCareAgentPhone}`)
        }
        if (formData.healthCareAgentEmail && formData.healthCareAgentEmail.trim()) {
          contactInfo.push(`Email: ${formData.healthCareAgentEmail}`)
        }
        
        if (contactInfo.length > 0) {
          primaryAgentText += ` (${contactInfo.join(', ')})`
        }
        
        formatted.healthCareAgent = primaryAgentText
      }
      
      // Format agent authority exceptions
      if (formData.agentAuthorityExceptions && formData.agentAuthorityExceptions.trim()) {
        formatted.agentAuthorityExceptions = formData.agentAuthorityExceptions.trim()
      } else {
        // Show blank lines if no exceptions specified
        formatted.agentAuthorityExceptions = `___________________________________________________________________________________________________

___________________________________________________________________________________________________

___________________________________________________________________________________________________`
      }
      
      // Format authority effectiveness checkbox
      formatted.authorityEffectivenessCheckbox = formData.immediateAuthorityEffective ? '☑' : '☐'
      
      // Format agent postdeath authorities
      const authorities = []
      if (formData.agentCanDonateOrgans) {
        authorities.push('donate my organs, tissues, and parts')
      }
      if (formData.agentCanAuthorizeAutopsy) {
        authorities.push('authorize an autopsy')
      }
      if (formData.agentCanDirectDisposition) {
        authorities.push('direct disposition of my remains')
      }
      
      if (authorities.length > 0) {
        if (authorities.length === 1) {
          formatted.agentPostdeathAuthorities = authorities[0]
        } else if (authorities.length === 2) {
          formatted.agentPostdeathAuthorities = authorities.join(' and ')
        } else {
          formatted.agentPostdeathAuthorities = authorities.slice(0, -1).join(', ') + ', and ' + authorities[authorities.length - 1]
        }
      } else {
        formatted.agentPostdeathAuthorities = '[No postdeath authorities selected]'
      }
      
      // Format selected end-of-life choice only (without checkmarks)
      if (formData.endOfLifeChoice === 'not-prolong') {
        formatted.selectedEndOfLifeChoice = `(a) Choice Not To Prolong Life

        I do not want my life to be prolonged if (1) I have an incurable and irreversible condition that will result in my death within a relatively short time, (2) I become unconscious and, to a reasonable degree of medical certainty, I will not regain consciousness, or (3) the likely risks and burdens of treatment would outweigh the expected benefits.`
      } else if (formData.endOfLifeChoice === 'prolong') {
        formatted.selectedEndOfLifeChoice = `(b) Choice To Prolong Life

        I want my life to be prolonged as long as possible within the limits of generally accepted health care standards.`
      } else {
        // Show both options without checkboxes if no choice made
        formatted.selectedEndOfLifeChoice = `(a) Choice Not To Prolong Life

        I do not want my life to be prolonged if (1) I have an incurable and irreversible condition that will result in my death within a relatively short time, (2) I become unconscious and, to a reasonable degree of medical certainty, I will not regain consciousness, or (3) the likely risks and burdens of treatment would outweigh the expected benefits, OR

        (b) Choice To Prolong Life

        I want my life to be prolonged as long as possible within the limits of generally accepted health care standards.`
      }
      
      // Format pain relief exceptions
      if (formData.painReliefExceptions && formData.painReliefExceptions.trim()) {
        formatted.painReliefExceptions = formData.painReliefExceptions.trim()
      } else {
        // Show blank lines if no exceptions specified
        formatted.painReliefExceptions = `___________________________________________________________________________________________________

___________________________________________________________________________________________________`
      }
      
      // Format health care wishes
      if (formData.healthCareWishes && formData.healthCareWishes.trim()) {
        formatted.healthCareWishes = formData.healthCareWishes.trim()
      } else {
        // Show blank lines if no wishes specified
        formatted.healthCareWishes = `___________________________________________________________________________________________________

___________________________________________________________________________________________________`
      }
      
      // Format personal organ donation choice (Part 3.1)
      formatted.personalOrganDonationCheckbox = formData.personalOrganDonation ? '☑' : '☐'
      
      // Format primary physician information (Part 4)
      if (formData.primaryPhysicianName && formData.primaryPhysicianName.trim()) {
        formatted.primaryPhysicianName = formData.primaryPhysicianName.trim()
      } else {
        formatted.primaryPhysicianName = '___________________________________________________________________________________________________'
      }
      
      if (formData.primaryPhysicianAddress && formData.primaryPhysicianAddress.trim()) {
        let addressParts = [formData.primaryPhysicianAddress.trim()]
        if (formData.primaryPhysicianCity && formData.primaryPhysicianCity.trim()) {
          addressParts.push(formData.primaryPhysicianCity.trim())
        }
        if (formData.primaryPhysicianState && formData.primaryPhysicianState.trim()) {
          addressParts.push(formData.primaryPhysicianState.trim())
        }
        if (formData.primaryPhysicianZip && formData.primaryPhysicianZip.trim()) {
          addressParts.push(formData.primaryPhysicianZip.trim())
        }
        formatted.primaryPhysicianAddress = addressParts.join(', ')
      } else {
        formatted.primaryPhysicianAddress = `___________________________________________________________________________________________________

___________________________________________________________________________________________________

(address)                    (city)                    (state)                    (ZIP Code)`
      }
      
      if (formData.primaryPhysicianPhone && formData.primaryPhysicianPhone.trim()) {
        formatted.primaryPhysicianPhone = formData.primaryPhysicianPhone.trim()
      } else {
        formatted.primaryPhysicianPhone = '___________________________________________________________________________________________________'
      }
      
      // Format alternate primary physician information
      if (formData.alternatePrimaryPhysicianName && formData.alternatePrimaryPhysicianName.trim()) {
        formatted.alternatePrimaryPhysicianName = formData.alternatePrimaryPhysicianName.trim()
      } else {
        formatted.alternatePrimaryPhysicianName = '___________________________________________________________________________________________________'
      }
      
      if (formData.alternatePrimaryPhysicianAddress && formData.alternatePrimaryPhysicianAddress.trim()) {
        let addressParts = [formData.alternatePrimaryPhysicianAddress.trim()]
        if (formData.alternatePrimaryPhysicianCity && formData.alternatePrimaryPhysicianCity.trim()) {
          addressParts.push(formData.alternatePrimaryPhysicianCity.trim())
        }
        if (formData.alternatePrimaryPhysicianState && formData.alternatePrimaryPhysicianState.trim()) {
          addressParts.push(formData.alternatePrimaryPhysicianState.trim())
        }
        if (formData.alternatePrimaryPhysicianZip && formData.alternatePrimaryPhysicianZip.trim()) {
          addressParts.push(formData.alternatePrimaryPhysicianZip.trim())
        }
        formatted.alternatePrimaryPhysicianAddress = addressParts.join(', ')
      } else {
        formatted.alternatePrimaryPhysicianAddress = `___________________________________________________________________________________________________

___________________________________________________________________________________________________

(address)                    (city)                    (state)                    (ZIP Code)`
      }
      
      if (formData.alternatePrimaryPhysicianPhone && formData.alternatePrimaryPhysicianPhone.trim()) {
        formatted.alternatePrimaryPhysicianPhone = formData.alternatePrimaryPhysicianPhone.trim()
      } else {
        formatted.alternatePrimaryPhysicianPhone = '___________________________________________________________________________________________________'
      }
      
      // Part 5 - Signature section
      // Format signature date
      if (formData.signatureDate && formData.signatureDate.trim()) {
        const date = new Date(formData.signatureDate)
        formatted.signatureDate = date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      } else {
        formatted.signatureDate = '_________________________________________________'
      }
      
      // Format signature image/document
      if (formData.signatureImage) {
        if (formData.signatureImage.startsWith('data:application/pdf')) {
          formatted.signatureImage = '[SIGNATURE PDF DOCUMENT UPLOADED]'
        } else {
          formatted.signatureImage = '[SIGNATURE IMAGE UPLOADED]'
        }
      } else {
        formatted.signatureImage = '_________________________________________________'
      }
      
      // Format principal name for signature (from Part 1)
      if (formData.principalName && formData.principalName.trim()) {
        formatted.signatureName = formData.principalName.trim()
      } else {
        formatted.signatureName = '_________________________________________________'
      }
      
      // Format principal address for signature (from Part 1)
      if (formData.principalAddress && formData.principalAddress.trim()) {
        let addressParts = []
        if (formData.principalAddress.trim()) {
          addressParts.push(formData.principalAddress.trim())
        }
        if (formData.principalCity && formData.principalCity.trim()) {
          addressParts.push(formData.principalCity.trim())
        }
        if (formData.principalState && formData.principalState.trim()) {
          addressParts.push(formData.principalState.trim())
        }
        if (formData.principalZip && formData.principalZip.trim()) {
          addressParts.push(formData.principalZip.trim())
        }
        
        if (addressParts.length > 0) {
          formatted.signatureAddress = addressParts[0]
          formatted.signatureCityStateZip = addressParts.slice(1).join(', ')
        } else {
          formatted.signatureAddress = '_________________________________________________'
          formatted.signatureCityStateZip = '_________________________________________________'
        }
      } else {
        formatted.signatureAddress = '_________________________________________________'
        formatted.signatureCityStateZip = '_________________________________________________'
      }
      
      // Format witness information for Part 5.3
      const formatWitness = (witness, index) => {
        const witnessNum = index + 1
        const result = {}
        
        result[`witness${witnessNum}Name`] = witness?.name?.trim() || '_________________________________________________'
        result[`witness${witnessNum}Address`] = witness?.address?.trim() || '_________________________________________________'
        
        const city = witness?.city?.trim() || ''
        const state = witness?.state?.trim() || ''
        if (city && state) {
          result[`witness${witnessNum}CityState`] = `${city}, ${state}`
        } else if (city || state) {
          result[`witness${witnessNum}CityState`] = `${city}${state}`.trim()
        } else {
          result[`witness${witnessNum}CityState`] = '_________________________________________________'
        }
        
        if (witness?.signatureDate?.trim()) {
          const date = new Date(witness.signatureDate)
          result[`witness${witnessNum}Date`] = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        } else {
          result[`witness${witnessNum}Date`] = '_________________________________________________'
        }
        
        // Signature line is always blank for witnesses to sign physically
        result[`witness${witnessNum}Signature`] = '_________________________________________________'
        
        return result
      }
      
      // Format both witnesses
      if (formData.witnesses && formData.witnesses.length >= 2) {
        Object.assign(formatted, formatWitness(formData.witnesses[0], 0))
        Object.assign(formatted, formatWitness(formData.witnesses[1], 1))
      } else {
        // Provide blank witness information if not enough witnesses
        Object.assign(formatted, formatWitness({}, 0))
        Object.assign(formatted, formatWitness({}, 1))
      }
      
      // Part 5.4 - Additional Statement of Witnesses (document only, no form fields needed)
      // This section provides blank signature lines for witnesses to sign physically
      formatted.additionalWitnessSignature = '_________________________________________________'
      
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
      
      // Format statutory powers list
      const statutoryPowers = [
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
      ]
      
      let powersList = ''
      
      if (formData.allPowersSelected) {
        // If all powers selected, show all with checkmarks and highlight (N)
        statutoryPowers.forEach(power => {
          powersList += `__X__ (${power.code}) ${power.description}\n`
        })
        powersList += `__X__ (N) ALL OF THE POWERS LISTED ABOVE\n`
      } else {
        // Show individual selections
        statutoryPowers.forEach(power => {
          const isSelected = formData.specificPowers && formData.specificPowers.includes(power.code)
          const mark = isSelected ? '__X__' : '______'
          powersList += `${mark} (${power.code}) ${power.description}\n`
        })
        powersList += `______ (N) ALL OF THE POWERS LISTED ABOVE\n`
      }
      
      formatted.statutoryPowersList = powersList
      
      // Format special instructions content from UI fields
      let specialInstructions = ''
      
      // Add limitations if provided
      if (formData.limitations && formData.limitations.trim()) {
        specialInstructions += `${formData.limitations.trim()}\n`
      }
      
      // Add alternate agents if provided
      if (formData.alternateAgents && Array.isArray(formData.alternateAgents)) {
        const validAlternateAgents = formData.alternateAgents.filter(agent => agent.name && agent.name.trim())
        
        if (validAlternateAgents.length > 0) {
          if (validAlternateAgents.length === 1) {
            const agent = validAlternateAgents[0]
            specialInstructions += `If ${formData.agentName} is unable or unwilling to serve as my Agent, I appoint ${agent.name} as my Alternate Agent.`
            
            // Build full address for alternate agent
            const alternateAgentFullAddress = [
              agent.address,
              agent.city,
              agent.state,
              agent.zip
            ].filter(item => item && item.trim()).join(', ')
            
            if (alternateAgentFullAddress) {
              specialInstructions += ` Address: ${alternateAgentFullAddress}`
            }
            
            // Add contact information
            const contactInfo = []
            if (agent.phone && agent.phone.trim()) {
              contactInfo.push(`Phone: ${agent.phone}`)
            }
            if (agent.email && agent.email.trim()) {
              contactInfo.push(`Email: ${agent.email}`)
            }
            
            if (contactInfo.length > 0) {
              specialInstructions += `, ${contactInfo.join(', ')}`
            }
            
            specialInstructions += '\n'
          } else {
            // Multiple alternate agents
            specialInstructions += `If ${formData.agentName} is unable or unwilling to serve as my Agent, I appoint the following persons as my Alternate Agents in the order listed:\n\n`
            
            validAlternateAgents.forEach((agent, index) => {
              specialInstructions += `${index + 1}. ${agent.name}`
              
              // Build full address
              const agentFullAddress = [
                agent.address,
                agent.city,
                agent.state,
                agent.zip
              ].filter(item => item && item.trim()).join(', ')
              
              if (agentFullAddress) {
                specialInstructions += `, Address: ${agentFullAddress}`
              }
              
              // Add contact information
              const contactInfo = []
              if (agent.phone && agent.phone.trim()) {
                contactInfo.push(`Phone: ${agent.phone}`)
              }
              if (agent.email && agent.email.trim()) {
                contactInfo.push(`Email: ${agent.email}`)
              }
              
              if (contactInfo.length > 0) {
                specialInstructions += `, ${contactInfo.join(', ')}`
              }
              
              specialInstructions += '\n'
            })
          }
        }
      }
      
      // Legacy support for old single alternate agent format
      else if (formData.alternateAgentName && formData.alternateAgentName.trim()) {
        specialInstructions += `If ${formData.agentName} is unable or unwilling to serve as my Agent, I appoint ${formData.alternateAgentName} as my Alternate Agent.`
        
        // Build full address for alternate agent
        const alternateAgentFullAddress = [
          formData.alternateAgentAddress,
          formData.alternateAgentCity,
          formData.alternateAgentState,
          formData.alternateAgentZip
        ].filter(item => item && item.trim()).join(', ')
        
        if (alternateAgentFullAddress) {
          specialInstructions += ` Address: ${alternateAgentFullAddress}`
        }
        
        // Add contact information
        const contactInfo = []
        if (formData.alternateAgentPhone && formData.alternateAgentPhone.trim()) {
          contactInfo.push(`Phone: ${formData.alternateAgentPhone}`)
        }
        if (formData.alternateAgentEmail && formData.alternateAgentEmail.trim()) {
          contactInfo.push(`Email: ${formData.alternateAgentEmail}`)
        }
        
        if (contactInfo.length > 0) {
          specialInstructions += `, ${contactInfo.join(', ')}`
        }
        
        specialInstructions += '\n'
      }
      
      // Format with blank lines structure
      const lines = specialInstructions.split('\n').filter(line => line.trim())
      let formattedInstructions = ''
      
      // Add up to 5 lines of content, then fill remaining with blank lines
      for (let i = 0; i < 5; i++) {
        if (i < lines.length) {
          formattedInstructions += `${lines[i]}\n`
        }
        formattedInstructions += '__________________________________________________________________________________________\n'
      }
      
      formatted.specialInstructionsContent = formattedInstructions
      
      // Set incapacitation text based on user choice
      if (formData.incapacitationChoice === 'non-durable') {
        formatted.incapacitationText = 'This power of attorney will cease to continue if I become incapacitated.'
      } else {
        // Default to durable
        formatted.incapacitationText = 'This power of attorney will continue to be effective even though I become incapacitated.'
      }
      
      // Create conditional appointment text
      const hasPrincipalInfo = formData.principalName && formData.principalName.trim()
      const hasAgentInfo = formData.agentName && formData.agentName.trim()
      
      if (hasPrincipalInfo && hasAgentInfo) {
        // Names provided - show actual names and addresses without instructional text
        const principalFullAddress = [
          formData.principalAddress,
          formData.principalCity,
          formData.principalState,
          formData.principalZip
        ].filter(item => item && item.trim()).join(', ')
        
        const agentFullAddress = [
          formData.agentAddress,
          formData.agentCity, 
          formData.agentState,
          formData.agentZip
        ].filter(item => item && item.trim()).join(', ')
        
        formatted.appointmentText = `I, ${formData.principalName}, ${principalFullAddress} appoint ${formData.agentName}, ${agentFullAddress} as my agent (attorney-in-fact) to act for me in any lawful way with respect to the following initialed subjects:`
      } else {
        // Names not provided - show instructional text with blanks
        formatted.appointmentText = `I, _____________________________________________________________________________ (your name and address) appoint ________________________________________________________________________ __________________________________ (name and address of the person appointed, or of each person appointed if you want to designate more than one) as my agent (attorney-in-fact) to act for me in any lawful way with respect to the following initialed subjects:`
      }
      
      break
  }
  
  return formatted
}

/**
 * Helper functions for trust document formatting
 */

// Extract county from city string (e.g., "Los Angeles, Los Angeles County" -> "Los Angeles County")
const extractCountyFromCity = (cityString) => {
  if (!cityString) return null
  
  // Common California county mappings
  const countyMappings = {
    'los angeles': 'Los Angeles County',
    'san francisco': 'San Francisco County',
    'san diego': 'San Diego County',
    'orange': 'Orange County',
    'riverside': 'Riverside County',
    'san bernardino': 'San Bernardino County',
    'alameda': 'Alameda County',
    'santa clara': 'Santa Clara County',
    'sacramento': 'Sacramento County',
    'contra costa': 'Contra Costa County'
  }
  
  const cityLower = cityString.toLowerCase()
  for (const [city, county] of Object.entries(countyMappings)) {
    if (cityLower.includes(city)) {
      return county
    }
  }
  
  // If county is already mentioned in the string
  if (cityLower.includes('county')) {
    return cityString
  }
  
  return null
}

// Extract city from address string
const extractCityFromAddress = (address) => {
  if (!address) return null
  
  // Simple extraction - assume city is after the street address
  const parts = address.split(',')
  if (parts.length >= 2) {
    return parts[1].trim()
  }
  
  return null
}

// Format specific gifts section
const formatSpecificGifts = (specificGifts) => {
  if (!specificGifts || specificGifts.length === 0) {
    return '[No specific gifts designated]'
  }
  
  const gifts = specificGifts.map(gift => {
    if (gift.beneficiary && gift.gift) {
      return `To ${gift.beneficiary}, ${gift.gift}.`
    }
    return null
  }).filter(gift => gift !== null)
  
  return gifts.length > 0 ? gifts.join('\n\n') : '[No specific gifts designated]'
}

// Format residue distribution section
const formatResidueDistribution = (children, otherBeneficiaries) => {
  const distributions = []
  
  // Add children with their specified percentages
  if (children && children.length > 0) {
    const validChildren = children.filter(child => child.name && child.name.trim())
    if (validChildren.length > 0) {
      validChildren.forEach(child => {
        if (child.percentage && child.percentage.trim()) {
          distributions.push(`${child.percentage} to ${child.name} (${child.relationship || 'Child'}).`)
        } else {
          distributions.push(`Equal share to ${child.name} (${child.relationship || 'Child'}).`)
        }
      })
    }
  }
  
  // Add other beneficiaries with their specified percentages
  if (otherBeneficiaries && otherBeneficiaries.length > 0) {
    const validOtherBeneficiaries = otherBeneficiaries.filter(b => b.name && b.name.trim())
    validOtherBeneficiaries.forEach(beneficiary => {
      if (beneficiary.percentage && beneficiary.percentage.trim()) {
        distributions.push(`${beneficiary.percentage} to ${beneficiary.name} (${beneficiary.relationship || 'Beneficiary'}).`)
      } else {
        distributions.push(`Share to be determined to ${beneficiary.name} (${beneficiary.relationship || 'Beneficiary'}).`)
      }
    })
  }
  
  return distributions.length > 0 ? distributions.join('\n\n') : '[No residue distribution specified]'
}

// Format trust assets list for Schedule A
const formatTrustAssetsList = (trustAssets) => {
  if (!trustAssets || trustAssets.length === 0) {
    return '[No assets listed]'
  }
  
  const assetsList = trustAssets.map(asset => {
    if (asset.description) {
      let assetText = asset.description
      if (asset.type) {
        assetText += ` (${asset.type})`
      }
      if (asset.value) {
        assetText += ` - Estimated Value: ${asset.value}`
      }
      return assetText
    }
    return null
  }).filter(asset => asset !== null)
  
  return assetsList.length > 0 ? assetsList.join('\n\n') : '[No assets listed]'
}

// Format successor trustees list
const formatSuccessorTrustees = (alternateTrustees) => {
  if (!alternateTrustees || alternateTrustees.length === 0) {
    return '[No successor trustees designated]'
  }
  
  const trusteesList = alternateTrustees.map((trustee, index) => {
    if (trustee.name && trustee.name.trim()) {
      const orderNumber = index + 1
      let trusteeText = `${orderNumber}. ${trustee.name.trim()}`
      
      // Add location if city and county are provided
      if (trustee.city && trustee.county) {
        trusteeText += `, of ${trustee.city}, ${trustee.county}, California`
      } else if (trustee.city) {
        trusteeText += `, of ${trustee.city}, California`
      }
      
      // Add contact information if available
      if (trustee.phone || trustee.email) {
        const contacts = []
        if (trustee.phone) contacts.push(`Phone: ${trustee.phone}`)
        if (trustee.email) contacts.push(`Email: ${trustee.email}`)
        trusteeText += ` (${contacts.join(', ')})`
      }
      
      return trusteeText + '.'
    }
    return null
  }).filter(trustee => trustee !== null)
  
  if (trusteesList.length === 0) {
    return '[No successor trustees designated]'
  }
  
  // Add final clause
  const formattedList = trusteesList.join('\n\n')
  return formattedList + '\n\nIf none of the above-named persons are able or willing to serve, then any reputable trust company may be appointed as Successor Trustee.'
}
