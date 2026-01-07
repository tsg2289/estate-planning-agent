-- Estate Planning Agent - Supabase Database Setup
-- Run this in your Supabase SQL Editor after creating your project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE document_type AS ENUM ('will', 'trust', 'power_of_attorney', 'healthcare_directive', 'other');
CREATE TYPE document_status AS ENUM ('draft', 'in_review', 'completed', 'archived');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'share');

-- Organizations table (for multi-tenancy)
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    consent_given_at TIMESTAMP WITH TIME ZONE,
    privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,
    data_retention_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estate documents table
CREATE TABLE estate_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type document_type NOT NULL,
    status document_status DEFAULT 'draft',
    content_encrypted TEXT, -- Encrypted document content
    content_hash VARCHAR(64), -- For integrity verification
    metadata JSONB DEFAULT '{}',
    version INTEGER DEFAULT 1,
    is_template BOOLEAN DEFAULT false,
    template_id UUID REFERENCES estate_documents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Audit logs table (SOC2 compliance)
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    data_classification VARCHAR(50) DEFAULT 'internal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI processing logs (for anonymization tracking)
CREATE TABLE ai_processing_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    request_id VARCHAR(255) UNIQUE NOT NULL,
    anonymization_map_encrypted TEXT, -- Encrypted mapping for de-anonymization
    ai_provider VARCHAR(50) NOT NULL, -- 'openai', 'anthropic', etc.
    model_used VARCHAR(100),
    tokens_used INTEGER,
    processing_time_ms INTEGER,
    data_classification VARCHAR(50) DEFAULT 'confidential',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data retention policies table
CREATE TABLE data_retention_policies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    data_type VARCHAR(100) NOT NULL,
    retention_days INTEGER NOT NULL,
    auto_delete BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE estate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Estate documents policies
CREATE POLICY "Users can view own documents" ON estate_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON estate_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON estate_documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON estate_documents
    FOR DELETE USING (auth.uid() = user_id);

-- Organization-scoped policies (multi-tenancy)
CREATE POLICY "Organization members can view org documents" ON estate_documents
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Audit logs policies (read-only for users)
CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- AI processing logs policies
CREATE POLICY "Users can view own AI logs" ON ai_processing_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Functions for encryption/decryption (placeholder - implement with your encryption key)
CREATE OR REPLACE FUNCTION encrypt_document_content(content TEXT, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
    -- In production, use proper encryption with your ENCRYPTION_KEY
    -- This is a placeholder - implement actual encryption
    RETURN encode(content::bytea, 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_document_content(encrypted_content TEXT, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
    -- In production, use proper decryption with your ENCRYPTION_KEY
    -- This is a placeholder - implement actual decryption
    RETURN convert_from(decode(encrypted_content, 'base64'), 'UTF8');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for audit logging on document changes
CREATE OR REPLACE FUNCTION log_document_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, details)
        VALUES (NEW.user_id, NEW.organization_id, 'create', 'estate_document', NEW.id, 
                jsonb_build_object('title', NEW.title, 'document_type', NEW.document_type));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, details)
        VALUES (NEW.user_id, NEW.organization_id, 'update', 'estate_document', NEW.id,
                jsonb_build_object('title', NEW.title, 'status', NEW.status));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, details)
        VALUES (OLD.user_id, OLD.organization_id, 'delete', 'estate_document', OLD.id,
                jsonb_build_object('title', OLD.title));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER estate_documents_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON estate_documents
    FOR EACH ROW EXECUTE FUNCTION log_document_changes();

-- Insert default data retention policies
INSERT INTO data_retention_policies (data_type, retention_days, auto_delete) VALUES
    ('audit_logs', 2555, true),  -- 7 years
    ('estate_documents', 2555, false),  -- 7 years, manual delete
    ('ai_processing_logs', 365, true),  -- 1 year
    ('user_sessions', 30, true);  -- 30 days

-- Create indexes for performance
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_estate_documents_user_id ON estate_documents(user_id);
CREATE INDEX idx_estate_documents_organization_id ON estate_documents(organization_id);
CREATE INDEX idx_estate_documents_type_status ON estate_documents(document_type, status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_ai_processing_logs_user_id ON ai_processing_logs(user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON TABLE organizations IS 'Multi-tenant organizations for enterprise customers';
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users with SOC2 compliance fields';
COMMENT ON TABLE estate_documents IS 'Encrypted estate planning documents with version control';
COMMENT ON TABLE audit_logs IS 'SOC2 compliant audit trail for all system activities';
COMMENT ON TABLE ai_processing_logs IS 'Tracking for AI processing with anonymization mapping';
COMMENT ON TABLE data_retention_policies IS 'Configurable data retention policies for compliance';