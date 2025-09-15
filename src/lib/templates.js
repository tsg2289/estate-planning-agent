// Document templates for estate planning forms
// These templates provide the structure and formatting for generating legal documents

export const willTemplate = {
  title: '{{testatorName}}\'S POUR-OVER WILL',
  sections: [
    {
      name: 'declaration',
      content: 'I, {{testatorName}}, a resident of the County of {{testatorCounty}}, State of California, declare this to be my Last Will and Testament.'
    },
    {
      name: 'article_1',
      content: 'ARTICLE I'
    },
    {
      name: 'revocation',
      content: 'Revocation of Prior Wills\nI revoke all prior wills and codicils made by me.'
    },
    {
      name: 'article_2',
      content: 'ARTICLE II'
    },
    {
      name: 'family_identification',
      content: 'Family Identification\n{{familyStatus}}\n{{childrenStatus}}'
    },
    {
      name: 'article_3',
      content: 'ARTICLE III'
    },
    {
      name: 'disposition_property',
      content: 'Disposition of Property\n{{specialBequestsText}}\n\nI give all of my remaining estate, of whatever kind and wherever situated, to the then-acting Trustee(s) of the {{trustName}}, dated {{trustDate}}, as amended from time to time, to be added to and administered as part of that trust according to its terms. My intent is that this gift shall be a "pour-over" to such trust.'
    },
    {
      name: 'article_4',
      content: 'ARTICLE IV'
    },
    {
      name: 'personal_representative',
      content: 'Personal Representative\nI nominate {{executorName}}, residing at {{executorAddress}}, {{executorCity}}, {{executorState}} {{executorZip}}, to serve as Executor of this Will.\nIf that person fails or ceases to serve, I nominate {{alternateExecutorName}}, residing at {{alternateExecutorAddress}}, {{alternateExecutorCity}}, {{alternateExecutorState}} {{alternateExecutorZip}}, as successor Executor.\n\nMy Executor shall serve without bond.\n\nEvery action by the Executor must be done in the best interest of the Estate. The Executor is prohibited from benefitting financially in any way, directly or indirectly.'
    },
    {
      name: 'article_5',
      content: 'ARTICLE V'
    },
    {
      name: 'guardian_minor_children',
      content: 'Guardian of Minor Children\nIf I have minor children at the time of my death, I nominate {{guardianName}}, of {{guardianCity}}, {{guardianState}}, as guardian of their persons and estates. If that person fails or ceases to serve, I nominate {{alternateGuardianName}}.'
    },
    {
      name: 'article_6',
      content: 'ARTICLE VI'
    },
    {
      name: 'general_provisions',
      content: 'General Provisions\n\nMy Executor shall have all powers granted under the California Probate Code.\n\nI direct that all estate, inheritance, and other death taxes shall be paid from the residue of my estate.\n\nThis Will is executed in conformity with the laws of the State of California.'
    },
    {
      name: 'article_7',
      content: 'ARTICLE VII'
    },
    {
      name: 'omissions',
      content: 'Omissions\nIf I have failed to provide for any heir, such omission is intentional, except as may be otherwise required by California law.'
    },
    {
      name: 'article_8',
      content: 'ARTICLE VIII'
    },
    {
      name: 'no_contest_clause',
      content: 'No Contest Clause\nIf any beneficiary under this Will contests this Will or the Trust into which it pours over, that beneficiary shall forfeit any share they would otherwise receive.'
    },
    {
      name: 'signature_section',
      content: 'SIGNATURE'
    },
    {
      name: 'testator_signature',
      content: 'I, {{testatorName}}, declare that I sign this instrument as my Last Will and Testament, that I understand and intend its contents, and that I sign it voluntarily on this ___ day of _______, 20, at {{testatorCity}}, California.\n\n[Testator\'s Signature]'
    },
    {
      name: 'attestation_clause',
      content: 'ATTESTATION CLAUSE\n\nOn the date written above, {{testatorName}} declared to us, the undersigned witnesses, that this instrument is his/her Will, and signed it in our presence. At the request of the testator, we now sign our names as witnesses in the presence of the testator and each other. We are both over the age of 18, and neither of us is named as a beneficiary in this Will.'
    },
    {
      name: 'witness_1',
      content: '{{witness1Name}}, residing at {{witness1Address}}'
    },
    {
      name: 'witness_2',
      content: '{{witness2Name}}, residing at {{witness2Address}}'
    }
  ]
}

