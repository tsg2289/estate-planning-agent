import { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, PageNumber } from 'docx'
import { saveAs } from 'file-saver'

export interface DocumentData {
  [key: string]: any
}

export type DocumentType = 'will' | 'trust' | 'poa' | 'ahcd' | 'pet_trust' | 'hipaa' | 'living_will' | 'beneficiary'

/**
 * Generate a Word document from form data
 */
export const generateDocument = async (documentType: DocumentType, formData: DocumentData): Promise<Blob> => {
  try {
    const template = getTemplate(documentType)
    const populatedTemplate = populateTemplate(template, formData)
    const sections = createDocumentSections(populatedTemplate, formData)
    
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
    
    const blob = await Packer.toBlob(doc)
    return blob
    
  } catch (error) {
    console.error('Error generating document:', error)
    throw new Error(`Failed to generate ${documentType} document: ${error.message}`)
  }
}

/**
 * Download a generated document
 */
export const downloadDocument = (blob: Blob, filename: string): void => {
  try {
    saveAs(blob, filename)
  } catch (error) {
    console.error('Error downloading document:', error)
    throw new Error('Failed to download document')
  }
}

/**
 * Generate filename based on document type and date
 */
export const generateFilename = (documentType: DocumentType, personName?: string): string => {
  const date = new Date().toISOString().split('T')[0]
  const name = personName ? `${personName.replace(/[^a-zA-Z0-9]/g, '_')}_` : ''
  
  const typeNames: Record<DocumentType, string> = {
    will: 'Last_Will_Testament',
    trust: 'Living_Trust',
    poa: 'Power_of_Attorney',
    ahcd: 'Advance_Healthcare_Directive',
    pet_trust: 'Pet_Trust',
    hipaa: 'HIPAA_Authorization',
    living_will: 'Living_Will',
    beneficiary: 'Beneficiary_Designation'
  }
  
  return `${name}${typeNames[documentType]}_${date}.docx`
}

/**
 * Get document template based on type
 */
