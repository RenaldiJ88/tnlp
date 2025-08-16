/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Vercel
  experimental: {
    // Habilitar App Router completamente
    appDir: true,
  },
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  
  // Configuración de funciones
  functions: {
    // Asegurar que las funciones se generen
    includeFiles: ['src/app/api/**/*'],
  },
  
  // Configuración de build
  output: 'standalone',
  
  // Configuración de trailing slash
  trailingSlash: false,
  
  // Configuración de rewrites si es necesario
  async rewrites() {
    return [];
  },
};

export default nextConfig;
