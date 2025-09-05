-- Complete Database Reset - Remove All Triggers and Policies
-- This will completely reset the database to a clean state

-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_estate_documents_updated_at ON estate_documents;
DROP TRIGGER IF EXISTS update_email_list_updated_at ON email_list;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;

-- Drop all functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_user_update();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS cleanup_expired_sessions();
DROP FUNCTION IF EXISTS get_user_stats();

-- Drop all policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view their own documents" ON estate_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON estate_documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON estate_documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON estate_documents;

DROP POLICY IF EXISTS "Anyone can add emails to list" ON email_list;
DROP POLICY IF EXISTS "Users can view their own email subscription" ON email_list;
DROP POLICY IF EXISTS "Users can update their own email subscription" ON email_list;
DROP POLICY IF EXISTS "Admins can view all email subscriptions" ON email_list;
DROP POLICY IF EXISTS "Anyone can view email subscriptions" ON email_list;

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can view their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can insert their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can view blog posts" ON blog_posts;

DROP POLICY IF EXISTS "Anyone can view active templates" ON document_templates;
DROP POLICY IF EXISTS "Admins can manage templates" ON document_templates;
DROP POLICY IF EXISTS "Anyone can view templates" ON document_templates;

DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;

-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE estate_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_list DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;

-- Drop the view
DROP VIEW IF EXISTS user_dashboard;

-- Now test if the basic connection works
SELECT 'Database reset complete' as status;
