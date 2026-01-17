/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Node.js server deployment (no static export)
  // Removed: output: 'export' - now using SSR/ISR
  // Removed: outputFileTracingRoot - not needed for Node.js deployment

  // Enable image optimization (now supported with Node.js server)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ipshopy.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/cache/**",
      },
      {
        protocol: "http",
        hostname: "blog-backend.ipshopy.com",
        pathname: "/cache/**",
      },
      {
        protocol: "https",
        hostname: "blog-backend.ipshopy.com",
        pathname: "/cache/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Trailing slash configuration
  trailingSlash: false,

  // Security headers (now supported with Node.js server)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: http://localhost:* http://blog-backend.ipshopy.com:* https://blog-backend.ipshopy.com:*; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.ipshopy.com http://localhost:* https://blog-api.ipshopy.com:* https://blog-api.ipshopy.com:*; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;


