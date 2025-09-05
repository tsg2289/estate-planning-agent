-- Complete Trigger and Policy Cleanup
-- Remove ALL triggers and policies that might be causing issues

-- Drop ALL triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_estate_documents_updated_at ON estate_documents;
DROP TRIGGER IF EXISTS update_email_list_updated_at ON email_list;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;

-- Drop ALL functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_user_update();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS cleanup_expired_sessions();
DROP FUNCTION IF EXISTS get_user_stats();

-- Drop ALL policies using a loop
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

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
SELECT 'Complete cleanup done - all triggers and policies removed' as status;
