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
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixMissingProfile() {
  const problemUserId = '5709de20-564c-4f88-871b-7a13317d0bc4'
  const userEmail = 'thomas.st.germain22@gmail.com'

  try {
    console.log('🔍 Checking if profile exists...')
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', problemUserId)
      .single()

    if (!checkError && existingProfile) {
      console.log('✅ Profile already exists!')
      console.log('Profile data:', existingProfile)
      return
    }

    console.log('❌ Profile missing, creating it...')

    // Get user info from auth
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(problemUserId)
    
    if (authError) {
      console.error('❌ Error getting auth user:', authError.message)
      return
    }

    console.log('✅ Found auth user:', authUser.user.email)

    // Create the missing profile
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert([
        {
          id: problemUserId,
          email: userEmail,
          full_name: authUser.user.user_metadata?.full_name || userEmail.split('@')[0],
          is_active: true,
          email_verified: authUser.user.email_confirmed_at ? true : false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating profile:', createError.message)
      return
    }

    console.log('✅ Profile created successfully!')
    console.log('New profile:', newProfile)

    console.log('\n🎉 Profile fix completed!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Fixed Profile Details:')
    console.log(`   User ID: ${problemUserId}`)
    console.log(`   Email: ${userEmail}`)
    console.log(`   Status: Active`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔗 Database saving should now work properly!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the function
fixMissingProfile().then(() => {
  console.log('✨ Script completed')
  process.exit(0)
}).catch((error) => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})
