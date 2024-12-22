/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // This will force Vercel to rebuild on every deployment
    CACHE_BUST: new Date().toISOString(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
      },
    ],
  },
  // Force cache invalidation
  generateBuildId: async () => {
    return `build-${new Date().getTime()}`
  },
  // Set revalidate to 0 in development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' 
              ? 'no-store, must-revalidate'
              : 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