const getTemplate = (documentType: DocumentType): string => {
  const templates = {
    will: `
LAST WILL AND TESTAMENT
OF {{testatorName}}

I, {{testatorName}}, a resident of {{testatorCity}}, {{testatorState}}, being of sound mind and disposing memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all former wills and codicils made by me.

ARTICLE I - FAMILY
I am {{maritalStatus}}. {{#if spouseName}}My spouse's name is {{spouseName}}.{{/if}}
{{#if children}}I have the following children: {{children}}.{{/if}}

ARTICLE II - EXECUTOR
I hereby nominate and appoint {{executorName}} as the Executor of this Will. If {{executorName}} is unable or unwilling to serve, I nominate {{alternateExecutorName}} as alternate Executor.

ARTICLE III - GUARDIAN
{{#if guardianName}}If I have minor children at the time of my death, I nominate {{guardianName}} as Guardian of the person and property of my minor children.{{/if}}

ARTICLE IV - DISPOSITION OF PROPERTY
I give, devise, and bequeath all of my property, real and personal, of every kind and description, wherever situated, to the Trustee of {{trustName}}, to be held, administered, and distributed according to the terms of that Trust.

IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of __________, 20__.

                    _________________________
                    {{testatorName}}, Testator

WITNESSES:
We, the undersigned, certify that the foregoing instrument was signed by {{testatorName}} as {{testatorName}}'s Last Will and Testament in our presence, and we, at {{testatorName}}'s request and in {{testatorName}}'s presence, and in the presence of each other, have subscribed our names as witnesses.

Witness 1: _________________________    Date: ___________
Name: {{witness1Name}}
Address: {{witness1Address}}

Witness 2: _________________________    Date: ___________
Name: {{witness2Name}}
Address: {{witness2Address}}
`,

    trust: `
{{trustName}}
REVOCABLE LIVING TRUST

This Trust Agreement is made this _____ day of __________, 20__, between {{trustorName}}, as Trustor, and {{trusteeName}}, as Trustee.

ARTICLE I - TRUST PROPERTY
The Trustor hereby transfers to the Trustee the property described in Schedule A attached hereto and incorporated herein by reference, to be held in trust according to the terms of this Agreement.

ARTICLE II - TRUST ADMINISTRATION
During the lifetime of the Trustor, the Trustee shall distribute to or for the benefit of the Trustor such amounts of the net income and principal as the Trustor may request.

ARTICLE III - SUCCESSOR TRUSTEE
If {{trusteeName}} is unable or unwilling to serve as Trustee, {{successorTrusteeName}} shall serve as successor Trustee.

ARTICLE IV - BENEFICIARIES
Upon the death of the Trustor, the trust property shall be distributed to the following beneficiaries:
{{#each beneficiaries}}
- {{this.name}}: {{this.share}}
{{/each}}

IN WITNESS WHEREOF, the parties have executed this Trust Agreement on the date first written above.

                    _________________________
                    {{trustorName}}, Trustor

                    _________________________
                    {{trusteeName}}, Trustee
`,

    poa: `
DURABLE POWER OF ATTORNEY FOR FINANCIAL MATTERS

I, {{principalName}}, a resident of {{principalCity}}, {{principalState}}, hereby appoint {{agentName}} as my attorney-in-fact (agent) to act in my name, place, and stead in any way which I myself could do, if I were personally present.

POWERS GRANTED:
{{#if generalPowers}}
My agent is granted general authority to act on my behalf in all financial and legal matters.
{{/if}}

{{#if specificPowers}}
My agent is granted the following specific powers:
{{specificPowers}}
{{/if}}

EFFECTIVE DATE:
{{#if immediatelyEffective}}
This Power of Attorney is effective immediately upon execution.
{{else}}
This Power of Attorney becomes effective upon my incapacity as determined by {{incapacityDetermination}}.
{{/if}}

SUCCESSOR AGENT:
If {{agentName}} is unable or unwilling to serve, I appoint {{successorAgentName}} as my successor agent.

This Power of Attorney shall not be affected by my subsequent disability or incapacity.

IN WITNESS WHEREOF, I have executed this Power of Attorney this _____ day of __________, 20__.

                    _________________________
                    {{principalName}}, Principal

NOTARIZATION:
State of {{principalState}}
County of {{principalCounty}}

On this _____ day of __________, 20__, before me personally appeared {{principalName}}, who proved to me on the basis of satisfactory evidence to be the person whose name is subscribed to the within instrument.

                    _________________________
                    Notary Public
`,

    ahcd: `
ADVANCE HEALTH CARE DIRECTIVE

I, {{principalName}}, being of sound mind, willfully and voluntarily make this Advance Health Care Directive.

PART 1 - APPOINTMENT OF HEALTH CARE AGENT
I hereby appoint {{healthCareAgent}} as my health care agent to make health care decisions for me when I am unable to make them for myself.

Agent Contact Information:
Address: {{healthCareAgentAddress}}
Phone: {{healthCareAgentPhone}}
Email: {{healthCareAgentEmail}}

ALTERNATE AGENTS:
{{#each alternateHealthCareAgents}}
{{@index}}. {{this.name}}
   Address: {{this.address}}
   Phone: {{this.phone}}
{{/each}}

PART 2 - INDIVIDUAL INSTRUCTIONS
{{#if endOfLifeWishes}}
End-of-Life Care Instructions:
{{endOfLifeWishes}}
{{/if}}

Life-Sustaining Treatment: {{lifeSustainingTreatment}}
Artificial Nutrition: {{artificialNutrition}}
Artificial Hydration: {{artificialHydration}}
Pain Management: {{painManagement}}

PART 3 - DONATION OF ORGANS AND TISSUES
{{#if personalOrganDonation}}
I consent to the donation of my organs and tissues for transplantation, therapy, research, and education.
{{else}}
I do not consent to the donation of my organs and tissues.
{{/if}}

PART 4 - PRIMARY PHYSICIAN
{{#if primaryPhysicianName}}
Primary Physician: {{primaryPhysicianName}}
Address: {{primaryPhysicianAddress}}, {{primaryPhysicianCity}}, {{primaryPhysicianState}} {{primaryPhysicianZip}}
Phone: {{primaryPhysicianPhone}}
{{/if}}

IN WITNESS WHEREOF, I have executed this Advance Health Care Directive this _____ day of __________, 20__.

                    _________________________
                    {{principalName}}, Principal

WITNESSES:
{{#each witnesses}}
Witness {{@index}}: _________________________    Date: ___________
Name: {{this.name}}
Address: {{this.address}}, {{this.city}}, {{this.state}}
{{/each}}
`,

    pet_trust: `
PET TRUST AGREEMENT

This Pet Trust Agreement is made this _____ day of __________, 20__, by {{trustorName}} ("Trustor").

ARTICLE I - PURPOSE
This trust is established for the care and maintenance of my beloved pet(s):

Pet Name: {{petName}}
Species/Breed: {{petBreed}}
Age: {{petAge}}
Description: {{petDescription}}

ARTICLE II - TRUSTEE
I appoint {{trusteeName}} as Trustee of this Pet Trust. If {{trusteeName}} is unable or unwilling to serve, I appoint {{successorTrusteeName}} as successor Trustee.

ARTICLE III - PET CAREGIVER
I designate {{caregiverName}} as the primary caregiver for my pet(s).
Address: {{caregiverAddress}}
Phone: {{caregiverPhone}}

If the primary caregiver is unable or unwilling to serve, I designate {{alternateCaregiverName}} as alternate caregiver.

ARTICLE IV - TRUST FUNDING
The initial funding of this trust shall be {{trustAmountDollars}}.

ARTICLE V - CARE INSTRUCTIONS
{{careInstructions}}

ARTICLE VI - VETERINARY CARE
Preferred Veterinarian: {{vetName}}
Address: {{vetAddress}}
Phone: {{vetPhone}}

ARTICLE VII - REMAINDER BENEFICIARY
Upon the death of all pets covered by this trust, any remaining trust funds shall be distributed to {{remainderBeneficiary}}.

IN WITNESS WHEREOF, I have executed this Pet Trust Agreement on the date first written above.

                    _________________________
                    {{trustorName}}, Trustor

                    _________________________
                    {{trusteeName}}, Trustee
`,

    hipaa: `
HIPAA AUTHORIZATION FOR RELEASE OF HEALTH INFORMATION

I, {{patientName}}, hereby authorize the release of my protected health information.

PATIENT INFORMATION
Name: {{patientName}}
Date of Birth: {{dateOfBirth}}
Address: {{patientAddress}}
Phone: {{patientPhone}}

PERSONS AUTHORIZED TO RECEIVE INFORMATION
I authorize the following person(s) to receive my health information:

Name: {{authorizedPerson1Name}}
Relationship: {{authorizedPerson1Relationship}}
Phone: {{authorizedPerson1Phone}}

{{#if authorizedPerson2Name}}
Name: {{authorizedPerson2Name}}
Relationship: {{authorizedPerson2Relationship}}
Phone: {{authorizedPerson2Phone}}
{{/if}}

INFORMATION TO BE RELEASED
{{#if allRecords}}
☑ All medical records
{{/if}}
{{#if specificRecords}}
☐ Specific records: {{specificRecords}}
{{/if}}

PURPOSE OF DISCLOSURE
{{purposeOfDisclosure}}

EXPIRATION
This authorization expires on: {{expirationDate}}

PATIENT RIGHTS
- I understand that I may revoke this authorization at any time by submitting a written request.
- I understand that the revocation will not apply to information already released.
- I understand that I may refuse to sign this authorization.
- I understand that my healthcare and payment for healthcare will not be affected if I refuse to sign.

SIGNATURE

                    _________________________
                    {{patientName}}
                    Date: _______________

WITNESS

                    _________________________
                    Witness Name
                    Date: _______________
`,

    living_will: `
LIVING WILL
(Declaration as to Medical or Surgical Treatment)

I, {{declarantName}}, being of sound mind, willfully and voluntarily make this declaration to be followed if I become unable to make or communicate decisions regarding my medical treatment.

DECLARATION

If I have a terminal condition or am in a persistent vegetative state, and there is no reasonable medical expectation of recovery, I direct that:

LIFE-SUSTAINING TREATMENT
{{#if withdrawTreatment}}
☑ Life-sustaining treatment be withheld or withdrawn, and that I be permitted to die naturally with only the administration of medication or procedures deemed necessary to provide comfort or alleviate pain.
{{else}}
☐ Life-sustaining treatment be continued for as long as medically possible.
{{/if}}

ARTIFICIAL NUTRITION AND HYDRATION
{{#if withdrawNutrition}}
☑ Artificial nutrition and hydration be withheld or withdrawn when the procedures would serve only to artificially prolong the process of dying.
{{else}}
☐ Artificial nutrition and hydration be continued.
{{/if}}

PAIN MANAGEMENT
I direct that treatment for alleviation of pain or discomfort be provided at all times, even if it hastens my death.

PREGNANCY EXCEPTION
{{#if pregnancyException}}
If I am pregnant, this declaration shall have no force during the course of my pregnancy.
{{/if}}

ADDITIONAL INSTRUCTIONS
{{additionalInstructions}}

I recognize that this Living Will may not be specifically applicable to every situation. In the absence of my ability to give directions regarding the use of life-sustaining procedures, I direct my healthcare agent (if appointed) or attending physician to make decisions consistent with my wishes as expressed above.

IN WITNESS WHEREOF, I have executed this Living Will on this _____ day of __________, 20__.

                    _________________________
                    {{declarantName}}, Declarant

WITNESSES
We declare that the person who signed this document, or asked another to sign on their behalf, did so in our presence, that they appear to be of sound mind and under no duress, fraud, or undue influence.

Witness 1: _________________________    Date: ___________
Print Name: {{witness1Name}}
Address: {{witness1Address}}

Witness 2: _________________________    Date: ___________
Print Name: {{witness2Name}}
Address: {{witness2Address}}
`,

    beneficiary: `
BENEFICIARY DESIGNATION FORM

ACCOUNT/POLICY INFORMATION
Account Holder: {{accountHolder}}
Account Type: {{accountType}}
Account Number: {{accountNumber}}

I hereby designate the following beneficiary(ies) for the above-referenced account:

PRIMARY BENEFICIARIES

Beneficiary 1:
Name: {{primaryBeneficiary1Name}}
Relationship: {{primaryBeneficiary1Relationship}}
Date of Birth: {{primaryBeneficiary1DOB}}
SSN (last 4): {{primaryBeneficiary1SSN}}
Percentage: {{primaryBeneficiary1Percentage}}%

{{#if primaryBeneficiary2Name}}
Beneficiary 2:
Name: {{primaryBeneficiary2Name}}
Relationship: {{primaryBeneficiary2Relationship}}
Date of Birth: {{primaryBeneficiary2DOB}}
SSN (last 4): {{primaryBeneficiary2SSN}}
Percentage: {{primaryBeneficiary2Percentage}}%
{{/if}}

CONTINGENT BENEFICIARIES
(To receive benefits if all primary beneficiaries predecease the account holder)

Contingent Beneficiary 1:
Name: {{contingentBeneficiary1Name}}
Relationship: {{contingentBeneficiary1Relationship}}
Date of Birth: {{contingentBeneficiary1DOB}}
SSN (last 4): {{contingentBeneficiary1SSN}}
Percentage: {{contingentBeneficiary1Percentage}}%

{{#if contingentBeneficiary2Name}}
Contingent Beneficiary 2:
Name: {{contingentBeneficiary2Name}}
Relationship: {{contingentBeneficiary2Relationship}}
Date of Birth: {{contingentBeneficiary2DOB}}
SSN (last 4): {{contingentBeneficiary2SSN}}
Percentage: {{contingentBeneficiary2Percentage}}%
{{/if}}

PER STIRPES DESIGNATION
{{#if perStirpes}}
☑ If a beneficiary predeceases me, their share shall pass to their descendants (per stirpes).
{{else}}
☐ If a beneficiary predeceases me, their share shall be redistributed among surviving beneficiaries.
{{/if}}

This designation supersedes all prior beneficiary designations on file for the above account.

                    _________________________
                    {{accountHolder}}
                    Date: _______________

NOTARY ACKNOWLEDGMENT (if required)
State of ________________
County of ________________

Subscribed and sworn to before me this _____ day of __________, 20__.

                    _________________________
                    Notary Public
                    My Commission Expires: _______________
`
  }
  
  return templates[documentType] || ''
}

