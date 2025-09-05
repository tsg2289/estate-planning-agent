-- Simple Fix - Remove All Admin Policies Temporarily
-- This will fix the infinite recursion issue

-- Drop all admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all email subscriptions" ON email_list;
DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage templates" ON document_templates;

-- Create simple policies without admin checks for now
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view email subscriptions" ON email_list
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view blog posts" ON blog_posts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view templates" ON document_templates
  FOR SELECT USING (true);

-- Keep the user-specific policies as they are
-- (These don't cause recursion)
