# 🚀 Quick Supabase Setup - Step by Step

## ✅ Your Supabase Project is Ready!
**Project URL:** https://gpxabmtowcvtjcqhnbwj.supabase.co

## Step 1: Set Up Database Schema

1. **Go to your Supabase dashboard:** https://supabase.com/dashboard/project/gpxabmtowcvtjcqhnbwj
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New Query"**
4. **Copy the entire contents** of `supabase-schema.sql` from your project
5. **Paste it** into the SQL Editor
6. **Click "Run"** to execute the script
7. **Verify success** - you should see "Success. No rows returned"

## Step 2: Configure Authentication

1. **Go to "Authentication" → "Settings"** in your Supabase dashboard
2. **Set Site URL:** `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app`
3. **Add Redirect URLs:**
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app`
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/app`
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/login`
   - `https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/register`
4. **Click "Save"**

## Step 3: Add Environment Variables to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Select your project:** `estate-planning-agent`
3. **Go to "Settings" → "Environment Variables"**
4. **Add these 3 variables:**

### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://gpxabmtowcvtjcqhnbwj.supabase.co`

### Variable 2:
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjYzMzIsImV4cCI6MjA3MjYwMjMzMn0.2yYOvsrZJNV2FULZ4WHvnQRNxIJ0CzDeQxuMElQWK-o`

### Variable 3:
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAyNjMzMiwiZXhwIjoyMDcyNjAyMzMyfQ.0KElpesu94N2MFJ9Q4WiRkF8Fi4ojEeJtiZvZJ0LF1c`

5. **Click "Save"** for each variable

## Step 4: Redeploy Your Application

1. **Go to "Deployments"** in your Vercel dashboard
2. **Click "Redeploy"** on the latest deployment
3. **Wait for deployment** to complete (2-3 minutes)

## Step 5: Test Your Application

1. **Visit:** https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app
2. **Try to sign up** for a new account
3. **Check your email** for verification
4. **Sign in** and test the full application

## 🎉 What You'll Get After Setup:

- ✅ **Real User Authentication** - Secure sign up/sign in
- ✅ **Email Verification** - Users must verify their email
- ✅ **Data Persistence** - All form data saved to database
- ✅ **User Profiles** - Each user has their own data
- ✅ **Admin Dashboard** - Manage users through Supabase
- ✅ **Row Level Security** - Users only see their own data
- ✅ **Scalable Infrastructure** - Handles growth automatically

## 🆘 Need Help?

- **Supabase Dashboard:** https://supabase.com/dashboard/project/gpxabmtowcvtjcqhnbwj
- **Vercel Dashboard:** https://vercel.com/thomas-st-germains-projects/estate-planning-agent
- **Your Live App:** https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app

## ⏱️ Total Setup Time: 5-10 minutes

Follow these steps and your Estate Planning Agent will be fully functional with real authentication and data storage! 🚀
