#!/bin/bash

echo "🚀 Deploying Estate Planning Agent with Authentication to Vercel"
echo "================================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating example file..."
    cat > .env.local << EOF
# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production

# Database Configuration (for future use)
# DATABASE_URL=your-database-connection-string

# Other Configuration
# NODE_ENV=production
EOF
    echo "✅ Created .env.local - PLEASE UPDATE JWT_SECRET before deploying!"
    echo ""
    echo "⚠️  IMPORTANT: Change the JWT_SECRET in .env.local to a secure value!"
    echo "   You can generate one with: openssl rand -base64 32"
    echo ""
    read -p "Press Enter after updating JWT_SECRET to continue..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install API dependencies
echo "📦 Installing API dependencies..."
cd api && npm install && cd ..

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔐 Next steps:"
echo "1. Set JWT_SECRET environment variable in Vercel dashboard"
echo "2. Test the authentication system"
echo "3. Update your domain settings if needed"
echo ""
echo "📚 For more information, see AUTHENTICATION_SETUP.md"
