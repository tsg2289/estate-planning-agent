-- Migration: Add Terms of Service Acceptance Tracking
-- Description: Adds a column to track when users accept the Terms of Service
-- This is separate from privacy_policy_accepted_at as they are distinct legal agreements

-- Add terms_of_service_accepted_at column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS terms_of_service_accepted_at TIMESTAMP WITH TIME ZONE;

-- Create an index for querying users who haven't accepted terms
-- This is useful for identifying users who need to accept updated terms
CREATE INDEX IF NOT EXISTS idx_profiles_terms_acceptance 
ON profiles(terms_of_service_accepted_at) 
WHERE terms_of_service_accepted_at IS NULL;

-- Add a comment to document the column
COMMENT ON COLUMN profiles.terms_of_service_accepted_at IS 
'Timestamp when the user accepted the Terms of Service. NULL indicates terms not yet accepted.';

-- Optional: If you want to require existing users to re-accept terms,
-- you can run this to reset acceptance for all users:
-- UPDATE profiles SET terms_of_service_accepted_at = NULL;

-- Optional: If you want to grandfather in existing users who previously
-- accepted via the general consent, uncomment this:
-- UPDATE profiles 
-- SET terms_of_service_accepted_at = consent_given_at 
-- WHERE consent_given_at IS NOT NULL AND terms_of_service_accepted_at IS NULL;
