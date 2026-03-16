import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Initialize Supabase SSR Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Retrieve the session user. This verifies the JWT securely.
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    // =========================================================================
    // 1. UNAUTHENTICATED PROTECTION
    // =========================================================================
    const consumerProtected = ['/profile', '/fitting-room', '/wishlist', '/dashboard']
    const needsAuth =
        path.startsWith('/saas') ||
        consumerProtected.some((r) => path === r || path.startsWith(`${r}/`))

    if (!user && needsAuth) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(redirectUrl)
    }

    // =========================================================================
    // 2. ROLE-BASED ACCESS CONTROL (RBAC) ENFORCEMENT
    // =========================================================================
    if (user && path.startsWith('/saas')) {
        // These claims were injected by our custom_access_token_hook.
        // No database lookups required here.
        const systemRole = user.app_metadata?.system_role
        const storeRole = user.app_metadata?.store_role

        // TIER 1: Super Admin checking
        if (path.startsWith('/saas/admin') && systemRole !== 'SUPER_ADMIN') {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/unauthorized'
            return NextResponse.redirect(redirectUrl)
        }

        // TIER 2: Store Owner checking
        if (path.startsWith('/saas/owner')) {
            if (systemRole !== 'SUPER_ADMIN' && storeRole !== 'OWNER') {
                const redirectUrl = request.nextUrl.clone()
                redirectUrl.pathname = '/unauthorized'
                return NextResponse.redirect(redirectUrl)
            }
        }

        // TIER 3/4: Store Staff checking
        if (path.startsWith('/saas/staff')) {
            if (systemRole !== 'SUPER_ADMIN' && !['OWNER', 'MANAGER', 'ASSOCIATE'].includes(storeRole)) {
                const redirectUrl = request.nextUrl.clone()
                redirectUrl.pathname = '/unauthorized'
                return NextResponse.redirect(redirectUrl)
            }
        }
    }

    // =========================================================================
    // 3. SMART LOGIN REDIRECTS
    // =========================================================================
    // If an already authenticated user hits the login page, route them to their proper dashboard
    if (user && (path === '/login' || path === '/owner-login')) {
        const redirectUrl = request.nextUrl.clone()
        const systemRole = user.app_metadata?.system_role
        const storeRole = user.app_metadata?.store_role

        if (systemRole === 'SUPER_ADMIN') {
            redirectUrl.pathname = '/saas/admin'
        } else if (storeRole === 'OWNER') {
            redirectUrl.pathname = '/saas/owner'
        } else if (['MANAGER', 'ASSOCIATE'].includes(storeRole)) {
            redirectUrl.pathname = '/saas/staff'
        } else {
            redirectUrl.pathname = '/profile' // Default fallback to customer profile
        }
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        // Apply proxy to everything except static assets and Next.js internals
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
