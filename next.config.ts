import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // world-lite is served by nginx alias (/www/wwwroot/mighan.com/world-lite/) in production —
  // the old public/world-lite copy was shadowed + stale and was removed (see public/world-lite/README.md).
  // This rewrite keeps LOCAL DEV working (hero iframe, playground, avatar-studio) by proxying
  // to the live canonical. In production nginx intercepts /world-lite/ first, so this never fires.
  async rewrites() {
    return [
      { source: '/world-lite/:path*', destination: 'https://mighan.com/world-lite/:path*' },
    ]
  },
}

export default nextConfig
