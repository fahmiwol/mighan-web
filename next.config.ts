import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV !== 'production'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // world-lite is served by nginx alias (/www/wwwroot/mighan.com/world-lite/) in production —
  // the old public/world-lite copy was shadowed + stale and was removed (see public/world-lite/README.md).
  // DEV-ONLY rewrite keeps local dev working (hero iframe, playground, avatar-studio) by proxying
  // to the live canonical. Gated to dev: an unconditional rewrite would self-recurse in prod
  // if the nginx alias were ever removed (request → Next → mighan.com → Next → …).
  async rewrites() {
    if (!isDev) return []
    return [
      { source: '/world-lite/:path*', destination: 'https://mighan.com/world-lite/:path*' },
    ]
  },
}

export default nextConfig
