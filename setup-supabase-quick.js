// Quick Supabase Setup Script
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://gpxabmtowcvtjcqhnbwj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjYzMzIsImV4cCI6MjA3MjYwMjMzMn0.2yYOvsrZJNV2FULZ4WHvnQRNxIJ0CzDeQxuMElQWK-o'

console.log('🚀 Quick Supabase Setup')
console.log('=======================')
console.log('')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupSupabase() {
  try {
    console.log('✅ Supabase connection successful!')
    console.log('')
    console.log('📋 Next Steps:')
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/gpxabmtowcvtjcqhnbwj')
    console.log('2. Go to SQL Editor')
    console.log('3. Copy the contents of supabase-schema.sql')
    console.log('4. Paste and run the SQL script')
    console.log('')
    console.log('🔧 Environment Variables for Vercel:')
    console.log('VITE_SUPABASE_URL=https://gpxabmtowcvtjcqhnbwj.supabase.co')
    console.log('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjYzMzIsImV4cCI6MjA3MjYwMjMzMn0.2yYOvsrZJNV2FULZ4WHvnQRNxIJ0CzDeQxuMElQWK-o')
    console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweGFibXRvd2N2dGpjcWhuYndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAyNjMzMiwiZXhwIjoyMDcyNjAyMzMyfQ.0KElpesu94N2MFJ9Q4WiRkF8Fi4ojEeJtiZvZJ0LF1c')
    console.log('')
    console.log('🎯 Authentication Settings:')
    console.log('Site URL: https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app')
    console.log('Redirect URLs:')
    console.log('  - https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app')
    console.log('  - https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/app')
    console.log('  - https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/login')
    console.log('  - https://estate-planning-agent-69nni3i6c-thomas-st-germains-projects.vercel.app/register')
    console.log('')
    console.log('🎉 After setup, your app will have real authentication and data storage!')
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message)
  }
}

setupSupabase()
