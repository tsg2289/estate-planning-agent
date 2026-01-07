#!/bin/bash

# Estate Planning Agent - Environment Setup Script for Next.js
# This script helps you set up your .env.local file with Supabase credentials

echo "🚀 Estate Planning Agent - Environment Setup"
echo "============================================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Creating backup..."
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
fi

echo "📝 Please provide your Supabase credentials:"
echo ""

# Get Supabase URL
read -p "Enter your Supabase Project URL (https://your-project-id.supabase.co): " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Supabase URL is required!"
    exit 1
fi

# Get Supabase Anon Key
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase Anon Key is required!"
    exit 1
fi

# Get Supabase Service Role Key
read -s -p "Enter your Supabase Service Role Key (hidden): " SUPABASE_SERVICE_ROLE_KEY
echo ""
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Supabase Service Role Key is required!"
    exit 1
fi

# Optional: Get OpenAI API Key
read -s -p "Enter your OpenAI API Key (optional, press Enter to skip): " OPENAI_API_KEY
echo ""

# Optional: Get Anthropic API Key
read -s -p "Enter your Anthropic API Key (optional, press Enter to skip): " ANTHROPIC_API_KEY
echo ""

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# AI Configuration (Server-only - never expose to client)
EOF

if [ ! -z "$OPENAI_API_KEY" ]; then
    echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env.local
fi

if [ ! -z "$ANTHROPIC_API_KEY" ]; then
    echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" >> .env.local
fi

cat >> .env.local << EOF

# Security Keys (Server-only)
# Generate strong random keys for production
ANONYMIZATION_SECRET=dev_anonymization_key_change_in_production_$(openssl rand -hex 16)
ENCRYPTION_KEY=dev_encryption_key_change_in_production_$(openssl rand -hex 16)

# Development Settings
NODE_ENV=development
LOG_LEVEL=debug

# SOC2 Compliance Configuration
DATA_RETENTION_DAYS=2555
AUDIT_LOG_RETENTION_DAYS=2555
AUTO_DELETE_EXPIRED_DATA=true
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo ""
echo "🔒 Security Notes:"
echo "- Your .env.local file contains sensitive keys"
echo "- This file is automatically ignored by git"
echo "- Never commit API keys to version control"
echo "- For production, set these in Vercel environment variables"
echo ""
echo "🚀 Next Steps:"
echo "1. Set up your Supabase database schema"
echo "2. Restart your Next.js development server"
echo "3. Test the authentication flow"
echo ""