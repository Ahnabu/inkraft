import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inkraft - Premium Tech Blog Platform',
    short_name: 'Inkraft',
    description: 'Premium blogging platform for high-quality tech content on AI, Programming, Cybersecurity, and Web Development.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
