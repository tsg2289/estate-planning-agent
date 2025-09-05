-- Grant Admin Access to thomas.st.germain22@gmail.com
-- Run this AFTER the user has signed up and verified their email

-- First, let's check if the user exists
SELECT id, email, preferences 
FROM profiles 
WHERE email = 'thomas.st.germain22@gmail.com';

-- Grant admin role to the user (run this after confirming the user exists above)
UPDATE profiles 
SET preferences = jsonb_set(
  COALESCE(preferences, '{}'::jsonb), 
  '{role}', 
  '"admin"'::jsonb
)
WHERE email = 'thomas.st.germain22@gmail.com';

-- Verify the admin role was set
SELECT id, email, preferences->>'role' as role, preferences 
FROM profiles 
WHERE email = 'thomas.st.germain22@gmail.com';

-- Test the admin functions (should work after granting admin role)
-- This will only work when logged in as the admin user
-- SELECT * FROM get_user_statistics();
-- SELECT * FROM get_all_users();
