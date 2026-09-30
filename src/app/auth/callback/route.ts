import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/** Exchanges the one-time code from confirmation / recovery emails for a session. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next') ?? '/dashboard'
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, origin))
  }
  return NextResponse.redirect(new URL('/login?error=link', origin))
}
