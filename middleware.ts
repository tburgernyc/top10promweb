import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_USER_ROUTES = ['/profile', '/fitting-room', '/wishlist']
const PROTECTED_ADMIN_PREFIX = '/admin'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedUser = PROTECTED_USER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const isProtectedAdmin = pathname.startsWith(PROTECTED_ADMIN_PREFIX)

  if (!isProtectedUser && !isProtectedAdmin) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/fitting-room/:path*',
    '/wishlist/:path*',
    '/admin/:path*',
  ],
}
