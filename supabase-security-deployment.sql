-- Enhanced Security Schema for Complete User Data Isolation
-- Execute this entire script in your Supabase SQL Editor

-- Step 1: Create security audit log table
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

-- Step 2: Enable RLS on audit log
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Step 3: Create audit log policies
DROP POLICY IF EXISTS "Users can view their own audit logs" ON security_audit_log;
CREATE POLICY "Users can view their own audit logs" ON security_audit_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert audit logs" ON security_audit_log;
CREATE POLICY "System can insert audit logs" ON security_audit_log
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all audit logs" ON security_audit_log;
CREATE POLICY "Admins can view all audit logs" ON security_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
    )
  );

-- Step 4: Create security logging function
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
EXCEPTION
  WHEN OTHERS THEN
    -- Silently handle errors to prevent breaking main operations
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Enhanced RLS policies for estate_documents
DROP POLICY IF EXISTS "Users can view their own documents" ON estate_documents;
CREATE POLICY "Users can view their own documents" ON estate_documents
  FOR SELECT USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  );

DROP POLICY IF EXISTS "Users can insert their own documents" ON estate_documents;
CREATE POLICY "Users can insert their own documents" ON estate_documents
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  );

DROP POLICY IF EXISTS "Users can update their own documents" ON estate_documents;
CREATE POLICY "Users can update their own documents" ON estate_documents
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  )
  WITH CHECK (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND NEW.user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can delete their own documents" ON estate_documents;
CREATE POLICY "Users can delete their own documents" ON estate_documents
  FOR DELETE USING (
    auth.uid() = user_id 
    AND auth.uid() IS NOT NULL
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true)
  );

-- Step 6: Enhanced RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id 
    AND auth.uid() IS NOT NULL
    AND is_active = true
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (
    auth.uid() = id 
    AND auth.uid() IS NOT NULL
    AND is_active = true
  )
  WITH CHECK (
    auth.uid() = id 
    AND NEW.id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id 
    AND auth.uid() IS NOT NULL
  );

-- Step 7: Create security utility functions
CREATE OR REPLACE FUNCTION validate_user_session()
RETURNS boolean AS $$
DECLARE
  user_active boolean;
BEGIN
  SELECT is_active INTO user_active
  FROM profiles
  WHERE id = auth.uid();
  
  IF NOT FOUND OR NOT user_active THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  IF p_user_id IS NULL THEN
    p_user_id := auth.uid();
  ELSIF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied. Users can only access their own documents.';
  END IF;
  
  IF NOT validate_user_session() THEN
    RAISE EXCEPTION 'Invalid session or inactive user.';
  END IF;
  
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

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_action ON security_audit_log(action);

-- Step 9: Grant permissions
GRANT EXECUTE ON FUNCTION log_security_event TO authenticated;
GRANT EXECUTE ON FUNCTION validate_user_session TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_documents TO authenticated;

-- Step 10: Create user data summary view
DROP VIEW IF EXISTS user_data_summary;
CREATE VIEW user_data_summary AS
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
WHERE p.id = auth.uid()
  AND p.is_active = true
GROUP BY p.id, p.email, p.full_name, p.created_at, p.last_login;

GRANT SELECT ON user_data_summary TO authenticated;

-- Deployment complete message
DO $$
BEGIN
  RAISE NOTICE '🎉 Enhanced Security Schema Deployed Successfully!';
  RAISE NOTICE '✅ Security audit logging enabled';
  RAISE NOTICE '✅ Enhanced RLS policies applied';
  RAISE NOTICE '✅ User data isolation functions created';
  RAISE NOTICE '✅ Performance indexes added';
  RAISE NOTICE '🔒 Your database now has enterprise-level user data security!';
END $$;
