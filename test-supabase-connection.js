// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js')
// Load environment variables manually since dotenv isn't installed
const fs = require('fs')
const path = require('path')

// Read .env.local file
try {
  const envPath = path.join(__dirname, '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  })
} catch (err) {
  console.log('❌ Could not read .env.local file:', err.message)
}

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...')
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('❌ Missing required environment variables')
    return
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      if (error.message.includes('relation "profiles" does not exist')) {
        console.log('⚠️  Connection successful, but database schema not set up yet')
        console.log('📝 Next step: Run the database setup SQL in your Supabase dashboard')
        return
      }
      console.log('❌ Connection error:', error.message)
      return
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('✅ Database schema is set up!')
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

testConnection()