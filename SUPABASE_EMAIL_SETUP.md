# Supabase Email Confirmation Setup Guide

## Issue: Email confirmation not working for user signup

Your signup flow is correctly implemented, but email confirmation emails are not being sent. Here's how to fix it:

## Step 1: Check Supabase Auth Settings

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `estate-planning-agent`
3. Navigate to **Authentication → Settings**

### Required Settings:

#### Site URL Configuration
- **Site URL**: `http://localhost:5173` (for development)
- **Additional Redirect URLs**: 
  - `http://localhost:5173/login`
  - `http://localhost:5173/register` 
  - `https://your-production-domain.com` (when deployed)

#### Email Confirmation
- **Enable email confirmations**: ✅ **ENABLED**
- **Confirm email change**: ✅ **ENABLED** (optional)
- **Enable secure email change**: ✅ **ENABLED** (recommended)

## Step 2: Configure Email Provider

### Option A: Use Supabase's Built-in Email (Recommended for Testing)
1. In **Authentication → Settings**
2. Scroll to **SMTP Settings**
3. **Enable custom SMTP**: ❌ **DISABLED** (use Supabase's email service)

**Note**: Supabase's built-in email service works for development but has limitations:
- Limited to 3 emails per hour per user
- May be marked as spam
- Not suitable for production

### Option B: Configure Custom SMTP (Recommended for Production)
1. **Enable custom SMTP**: ✅ **ENABLED**
2. Configure your SMTP settings:
   ```
   SMTP Host: smtp.gmail.com (for Gmail)
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Pass: your-app-password
   Sender email: noreply@yourdomain.com
   Sender name: Estate Planning Agent
   ```

#### For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" (not your regular password)
3. Use the app password in the SMTP settings

## Step 3: Customize Email Templates (Optional)

1. Go to **Authentication → Email Templates**
2. Customize the **Confirm signup** template:
   ```html
   <h2>Welcome to Estate Planning Agent!</h2>
   <p>Thanks for signing up! Please confirm your email address by clicking the link below:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   <p>If you didn't create an account, you can safely ignore this email.</p>
   ```

## Step 4: Test the Flow

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Try signing up** with a real email address you can access

3. **Check the browser console** for debug messages:
   ```
   🚀 Starting signup process for: your-email@example.com
   📡 Signup response: { data: {...}, error: null }
   ✅ User created successfully: { email: "...", emailConfirmed: null, hasSession: false }
   ```

4. **Check your email** (including spam folder) for the confirmation link

## Step 5: Handle Email Confirmation

When users click the confirmation link in their email, they'll be redirected to your site. You need to handle this:

1. The URL will look like: `http://localhost:5173#access_token=...&type=signup`
2. Supabase automatically processes this and updates the user's `email_confirmed_at` field
3. Your app should redirect them to the login page or dashboard

## Troubleshooting

### Problem: "User already registered" error
- This happens when the user exists but isn't confirmed
- Solution: The user should check their email for the original confirmation link

### Problem: No email received
1. **Check Supabase logs**:
   - Go to **Logs → Auth logs** in your Supabase dashboard
   - Look for email sending errors

2. **Verify email settings**:
   - Make sure Site URL is correct
   - Check SMTP configuration if using custom email

3. **Check spam folder**
   - Supabase's built-in email service often goes to spam

### Problem: "Invalid redirect URL" error
- Add your redirect URLs to the **Authentication → URL Configuration**
- Make sure the URLs match exactly (including protocol)

## Production Deployment

When deploying to production:

1. **Update Site URL** in Supabase to your production domain
2. **Add production redirect URLs**
3. **Configure custom SMTP** for reliable email delivery
4. **Test the complete flow** in production

## Environment Variables

Make sure these are set in your `.env.local`:
```bash
VITE_SUPABASE_URL=https://gpxabmtowcvtjcqhnbwj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Current Status

✅ Supabase connection working  
✅ Signup form properly implemented  
✅ User creation working  
⚠️  Email confirmation needs to be configured in Supabase dashboard  

The main issue is that email confirmation is enabled but emails aren't being sent. Follow the steps above to configure email delivery in your Supabase project.
