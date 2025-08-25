import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/login',
        '/register',
        '/_next/',
        '/uploads/'
      ],
    },
    sitemap: 'https://vtu-digital-library.com/sitemap.xml',
  }
}
