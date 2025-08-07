import { NextResponse } from 'next/server'
const { verifyToken } = require('./lib/auth')

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Solo aplicar middleware a rutas admin (excepto login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    
    // Obtener token de la cookie
    const token = request.cookies.get('adminToken')?.value

    if (!token) {
      // No hay token, redirigir a login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verificar token simple
    if (!token.startsWith('auth_')) {
      // Token inválido, redirigir a login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      
      // Limpiar cookie inválida
      response.cookies.set('adminToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/admin'
      })
      
      return response
    }

    // Token válido, continuar
    return NextResponse.next()
  }

  // Para todas las demás rutas, continuar sin verificación
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas admin excepto:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/admin/:path*'
  ]
}