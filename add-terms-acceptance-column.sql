-- =====================================================
-- Add Terms of Service Acceptance Column to Profiles
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to add the 
-- terms_of_service_accepted_at column to the profiles table.
--
-- This is required for the Terms Acknowledgment feature.
-- =====================================================

-- Add the column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS terms_of_service_accepted_at TIMESTAMP WITH TIME ZONE;

-- Create an index for querying users who haven't accepted terms
-- (Useful for identifying users who need to accept updated terms)
CREATE INDEX IF NOT EXISTS idx_profiles_terms_acceptance 
ON profiles(terms_of_service_accepted_at) 
WHERE terms_of_service_accepted_at IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN profiles.terms_of_service_accepted_at IS 
'Timestamp when the user accepted the Terms of Service. NULL indicates terms not yet accepted.';

-- =====================================================
-- OPTIONAL: Choose one of the following options
-- =====================================================

-- OPTION A: Require ALL existing users to re-accept terms
-- Uncomment the line below if you want existing users to see the modal:
-- UPDATE profiles SET terms_of_service_accepted_at = NULL, privacy_policy_accepted_at = NULL;

-- OPTION B: Grandfather in existing users who previously gave consent
-- Uncomment the lines below if you want to auto-accept for existing users:
-- UPDATE profiles 
-- SET terms_of_service_accepted_at = COALESCE(consent_given_at, created_at),
--     privacy_policy_accepted_at = COALESCE(consent_given_at, created_at)
-- WHERE consent_given_at IS NOT NULL 
--   AND terms_of_service_accepted_at IS NULL;

-- =====================================================
-- Verify the changes
-- =====================================================
-- Run this to confirm the column was added:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' 
-- AND column_name = 'terms_of_service_accepted_at';
