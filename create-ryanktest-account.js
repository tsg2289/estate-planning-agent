#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

// Try to load environment variables from multiple locations
const envFiles = ['.env.local', 'frontend.env.local', 'env.production']
let envLoaded = false

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile })
    console.log(`📄 Loading environment from: ${envFile}`)
    envLoaded = true
    break
  }
}

if (!envLoaded) {
  console.log('⚠️  No environment file found, using process.env')
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

console.log('🔍 Environment check:')
console.log(`   Supabase URL: ${supabaseUrl ? '✅ Found' : '❌ Missing'}`)
console.log(`   Service Key: ${supabaseServiceKey ? '✅ Found' : '❌ Missing'}`)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment files')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createRyanKTestAccount() {
  const testEmail = 'RyanKTest@test.com'
  const testPassword = '123456'
  const testName = 'Ryan K Test'

  try {
    console.log('🚀 Creating test account for:', testEmail)
    
    // First, check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error checking existing users:', listError.message)
      return
    }
    
    const existingUser = existingUsers.users.find(u => u.email === testEmail)
    
    if (existingUser) {
      console.log('✅ RyanKTest account already exists! You can log in with:')
      console.log(`   Email: ${testEmail}`)
      console.log(`   Password: ${testPassword}`)
      console.log(`   User ID: ${existingUser.id}`)
      return
    }

    // Create user in Supabase Auth with email verification bypassed
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Skip email verification
      user_metadata: {
        full_name: testName
      }
    })

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      return
    }

    console.log('✅ Auth user created successfully!')
    console.log(`   User ID: ${authUser.user.id}`)

    // Create profile in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authUser.user.id,
          email: testEmail,
          full_name: testName,
          is_active: true,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message)
      console.log('⚠️  Auth user was created, but profile creation failed')
      return
    }

    console.log('✅ Profile created successfully!')

    // Test the account by trying to sign in
    console.log('🔐 Testing account login...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (signInError) {
      console.error('❌ Login test failed:', signInError.message)
    } else {
      console.log('✅ Login test successful!')
      
      // Sign out immediately
      await supabase.auth.signOut()
    }

    console.log('\n🎉 RyanKTest account created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Account Details:')
    console.log(`   Email: ${testEmail}`)
    console.log(`   Password: ${testPassword}`)
    console.log(`   Name: ${testName}`)
    console.log(`   User ID: ${authUser.user.id}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔗 You can now log in to your application with these credentials')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the function
createRyanKTestAccount().then(() => {
  console.log('✨ Script completed')
  process.exit(0)
}).catch((error) => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})
