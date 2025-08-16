/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica para Next.js 13+
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración de imágenes
  images: {
    domains: ['localhost', 'tunotebooklp.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de headers para CORS (solo si es necesario)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
