import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/student/*', '/admin/*', '/instructor/*', '/api/*', '/checkout/*'],
    },
    sitemap: 'https://academy.jpsmartsolutions.com/sitemap.xml',
  };
}
