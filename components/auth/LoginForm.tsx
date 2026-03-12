'use client'

import { useActionState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginAction, type AuthFormState } from '@/lib/actions/auth'
import Link from 'next/link'

const initial: AuthFormState = { status: 'idle', message: '' }

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const shouldReduce = useReducedMotion()
  const [state, formAction, isPending] = useActionState(loginAction, initial)

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="glass-heavy rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-ivory">Welcome back</h1>
          <p className="text-sm text-platinum">Sign in to your account</p>
        </div>

        {state.status === 'error' && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {redirectTo && (
            <input type="hidden" name="redirect" value={redirectTo} />
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            error={state.fieldErrors?.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            error={state.fieldErrors?.password}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-platinum">
          No account?{' '}
          <Link href="/signup" className="text-gold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
