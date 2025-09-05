-- Fix email_list RLS policy to allow anon users to read
DROP POLICY IF EXISTS "Anyone can add emails to list" ON email_list;
DROP POLICY IF EXISTS "Users can view their own email subscription" ON email_list;
DROP POLICY IF EXISTS "Users can update their own email subscription" ON email_list;
DROP POLICY IF EXISTS "Admins can view all email subscriptions" ON email_list;

-- Allow anyone to add emails to the list
CREATE POLICY "Anyone can add emails to list" ON email_list
  FOR INSERT WITH CHECK (true);

-- Allow anyone to view email list (for public access)
CREATE POLICY "Anyone can view email list" ON email_list
  FOR SELECT USING (true);

-- Users can update their own email subscription
CREATE POLICY "Users can update their own email subscription" ON email_list
  FOR UPDATE USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Admins can view all email subscriptions
CREATE POLICY "Admins can view all email subscriptions" ON email_list
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  );