/**
 * Populate template with form data
 */
const populateTemplate = (template: string, formData: DocumentData): string => {
  let populated = template
  
  // Simple template replacement (in a real app, you'd use a proper template engine)
  Object.keys(formData).forEach(key => {
    const value = formData[key]
    const regex = new RegExp(`{{${key}}}`, 'g')
    populated = populated.replace(regex, value || '[Not specified]')
  })
  
  // Handle arrays and conditional logic (simplified)
  if (formData.beneficiaries && Array.isArray(formData.beneficiaries)) {
    const beneficiaryList = formData.beneficiaries
      .map(b => `- ${b.name}: ${b.share}`)
      .join('\n')
    populated = populated.replace(/{{#each beneficiaries}}[\s\S]*?{{\/each}}/g, beneficiaryList)
  }
  
  if (formData.alternateHealthCareAgents && Array.isArray(formData.alternateHealthCareAgents)) {
    const agentList = formData.alternateHealthCareAgents
      .map((agent, index) => `${index + 1}. ${agent.name}\n   Address: ${agent.address}\n   Phone: ${agent.phone}`)
      .join('\n')
    populated = populated.replace(/{{#each alternateHealthCareAgents}}[\s\S]*?{{\/each}}/g, agentList)
  }
  
  if (formData.witnesses && Array.isArray(formData.witnesses)) {
    const witnessList = formData.witnesses
      .map((witness, index) => `Witness ${index + 1}: _________________________    Date: ___________\nName: ${witness.name}\nAddress: ${witness.address}, ${witness.city}, ${witness.state}`)
      .join('\n\n')
    populated = populated.replace(/{{#each witnesses}}[\s\S]*?{{\/each}}/g, witnessList)
  }
  
  // Clean up any remaining template syntax
  populated = populated.replace(/{{#if \w+}}/g, '')
  populated = populated.replace(/{{\/if}}/g, '')
  populated = populated.replace(/{{else}}/g, '')
  populated = populated.replace(/{{[^}]+}}/g, '[Not specified]')
  
  return populated
}

/**
 * Create document sections from template
 */
const createDocumentSections = (template: string, formData: DocumentData) => {
  const paragraphs = template.split('\n').map(line => 
    new Paragraph({
      children: [
        new TextRun({
          text: line,
          size: line.includes('LAST WILL') || line.includes('TRUST') || line.includes('POWER OF ATTORNEY') || line.includes('ADVANCE HEALTH') ? 32 : 24,
          bold: line.includes('ARTICLE') || line.includes('PART') || line.includes('WITNESSES') || line.includes('NOTARIZATION'),
        }),
      ],
      alignment: line.includes('LAST WILL') || line.includes('TRUST') || line.includes('POWER OF ATTORNEY') || line.includes('ADVANCE HEALTH') 
        ? AlignmentType.CENTER 
        : AlignmentType.LEFT,
    })
  )
  
  return [{
    children: paragraphs,
  }]
}

/**
 * Generate a comprehensive estate planning package
 */
export const generateEstatePlanningPackage = async (allFormData: Record<DocumentType, DocumentData>): Promise<Blob> => {
  try {
    const documents = []
    
    // Generate individual documents
    for (const [type, data] of Object.entries(allFormData) as [DocumentType, DocumentData][]) {
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