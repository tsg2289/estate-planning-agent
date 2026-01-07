import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DataAnonymizer } from '@/lib/ai/anonymization'
import OpenAI from 'openai'
import { nanoid } from 'nanoid'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = nanoid()

  try {
    const supabase = createClient()
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, documentData, context } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Get user's profile for organization context
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    // Log the AI request for audit purposes
    await (supabase as any)
      .from('audit_logs')
      .insert([{
        user_id: user.id,
        organization_id: profile?.organization_id || null,
        action: 'ai_request_initiated',
        details: { 
          prompt_length: prompt.length, 
          has_document_data: !!documentData,
          request_id: requestId
        },
        ip_address: request.ip || null,
        user_agent: request.headers.get('user-agent') || null,
      }])

    // Anonymize the data before sending to AI
    const anonymizer = DataAnonymizer.getInstance()
    const dataToAnonymize = {
      prompt,
      documentData: documentData || {},
      context: context || {}
    }

    const { anonymizedData, anonymizationMap } = anonymizer.anonymizeData(dataToAnonymize)

    // Log AI processing request
    await (supabase as any)
      .from('ai_processing_logs')
      .insert([{
        user_id: user.id,
        organization_id: profile?.organization_id || null,
        request_id: requestId,
        anonymization_applied: true,
        ai_provider: 'openai',
        model_used: 'gpt-4',
        data_anonymized_at: new Date().toISOString(),
      }])

    // Call OpenAI with anonymized data
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2-2025-12-11",
      messages: [
        {
          role: "system",
          content: `You are a professional estate planning assistant with expertise in legal document preparation. 
          
          IMPORTANT SECURITY NOTICE: All data has been anonymized for privacy protection. You are working with anonymized identifiers (ANON_XXXXXXXX) that represent real client information. Provide helpful, accurate advice while maintaining this anonymization.
          
          Your responsibilities:
          - Provide expert guidance on estate planning matters
          - Help draft and review legal documents
          - Ensure compliance with relevant laws and regulations
          - Maintain professional standards and confidentiality
          - Use the anonymized data appropriately in your responses
          
          Remember: Never attempt to de-anonymize data or ask for real names/identifiers.`
        },
        {
          role: "user",
          content: `Please help with this estate planning request:

Prompt: ${anonymizedData.prompt}

${anonymizedData.documentData && Object.keys(anonymizedData.documentData).length > 0 
  ? `Document Data: ${JSON.stringify(anonymizedData.documentData, null, 2)}`
  : ''
}

${anonymizedData.context && Object.keys(anonymizedData.context).length > 0
  ? `Context: ${JSON.stringify(anonymizedData.context, null, 2)}`
  : ''
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const aiResponse = completion.choices[0]?.message?.content || ''
    const tokensUsed = completion.usage?.total_tokens || 0

    // De-anonymize the response
    const deanonymizedResponse = anonymizer.deanonymizeData(aiResponse, anonymizationMap)

    const processingTime = Date.now() - startTime

    // Update AI processing log with results
    await (supabase as any)
      .from('ai_processing_logs')
      .update({
        tokens_used: tokensUsed,
        processing_time_ms: processingTime,
      })
      .eq('request_id', requestId)

    // Log successful AI response
    await (supabase as any)
      .from('audit_logs')
      .insert([{
        user_id: user.id,
        organization_id: profile?.organization_id || null,
        action: 'ai_response_received',
        details: { 
          response_length: deanonymizedResponse.length,
          tokens_used: tokensUsed,
          processing_time_ms: processingTime,
          request_id: requestId
        },
        ip_address: request.ip || null,
        user_agent: request.headers.get('user-agent') || null,
      }])

    return NextResponse.json({ 
      response: deanonymizedResponse,
      usage: {
        total_tokens: tokensUsed,
        processing_time_ms: processingTime
      },
      request_id: requestId
    })

  } catch (error) {
    console.error('AI processing error:', error)
    
    const processingTime = Date.now() - startTime
    
    // Log the error
    const supabase = createClient()
    await (supabase as any)
      .from('audit_logs')
      .insert([{
        user_id: null,
        organization_id: null,
        action: 'ai_request_failed',
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          request_id: requestId,
          processing_time_ms: processingTime
        },
        ip_address: request.ip || null,
        user_agent: request.headers.get('user-agent') || null,
      }])

    // Update AI processing log with error
    await (supabase as any)
      .from('ai_processing_logs')
      .update({
        processing_time_ms: processingTime,
      })
      .eq('request_id', requestId)

    return NextResponse.json(
      { 
        error: 'Failed to process AI request',
        request_id: requestId
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'ai-processing',
    timestamp: new Date().toISOString()
  })
}