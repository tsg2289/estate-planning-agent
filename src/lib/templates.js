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
      name: 'article_9',
      content: 'ARTICLE IX'
    },
    {
      name: 'execution',
      content: 'Execution\n\nI, {{testatorName}}, declare that I sign this instrument as my Last Will and Testament, that I understand and intend its contents, and that I sign it voluntarily on this ___ day of _______, 20__, at {{testatorCity}}, California.\n\n\n_________________________________\n{{testatorName}}, Testator'
    },
    {
      name: 'page_break',
      content: 'PAGE_BREAK'
    },
    {
      name: 'witness_attestation_title',
      content: 'WITNESS ATTESTATION'
    },
    {
      name: 'attestation_clause',
      content: 'On {{attestationDate}}, {{testatorName}} declared to us, the undersigned witnesses, that this instrument is his/her Will, and signed it in our presence. At the request of the testator, we now sign our names as witnesses in the presence of the testator and each other. We are both over the age of 18, and neither of us is named as a beneficiary in this Will.'
    },
    {
      name: 'witness_1',
      content: '{{witness1Name}}, residing at {{witness1Address}}\n\n_________________________________\nWitness #1 Signature'
    },
    {
      name: 'witness_2',
      content: '{{witness2Name}}, residing at {{witness2Address}}\n\n_________________________________\nWitness #2 Signature'
    }
  ]
}

export const trustTemplate = {
  title: 'REVOCABLE LIVING TRUST AGREEMENT',
  sections: [
    {
      name: 'title_header',
      content: `REVOCABLE LIVING TRUST AGREEMENT

(of {{trustorName}})`
    },
    {
      name: 'article_1',
      content: `ARTICLE I – IDENTIFICATION OF PARTIES

This Revocable Living Trust Agreement ("Trust Agreement") is made this ___ day of ________, 20__, by and between:

Trustor/Grantor: {{trustorName}}, of {{trustorCity}}, {{trustorCounty}}, California ("Trustor" or "Grantor"); and

Trustee: {{trusteeName}}, of {{trusteeCity}}, {{trusteeCounty}}, California ("Trustee").

The Trustor may also serve as the initial Trustee.`
    },
    {
      name: 'article_2',
      content: `ARTICLE II – NAME OF TRUST

This Trust shall be known as the {{trustorName}} Revocable Living Trust, dated __________, 20__.`
    },
    {
      name: 'article_3',
      content: `ARTICLE III – REVOCABILITY

This Trust is revocable. During the lifetime of the Trustor, the Trustor may amend, revoke, or terminate this Trust, in whole or in part, by a written instrument delivered to the Trustee.`
    },
    {
      name: 'article_4',
      content: `ARTICLE IV – TRUST PROPERTY

The Trustor hereby transfers, assigns, and delivers to the Trustee all property listed on Schedule A (attached hereto and incorporated herein). The Trustee shall hold, manage, and distribute said property in accordance with this Trust Agreement.`
    },
    {
      name: 'article_5',
      content: `ARTICLE V – MANAGEMENT DURING LIFETIME

During the lifetime of the Trustor:

The Trustor is entitled to all income and principal of the Trust Property.

The Trustee shall manage the Trust Property for the benefit of the Trustor.`
    },
    {
      name: 'article_6',
      content: `ARTICLE VI – SUCCESSOR TRUSTEE

Upon the death, incapacity, or resignation of the initial Trustee, {{successorTrusteeName}} shall serve as Successor Trustee. If that person is unable or unwilling to serve, then {{alternateSuccessorTrusteeName}} shall serve.`
    },
    {
      name: 'article_7',
      content: `ARTICLE VII – DISTRIBUTION UPON DEATH OF TRUSTOR

Upon the death of the Trustor, the Trustee shall distribute the remaining Trust Property as follows:

Specific Gifts – The Trustee shall distribute the following property:

{{specificGifts}}

Residue – The remainder of the Trust Property shall be distributed as follows:

{{residueDistribution}}`
    },
    {
      name: 'article_8',
      content: `ARTICLE VIII – POWERS OF TRUSTEE

The Trustee shall have all powers granted by the California Probate Code, including but not limited to the power to:

Buy, sell, lease, and manage real and personal property.

Invest and reinvest Trust assets.

Employ agents, accountants, and attorneys.`
    },
    {
      name: 'article_9',
      content: `ARTICLE IX – GOVERNING LAW

This Trust shall be governed by and construed in accordance with the laws of the State of California.`
    },
    {
      name: 'article_10',
      content: `ARTICLE X – GENERAL PROVISIONS

Spendthrift Clause – No interest of any beneficiary shall be subject to claims of creditors or to legal process.

No Bond – No bond shall be required of any Trustee.

Severability – If any provision is invalid, the remaining provisions shall continue in effect.`
    },
    {
      name: 'article_11',
      content: `ARTICLE XI – SIGNATURES

IN WITNESS WHEREOF, the Trustor has executed this Trust Agreement as of the day and year first written above.

{{trustorName}}, Trustor

{{trusteeName}}, Trustee`
    },
    {
      name: 'notary_acknowledgment',
      content: `NOTARY ACKNOWLEDGMENT

(A California Notary acknowledgment block should be attached here.)`
    },
    {
      name: 'schedule_a',
      content: `SCHEDULE A – TRUST PROPERTY

(List all property being transferred into the Trust: real estate, bank accounts, investments, personal property, etc.)

{{trustAssetsList}}`
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
