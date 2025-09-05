// Test Supabase Connection
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🧪 Testing Supabase Connection')
console.log('==============================')
console.log('')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing Supabase credentials!')
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

console.log('✅ Supabase URL:', supabaseUrl)
console.log('✅ Anon Key:', supabaseAnonKey.substring(0, 20) + '...')
console.log('')

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
    console.log('🎉 Supabase is properly configured!')
    console.log('You can now use the full authentication system.')
    
    return true
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message)
    return false
  }
}

// Run the test
testConnection()
