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
}

module.exports = nextConfig
