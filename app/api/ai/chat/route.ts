import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are a helpful estate planning assistant for EstatePlan Pro. Your role is to:

1. Answer questions about estate planning concepts (wills, trusts, powers of attorney, healthcare directives)
2. Explain legal terminology in plain, easy-to-understand language
3. Help users understand what documents they might need
4. Provide general guidance on estate planning best practices

IMPORTANT GUIDELINES:
- Always be helpful, professional, and empathetic
- Never provide specific legal advice - always recommend consulting with a licensed attorney
- Use clear, simple language
- Keep responses concise but informative
- When appropriate, mention the specific documents available in our app (Will, Trust, POA, AHCD)
- If asked about specific legal situations, recommend professional legal counsel

You can help with:
- Explaining what wills, trusts, POAs, and AHCDs are
- Describing when each document might be needed
- Explaining terms like "executor", "trustee", "beneficiary", "probate"
- General timeline recommendations for estate planning
- Factors to consider when choosing executors/trustees/agents

Always include a brief disclaimer when providing substantive information.`

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return a helpful fallback response
      return NextResponse.json({
        response: getFallbackResponse(message)
      })
    }

    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      response: "I'm having trouble connecting to the AI service right now. Please try again in a moment, or feel free to explore our document templates directly."
    })
  }
}

// Fallback responses for common questions when API is unavailable
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('will') && lowerMessage.includes('trust')) {
    return `**Will vs. Trust - Key Differences:**

**Will:**
• Takes effect after death
• Goes through probate (court process)
• Becomes public record
• Can name guardians for minor children
• Generally simpler and less expensive

**Trust:**
• Can take effect immediately
• Avoids probate
• Remains private
• More flexible for complex situations
• Can help with incapacity planning

*Note: This is general information. Please consult with a licensed attorney for advice specific to your situation.*

Would you like to create either document? You can access them from your dashboard.`
  }

  if (lowerMessage.includes('will')) {
    return `**About Wills:**

A Last Will and Testament is a legal document that specifies:
• How your assets should be distributed after death
• Who will be the executor (manage your estate)
• Guardians for minor children

**Key Points:**
• Must be signed and witnessed properly
• Should be updated after major life changes
• Works with (not replaces) beneficiary designations

*This is general information only. Consult a licensed attorney for legal advice.*

Ready to create your will? Click "Create Document" for the Will option on your dashboard.`
  }

  if (lowerMessage.includes('trust')) {
    return `**About Living Trusts:**

A Living Trust is a legal arrangement where you:
• Transfer assets to the trust during your lifetime
• Name yourself as initial trustee
• Designate a successor trustee
• Specify beneficiaries

**Benefits:**
• Avoids probate
• Maintains privacy
• Provides for incapacity
• Can be revoked or amended

*This is general information only. Consult a licensed attorney for legal advice.*

Ready to create a trust? Use the Trust option on your dashboard.`
  }

  if (lowerMessage.includes('power of attorney') || lowerMessage.includes('poa')) {
    return `**About Power of Attorney (POA):**

A POA allows you to designate someone (an "agent") to make decisions on your behalf.

**Types:**
• **Financial POA** - Handles money, property, business matters
• **Healthcare POA** - Makes medical decisions (often part of AHCD)

**Key Considerations:**
• Choose someone trustworthy
• Can be "durable" (survives incapacity)
• Can be limited or general in scope

*This is general information only. Consult a licensed attorney for legal advice.*

Create your POA from the dashboard.`
  }

  if (lowerMessage.includes('healthcare') || lowerMessage.includes('ahcd') || lowerMessage.includes('directive')) {
    return `**About Advance Healthcare Directives (AHCD):**

An AHCD documents your healthcare preferences and appoints someone to make medical decisions if you cannot.

**Includes:**
• Living Will - Your treatment preferences
• Healthcare Agent - Person who speaks for you
• End-of-life wishes
• Organ donation preferences

**Why Important:**
• Ensures your wishes are known
• Reduces burden on family
• Provides legal authority to your agent

*This is general information only. Consult a licensed attorney for legal advice.*

Create your AHCD from the dashboard.`
  }

  if (lowerMessage.includes('executor')) {
    return `**Choosing an Executor:**

An executor manages your estate after death. Consider someone who is:

• Trustworthy and responsible
• Organized and detail-oriented
• Willing to serve
• Geographically accessible
• Financially stable

**Executor Duties:**
• Locate and secure assets
• Pay debts and taxes
• Distribute assets to beneficiaries
• Handle legal/court requirements

*Tip: Always name an alternate executor in case your first choice can't serve.*`
  }

  if (lowerMessage.includes('need') || lowerMessage.includes('document') || lowerMessage.includes('start')) {
    return `**Getting Started with Estate Planning:**

Most adults should consider these core documents:

1. **Last Will & Testament** - Asset distribution, executor, guardians
2. **Living Trust** - Avoid probate, manage assets
3. **Power of Attorney** - Financial decisions if incapacitated
4. **Healthcare Directive** - Medical decisions and end-of-life wishes

**Priority Order:**
Start with a Will if you have:
• Children (especially minors)
• Property or significant assets
• Specific wishes for asset distribution

*This is general information. Consult an attorney for personalized guidance.*

Ready to begin? Visit your dashboard to create these documents.`
  }

  return `Thank you for your question! I'm here to help with estate planning topics.

**I can assist with:**
• Understanding wills, trusts, POAs, and healthcare directives
• Explaining legal terms in plain language
• Guidance on which documents you might need
• General estate planning best practices

**Try asking:**
• "What's the difference between a will and a trust?"
• "What documents do I need?"
• "How do I choose an executor?"

*Remember: Always consult a licensed attorney for legal advice specific to your situation.*`
}
