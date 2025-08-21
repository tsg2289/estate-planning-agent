#!/bin/bash

# Estate Planning Agent - Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting deployment to Vercel..."

# Check if user is logged in to Vercel
if ! npx vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    npx vercel login
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf .vercel/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level moderate || echo "⚠️  Security audit completed with warnings"

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "🎉 Deployment completed!"
echo "📋 Next steps:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Configure custom domain (optional)"
echo "   3. Test all functionality on live site"
echo "   4. Monitor performance and errors"
