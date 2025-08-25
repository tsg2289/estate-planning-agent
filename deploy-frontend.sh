#!/bin/bash

# Estate Planning Agent - Frontend Deployment Script
# This script builds and deploys the frontend application

echo "🚀 Starting Estate Planning Agent Frontend Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run security audit
echo "🔒 Running security audit..."
npm run security-check

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in 'dist/' directory"
    
    # Display build statistics
    echo "📊 Build Statistics:"
    du -sh dist/
    echo ""
    
    echo "🎉 Frontend deployment ready!"
    echo ""
    echo "Next steps:"
    echo "1. Upload the contents of 'dist/' to your web server"
    echo "2. Configure your web server to serve the SPA correctly"
    echo "3. Set up environment variables for production"
    echo "4. Enable HTTPS/TLS for security"
    echo ""
    echo "For Vercel deployment:"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Run: vercel --prod"
    echo ""
    echo "For Netlify deployment:"
    echo "1. Drag and drop the 'dist/' folder to Netlify"
    echo "2. Configure redirects for SPA routing"
    
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
