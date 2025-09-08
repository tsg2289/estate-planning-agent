import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
};

// Create transporter
const createTransporter = () => {
  // Check if we have real email credentials
  if (EMAIL_CONFIG.auth.user && EMAIL_CONFIG.auth.pass) {
    console.log('📧 Using real SMTP configuration');
    return nodemailer.createTransport(EMAIL_CONFIG);
  }
  
  // Fallback to development mode
  console.log('🔧 Using development mode - emails will be logged to console');
  console.log('💡 To send real emails, set SMTP_USER and SMTP_PASS environment variables');
  
  // Return a mock transporter for development
  return {
    sendMail: async (mailOptions) => {
      console.log('📧 [DEV MODE] Email would be sent:');
      console.log('📧 To:', mailOptions.to);
      console.log('📧 Subject:', mailOptions.subject);
      console.log('📧 Verification Code:', mailOptions.html.match(/\d{6}/)?.[0] || 'Not found');
      console.log('📧 Full HTML:', mailOptions.html);
      
      // Return a mock success response
      return {
        messageId: 'dev-' + Date.now(),
        response: 'Development mode - email logged to console',
        success: true
      };
    }
  };
};

// Generate a random 6-digit code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code email
export const sendVerificationCode = async (email, code, userName = 'User') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@estateplanning.com',
      to: email,
      subject: 'Your Estate Planning Agent Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Estate Planning Agent</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Two-Factor Authentication</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your verification code for Estate Planning Agent is:
            </p>
            
            <div style="background: #fff; border: 2px solid #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${code}</span>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
            
            <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                <strong>Security Tip:</strong> Never share your verification code with anyone. Our team will never ask for this code.
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">
              © 2024 Estate Planning Agent. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
Estate Planning Agent - Two-Factor Authentication

Hello ${userName},

Your verification code is: ${code}

This code will expire in 10 minutes.

Security Tip: Never share your verification code with anyone.

© 2024 Estate Planning Agent
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email sent (development mode):', info.messageId);
      if (info.response) {
        console.log('📧 Response:', info.response);
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@estateplanning.com',
      to: email,
      subject: 'Welcome to Estate Planning Agent!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Estate Planning Agent!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your account is now verified and ready to use</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for verifying your account! You now have full access to Estate Planning Agent and can:
            </p>
            
            <ul style="color: #666; line-height: 1.8; margin-bottom: 25px;">
              <li>Create and manage your estate planning documents</li>
              <li>Access your personalized dashboard</li>
              <li>Track your progress and save your work</li>
              <li>Get expert guidance on estate planning</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://your-app.vercel.app'}/dashboard" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Get Started
              </a>
            </div>
            
            <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                <strong>Need Help?</strong> If you have any questions, feel free to reach out to our support team.
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">
              © 2024 Estate Planning Agent. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Welcome email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName = 'User') => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@estateplanning.com',
      to: email,
      subject: 'Password Reset - Estate Planning Agent',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Estate Planning Agent</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password for your Estate Planning Agent account. Your account has been temporarily locked due to multiple failed login attempts.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Click the button below to reset your password and unlock your account:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Or copy and paste this link into your browser:
            </p>
            
            <div style="background: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin: 20px 0; word-break: break-all;">
              <a href="${resetUrl}" style="color: #667eea; text-decoration: none;">${resetUrl}</a>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
            
            <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; color: #721c24; font-size: 14px;">
                <strong>Account Locked:</strong> Your account has been locked due to 5 failed login attempts. Resetting your password will automatically unlock your account.
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">
              © 2024 Estate Planning Agent. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
Estate Planning Agent - Password Reset Request

Hello ${userName},

We received a request to reset your password for your Estate Planning Agent account. Your account has been temporarily locked due to multiple failed login attempts.

Reset your password by clicking this link: ${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email and your password will remain unchanged.

Account Locked: Your account has been locked due to 5 failed login attempts. Resetting your password will automatically unlock your account.

© 2024 Estate Planning Agent
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Password reset email sent (development mode):', info.messageId);
      console.log('🔗 Reset URL:', resetUrl);
      if (info.response) {
        console.log('📧 Response:', info.response);
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Password reset email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send account lockout notification email
export const sendAccountLockoutEmail = async (email, userName = 'User') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@estateplanning.com',
      to: email,
      subject: 'Account Locked - Estate Planning Agent',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Account Locked</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Security Alert</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your Estate Planning Agent account has been temporarily locked due to 5 consecutive failed login attempts.
            </p>
            
            <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; color: #721c24; font-size: 14px;">
                <strong>Security Measure:</strong> Your account will automatically unlock after 30 minutes, or you can reset your password immediately to regain access.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              If this wasn't you, please reset your password immediately to secure your account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/forgot-password" 
                 style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Reset Password Now
              </a>
            </div>
            
            <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; color: #333; font-size: 14px;">
                <strong>Need Help?</strong> If you're having trouble accessing your account, please contact our support team.
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">
              © 2024 Estate Planning Agent. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
Estate Planning Agent - Account Locked

Hello ${userName},

Your Estate Planning Agent account has been temporarily locked due to 5 consecutive failed login attempts.

Security Measure: Your account will automatically unlock after 30 minutes, or you can reset your password immediately to regain access.

If this wasn't you, please reset your password immediately to secure your account.

Reset your password: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/forgot-password

© 2024 Estate Planning Agent
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Account lockout email sent (development mode):', info.messageId);
      if (info.response) {
        console.log('📧 Response:', info.response);
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Account lockout email sending failed:', error);
    return { success: false, error: error.message };
  }
};
