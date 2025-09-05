// Debug Supabase Connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gpxabmtowcvtjcqhnbwj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjYzMzIsImV4cCI6MjA3MjYwMjMzMn0.2yYOvsrZJNV2FULZ4WHvnQRNxIJ0CzDeQxuMElQWK-o'

console.log('🔍 Debugging Supabase Connection')
console.log('================================')
console.log('')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugConnection() {
  try {
    console.log('1. Testing basic connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Database connection failed:', error.message)
      console.log('   Error code:', error.code)
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log('')
    
    console.log('2. Testing authentication...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Authentication test failed:', authError.message)
    } else {
      console.log('✅ Authentication system ready!')
    }
    console.log('')
    
    console.log('3. Testing sign up...')
    const testEmail = 'test@example.com'
    const testPassword = 'testpassword123'
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })
    
    if (signUpError) {
      console.log('❌ Sign up test failed:', signUpError.message)
      console.log('   Error code:', signUpError.code)
    } else {
      console.log('✅ Sign up test successful!')
      console.log('   User ID:', signUpData.user?.id)
      console.log('   Email confirmed:', signUpData.user?.email_confirmed_at ? 'Yes' : 'No')
    }
    console.log('')
    
    console.log('4. Testing sign in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (signInError) {
      console.log('❌ Sign in test failed:', signInError.message)
      console.log('   Error code:', signInError.code)
    } else {
      console.log('✅ Sign in test successful!')
      console.log('   User ID:', signInData.user?.id)
    }
    console.log('')
    
    console.log('🎉 All tests completed!')
    
  } catch (error) {
    console.log('❌ Debug failed:', error.message)
  }
}

debugConnection()
