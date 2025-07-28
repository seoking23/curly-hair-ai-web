// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react']
  },
  serverExternalPackages: ['@anthropic-ai/sdk'],
  images: {
    domains: ['stgkoqsptdgxjwwapqjm.supabase.co'],
    formats: ['image/avif', 'image/webp']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

export default nextConfig