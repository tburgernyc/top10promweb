'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#050505', color: '#F5F5F5', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ maxWidth: '400px', textAlign: 'center', gap: '1rem', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F5F5F5' }}>Critical error</h1>
            <p style={{ color: '#C0C0C0', fontSize: '0.875rem' }}>
              The application encountered a critical error and cannot continue.
            </p>
            {error.digest && (
              <p style={{ color: '#666', fontSize: '0.75rem', fontFamily: 'monospace' }}>ref: {error.digest}</p>
            )}
            <button
              onClick={reset}
              style={{
                background: '#D4AF37',
                color: '#050505',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.625rem 1.25rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
