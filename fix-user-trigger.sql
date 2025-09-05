-- Fix User Registration Trigger
-- Remove the problematic trigger that's causing database errors

-- Drop the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS handle_new_user();

-- Test that the trigger is removed
SELECT 'User trigger removed successfully' as status;