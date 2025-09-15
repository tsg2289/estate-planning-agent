#!/bin/bash

# Estate Planning Agent - Production Environment Setup Script
# This script sets up all required environment variables for Vercel deployment

echo "🚀 Setting up production environment variables for Estate Planning Agent..."
echo ""

# Get the current production URL
PRODUCTION_URL=$(npx vercel ls | grep "● Ready" | grep "Production" | head -1 | awk '{print $2}')

if [ -z "$PRODUCTION_URL" ]; then
    echo "❌ No working production deployment found. Please deploy first with: npx vercel --prod"
    exit 1
fi

echo "📍 Found working deployment: $PRODUCTION_URL"
echo ""

# Set required environment variables
echo "🔧 Setting up environment variables..."

# Frontend URL (for email templates)
echo "Setting FRONTEND_URL..."
echo "$PRODUCTION_URL" | npx vercel env add FRONTEND_URL production

# Node environment
echo "Setting NODE_ENV..."
echo "production" | npx vercel env add NODE_ENV production

# Email configuration (you'll need to provide these)
echo ""
echo "📧 Email Configuration Required:"
echo "For password reset functionality to work, you need to set up email:"
echo ""
echo "1. SMTP_HOST (e.g., smtp.gmail.com)"
echo "2. SMTP_PORT (e.g., 587)"
echo "3. SMTP_USER (your email address)"
echo "4. SMTP_PASS (your app password)"
echo "5. FROM_EMAIL (sender email address)"
echo ""

read -p "Do you want to set up email configuration now? (y/n): " setup_email

if [ "$setup_email" = "y" ] || [ "$setup_email" = "Y" ]; then
    echo ""
    echo "📧 Setting up email configuration..."
    
    read -p "Enter SMTP Host (default: smtp.gmail.com): " smtp_host
    smtp_host=${smtp_host:-smtp.gmail.com}
    echo "$smtp_host" | npx vercel env add SMTP_HOST production
    
    read -p "Enter SMTP Port (default: 587): " smtp_port
    smtp_port=${smtp_port:-587}
    echo "$smtp_port" | npx vercel env add SMTP_PORT production
    
    read -p "Enter your email address: " smtp_user
    echo "$smtp_user" | npx vercel env add SMTP_USER production
    
    read -p "Enter your email app password: " smtp_pass
    echo "$smtp_pass" | npx vercel env add SMTP_PASS production
    
    read -p "Enter FROM email address: " from_email
    echo "$from_email" | npx vercel env add FROM_EMAIL production
    
    echo "✅ Email configuration completed!"
fi

echo ""
echo "🔐 Security Configuration:"
echo "Setting up security environment variables..."

# Generate a secure JWT secret if not exists
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
echo "$JWT_SECRET" | npx vercel env add JWT_SECRET production

echo ""
echo "✅ Production environment setup completed!"
echo ""
echo "📋 Summary:"
echo "- FRONTEND_URL: $PRODUCTION_URL"
echo "- NODE_ENV: production"
echo "- JWT_SECRET: [Generated securely]"
if [ "$setup_email" = "y" ] || [ "$setup_email" = "Y" ]; then
    echo "- Email configuration: ✅ Configured"
else
    echo "- Email configuration: ⚠️  Needs manual setup"
fi
echo ""
echo "🚀 Next steps:"
echo "1. Deploy your application: npx vercel --prod"
echo "2. Test the account lockout functionality"
echo "3. Verify email notifications (if configured)"
echo ""
echo "📖 For more details, see: SECURITY_AND_DEPLOYMENT.md"
