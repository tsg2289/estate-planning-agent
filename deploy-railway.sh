#!/bin/bash

echo "🚀 Deploying Estate Planning API to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to API directory
cd api

echo "📦 Installing dependencies..."
npm install

echo "🔐 Logging into Railway..."
railway login

echo "🚇 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🔗 Your API URL will be shown above"
echo "📝 Copy the URL and update your frontend configuration"
