#!/usr/bin/env node

/**
 * Script to manually create a profile for a user after registration
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createProfileForUser(email) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`)
    
    // Get the user from auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error getting users:', usersError.message)
      return
    }
    
    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.error(`❌ User with email ${email} not found in auth.users`)
      return
    }
    
    console.log(`✅ Found user: ${user.id}`)
    
    // Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (existingProfile) {
      console.log('✅ Profile already exists for this user')
      return
    }
    
    // Create the profile
    const { data: profile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.raw_user_meta_data?.full_name || user.email.split('@')[0],
        email_verified: user.email_confirmed_at ? true : false,
        created_at: user.created_at,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Error creating profile:', createError.message)
      return
    }
    
    console.log('✅ Profile created successfully:', profile)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.error('❌ Please provide an email address')
  console.error('Usage: node scripts/create-profile.js <email>')
  process.exit(1)
}

createProfileForUser(email)
