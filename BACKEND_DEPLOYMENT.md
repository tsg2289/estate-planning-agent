# Backend Deployment Guide

This guide will help you deploy the Estate Planning Agent backend API to Vercel Functions.

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

1. **Run the deployment script:**
   ```bash
   ./deploy-backend.sh
   ```

2. **Follow the prompts to:**
   - Log in to Vercel (if not already logged in)
   - Configure your project
   - Deploy to production

### Option 2: Manual Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables

After deployment, you **MUST** set these environment variables in your Vercel dashboard:

### Required Variables

- **`JWT_SECRET`**: A secure random string for JWT token signing
  - Generate one: `openssl rand -base64 32`
  - **Never share or commit this value**

- **`NODE_ENV`**: Set to `production`

### How to Set Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `JWT_SECRET`
   - **Value**: Your generated secret
   - **Environment**: Production
5. Click **Save**

## 📁 Project Structure

```
api/
├── auth/
│   ├── register.js      # User registration endpoint
│   ├── login.js         # User login endpoint
│   └── verify.js        # JWT token verification
├── lib/
│   └── users.js         # Shared user storage
├── health.js            # Health check endpoint
└── package.json         # API dependencies
```

## 🔗 API Endpoints

Once deployed, your API will be available at:

- **Health Check**: `https://your-domain.vercel.app/api/health`
- **Register**: `https://your-domain.vercel.app/api/auth/register`
- **Login**: `https://your-domain.vercel.app/api/auth/login`
- **Verify**: `https://your-domain.vercel.app/api/auth/verify`

## 🧪 Testing the API

### Health Check
```bash
curl https://your-domain.vercel.app/api/health
```

### User Registration
```bash
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### User Login
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

## ⚠️ Important Notes

### Current Limitations

1. **In-Memory Storage**: Users are stored in memory and will be lost on server restarts
2. **No Database**: This is a demo setup - production should use a real database
3. **Single Instance**: Vercel Functions are stateless

### Production Considerations

1. **Database Integration**: Replace in-memory storage with:
   - PostgreSQL (recommended)
   - MongoDB
   - Supabase
   - PlanetScale

2. **User Persistence**: Implement proper user management
3. **Rate Limiting**: Add API rate limiting
4. **Monitoring**: Set up logging and monitoring
5. **Backup**: Regular database backups

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Password complexity requirements
- ✅ CORS protection
- ✅ Input validation
- ✅ Secure headers

## 🚨 Troubleshooting

### Common Issues

1. **"JWT_SECRET not set"**
   - Set the environment variable in Vercel dashboard

2. **"Function not found"**
   - Ensure all API files are in the `api/` directory
   - Check that `vercel.json` includes the functions configuration

3. **"Module not found"**
   - Ensure dependencies are in the main `package.json`
   - Check that `type: "module"` is set in API package.json

### Getting Help

- Check Vercel deployment logs
- Verify environment variables are set
- Ensure all files are committed and pushed

## 🎯 Next Steps

After successful deployment:

1. **Update Frontend**: Point your frontend to the new API URL
2. **Test Authentication**: Verify login/register flows work
3. **Monitor Usage**: Check Vercel analytics
4. **Scale Up**: Consider database integration for production use

## 📚 Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [JWT.io](https://jwt.io/) - JWT debugging
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- [Vercel Dashboard](https://vercel.com/dashboard)

---

**Need help?** Check the deployment logs in your Vercel dashboard or review the troubleshooting section above.
