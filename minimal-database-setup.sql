-- Minimal Database Setup - Just the essentials
-- This creates a minimal working database without complex RLS

-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS document_templates CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS email_list CASCADE;
DROP TABLE IF EXISTS estate_documents CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS document_status CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;

-- Create custom types
CREATE TYPE document_type AS ENUM ('will', 'trust', 'poa', 'ahcd');
CREATE TYPE document_status AS ENUM ('draft', 'completed', 'archived');

-- Create profiles table (minimal)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create estate_documents table (minimal)
CREATE TABLE estate_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status document_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_list table (minimal)
CREATE TABLE email_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create simple function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test the setup
SELECT 'Minimal database setup complete' as status;
