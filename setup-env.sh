#!/bin/bash

echo "🚀 Setting up environment variables for Estate Planning Agent"
echo "=================================================="

# Create .env.local file
cat > .env.local << 'EOF'
# Demo Environment Variables for Development
# Replace with your actual Supabase credentials when ready

# Supabase Configuration (Replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=demo_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=demo_project_id

# AI Configuration (Server-only - Add your actual API keys)
OPENAI_API_KEY=demo_openai_api_key
ANTHROPIC_API_KEY=demo_anthropic_api_key

# Security Keys (Generate strong keys for production!)
ANONYMIZATION_SECRET=demo_anonymization_secret_change_in_production
ENCRYPTION_KEY=demo_encryption_key_change_in_production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=demo_nextauth_secret

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug
EOF

echo "✅ Created .env.local file with demo values"
echo ""
echo "🔧 Next Steps:"
echo "1. The application will now run in demo mode"
echo "2. To enable full functionality, replace the demo values with your actual:"
echo "   - Supabase project URL and keys"
echo "   - OpenAI API key"
echo "   - Strong secrets for production"
echo ""
echo "📖 For setup instructions, see: README-NEXTJS.md"
echo ""
echo "🚀 You can now run: npm run dev"