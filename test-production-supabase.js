// Test Supabase Connection for Production
import { createClient } from '@supabase/supabase-js'

// Test with your production URL
const supabaseUrl = 'https://gpxabmtowcvtjcqhnbwj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjYzMzIsImV4cCI6MjA3MjYwMjMzMn0.2yYOvsrZJNV2FULZ4WHvnQRNxIJ0CzDeQxuMElQWK-o'

console.log('🧪 Testing Production Supabase Connection')
console.log('=========================================')
console.log('')

if (supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('your_anon_key')) {
  console.log('❌ Please update the script with your actual Supabase credentials!')
  console.log('')
  console.log('1. Replace supabaseUrl with your Project URL')
  console.log('2. Replace supabaseAnonKey with your anon public key')
  console.log('3. Run: node test-production-supabase.js')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log('')
    
    // Test authentication
    console.log('🔍 Testing authentication...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('⚠️  Authentication test failed:', authError.message)
    } else {
      console.log('✅ Authentication system ready!')
    }
    
    console.log('')
    console.log('🎉 Supabase is properly configured for production!')
    console.log('Your application should work correctly now.')
    
    return true
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message)
    return false
  }
}

// Run the test
testConnection()
