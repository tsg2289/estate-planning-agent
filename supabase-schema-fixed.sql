-- Estate Planning Agent - Supabase Database Schema with Row Level Security
-- This file contains the complete database schema with RLS policies for secure data access

-- Create custom types
CREATE TYPE document_type AS ENUM ('will', 'trust', 'poa', 'ahcd');
CREATE TYPE document_status AS ENUM ('draft', 'completed', 'archived');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  assessment_answers JSONB,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Estate planning documents table
CREATE TABLE estate_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status document_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  is_template BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Email list table for marketing/communications
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
  last_contacted TIMESTAMP WITH TIME ZONE
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[],
  featured_image_url TEXT,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0
);

-- Document templates table
CREATE TABLE document_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type document_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- User sessions table (for additional session tracking)
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_active ON profiles(is_active) WHERE is_active = true;
CREATE INDEX idx_estate_documents_user_id ON estate_documents(user_id);
CREATE INDEX idx_estate_documents_type ON estate_documents(document_type);
CREATE INDEX idx_estate_documents_status ON estate_documents(status);
CREATE INDEX idx_email_list_subscribed ON email_list(subscribed) WHERE subscribed = true;
CREATE INDEX idx_blog_posts_published ON blog_posts(published) WHERE published = true;
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estate_documents_updated_at BEFORE UPDATE ON estate_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_list_updated_at BEFORE UPDATE ON email_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE estate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin users can view all profiles (you'll need to implement admin role checking)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
    )
  );

-- RLS Policies for estate_documents table
CREATE POLICY "Users can view their own documents" ON estate_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON estate_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON estate_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON estate_documents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_list table
-- Anyone can add emails to the list (for public signup)
CREATE POLICY "Anyone can add emails to list" ON email_list
  FOR INSERT WITH CHECK (true);

-- Users can view their own email subscription
CREATE POLICY "Users can view their own email subscription" ON email_list
  FOR SELECT USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Users can update their own email subscription
CREATE POLICY "Users can update their own email subscription" ON email_list
  FOR UPDATE USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Admins can view all email subscriptions
CREATE POLICY "Admins can view all email subscriptions" ON email_list
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
    )
  );

-- RLS Policies for blog_posts table
-- Anyone can view published blog posts
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Authors can view their own blog posts (published or not)
CREATE POLICY "Authors can view their own blog posts" ON blog_posts
  FOR SELECT USING (auth.uid() = author_id);

-- Authors can insert their own blog posts
CREATE POLICY "Authors can insert their own blog posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authors can update their own blog posts
CREATE POLICY "Authors can update their own blog posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Authors can delete their own blog posts
CREATE POLICY "Authors can delete their own blog posts" ON blog_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Admins can view all blog posts
CREATE POLICY "Admins can view all blog posts" ON blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
    )
  );

-- RLS Policies for document_templates table
-- Anyone can view active templates
CREATE POLICY "Anyone can view active templates" ON document_templates
  FOR SELECT USING (is_active = true);

-- Admins can manage all templates
CREATE POLICY "Admins can manage templates" ON document_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
    )
  );

-- RLS Policies for user_sessions table
-- Users can view their own sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update user profile when auth.users is updated
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    email = NEW.email,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_update();

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user statistics (admin only)
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
  total_users BIGINT,
  active_users BIGINT,
  total_documents BIGINT,
  total_email_subscribers BIGINT
) AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND (preferences->>'role' = 'admin' OR preferences->>'role' = 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles),
    (SELECT COUNT(*) FROM profiles WHERE is_active = true),
    (SELECT COUNT(*) FROM estate_documents),
    (SELECT COUNT(*) FROM email_list WHERE subscribed = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Insert some sample data (optional)
INSERT INTO document_templates (document_type, name, description, content, created_by) VALUES
('will', 'Basic Will Template', 'A simple will template for basic estate planning', 
 '{"sections": ["executor", "beneficiaries", "assets", "guardianship"]}', NULL),
('trust', 'Revocable Living Trust', 'A comprehensive revocable living trust template',
 '{"sections": ["trustee", "beneficiaries", "assets", "distribution"]}', NULL),
('poa', 'Durable Power of Attorney', 'Power of attorney for financial matters',
 '{"sections": ["agent", "powers", "limitations", "successor"]}', NULL),
('ahcd', 'Advance Health Care Directive', 'Health care directive and living will',
 '{"sections": ["healthcare_agent", "treatment_preferences", "end_of_life"]}', NULL);

-- Create a view for user dashboard data
CREATE VIEW user_dashboard AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.created_at,
  p.last_login,
  COUNT(ed.id) as document_count,
  COUNT(CASE WHEN ed.status = 'completed' THEN 1 END) as completed_documents
FROM profiles p
LEFT JOIN estate_documents ed ON p.id = ed.user_id
WHERE p.is_active = true
GROUP BY p.id, p.email, p.full_name, p.created_at, p.last_login;

-- Grant access to the view
GRANT SELECT ON user_dashboard TO authenticated;
