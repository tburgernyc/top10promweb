'use client'

import { useActionState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { signupAction, type AuthFormState } from '@/lib/actions/auth'
import Link from 'next/link'

const initial: AuthFormState = { status: 'idle', message: '' }

export function SignupForm() {
  const shouldReduce = useReducedMotion()
  const [state, formAction, isPending] = useActionState(signupAction, initial)

  if (state.status === 'success') {
    return (
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="glass-heavy rounded-2xl p-8 text-center space-y-4">
          <div className="text-4xl">✉️</div>
          <h2 className="text-xl font-semibold text-ivory">Check your email</h2>
          <p className="text-sm text-platinum">{state.message}</p>
          <Link href="/login" className="text-gold hover:underline text-sm">
            Back to sign in
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="glass-heavy rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-ivory">Create account</h1>
          <p className="text-sm text-platinum">Join to save your favorites</p>
        </div>

        {state.status === 'error' && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            label="Full name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            error={state.fieldErrors?.full_name}
          />

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
            autoComplete="new-password"
            required
            error={state.fieldErrors?.password}
          />

          <Input
            label="Confirm password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            error={state.fieldErrors?.confirm_password}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-platinum">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
