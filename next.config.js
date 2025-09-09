/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.igdb.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        pathname: '/igdb/image/upload/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['zod'],
  },
}

module.exports = nextConfig
