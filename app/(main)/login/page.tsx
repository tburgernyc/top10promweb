import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | Top 10 Prom',
  description: 'Sign in to your Top 10 Prom member account.',
}

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams

  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* Video background */}
      <video autoPlay muted loop playsInline aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none">
        <source src="/video/splash.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.45) 50%, rgba(5,5,5,0.75) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="text-center mb-8">
          <p className="text-gold font-black text-3xl tracking-[0.2em]">TOP 10 PROM</p>
          <p className="text-platinum/50 text-xs tracking-widest uppercase mt-1">Member Portal</p>
        </div>
        <LoginForm redirectTo={redirect} />
      </div>
    </div>
  )
}
