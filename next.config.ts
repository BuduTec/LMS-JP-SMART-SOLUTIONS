import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'wloxgtyqwktyksgqiitu.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflarestream.com',
      },
      {
        protocol: 'https',
        hostname: 'videodelivery.net',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            // Content-Security-Policy: restrict resource origins
            // 'unsafe-inline' is required for Next.js inline scripts/styles
            // frame-src allows Cloudflare Stream iframe embeds
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://embed.cloudflarestream.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https://*.cloudflarestream.com https://videodelivery.net",
              "frame-src 'self' https://*.cloudflarestream.com https://embed.cloudflarestream.com https://js.paystack.co",
              "connect-src 'self' https://*.supabase.co https://api.paystack.co https://*.cloudflarestream.com https://videodelivery.net wss://*.supabase.co",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
      {
        // Allow video manifest files to be fetched cross-origin
        source: '/api/video/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
