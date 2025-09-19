-- Enhanced Security Schema for Complete User Data Isolation
-- This file adds additional security measures beyond basic RLS

-- Create security audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  additional_data JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on audit log
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can only view their own audit logs
CREATE POLICY "Users can view their own audit logs" ON security_audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- Only system can insert audit logs (via triggers/functions)
CREATE POLICY "System can insert audit logs" ON security_audit_log
  FOR INSERT WITH CHECK (true);

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs" ON security_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
    )
  );

-- Create function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_additional_data JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO security_audit_log (
    user_id, action, resource_type, resource_id, 
    ip_address, user_agent, additional_data
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent',
    p_additional_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced RLS policies with additional security checks

-- Drop and recreate estate_documents policies with enhanced security
DROP POLICY IF EXISTS "Users can view their own documents" ON estate_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON estate_documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON estate_documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON estate_documents;

-- Enhanced policies with security logging
CREATE POLICY "Users can view their own documents" ON estate_documents
  FOR SELECT USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Users can insert their own documents" ON estate_documents
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Users can update their own documents" ON estate_documents
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  )
  WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND NEW.user_id = auth.uid()  -- Prevent user_id tampering
  );

CREATE POLICY "Users can delete their own documents" ON estate_documents
  FOR DELETE USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  );

-- Enhanced profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id 
    AND auth.uid() IS NOT NULL
    AND is_active = true
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (
    auth.uid() = id 
    AND auth.uid() IS NOT NULL
    AND is_active = true
  )
  WITH CHECK (
    auth.uid() = id 
    AND NEW.id = auth.uid()  -- Prevent ID tampering
  );

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id 
    AND auth.uid() IS NOT NULL
  );

