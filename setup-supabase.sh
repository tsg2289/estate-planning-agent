#!/bin/bash

echo "🚀 Setting up Supabase for Estate Planning Agent"
echo "================================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret (for fallback)
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Environment
NODE_ENV=development
EOF
    echo "✅ .env.local created"
    echo ""
else
    echo "📝 .env.local already exists"
    echo ""
fi

echo "🔧 Supabase Setup Instructions"
echo "=============================="
echo ""
echo "1. Go to https://supabase.com and create a new project"
echo "2. Wait for the project to be ready (2-3 minutes)"
echo "3. Go to Settings → API in your Supabase dashboard"
echo "4. Copy the following values:"
echo "   - Project URL (starts with https://)"
echo "   - anon public key"
echo "   - service_role key (keep this secret!)"
echo ""
echo "5. Update your .env.local file with these values"
echo ""
echo "6. Go to SQL Editor in Supabase dashboard"
echo "7. Copy the contents of supabase-schema.sql"
echo "8. Paste and run the SQL script"
echo ""
echo "7. Go to Authentication → Settings"
echo "8. Set Site URL to: http://localhost:3001"
echo "9. Add Redirect URLs: http://localhost:3001"
echo ""
echo "10. Go to Authentication → Providers"
echo "11. Enable Email provider"
echo "12. Configure email settings if you have SMTP credentials"
echo ""
echo "📧 Email Configuration (Optional)"
echo "================================="
echo "If you want real email sending:"
echo "1. Set up SMTP credentials in .env.local"
echo "2. Or use Supabase's built-in email service"
echo ""
echo "🎉 After setup, restart your development server:"
echo "   npm run dev"
echo ""
echo "Your app will be available at: http://localhost:3001"
