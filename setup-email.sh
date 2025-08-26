#!/bin/bash

echo "🚀 Setting up Real Email Sending for 2FA"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ .env.local created from env.example"
    echo ""
fi

echo "📧 Email Configuration Setup"
echo "==========================="
echo ""

echo "Choose your email provider:"
echo "1) Gmail (Recommended for testing)"
echo "2) Outlook/Hotmail"
echo "3) Yahoo"
echo "4) Custom SMTP"
echo "5) Skip for now (use development mode)"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📧 Gmail Setup Instructions:"
        echo "============================"
        echo "1. Go to your Google Account settings"
        echo "2. Security → 2-Step Verification → App passwords"
        echo "3. Generate a new app password for 'Mail'"
        echo "4. Copy the 16-character password"
        echo ""
        
        read -p "Enter your Gmail address: " gmail_address
        read -p "Enter your Gmail app password (16 characters): " gmail_password
        
        # Update .env.local with Gmail settings
        sed -i '' "s/SMTP_HOST=.*/SMTP_HOST=smtp.gmail.com/" .env.local
        sed -i '' "s/SMTP_PORT=.*/SMTP_PORT=587/" .env.local
        sed -i '' "s/SMTP_USER=.*/SMTP_USER=$gmail_address/" .env.local
        sed -i '' "s/SMTP_PASS=.*/SMTP_PASS=$gmail_password/" .env.local
        sed -i '' "s/FROM_EMAIL=.*/FROM_EMAIL=$gmail_address/" .env.local
        
        echo ""
        echo "✅ Gmail configuration saved to .env.local"
        echo "📧 Your verification codes will now be sent via Gmail!"
        ;;
        
    2)
        echo ""
        echo "📧 Outlook Setup:"
        echo "================="
        read -p "Enter your Outlook email: " outlook_email
        read -p "Enter your Outlook password: " outlook_password
        
        sed -i '' "s/SMTP_HOST=.*/SMTP_HOST=smtp-mail.outlook.com/" .env.local
        sed -i '' "s/SMTP_PORT=.*/SMTP_PORT=587/" .env.local
        sed -i '' "s/SMTP_USER=.*/SMTP_USER=$outlook_email/" .env.local
        sed -i '' "s/SMTP_PASS=.*/SMTP_PASS=$outlook_password/" .env.local
        sed -i '' "s/FROM_EMAIL=.*/FROM_EMAIL=$outlook_email/" .env.local
        
        echo ""
        echo "✅ Outlook configuration saved to .env.local"
        ;;
        
    3)
        echo ""
        echo "📧 Yahoo Setup:"
        echo "==============="
        read -p "Enter your Yahoo email: " yahoo_email
        read -p "Enter your Yahoo password: " yahoo_password
        
        sed -i '' "s/SMTP_HOST=.*/SMTP_HOST=smtp.mail.yahoo.com/" .env.local
        sed -i '' "s/SMTP_PORT=.*/SMTP_PORT=587/" .env.local
        sed -i '' "s/SMTP_USER=.*/SMTP_USER=$yahoo_email/" .env.local
        sed -i '' "s/SMTP_PASS=.*/SMTP_PASS=$yahoo_password/" .env.local
        sed -i '' "s/FROM_EMAIL=.*/FROM_EMAIL=$yahoo_email/" .env.local
        
        echo ""
        echo "✅ Yahoo configuration saved to .env.local"
        ;;
        
    4)
        echo ""
        echo "📧 Custom SMTP Setup:"
        echo "====================="
        read -p "Enter SMTP host: " custom_host
        read -p "Enter SMTP port (usually 587): " custom_port
        read -p "Enter your email: " custom_email
        read -p "Enter your password: " custom_password
        
        sed -i '' "s/SMTP_HOST=.*/SMTP_HOST=$custom_host/" .env.local
        sed -i '' "s/SMTP_PORT=.*/SMTP_PORT=$custom_port/" .env.local
        sed -i '' "s/SMTP_USER=.*/SMTP_USER=$custom_email/" .env.local
        sed -i '' "s/SMTP_PASS=.*/SMTP_PASS=$custom_password/" .env.local
        sed -i '' "s/FROM_EMAIL=.*/FROM_EMAIL=$custom_email/" .env.local
        
        echo ""
        echo "✅ Custom SMTP configuration saved to .env.local"
        ;;
        
    5)
        echo ""
        echo "⏭️  Skipping email setup. System will use development mode."
        echo "📧 Verification codes will be logged to console only."
        echo ""
        echo "To set up email later, run this script again or manually edit .env.local"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🔄 Now restart your backend server to apply the new email configuration:"
echo "   cd api && npm run dev"
echo ""
echo "📧 Your verification codes will now be sent as real emails!"
echo ""
echo "💡 If you encounter issues:"
echo "   - Check your email provider's security settings"
echo "   - Ensure 2FA is enabled (for Gmail)"
echo "   - Verify your password is correct"
echo "   - Check spam folders for verification emails"
