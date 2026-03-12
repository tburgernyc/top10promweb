'use cache'

import Link from 'next/link'

export default async function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Layered "404" */}
        <div className="relative select-none">
          <p className="text-[120px] font-black leading-none text-gold/10">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-5xl font-black text-gold tracking-tight">404</p>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-ivory">Page not found</h1>
          <p className="text-platinum text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center font-medium text-sm px-5 py-2.5 rounded-xl text-platinum hover:text-ivory hover:bg-white/5 transition-colors"
          >
            Browse Dresses
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center font-semibold text-sm px-5 py-2.5 rounded-xl bg-gold text-onyx hover:bg-[#c9a227] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
