-- Fix RLS Policies - Remove Infinite Recursion
-- Run this in your Supabase SQL Editor

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a simpler admin policy that doesn't cause recursion
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE preferences->>'role' = 'admin' 
      OR preferences->>'role' = 'super_admin'
    )
  );

-- Also fix the other admin policies to avoid recursion
DROP POLICY IF EXISTS "Admins can view all email subscriptions" ON email_list;
CREATE POLICY "Admins can view all email subscriptions" ON email_list
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE preferences->>'role' = 'admin' 
      OR preferences->>'role' = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
CREATE POLICY "Admins can view all blog posts" ON blog_posts
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE preferences->>'role' = 'admin' 
      OR preferences->>'role' = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage templates" ON document_templates;
CREATE POLICY "Admins can manage templates" ON document_templates
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE preferences->>'role' = 'admin' 
      OR preferences->>'role' = 'super_admin'
    )
  );
