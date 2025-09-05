# 🚀 Supabase Production Setup Guide

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your account
3. **Click "New Project"**
4. **Fill in project details:**
   - **Name:** `estate-planning-agent`
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users (e.g., US East)
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for the project to be ready

## Step 2: Get Your Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`) - Keep this secret!

## Step 3: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Click "New Query"**
3. **Copy the entire contents** of `supabase-schema.sql` from your project
4. **Paste it** into the SQL Editor
5. **Click "Run"** to execute the script
6. **Verify success** - you should see "Success. No rows returned"

## Step 4: Configure Authentication

1. **Go to Authentication → Settings**
2. **Set Site URL:** `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app`
3. **Add Redirect URLs:**
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app`
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/app`
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/login`
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/register`

4. **Go to Authentication → Providers**
5. **Enable Email provider**
6. **Configure email settings** (optional - you can use Supabase's built-in email service)

## Step 5: Add Environment Variables to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Select your project:** `estate-planning-agent`
3. **Go to Settings → Environment Variables**
4. **Add these variables:**

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

5. **Click "Save"** for each variable

## Step 6: Redeploy Your Application

1. **Go to Deployments** in your Vercel dashboard
2. **Click "Redeploy"** on the latest deployment
3. **Wait for deployment** to complete (2-3 minutes)

## Step 7: Test Your Application

1. **Visit your live app:** https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app
2. **Try to sign up** for a new account
3. **Check your email** for verification (if configured)
4. **Sign in** and test the full application

## 🎯 What You'll Get After Setup

- ✅ **Real User Authentication** - Secure sign up/sign in
- ✅ **Email Verification** - Users must verify their email
- ✅ **Data Persistence** - All form data saved to database
- ✅ **User Profiles** - Each user has their own data
- ✅ **Admin Dashboard** - Manage users through Supabase
- ✅ **Row Level Security** - Users only see their own data
- ✅ **Scalable Infrastructure** - Handles growth automatically

## 🔧 Troubleshooting

### If you get "Supabase not configured" error:
- Check that environment variables are set correctly in Vercel
- Make sure you redeployed after adding the variables

### If authentication doesn't work:
- Verify the Site URL and Redirect URLs in Supabase
- Check that the database schema was created successfully

### If you can't see your data:
- Check that the RLS policies are working
- Verify you're signed in with the correct account

## 📞 Need Help?

- **Supabase Documentation:** https://supabase.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **Check deployment logs** in Vercel dashboard

## 🎉 Success!

Once everything is set up, your Estate Planning Agent will have:
- Enterprise-grade security
- Real user authentication
- Persistent data storage
- Email verification
- Admin capabilities
- Scalable infrastructure

Your application will be production-ready! 🚀
