-- Enhanced Supabase Schema with SOC2 Compliance
-- Estate Planning Agent - Complete Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types
CREATE TYPE document_type AS ENUM ('will', 'trust', 'poa', 'ahcd');
CREATE TYPE document_status AS ENUM ('draft', 'in_progress', 'completed', 'archived');
CREATE TYPE audit_action AS ENUM (
  'login', 'logout', 'document_created', 'document_updated', 'document_deleted', 
  'document_accessed', 'ai_request_initiated', 'ai_response_received', 
  'ai_request_failed', 'profile_updated', 'password_changed', 'failed_login',
  'profile_created', 'email_verified', 'password_reset_requested'
);

-- Organizations/Tenants table for multi-tenancy
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  -- SOC2 compliance fields
  data_retention_policy_days INTEGER DEFAULT 2555, -- 7 years
  audit_log_retention_days INTEGER DEFAULT 2555
);

-- Enhanced profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}'::jsonb,
  -- SOC2 compliance fields
  data_retention_until TIMESTAMP WITH TIME ZONE,
  consent_given_at TIMESTAMP WITH TIME ZONE,
  privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,
  -- Security fields
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estate planning documents with encryption
CREATE TABLE estate_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  title TEXT NOT NULL,
  -- Encrypted content
  content_encrypted TEXT NOT NULL,
  content_hash TEXT NOT NULL, -- For integrity verification
  status document_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  is_template BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  -- Access control
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'shared', 'public')),
  shared_with UUID[] DEFAULT '{}',
  -- Audit trail
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  -- Data retention
  delete_after TIMESTAMP WITH TIME ZONE
);

-- Comprehensive audit logging
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  action audit_action NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Data classification for compliance
  data_classification TEXT DEFAULT 'internal' CHECK (data_classification IN ('public', 'internal', 'confidential', 'restricted')),
  -- Retention
  delete_after TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 years')
);

-- AI processing logs for transparency
CREATE TABLE ai_processing_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  request_id TEXT UNIQUE NOT NULL,
  anonymization_applied BOOLEAN DEFAULT true,
  ai_provider TEXT NOT NULL,
  model_used TEXT,
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Compliance tracking
  data_anonymized_at TIMESTAMP WITH TIME ZONE,
  data_deleted_at TIMESTAMP WITH TIME ZONE,
  -- Retention
  delete_after TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 years')
);

-- Data retention policies
CREATE TABLE data_retention_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  retention_period_days INTEGER NOT NULL,
  auto_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email list for marketing (separate from user data)
CREATE TABLE email_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',
  subscribed BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[],
  notes TEXT,
  -- Compliance
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  gdpr_compliant BOOLEAN DEFAULT false
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE estate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Profiles RLS - Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Estate documents RLS with organization isolation
CREATE POLICY "Users can view own documents" ON estate_documents
  FOR SELECT USING (
    auth.uid() = user_id 
    AND (organization_id IS NULL OR organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ))
  );

CREATE POLICY "Users can create own documents" ON estate_documents
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND (organization_id IS NULL OR organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ))
  );

CREATE POLICY "Users can update own documents" ON estate_documents
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND (organization_id IS NULL OR organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ))
  );

CREATE POLICY "Users can delete own documents" ON estate_documents
  FOR DELETE USING (
    auth.uid() = user_id 
    AND (organization_id IS NULL OR organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    ))
  );

-- Audit logs RLS - Users can view their own logs, admins can view org logs
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (
    auth.uid() = user_id 
    OR auth.uid() IN (
      SELECT id FROM profiles 
      WHERE organization_id = (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      ) 
      AND (preferences->>'role')::text = 'admin'
    )
  );

-- AI processing logs RLS
CREATE POLICY "Users can view own AI logs" ON ai_processing_logs
  FOR SELECT USING (
    auth.uid() = user_id 
    OR auth.uid() IN (
      SELECT id FROM profiles 
      WHERE organization_id = (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      ) 
      AND (preferences->>'role')::text = 'admin'
    )
  );

-- Organizations RLS
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (
    id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Functions for encryption/decryption
CREATE OR REPLACE FUNCTION encrypt_document_content(content TEXT, key_id TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_encrypt(content, key_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_document_content(encrypted_content TEXT, key_id TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_content, key_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, consent_given_at, privacy_policy_accepted_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger for automatic audit logging
CREATE OR REPLACE FUNCTION log_document_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, details)
    VALUES (NEW.user_id, NEW.organization_id, 'document_created', 'estate_document', NEW.id, 
            jsonb_build_object('document_type', NEW.document_type, 'title', NEW.title));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, details)
    VALUES (NEW.user_id, NEW.organization_id, 'document_updated', 'estate_document', NEW.id,
            jsonb_build_object('changes', jsonb_build_object('old_version', OLD.version, 'new_version', NEW.version)));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, details)
    VALUES (OLD.user_id, OLD.organization_id, 'document_deleted', 'estate_document', OLD.id,
            jsonb_build_object('document_type', OLD.document_type, 'title', OLD.title));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER estate_documents_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON estate_documents
  FOR EACH ROW EXECUTE FUNCTION log_document_changes();

-- Function for data retention cleanup
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Delete expired audit logs
  DELETE FROM audit_logs WHERE delete_after < NOW();
  
  -- Delete expired AI processing logs
  DELETE FROM ai_processing_logs WHERE delete_after < NOW();
  
  -- Delete expired documents
  DELETE FROM estate_documents WHERE delete_after < NOW();
  
  -- Log cleanup activity
  INSERT INTO audit_logs (action, details)
  VALUES ('data_retention_cleanup', jsonb_build_object('timestamp', NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance
CREATE INDEX idx_estate_documents_user_id ON estate_documents(user_id);
CREATE INDEX idx_estate_documents_organization_id ON estate_documents(organization_id);
CREATE INDEX idx_estate_documents_type_status ON estate_documents(document_type, status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_ai_processing_logs_user_id ON ai_processing_logs(user_id);
CREATE INDEX idx_ai_processing_logs_request_id ON ai_processing_logs(request_id);

-- Insert default organization for individual users
INSERT INTO organizations (name, slug, settings) 
VALUES ('Individual Users', 'individual', '{"type": "individual", "features": ["basic_estate_planning", "ai_assistance"]}');

-- Insert default data retention policies
INSERT INTO data_retention_policies (organization_id, data_type, retention_period_days, auto_delete)
SELECT 
  id,
  unnest(ARRAY['audit_logs', 'ai_processing_logs', 'estate_documents', 'profiles']),
  2555, -- 7 years
  true
FROM organizations WHERE slug = 'individual';

-- Create a function to schedule data cleanup (to be called by cron job)
CREATE OR REPLACE FUNCTION schedule_data_cleanup()
RETURNS void AS $$
BEGIN
  PERFORM cleanup_expired_data();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with SOC2 compliance fields';
COMMENT ON TABLE estate_documents IS 'Encrypted estate planning documents with audit trail';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit logging for SOC2 compliance';
COMMENT ON TABLE ai_processing_logs IS 'AI processing transparency and compliance logs';
COMMENT ON TABLE organizations IS 'Multi-tenant organization support';
COMMENT ON FUNCTION cleanup_expired_data() IS 'Automated data retention cleanup function';
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates profile for new auth users';