export const trustTemplate = {
  title: 'LIVING TRUST AGREEMENT',
  sections: [
    {
      name: 'header',
      content: `
        This Living Trust Agreement (the "Trust") is made this {{currentDate}} by and between 
        {{trustorName}} (hereinafter referred to as the "Trustor"), and {{trusteeName}} 
        (hereinafter referred to as the "Trustee").
      `
    },
    {
      name: 'trust_info',
      content: `
        The name of this Trust shall be "{{trustName}}" and it shall be governed by the laws of {{trustorState}}.
      `
    },
    {
      name: 'trust_type',
      content: `
        This is a {{trustType}} trust, which means {{trustTypeDescription}}.
      `
    },
    {
      name: 'trust_purpose',
      content: `
        The purpose of this Trust is: {{trustPurpose}}
      `
    },
    {
      name: 'trustee_powers',
      content: `
        The Trustee shall have the following powers and authority:
        - To manage, control, and dispose of trust property
        - To invest and reinvest trust assets
        - To make distributions to beneficiaries
        - To pay expenses and taxes
        - To engage professional advisors
      `
    },
    {
      name: 'beneficiaries',
      content: `
        The beneficiaries of this Trust are:
        {{beneficiariesList}}
      `
    },
    {
      name: 'distribution_terms',
      content: `
        Distributions from this Trust shall be made as follows:
        {{distributionTerms}}
      `
    },
    {
      name: 'trust_termination',
      content: `
        This Trust shall terminate upon {{terminationConditions}}.
      `
    }
  ]
}

export const poaTemplate = {
  title: 'POWER OF ATTORNEY',
  sections: [
    {
      name: 'header',
      content: `
        I, {{principalName}}, hereby appoint {{agentName}} as my Attorney-in-Fact 
        (hereinafter referred to as my "Agent") pursuant to the laws of {{principalState}}.
      `
    },
    {
      name: 'scope',
      content: `
        This is a {{scope}} Power of Attorney, which means {{scopeDescription}}.
      `
    },
    {
      name: 'effective_date',
      content: `
        This Power of Attorney shall become effective on {{effectiveDate}}.
      `
    },
    {
      name: 'termination',
      content: `
        This Power of Attorney shall terminate on {{terminationDate}} or upon my death, 
        whichever occurs first.
      `
    },
    {
      name: 'specific_powers',
      content: `
        My Agent shall have the following specific powers:
        {{specificPowersList}}
      `
    },
    {
      name: 'limitations',
      content: `
        The following limitations apply to my Agent's authority:
        {{limitations}}
      `
    },
    {
      name: 'compensation',
      content: `
        My Agent shall be compensated as follows: {{compensation}}
      `
    },
    {
      name: 'alternate_agent',
      content: `
        If {{agentName}} is unable or unwilling to serve as my Agent, 
        I appoint {{alternateAgentName}} as my Alternate Agent.
      `
    }
  ]
}

export const ahcdTemplate = {
  title: 'ADVANCE HEALTH CARE DIRECTIVE',
  sections: [
    {
      name: 'header',
      content: `
        I, {{principalName}}, being of sound mind and at least 18 years of age, 
        hereby create this Advance Health Care Directive as a directive to my family, 
        physicians, and other health care providers.
      `
    },
    {
      name: 'health_care_agent',
      content: `
        I designate {{healthCareAgent}} as my Health Care Agent to make health care decisions 
        for me when I am unable to make them for myself.
      `
    },
    {
      name: 'alternate_agent',
      content: `
        If {{healthCareAgent}} is unable or unwilling to serve as my Health Care Agent, 
        I designate {{alternateHealthCareAgent}} as my Alternate Health Care Agent.
      `
    },
    {
      name: 'life_sustaining_treatment',
      content: `
        Regarding life-sustaining treatment, my wishes are: {{lifeSustainingTreatment}}
      `
    },
    {
      name: 'artificial_nutrition',
      content: `
        Regarding artificial nutrition and hydration: {{artificialNutrition}}
      `
    },
    {
      name: 'pain_management',
      content: `
        I want pain management to be: {{painManagement}}
      `
    },
    {
      name: 'end_of_life_wishes',
      content: `
        My specific wishes for end-of-life care include: {{endOfLifeWishes}}
      `
    },
    {
      name: 'organ_donation',
      content: `
        Regarding organ and tissue donation: {{organDonation}}
      `
    },
    {
      name: 'autopsy',
      content: `
        Regarding autopsy: {{autopsy}}
      `
    },
    {
      name: 'funeral_wishes',
      content: `
        My funeral and burial preferences are: {{funeralWishes}}
      `
    },
    {
      name: 'additional_instructions',
      content: `
        Additional health care instructions: {{additionalInstructions}}
      `
    }
  ]
}

// Helper function to get template by type
export const getTemplate = (type) => {
  switch (type) {
    case 'will':
      return willTemplate
    case 'trust':
      return trustTemplate
    case 'poa':
      return poaTemplate
    case 'ahcd':
      return ahcdTemplate
    default:
      throw new Error(`Unknown template type: ${type}`)
  }
}

// Helper function to populate template with data
export const populateTemplate = (template, data) => {
  let populatedTemplate = { ...template }
  
  // Populate the title if it exists
  if (populatedTemplate.title) {
    populatedTemplate.title = populatedTemplate.title.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }
  
  populatedTemplate.sections = template.sections.map(section => ({
    ...section,
    content: section.content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }))
  
  return populatedTemplate
}
