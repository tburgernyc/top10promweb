import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const title = searchParams.get('title') ?? 'Top 10 Prom'
  const subtitle = searchParams.get('subtitle') ?? 'Your moment. Your dress. Your night.'
  const imageUrl = searchParams.get('image') ?? null

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#050505',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background dress image */}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.35,
            }}
          />
        )}

        {/* Gold frame overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '1px solid rgba(212,175,55,0.5)',
            borderRadius: 16,
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 48,
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#D4AF37', fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
              Top
            </span>
            <span style={{ color: '#F5F5F5', fontSize: 28, fontWeight: 700 }}>10</span>
            <span style={{ color: '#D4AF37', fontSize: 28, fontWeight: 700 }}>Prom</span>
          </div>

          {/* Main text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: '#F5F5F5',
                lineHeight: 1.1,
                maxWidth: 700,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 22,
                color: '#C0C0C0',
                lineHeight: 1.4,
                maxWidth: 580,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 8,
                padding: '6px 14px',
                color: '#D4AF37',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              One dress. One school. One night.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
