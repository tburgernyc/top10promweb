import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Top 10 Prom | Digital Showroom',
    template: '%s | Top 10 Prom',
  },
  description:
    'Your moment. Your dress. Your night. Shop prom dresses with our no-duplicate guarantee — one dress per school, guaranteed.',
  keywords: ['prom dress', 'prom gown', 'boutique', 'Atlanta', 'no duplicate prom dress'],
  openGraph: {
    type: 'website',
    siteName: 'Top 10 Prom',
    title: 'Top 10 Prom | Digital Showroom',
    description: 'Your moment. Your dress. Your night.',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
