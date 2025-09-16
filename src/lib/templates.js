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
      name: 'trust_information',
      content: `Trust Information

Trust Name: {{trustName}}
Trust Date: {{trustDateFormatted}}`
    },
    {
      name: 'article_1',
      content: `ARTICLE I – IDENTIFICATION OF PARTIES

{{trustorInfo}}`
    },
    {
      name: 'article_2',
      content: `ARTICLE II – NAME OF TRUST

This Trust shall be known as the {{trustName}}, dated {{trustDateFormatted}}.`
    },
    {
      name: 'article_3',
      content: `ARTICLE III – TRUSTEES

Initial Trustees: We, the Trustors, shall serve as initial Co-Trustees.

Successor Trustee: If either or both of us are unable or unwilling to serve, then {{successorTrusteePrimary}} shall serve as Successor Trustee. If that person is unable or unwilling to serve, then {{successorTrusteeAlternate}} shall serve.

A Successor Trustee shall have all the powers granted under this Trust and the California Probate Code.`
    },
    {
      name: 'article_4',
      content: `ARTICLE IV – REVOCABILITY

This Trust is revocable. During the lifetime of the Trustor, the Trustor may amend, revoke, or terminate this Trust, in whole or in part, by a written instrument delivered to the Trustee.`
    },
    {
      name: 'article_5',
      content: `ARTICLE V – TRUST PROPERTY

The Trustor hereby transfers, assigns, and delivers to the Trustee all property listed on Schedule A (attached hereto and incorporated herein). The Trustee shall hold, manage, and distribute said property in accordance with this Trust Agreement.`
    },
    {
      name: 'article_6',
      content: `ARTICLE VI – MANAGEMENT DURING LIFETIME

During the lifetime of the Trustor:

The Trustor is entitled to all income and principal of the Trust Property.

The Trustee shall manage the Trust Property for the benefit of the Trustor.`
    },
    {
      name: 'article_7',
      content: `ARTICLE VII – SUCCESSOR TRUSTEE

Upon the death, incapacity, or resignation of the initial Trustee, the following shall serve as Successor Trustees in the order listed:

{{successorTrusteeList}}`
    },
    {
      name: 'article_8',
      content: `ARTICLE VIII – DISTRIBUTION UPON DEATH OF TRUSTOR

Upon the death of the Trustor, the Trustee shall distribute the remaining Trust Property as follows:

Specific Gifts – The Trustee shall distribute the following property:

{{specificGifts}}

Residue – The remainder of the Trust Property shall be distributed as follows:

{{residueDistribution}}`
    },
    {
      name: 'article_9',
      content: `ARTICLE IX – POWERS OF TRUSTEE

The Trustee shall have all powers granted by the California Probate Code, including but not limited to the power to:

Buy, sell, lease, and manage real and personal property.

Invest and reinvest Trust assets.

Employ agents, accountants, and attorneys.`
    },
    {
      name: 'article_10',
      content: `ARTICLE X – GOVERNING LAW

This Trust shall be governed by and construed in accordance with the laws of the State of California.`
    },
    {
      name: 'article_11',
      content: `ARTICLE XI – GENERAL PROVISIONS

Spendthrift Clause – No interest of any beneficiary shall be subject to claims of creditors or to legal process.

No Bond – No bond shall be required of any Trustee.

Severability – If any provision is invalid, the remaining provisions shall continue in effect.`
    },
    {
      name: 'article_12',
      content: `ARTICLE XII – SIGNATURES

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
      name: 'statutory_notice',
      content: `
        (California Probate Code Section 4401)
        NOTICE: THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING. THEY ARE EXPLAINED IN THE UNIFORM STATUTORY FORM POWER OF ATTORNEY ACT (CALIFORNIA PROBATE CODE SECTIONS 4400–4465). THE POWERS LISTED IN THIS DOCUMENT DO NOT INCLUDE ALL POWERS THAT ARE AVAILABLE UNDER THE PROBATE CODE. ADDITIONAL POWERS AVAILABLE UNDER THE PROBATE CODE MAY BE ADDED BY SPECIFICALLY LISTING THEM UNDER THE SPECIAL INSTRUCTIONS SECTION OF THIS DOCUMENT. IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTHCARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO.
      `
    },
    {
      name: 'appointment_form',
      content: `
        ____________
        {{appointmentText}}
        TO GRANT ALL OF THE FOLLOWING POWERS, INITIAL THE LINE IN FRONT OF (N) AND IGNORE
        THE LINES IN FRONT OF THE OTHER POWERS.
        TO GRANT ONE OR MORE, BUT FEWER THAN ALL, OF THE FOLLOWING POWERS, INITIAL THE
        LINE IN FRONT OF EACH POWER YOU ARE GRANTING.
        TO WITHHOLD A POWER, DO NOT INITIAL THE LINE IN FRONT OF IT. YOU MAY, BUT NEED NOT,
        CROSS OUT EACH POWER WITHHELD.
      `
    },
    {
      name: 'statutory_powers',
      content: `
        {{statutoryPowersList}}
        
        YOU NEED NOT INITIAL ANY OTHER LINES IF YOU INITIAL LINE (N)
      `
    },
    {
      name: 'special_instructions',
      content: `
        _______________
        SPECIAL INSTRUCTIONS:
        ON THE FOLLOWING LINES YOU MAY GIVE SPECIAL INSTRUCTIONS LIMITING OR EXTENDING THE
        POWERS GRANTED TO YOUR AGENT.
        {{specialInstructionsContent}}
        UNLESS YOU DIRECT OTHERWISE ABOVE, THIS POWER OF ATTORNEY IS EFFECTIVE
        IMMEDIATELY AND WILL CONTINUE UNTIL IT IS REVOKED.
        
        {{incapacitationText}}
      `
    },
    {
      name: 'signature_and_acceptance',
      content: `
        ____________
        I agree that any third party who receives a copy of this document may act under it. Revocation of the power
        of attorney is not effective as to a third party until the third party has actual knowledge of the revocation. I agree to
        indemnify the third party for any claims that arise against the third party because of reliance on this power of
        attorney.
        
        Signed this __________ day of _________________________, __________.
        
        ________________________________________
        (your signature)
        
        State of ________________________, County of _________________________,
        
        BY ACCEPTING OR ACTING UNDER THE APPOINTMENT, THE AGENT ASSUMES THE FIDUCIARY
        AND OTHER LEGAL RESPONSIBILITIES OF AN AGENT.
      `
    },
    {
      name: 'page_break',
      content: 'PAGE_BREAK'
    },
    {
      name: 'notary_certificate',
      content: `
        CERTIFICATE OF ACKNOWLEDGMENT OF NOTARY PUBLIC
        
        State of California
        
        County of __________
        
        On__________________________________before me, ________________________________,
        
        personally appeared_____________________________, who proved to me on the basis of satisfactory
        
        evidence to be the person(s) whose name(s) is/are subscribed to the within instrument and
        
        acknowledged to me that he/she/they executed the same in his/her/their authorized capacity(ies), and
        
        that by his/her/their signature(s) on the instrument the person(s), or the entity upon behalf of which the
        
        person(s) acted, executed the instrument.
        
        I certify under PENALTY OF PERJURY under the laws of the State of California that the
        
        foregoing paragraph is true and correct.
        
        WITNESS my hand and official seal.
        
        
        Signature __________________________________ (Seal)
      `
    },
  ]
}

export const ahcdTemplate = {
  title: 'ADVANCE HEALTH CARE DIRECTIVE',
  sections: [
    {
      name: 'legal_explanation',
      content: `
        ADVANCE HEALTH CARE DIRECTIVE
        (California Probate Code Section 4701)
        Explanation
        
        You have the right to give instructions about your own physical and mental health care. You also have the right to name someone else to make those health care decisions for you. This form lets you do either or both of these things. It also lets you express your wishes regarding donation of organs and the designation of your primary physician. If you use this form, you may complete or modify all or any part of it. You are free to use a different form.

        Part 1 of this form is a power of attorney for health care. Part 1 lets you name another individual as agent to make health care decisions for you if you become incapable of making your own decisions or if you want someone else to make those decisions for you now even though you are still capable. You may also name an alternate agent to act for you if your first choice is not willing, able, or reasonably available to make decisions for you. (Your agent may not be an operator or employee of a community care facility or a residential care facility where you are receiving care, or your supervising health care provider or employee of the health care institution where you are receiving care, unless your agent is related to you or is a coworker.)

        Unless the form you sign limits the authority of your agent, your agent may make all health care decisions for you. This form has a place for you to limit the authority of your agent. You need not limit the authority of your agent if you wish to rely on your agent for all health care decisions that may have to be made. If you choose not to limit the authority of your agent, your agent will have the right to:

        (a) Consent or refuse consent to any care, treatment, service, or procedure to maintain, diagnose, or otherwise affect a physical or mental condition.

        (b) Select or discharge health care providers and institutions.

        (c) For all physical and mental health care, approve or disapprove diagnostic tests, surgical procedures, and programs of medication.

        (d) Direct the provision, withholding, or withdrawal of artificial nutrition and hydration and all other forms of health care, including cardiopulmonary resuscitation.

        (e) Donate your organs, tissues, and parts, authorize an autopsy, and direct disposition of remains.

        However, your agent will not be able to commit you to a mental health facility, or consent to convulsive treatment, psychosurgery, sterilization, or abortion for you.

        Part 2 of this form lets you give specific instructions about any aspect of your health care, whether or not you appoint an agent. Choices are provided for you to express your wishes regarding the provision, withholding, or withdrawal of treatment to keep you alive, as well as the provision of pain relief. Space is also provided for you to add to the choices you have made or for you to write out any additional wishes. If you are satisfied to allow your agent to determine what is best for you in making end-of-life decisions, you need not fill out Part 2 of this form.

        Part 3 of this form lets you express an intention to donate your bodily organs, tissues, and parts following your death.

        Part 4 of this form lets you designate a physician to have primary responsibility for your health care.

        After completing this form, sign and date the form at the end. The form shall be signed by two qualified witnesses or acknowledged before a notary public. Give a copy of the signed and completed form to your physician, to any other health care providers you may have, to any health care institution at which you are receiving care, and to any health care agents you have named. You should talk to the person you have named as agent to make sure that they understand your wishes and is willing to take the responsibility.

        You have the right to revoke this advance health care directive or replace this form at any time.
      `
    },
    {
      name: 'page_break',
      content: 'PAGE_BREAK'
    },
    {
      name: 'header',
      content: `
        I, {{principalName}}, being of sound mind and at least 18 years of age, 
        hereby create this Advance Health Care Directive as a directive to my family, 
        physicians, and other health care providers.
      `
    },
    {
      name: 'agent_designation',
      content: `
        (1.1) DESIGNATION OF AGENT: I designate {{healthCareAgent}} as my Health Care Agent to make health care decisions for me when I am unable to make them for myself.
      `
    },
    {
      name: 'alternate_agent',
      content: `
        If {{healthCareAgent}} is unable or unwilling to serve as my Health Care Agent, 
        I designate {{alternateHealthCareAgent}} as my Alternate Health Care Agent.
        {{alternateHealthCareAgentDetails}}
      `
    },
    {
      name: 'agent_authority',
      content: `
        (1.2) AGENT'S AUTHORITY: My agent is authorized to make all physical and mental health care decisions for me, including decisions to provide, withhold, or withdraw artificial nutrition and hydration and all other forms of health care to keep me alive, except as I state here:
        
        {{agentAuthorityExceptions}}
      `
    },
    {
      name: 'authority_effectiveness',
      content: `
        (1.3) WHEN AGENT'S AUTHORITY BECOMES EFFECTIVE: My agent's authority becomes effective when my primary physician determines that I am unable to make my own health care decisions unless I mark the following box. If I mark this box {{authorityEffectivenessCheckbox}}, my agent's authority to make health care decisions for me takes effect immediately.
      `
    },
    {
      name: 'agent_obligation',
      content: `
        (1.4) AGENT'S OBLIGATION: My agent shall make health care decisions for me in accordance with this power of attorney for health care, any instructions I give in Part 2 of this form, and my other wishes to the extent known to my agent. To the extent my wishes are unknown, my agent shall make health care decisions for me in accordance with what my agent determines to be in my best interest. In determining my best interest, my agent shall consider my personal values to the extent known to my agent.
      `
    },
    {
      name: 'conservator_nomination',
      content: `
        (1.6) NOMINATION OF CONSERVATOR: If a conservator of my person needs to be appointed for me by a court, I nominate the agent designated in this form. If that agent is not willing, able, or reasonably available to act as conservator, I nominate the alternate agents whom I have named, in the order designated.
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
