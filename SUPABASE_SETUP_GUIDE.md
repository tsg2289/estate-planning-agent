# 🚀 Supabase Setup Guide for Estate Planning Agent

This guide will help you connect your Next.js application to Supabase for full authentication and database functionality.

## 📋 Prerequisites

- A Supabase account (free tier is fine for development)
- Your Next.js application running locally
- Basic knowledge of SQL (for database setup)

## 🔧 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or sign in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: `estate-planning-agent` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 2-3 minutes)

## 🔑 Step 2: Get Your API Keys

Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. You'll need these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon key**: `eyJ...` (public key, safe for client-side)
   - **Service role key**: `eyJ...` (secret key, server-only!)

⚠️ **Important**: Never expose the service role key in client-side code!

## 🗄️ Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `setup-supabase-database.sql`
4. Click "Run" to execute the SQL
5. Verify tables were created in **Table Editor**

Expected tables:
- `organizations` - Multi-tenant organization management
- `profiles` - User profiles extending auth.users
- `estate_documents` - Encrypted document storage
- `audit_logs` - SOC2 compliance audit trail
- `ai_processing_logs` - AI processing tracking
- `data_retention_policies` - Compliance policies

## 🔐 Step 4: Configure Environment Variables

### Option A: Use the Setup Script (Recommended)

1. Open terminal in your project directory
2. Run the setup script:
   ```bash
   ./setup-env-nextjs.sh
   ```
3. Follow the prompts to enter your Supabase credentials
4. The script will create `.env.local` with secure random keys

### Option B: Manual Setup

1. Create `.env.local` in your project root:
   ```bash
   touch .env.local
   ```

2. Add your Supabase credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # AI Configuration (Optional - add when ready)
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Security Keys (Auto-generated or custom)
   ANONYMIZATION_SECRET=your_secure_anonymization_key
   ENCRYPTION_KEY=your_secure_encryption_key

   # Development Settings
   NODE_ENV=development
   LOG_LEVEL=debug

   # SOC2 Compliance
   DATA_RETENTION_DAYS=2555
   AUDIT_LOG_RETENTION_DAYS=2555
   AUTO_DELETE_EXPIRED_DATA=true
   ```

## 🚀 Step 5: Test the Connection

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test authentication flow**:
   - Go to `http://localhost:3000/auth/signup`
   - Create a test account
   - Check your email for verification
   - Try signing in at `http://localhost:3000/auth/signin`

3. **Verify in Supabase**:
   - Go to **Authentication** → **Users** in Supabase dashboard
   - You should see your test user
   - Check **Table Editor** → **profiles** for the user profile

## 🔍 Step 6: Verify Security Features

### Row Level Security (RLS)
- RLS is automatically enabled on all tables
- Users can only access their own data
- Organization-scoped access for multi-tenancy

### Audit Logging
- All document changes are automatically logged
- View logs in **Table Editor** → **audit_logs**

### Data Encryption
- Document content is encrypted before storage
- Encryption keys are server-only

## 🚨 Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check `.env.local` exists and has correct values
   - Restart development server after adding variables

2. **"Invalid API key"**
   - Verify you copied the keys correctly from Supabase dashboard
   - Make sure you're using the anon key (not service role) for NEXT_PUBLIC_SUPABASE_ANON_KEY

3. **Database connection errors**
   - Ensure the SQL schema was executed successfully
   - Check Supabase project is not paused (free tier pauses after inactivity)

4. **Authentication not working**
   - Verify email confirmation is enabled in Supabase Auth settings
   - Check spam folder for verification emails

### Debug Steps:

1. **Check environment variables**:
   ```bash
   # In your project directory
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Test Supabase connection**:
   - Open browser console on your app
   - Look for Supabase connection errors

3. **Check Supabase logs**:
   - Go to **Logs** in Supabase dashboard
   - Look for authentication and database errors

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for production** - Generate new keys for deployment
3. **Rotate keys regularly** - Especially for production environments
4. **Monitor audit logs** - Review regularly for suspicious activity
5. **Enable 2FA** - On your Supabase account

## 🚀 Production Deployment

When ready for production:

1. **Set environment variables in Vercel**:
   - Go to your Vercel project settings
   - Add all environment variables from `.env.local`
   - Generate new, stronger keys for production

2. **Configure Supabase for production**:
   - Update allowed origins in Supabase Auth settings
   - Set up custom SMTP for emails
   - Configure rate limiting

3. **Enable monitoring**:
   - Set up Vercel Analytics
   - Configure Supabase monitoring alerts

## 📞 Support

If you encounter issues:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the [Next.js Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
3. Check your browser console for error messages
4. Verify your database schema matches the provided SQL

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Development server restarted
- [ ] Test user account created
- [ ] Authentication flow working
- [ ] User profile created in database
- [ ] Audit logging working

Once all items are checked, your Estate Planning Agent is fully connected to Supabase! 🎉