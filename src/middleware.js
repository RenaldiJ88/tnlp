import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Solo aplicar middleware a rutas admin (excepto login y páginas de debug)
  if (pathname.startsWith('/admin') && 
      pathname !== '/admin/login' &&
      !pathname.startsWith('/admin/debug-') &&
      !pathname.startsWith('/admin/check-') &&
      !pathname.startsWith('/admin/test-')) {
    
    // Buscar token de Supabase en las cookies
    // Supabase usa cookies con diferentes formatos posibles
    let supabaseToken = null
    
    // Intentar diferentes formatos de cookies de Supabase
    const cookies = request.cookies
    for (const cookie of cookies.getAll()) {
      if (cookie.name.includes('auth-token') && cookie.name.startsWith('sb-')) {
        supabaseToken = cookie.value
        console.log('🔍 Middleware: Encontré cookie de Supabase:', cookie.name)
        break
      }
    }

    if (!supabaseToken) {
      console.log('🔒 Middleware: No hay token de Supabase, redirigiendo a login')
      console.log('🔍 Cookies disponibles:', cookies.getAll().map(c => c.name))
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Parsear el token de Supabase (es un JSON)
      const tokenData = JSON.parse(supabaseToken)
      
      if (!tokenData.access_token || !tokenData.user) {
        console.log('🔒 Middleware: Token de Supabase inválido, redirigiendo a login')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Verificar si el token no ha expirado
      const expiresAt = tokenData.expires_at
      const now = Math.floor(Date.now() / 1000)
      
      if (expiresAt && now > expiresAt) {
        console.log('🔒 Middleware: Token expirado, redirigiendo a login')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      console.log('✅ Middleware: Usuario autorizado:', tokenData.user.email)
      return NextResponse.next()

    } catch (error) {
      console.log('🔒 Middleware: Error parseando token, redirigiendo a login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Para todas las demás rutas, continuar sin verificación
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware SOLO a páginas admin por ahora:
     * - /admin/* (páginas admin)
     * Excluir:
     * - /admin/login
     * - /api/admin/* (APIs admin) - TEMPORALMENTE DESHABILITADO
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/admin/:path*'
    // '/api/admin/:path*'  // COMENTADO TEMPORALMENTE
  ]
}