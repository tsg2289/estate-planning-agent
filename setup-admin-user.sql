-- Setup Admin User for Estate Planning Agent
-- This script sets up thomas.st.germain22@gmail.com as an admin user

-- First, we need to create/update the user profile with admin role
-- Note: The user must first sign up normally through the app, then we can update their role

-- Update the user profile to make them an admin
-- Replace 'USER_ID_HERE' with the actual UUID from auth.users after the user signs up
UPDATE profiles 
SET preferences = jsonb_set(
  COALESCE(preferences, '{}'::jsonb), 
  '{role}', 
  '"admin"'::jsonb
)
WHERE email = 'thomas.st.germain22@gmail.com';

-- Alternative: If the profile doesn't exist yet, we can prepare an admin check function
-- This function will automatically make thomas.st.germain22@gmail.com an admin when they sign up

CREATE OR REPLACE FUNCTION check_and_set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user is the designated admin
  IF NEW.email = 'thomas.st.germain22@gmail.com' THEN
    -- Set admin role in preferences
    NEW.preferences = jsonb_set(
      COALESCE(NEW.preferences, '{}'::jsonb),
      '{role}',
      '"admin"'::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set admin role for the admin email
DROP TRIGGER IF EXISTS set_admin_role_trigger ON profiles;
CREATE TRIGGER set_admin_role_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_and_set_admin_role();

-- Create a function to get all users (admin only)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  is_active BOOLEAN,
  email_verified BOOLEAN
) AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Return all users
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    p.last_login,
    p.is_active,
    p.email_verified
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
  total_users BIGINT,
  verified_users BIGINT,
  active_users BIGINT,
  recent_signups BIGINT
) AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Return user statistics
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_users,
    COUNT(CASE WHEN email_verified = true THEN 1 END)::BIGINT as verified_users,
    COUNT(CASE WHEN is_active = true THEN 1 END)::BIGINT as active_users,
    COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END)::BIGINT as recent_signups
  FROM profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_statistics() TO authenticated;

-- Instructions:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Have thomas.st.germain22@gmail.com sign up through your app
-- 3. The user will automatically be granted admin privileges
-- 4. They can then access the admin panel and see all users
