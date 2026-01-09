import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/auth/signin'
  const type = searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Email confirmed successfully!
      // Redirect to login page with success message
      const redirectUrl = new URL('/auth/signin', origin)
      redirectUrl.searchParams.set('confirmed', 'true')
      
      // If this was a signup confirmation, add that context
      if (type === 'signup') {
        redirectUrl.searchParams.set('message', 'email_verified')
      }
      
      return NextResponse.redirect(redirectUrl)
    }
    
    // There was an error exchanging the code
    console.error('Auth callback error:', error)
    const errorUrl = new URL('/auth/signin', origin)
    errorUrl.searchParams.set('error', 'confirmation_failed')
    errorUrl.searchParams.set('error_description', error.message)
    return NextResponse.redirect(errorUrl)
  }

  // No code provided - redirect to signin with error
  const errorUrl = new URL('/auth/signin', origin)
  errorUrl.searchParams.set('error', 'missing_code')
  return NextResponse.redirect(errorUrl)
}
