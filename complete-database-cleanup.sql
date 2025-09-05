-- Complete Database Cleanup - Remove ALL policies and triggers
-- This will completely clean the database

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Drop ALL policies on all tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Get all policies and drop them
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Drop all triggers
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

-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE estate_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_list DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;

-- Drop the view
DROP VIEW IF EXISTS user_dashboard;

-- Test basic connection
SELECT 'Database cleanup complete - RLS disabled' as status;