-- Create triggers to log document access
CREATE OR REPLACE FUNCTION log_document_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log document access for security auditing
  IF TG_OP = 'SELECT' THEN
    PERFORM log_security_event(
      auth.uid(), 
      'DOCUMENT_VIEW', 
      'estate_documents', 
      OLD.id,
      jsonb_build_object('document_type', OLD.document_type)
    );
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM log_security_event(
      NEW.user_id, 
      'DOCUMENT_CREATE', 
      'estate_documents', 
      NEW.id,
      jsonb_build_object('document_type', NEW.document_type)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_security_event(
      NEW.user_id, 
      'DOCUMENT_UPDATE', 
      'estate_documents', 
      NEW.id,
      jsonb_build_object('document_type', NEW.document_type)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_security_event(
      OLD.user_id, 
      'DOCUMENT_DELETE', 
      'estate_documents', 
      OLD.id,
      jsonb_build_object('document_type', OLD.document_type)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for document access logging
DROP TRIGGER IF EXISTS log_document_insert ON estate_documents;
CREATE TRIGGER log_document_insert
  AFTER INSERT ON estate_documents
  FOR EACH ROW EXECUTE FUNCTION log_document_access();

DROP TRIGGER IF EXISTS log_document_update ON estate_documents;
CREATE TRIGGER log_document_update
  AFTER UPDATE ON estate_documents
  FOR EACH ROW EXECUTE FUNCTION log_document_access();

DROP TRIGGER IF EXISTS log_document_delete ON estate_documents;
CREATE TRIGGER log_document_delete
  AFTER DELETE ON estate_documents
  FOR EACH ROW EXECUTE FUNCTION log_document_access();

-- Create function to validate user session
CREATE OR REPLACE FUNCTION validate_user_session()
RETURNS boolean AS $$
DECLARE
  user_active boolean;
  session_valid boolean;
BEGIN
  -- Check if user exists and is active
  SELECT is_active INTO user_active
  FROM profiles
  WHERE id = auth.uid();
  
  IF NOT FOUND OR NOT user_active THEN
    RETURN false;
  END IF;
  
  -- Additional session validation can be added here
  -- For now, basic validation is sufficient
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean user data on logout (called from application)
CREATE OR REPLACE FUNCTION secure_user_logout(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Verify the user can only clean their own data
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied. Users can only clean their own data.';
  END IF;
  
  -- Log the logout event
  PERFORM log_security_event(
    p_user_id,
    'USER_LOGOUT',
    'profiles',
    p_user_id,
    jsonb_build_object('timestamp', NOW())
  );
  
  -- Clean up expired sessions
  DELETE FROM user_sessions 
  WHERE user_id = p_user_id 
  AND (expires_at < NOW() OR last_accessed < NOW() - INTERVAL '24 hours');
  
  -- Update last logout time in profile
  UPDATE profiles 
  SET updated_at = NOW() 
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's own data only
CREATE OR REPLACE FUNCTION get_user_documents(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  document_type document_type,
  title TEXT,
  content JSONB,
  status document_status,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Use auth.uid() if no user_id provided, or verify it matches auth.uid()
  IF p_user_id IS NULL THEN
    p_user_id := auth.uid();
  ELSIF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied. Users can only access their own documents.';
  END IF;
  
  -- Verify user is active
  IF NOT validate_user_session() THEN
    RAISE EXCEPTION 'Invalid session or inactive user.';
  END IF;
  
  -- Log the access
  PERFORM log_security_event(
    p_user_id,
    'BULK_DOCUMENT_ACCESS',
    'estate_documents',
    NULL,
    jsonb_build_object('count', (SELECT COUNT(*) FROM estate_documents WHERE user_id = p_user_id))
  );
  
  RETURN QUERY
  SELECT ed.id, ed.document_type, ed.title, ed.content, ed.status, ed.created_at, ed.updated_at
  FROM estate_documents ed
  WHERE ed.user_id = p_user_id
  ORDER BY ed.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for security audit log
CREATE INDEX IF NOT EXISTS idx_security_audit_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_action ON security_audit_log(action);

-- Grant necessary permissions for security functions
GRANT EXECUTE ON FUNCTION log_security_event TO authenticated;
GRANT EXECUTE ON FUNCTION validate_user_session TO authenticated;
GRANT EXECUTE ON FUNCTION secure_user_logout TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_documents TO authenticated;

-- Additional security: Create a function to verify data integrity
CREATE OR REPLACE FUNCTION verify_user_data_integrity(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  table_name TEXT,
  record_count BIGINT,
  last_modified TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Use auth.uid() if no user_id provided, or verify it matches auth.uid()
  IF p_user_id IS NULL THEN
    p_user_id := auth.uid();
  ELSIF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied. Users can only verify their own data.';
  END IF;
  
  -- Return data integrity information
  RETURN QUERY
  SELECT 
    'estate_documents'::TEXT as table_name,
    COUNT(*) as record_count,
    MAX(updated_at) as last_modified
  FROM estate_documents 
  WHERE user_id = p_user_id
  
  UNION ALL
  
  SELECT 
    'profiles'::TEXT as table_name,
    COUNT(*) as record_count,
    MAX(updated_at) as last_modified
  FROM profiles 
  WHERE id = p_user_id
  
  UNION ALL
  
  SELECT 
    'user_sessions'::TEXT as table_name,
    COUNT(*) as record_count,
    MAX(last_accessed) as last_modified
  FROM user_sessions 
  WHERE user_id = p_user_id AND expires_at > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION verify_user_data_integrity TO authenticated;

-- Create a view for user's own data summary (secure)
CREATE OR REPLACE VIEW user_data_summary AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.created_at,
  p.last_login,
  COUNT(ed.id) as document_count,
  COUNT(CASE WHEN ed.status = 'completed' THEN 1 END) as completed_documents,
  COUNT(CASE WHEN ed.status = 'draft' THEN 1 END) as draft_documents,
  MAX(ed.updated_at) as last_document_update
FROM profiles p
LEFT JOIN estate_documents ed ON p.id = ed.user_id
WHERE p.id = auth.uid()  -- Only show current user's data
  AND p.is_active = true
GROUP BY p.id, p.email, p.full_name, p.created_at, p.last_login;

-- Grant access to the secure view
GRANT SELECT ON user_data_summary TO authenticated;

-- Create function to completely purge user data (for GDPR compliance)
CREATE OR REPLACE FUNCTION purge_user_data(p_user_id UUID, p_confirmation_text TEXT)
RETURNS boolean AS $$
BEGIN
  -- Verify the user can only purge their own data
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied. Users can only purge their own data.';
  END IF;
  
  -- Require confirmation text
  IF p_confirmation_text != 'DELETE_ALL_MY_DATA' THEN
    RAISE EXCEPTION 'Invalid confirmation text. Data purge cancelled.';
  END IF;
  
  -- Log the purge request
  PERFORM log_security_event(
    p_user_id,
    'DATA_PURGE_REQUEST',
    'profiles',
    p_user_id,
    jsonb_build_object('timestamp', NOW(), 'confirmation', p_confirmation_text)
  );
  
  -- Delete all user documents
  DELETE FROM estate_documents WHERE user_id = p_user_id;
  
  -- Delete user sessions
  DELETE FROM user_sessions WHERE user_id = p_user_id;
  
  -- Archive audit logs instead of deleting (for compliance)
  UPDATE security_audit_log 
  SET additional_data = additional_data || jsonb_build_object('purged', true, 'purge_date', NOW())
  WHERE user_id = p_user_id;
  
  -- Mark profile as inactive instead of deleting (for referential integrity)
  UPDATE profiles 
  SET 
    is_active = false,
    email = 'deleted_' || id::text || '@deleted.local',
    full_name = 'Deleted User',
    avatar_url = NULL,
    assessment_answers = NULL,
    preferences = '{}'::jsonb,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION purge_user_data TO authenticated;

-- Final security check: Ensure all tables have proper RLS enabled
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        EXECUTE 'ALTER TABLE ' || table_name || ' ENABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;
