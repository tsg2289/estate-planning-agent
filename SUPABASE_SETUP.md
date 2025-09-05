# Supabase Integration Setup Guide

This guide will help you migrate your estate planning application to use Supabase with Row Level Security (RLS) for secure data storage.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `estate-planning-agent`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Secret (for fallback)
JWT_SECRET=your_jwt_secret_key

# Email Configuration (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@yourdomain.com

# Environment
NODE_ENV=development
```

### 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all tables, RLS policies, and functions

### 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add your production domain when ready
   - **Email Templates**: Customize as needed
3. Go to **Authentication** → **Providers**
4. Enable **Email** provider
5. Configure email settings if you have SMTP credentials

### 6. Install Dependencies

```bash
npm install @supabase/supabase-js dotenv
```

### 7. Migrate Existing Data (Optional)

If you have existing data in your SQLite database:

```bash
# Install migration dependencies
npm install sqlite3

# Run the migration script
node scripts/migrate-to-supabase.js
```

## 🔒 Security Features

### Row Level Security (RLS)

Your data is protected by RLS policies that ensure:

- **Users can only access their own data**
- **Admins can access all data** (when properly configured)
- **Public data is accessible to everyone** (blog posts, templates)
- **Email list signups are public** but personal data is protected

### Authentication Security

- **Email verification required** for new accounts
- **Secure password hashing** (handled by Supabase)
- **JWT tokens** for session management
- **Automatic token refresh**
- **Session persistence** across browser refreshes

### Data Protection

- **Encrypted data at rest** (Supabase handles this)
- **Encrypted data in transit** (HTTPS)
- **Automatic backups** (Supabase handles this)
- **Audit logs** available in Supabase dashboard

## 🛠️ Implementation

### Update Your App.jsx

Replace your existing AuthContext with the new SupabaseAuthContext:

```jsx
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext'

function App() {
  return (
    <SupabaseAuthProvider>
      {/* Your existing app content */}
    </SupabaseAuthProvider>
  )
}
```

### Update Authentication Components

Replace your existing login/register components with the new Supabase versions:

```jsx
import SupabaseLogin from './components/auth/SupabaseLogin'
import SupabaseRegister from './components/auth/SupabaseRegister'
import SupabaseProtectedRoute from './components/auth/SupabaseProtectedRoute'
```

### Update API Calls

Replace your existing API calls with Supabase client calls:

```jsx
import { supabase, db } from './lib/supabase'

// Example: Get user's documents
const { data: documents, error } = await db.documents.getUserDocuments(userId)

// Example: Create new document
const { data: document, error } = await db.documents.createDocument({
  user_id: userId,
  document_type: 'will',
  title: 'My Will',
  content: { /* document content */ }
})
```

## 📊 Database Schema

### Tables Created

1. **profiles** - User profiles (extends auth.users)
2. **estate_documents** - Estate planning documents
3. **email_list** - Marketing email subscribers
4. **blog_posts** - Blog content
5. **document_templates** - Reusable document templates
6. **user_sessions** - Additional session tracking

### Key Features

- **Automatic timestamps** (created_at, updated_at)
- **Soft deletes** (is_active flags)
- **JSONB columns** for flexible data storage
- **Foreign key constraints** for data integrity
- **Indexes** for optimal performance

## 🔧 Configuration

### Admin Users

To make a user an admin, update their profile:

```sql
UPDATE profiles 
SET preferences = jsonb_set(
  COALESCE(preferences, '{}'::jsonb), 
  '{role}', 
  '"admin"'::jsonb
) 
WHERE email = 'admin@yourdomain.com';
```

### Email Templates

Customize email templates in **Authentication** → **Email Templates**:

- **Confirm signup** - Email verification
- **Reset password** - Password reset
- **Magic link** - Passwordless login

### Storage (Optional)

If you need file storage for documents:

1. Go to **Storage** in Supabase dashboard
2. Create a bucket called `documents`
3. Configure RLS policies for the bucket
4. Use Supabase Storage API in your app

## 🚀 Deployment

### Vercel Deployment

1. Add environment variables to Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Update your `vercel.json` if needed

3. Deploy as usual

### Update Site URL

After deployment, update your Supabase project:
1. Go to **Authentication** → **Settings**
2. Update **Site URL** to your production domain
3. Add production domain to **Redirect URLs**

## 🧪 Testing

### Test RLS Policies

1. Create test users with different roles
2. Verify users can only access their own data
3. Test admin access
4. Verify public data is accessible

### Test Authentication Flow

1. Test user registration
2. Test email verification
3. Test login/logout
4. Test password reset
5. Test session persistence

## 📈 Monitoring

### Supabase Dashboard

Monitor your application through the Supabase dashboard:

- **Database** - View tables, run queries
- **Authentication** - Monitor user activity
- **Logs** - View API and auth logs
- **Metrics** - Performance and usage stats

### Security Monitoring

- Review authentication logs regularly
- Monitor for suspicious activity
- Check RLS policy effectiveness
- Review user permissions

## 🆘 Troubleshooting

### Common Issues

1. **"Invalid API key"** - Check your environment variables
2. **"RLS policy violation"** - Check your RLS policies
3. **"Email not confirmed"** - Check email verification settings
4. **"CORS errors"** - Check your site URL configuration

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🔄 Migration Checklist

- [ ] Create Supabase project
- [ ] Set up environment variables
- [ ] Run database schema
- [ ] Configure authentication
- [ ] Install dependencies
- [ ] Update app components
- [ ] Test authentication flow
- [ ] Migrate existing data
- [ ] Test RLS policies
- [ ] Deploy to production
- [ ] Update production settings

## 🎉 Benefits

After migration, you'll have:

- **Enterprise-grade security** with RLS
- **Scalable infrastructure** (Supabase handles scaling)
- **Built-in authentication** (no custom auth code needed)
- **Real-time capabilities** (if needed later)
- **Automatic backups** and monitoring
- **Easy admin management** through dashboard
- **Better performance** with optimized queries
- **Compliance ready** (GDPR, SOC2, etc.)

Your estate planning application will now be secure, scalable, and production-ready! 🚀
