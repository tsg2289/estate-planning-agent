#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure you have VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestAccount() {
  const testEmail = 'MatthewTest@test.com'
  const testPassword = '123456'
  const testName = 'Matthew Test'

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
      console.log('✅ Test account already exists! You can log in with:')
      console.log(`   Email: ${testEmail}`)
      console.log(`   Password: ${testPassword}`)
      return
    }

    // Create user in Supabase Auth with email verification bypassed
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // This bypasses email verification!
      user_metadata: {
        full_name: testName
      }
    })
    
    if (authError) {
      console.error('❌ Error creating auth user:', authError.message)
      return
    }
    
    console.log('✅ Created Supabase auth user:', authData.user.id)
    
    // The profile should be created automatically by the database trigger,
    // but let's verify it exists
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second for trigger
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()
    
    if (profileError) {
      console.log('⚠️  Profile not found, creating manually...')
      
      // Create profile manually if trigger didn't work
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: testEmail,
          full_name: testName,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (createProfileError) {
        console.error('❌ Error creating profile:', createProfileError.message)
        return
      }
      
      console.log('✅ Created profile manually')
    } else {
      console.log('✅ Profile exists:', profile.full_name)
    }
    
    console.log('\n🎉 Test account created successfully!')
    console.log('📝 Login credentials:')
    console.log(`   Email: ${testEmail}`)
    console.log(`   Password: ${testPassword}`)
    console.log('\n✨ This account bypasses email verification and can be used immediately for testing!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Also add to local authentication system for fallback
export function addTestAccountToLocal() {
  // This function can be imported and used by the local auth system
  const testUser = {
    id: 'test-matthew-1',
    email: 'MatthewTest@test.com',
    name: 'Matthew Test',
    password: '$2a$12$LQv3c1yqBwlVHpPjrU3HSONhI1WdQzuUjChgBTz3YjVMIxfHurIrW', // bcrypt hash of '123456'
    createdAt: new Date().toISOString(),
    failedLoginAttempts: 0,
    accountLocked: false,
    lockoutExpiry: null,
    lastFailedAttempt: null,
    passwordResetToken: null,
    passwordResetExpiry: null
  }
  
  return testUser
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestAccount()
}
