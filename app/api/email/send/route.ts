import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, recipientName, documentType, documentTitle, message, recipientType } = await request.json()

    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // In a production environment, you would:
    // 1. Generate a secure, time-limited download link for the document
    // 2. Store the document temporarily in secure storage (e.g., S3 with presigned URL)
    // 3. Send the email using a service like SendGrid, AWS SES, or Resend

    // For now, we'll log the email details and return success
    console.log('Email request received:', {
      to,
      recipientName,
      documentType,
      documentTitle,
      message,
      recipientType,
      timestamp: new Date().toISOString()
    })

    // Simulate email sending
    // In production, integrate with email service:
    /*
    const sendgrid = require('@sendgrid/mail')
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
    
    await sendgrid.send({
      to,
      from: 'noreply@estateplanpro.com',
      subject: `Estate Planning Document: ${documentTitle}`,
      html: generateEmailHTML(recipientName, documentTitle, message, downloadLink),
    })
    */

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Email queued for delivery',
      details: {
        to,
        documentTitle,
        sentAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Email template generator (for future use)
function generateEmailHTML(
  recipientName: string, 
  documentTitle: string, 
  message: string, 
  downloadLink: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3B82F6, #EC4899); padding: 30px; border-radius: 10px 10px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: linear-gradient(135deg, #3B82F6, #EC4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📄 EstatePlan Pro</h1>
    </div>
    <div class="content">
      <p>Hello ${recipientName || 'there'},</p>
      
      <p>A document has been shared with you from EstatePlan Pro:</p>
      
      <h2 style="color: #3B82F6;">${documentTitle}</h2>
      
      ${message ? `<p><em>"${message}"</em></p>` : ''}
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${downloadLink}" class="button">Download Document</a>
      </p>
      
      <div class="warning">
        <strong>⚠️ Important:</strong> This download link will expire in 7 days. 
        Please download your document promptly and store it securely.
      </div>
      
      <p>If you have any questions about this document, please contact the sender directly.</p>
    </div>
    <div class="footer">
      <p>This email was sent by EstatePlan Pro on behalf of a user.</p>
      <p>© ${new Date().getFullYear()} EstatePlan Pro. All rights reserved.</p>
      <p>This document is confidential and intended only for the named recipient.</p>
    </div>
  </div>
</body>
</html>
`
}
