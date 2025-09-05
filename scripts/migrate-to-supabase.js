#!/usr/bin/env node

/**
 * Migration script to move data from SQLite to Supabase
 * Run this after setting up your Supabase project and schema
 */

import { createClient } from '@supabase/supabase-js'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// SQLite database path
const dbPath = join(__dirname, '../data/users.db')

async function migrateData() {
  console.log('🚀 Starting migration from SQLite to Supabase...')
  
  try {
    // Open SQLite database
    const db = new sqlite3.Database(dbPath)
    
    // Get all users from SQLite
    const users = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM users WHERE is_active = 1', (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
    
    console.log(`📊 Found ${users.length} users to migrate`)
    
    // Migrate users to Supabase
    for (const user of users) {
      try {
        console.log(`👤 Migrating user: ${user.email}`)
        
        // Create user in Supabase Auth (this will trigger the profile creation)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: 'TempPassword123!', // User will need to reset password
          email_confirm: true,
          user_metadata: {
            full_name: user.name
          }
        })
        
        if (authError) {
          console.error(`❌ Error creating auth user for ${user.email}:`, authError.message)
          continue
        }
        
        // Update the profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            email_verified: user.email_verified === 1,
            last_login: user.last_login,
            assessment_answers: user.assessment_answers ? JSON.parse(user.assessment_answers) : null,
            created_at: user.created_at,
            updated_at: user.updated_at
          })
          .eq('id', authData.user.id)
        
        if (profileError) {
          console.error(`❌ Error updating profile for ${user.email}:`, profileError.message)
        } else {
          console.log(`✅ Successfully migrated user: ${user.email}`)
        }
        
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error.message)
      }
    }
    
    // Get email list from SQLite
    const emailList = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM email_list', (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
    
    console.log(`📧 Found ${emailList.length} email list entries to migrate`)
    
    // Migrate email list
    for (const entry of emailList) {
      try {
        const { error } = await supabase
          .from('email_list')
          .insert({
            email: entry.email,
            name: entry.name,
            source: entry.source || 'migration',
            subscribed: entry.subscribed === 1,
            subscribed_at: entry.subscribed_at,
            unsubscribed_at: entry.unsubscribed_at,
            created_at: entry.created_at,
            updated_at: entry.updated_at,
            tags: entry.tags ? entry.tags.split(',') : null,
            notes: entry.notes
          })
        
        if (error) {
          console.error(`❌ Error migrating email list entry ${entry.email}:`, error.message)
        } else {
          console.log(`✅ Successfully migrated email list entry: ${entry.email}`)
        }
        
      } catch (error) {
        console.error(`❌ Error migrating email list entry ${entry.email}:`, error.message)
      }
    }
    
    // Close SQLite database
    db.close()
    
    console.log('🎉 Migration completed!')
    console.log('📝 Next steps:')
    console.log('1. Users will need to reset their passwords using the "Forgot Password" feature')
    console.log('2. Test the authentication flow in your application')
    console.log('3. Verify that all data is accessible through the new Supabase setup')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateData()
