// Test with Valid Email Format
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gpxabmtowcvtjcqhnbwj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjYzMzIsImV4cCI6MjA3MjYwMjMzMn0.2yYOvsrZJNV2FULZ4WHvnQRNxIJ0CzDeQxuMElQWK-o'

console.log('🔍 Testing with Valid Email Format')
console.log('==================================')
console.log('')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testValidEmail() {
  try {
    console.log('1. Testing sign up with valid email...')
    const testEmail = 'testuser@gmail.com'
    const testPassword = 'TestPassword123!'
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })
    
    if (signUpError) {
      console.log('❌ Sign up failed:', signUpError.message)
      console.log('   Error code:', signUpError.code)
    } else {
      console.log('✅ Sign up successful!')
      console.log('   User ID:', signUpData.user?.id)
      console.log('   Email confirmed:', signUpData.user?.email_confirmed_at ? 'Yes' : 'No')
      console.log('   Email:', signUpData.user?.email)
    }
    console.log('')
    
    console.log('2. Testing sign in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message)
      console.log('   Error code:', signInError.code)
    } else {
      console.log('✅ Sign in successful!')
      console.log('   User ID:', signInData.user?.id)
      console.log('   Email:', signInData.user?.email)
    }
    console.log('')
    
    console.log('🎉 Authentication tests completed!')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

testValidEmail()
