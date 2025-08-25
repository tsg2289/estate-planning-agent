#!/bin/bash

# Estate Planning Agent - Backend Deployment Script
# This script deploys the backend API to Vercel

set -e

echo "🚀 Deploying Estate Planning Agent Backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    
    # Try to install globally first
    if npm install -g vercel 2>/dev/null; then
        echo "✅ Vercel CLI installed globally"
    else
        echo "⚠️  Global installation failed. Installing locally..."
        npm install vercel
        echo "✅ Vercel CLI installed locally"
        echo "💡 You can now run: npx vercel"
    fi
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null 2>&1; then
    echo "🔐 Please log in to Vercel..."
    
    # Try global vercel first, then local
    if command -v vercel &> /dev/null; then
        vercel login
    else
        npx vercel login
    fi
fi

# Set environment variables for production
echo "🔧 Setting up environment variables..."

# Generate a secure JWT secret if not set
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "🔑 Generated new JWT_SECRET: $JWT_SECRET"
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    npx vercel --prod
fi

echo "✅ Backend deployment complete!"
echo ""
echo "🔗 Your API endpoints are now available at:"
echo "   - Health Check: https://your-domain.vercel.app/api/health"
echo "   - Register: https://your-domain.vercel.app/api/auth/register"
echo "   - Login: https://your-domain.vercel.app/api/auth/login"
echo "   - Verify: https://your-domain.vercel.app/api/auth/verify"
echo ""
echo "⚠️  Important: Set the following environment variables in your Vercel dashboard:"
echo "   - JWT_SECRET: $JWT_SECRET"
echo "   - NODE_ENV: production"
echo ""
echo "🔐 To set environment variables:"
echo "   1. Go to your Vercel dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings > Environment Variables"
echo "   4. Add JWT_SECRET with the value above"
echo ""
echo "🎉 Your estate planning agent backend is now live!"
