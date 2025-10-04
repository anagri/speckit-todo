/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/speckit-todo',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
}

module.exports = nextConfig
