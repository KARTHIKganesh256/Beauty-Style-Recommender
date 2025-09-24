/** @type {import('next').NextConfig} */
const repoBase = process.env.NEXT_PUBLIC_BASE_PATH || '/'
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: repoBase !== '/' ? repoBase : undefined,
  assetPrefix: repoBase !== '/' ? repoBase : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
}

module.exports = nextConfig


