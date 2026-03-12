'use cache'

import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Top 10 Prom account to save favorites and manage appointments.',
}

export default async function SignupPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <SignupForm />
    </div>
  )
}
