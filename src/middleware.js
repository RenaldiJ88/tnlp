import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // TEMPORALMENTE: Permitir acceso a admin después de login exitoso
  // TODO: Mejorar detección de cookies de Supabase
  if (pathname.startsWith('/admin') && 
      pathname !== '/admin/login' &&
      !pathname.startsWith('/admin/debug-') &&
      false) { // TEMPORALMENTE DESHABILITADO
    
    // Buscar token de Supabase en las cookies
    const cookies = request.cookies
    let supabaseToken = null
    
    // Buscar cookies de Supabase - pueden tener diferentes nombres
    const possibleCookieNames = [
      'sb-wqrugaygrebeqscssvnx-auth-token',
      'supabase-auth-token', 
      'supabase.auth.token',
      'sb-auth-token'
    ]
    
    // También buscar cualquier cookie que contenga información de sesión
    for (const cookie of cookies.getAll()) {
      // Buscar por nombres específicos
      if (possibleCookieNames.includes(cookie.name)) {
        supabaseToken = cookie.value
        console.log('🔍 Middleware: Encontré cookie específica:', cookie.name)
        break
      }
      // Buscar cualquier cookie de Supabase con auth
      if (cookie.name.startsWith('sb-') && cookie.name.includes('auth')) {
        supabaseToken = cookie.value
        console.log('🔍 Middleware: Encontré cookie genérica:', cookie.name)
        break
      }
    }

    // Mostrar todas las cookies para debug
    console.log('🔍 Middleware: Cookies disponibles:', cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })))
    
    if (!supabaseToken) {
      console.log('🔒 Middleware: No encontré token específico de Supabase')
      
      // Buscar cualquier cookie que pueda contener sesión
      let sessionCookie = null
      for (const cookie of cookies.getAll()) {
        if ((cookie.name.includes('session') || cookie.name.includes('token') || cookie.name.includes('auth')) && cookie.value) {
          sessionCookie = cookie
          console.log('🔍 Middleware: Encontré posible cookie de sesión:', cookie.name)
          break
        }
      }
      
      if (!sessionCookie) {
        console.log('🔒 Middleware: No hay ninguna cookie de sesión válida')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      
      supabaseToken = sessionCookie.value
    }

    try {
      // Intentar parsear el token como JSON
      let tokenData
      try {
        tokenData = JSON.parse(supabaseToken)
      } catch (parseError) {
        // Si no es JSON, podría ser un token directo
        console.log('🔍 Middleware: Token no es JSON, asumiendo formato directo')
        if (supabaseToken.length > 20) { // Un token válido debería ser largo
          console.log('✅ Middleware: Aceptando token directo')
          return NextResponse.next()
        } else {
          console.log('🔒 Middleware: Token demasiado corto')
          return NextResponse.redirect(new URL('/admin/login', request.url))
        }
      }
      
      // Si es JSON, verificar estructura
      if (tokenData && (tokenData.access_token || tokenData.user || tokenData.session)) {
        // Verificar expiración si existe
        const expiresAt = tokenData.expires_at
        const now = Math.floor(Date.now() / 1000)
        
        if (expiresAt && now > expiresAt) {
          console.log('🔒 Middleware: Token expirado')
          return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        const userEmail = tokenData.user?.email || tokenData.session?.user?.email || 'usuario'
        console.log('✅ Middleware: Usuario autorizado:', userEmail)
        return NextResponse.next()
      } else {
        console.log('🔒 Middleware: Token JSON inválido')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

    } catch (error) {
      console.log('🔒 Middleware: Error procesando token:', error.message)
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