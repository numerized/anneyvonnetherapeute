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
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
      },
    ],
  },
  typescript: {
    // Set this to false if you want production builds to abort if there are type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === 'production',
  },
  eslint: {
    // Set this to false if you want production builds to abort if there are lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === 'production',
  },
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
  // Development-specific configuration
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable cache in development
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig
