import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Top 10 Prom — Digital Showroom',
    short_name: 'Top 10 Prom',
    description: 'Your moment. Your dress. Your night. One dress per school, guaranteed.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    orientation: 'portrait-primary',
    categories: ['shopping', 'lifestyle'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Home — Digital Showroom',
      },
    ],
    shortcuts: [
      { name: 'Browse Dresses', short_name: 'Catalog', url: '/catalog', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Book Appointment', short_name: 'Book', url: '/book', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'My Fitting Room', short_name: 'Fitting Room', url: '/fitting-room', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  }
}
