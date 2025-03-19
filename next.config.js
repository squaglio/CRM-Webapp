/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable TypeScript type checking in production builds
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 