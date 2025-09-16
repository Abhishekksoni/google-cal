/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'standalone',
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig