/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica para producción
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración de imágenes optimizada
  images: {
    domains: ['localhost', 'tunotebooklp.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de headers para APIs
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
  
  // Configuración de rewrites para APIs
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: '/api/admin/:path*',
      },
    ]
  },
  
  // Configuración de webpack optimizada
  webpack: (config, { isServer, dev }) => {
    // Optimizaciones para producción
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },
  
  // Configuración de experimental (solo para Next.js 14+)
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Configuración de output
  output: 'standalone',
  
  // Configuración de trailing slash
  trailingSlash: false,
}

export default nextConfig
