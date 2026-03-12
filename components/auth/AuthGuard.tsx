'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserRole } from '@/types/index'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback,
}: AuthGuardProps) {
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'authorized' | 'unauthorized'>('loading')

  useEffect(() => {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function check() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setState('unauthorized')
        router.replace(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profile || !roles.includes(profile.role)) {
          setState('unauthorized')
          router.replace('/dashboard')
          return
        }
      }

      setState('authorized')
    }

    check()
  }, [requiredRole, redirectTo, router])

  if (state === 'loading') {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    )
  }

  if (state === 'unauthorized') {
    return fallback ?? null
  }

  return <>{children}</>
}
