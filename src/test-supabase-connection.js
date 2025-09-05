// Test Supabase connection in the browser
import { supabase } from './lib/supabase.js'

console.log('🧪 Testing Supabase connection in browser...')

// Test basic connection
supabase.from('email_list').select('count').then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection failed:', error)
  } else {
    console.log('✅ Supabase connection working!', data)
  }
})

// Test auth
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('❌ Auth check failed:', error)
  } else {
    console.log('✅ Auth system working! Session:', session ? 'Active' : 'None')
  }
})
