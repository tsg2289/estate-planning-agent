// Test script to verify your Supabase keys are working
// Run with: node test-supabase-keys.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Testing Supabase API Keys...\n')

// Check if keys are loaded
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure your .env.local file has:')
  console.error('- VITE_SUPABASE_URL')
  console.error('- VITE_SUPABASE_ANON_KEY')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log(`📡 Supabase URL: ${supabaseUrl}`)
console.log(`🔑 Anon Key: ${supabaseAnonKey.substring(0, 20)}...`)
console.log(`🔐 Service Key: ${supabaseServiceKey.substring(0, 20)}...\n`)

// Test anon key
console.log('🧪 Testing anon key...')
const anonClient = createClient(supabaseUrl, supabaseAnonKey)

try {
  // Test with a table that anon users can access
  const { data, error } = await anonClient.from('email_list').select('count')
  if (error) {
    console.error('❌ Anon key test failed:', error.message)
  } else {
    console.log('✅ Anon key working!')
  }
} catch (err) {
  console.error('❌ Anon key test failed:', err.message)
}

// Test service role key
console.log('🧪 Testing service role key...')
const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

try {
  const { data, error } = await serviceClient.from('profiles').select('count')
  if (error) {
    console.error('❌ Service role key test failed:', error.message)
  } else {
    console.log('✅ Service role key working!')
  }
} catch (err) {
  console.error('❌ Service role key test failed:', err.message)
}

console.log('\n🎉 Key testing complete!')
console.log('If both tests passed, your keys are working correctly.')
console.log('If tests failed, check your .env.local file and Supabase project setup.')
