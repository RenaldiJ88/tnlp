import { NextResponse } from 'next/server'
const { verifyCredentials, createToken } = require('../../../../lib/auth')

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { username, password } = await request.json()
    
    // Validar que se proporcionen credenciales
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }
    
    // Verificar credenciales
    const verification = await verifyCredentials(username, password)
    
    if (!verification.success) {
      // Log de intento de login fallido (para seguridad)
      console.warn(`Login fallido para usuario: ${username} desde IP: ${request.ip || 'unknown'}`)
      
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 401 }
      )
    }
    
    // Por ahora usamos un token simple (sin JWT)
    const simpleToken = `auth_${username}_${Date.now()}`
    
    // Log de login exitoso
    console.log(`✅ Login exitoso para usuario: ${username}`)
    
    // Crear respuesta con token
    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        username,
        isAdmin: true
      }
    })
    
    // Configurar cookie con configuración más permisiva para debugging
    const cookieOptions = {
      httpOnly: false,         // Temporalmente false para debugging
      secure: false,           // False para localhost  
      sameSite: 'lax',         // Menos restrictivo
      maxAge: 24 * 60 * 60,    // 24 horas en segundos
      path: '/'                // Disponible en toda la app
    }
    
    console.log('🍪 Configurando cookie con opciones:', cookieOptions)
    response.cookies.set('adminToken', simpleToken, cookieOptions)
    
    console.log(`🍪 Cookie establecida: ${simpleToken}`)
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Método GET para verificar estado de autenticación
export async function GET(request) {
  try {
    console.log('🔍 GET /api/auth/login - Verificando autenticación...')
    
    const token = request.cookies.get('adminToken')?.value
    console.log('🍪 Token recibido:', token ? `${token.substring(0, 20)}...` : 'NINGUNO')
    
    if (!token) {
      console.log('❌ No hay token')
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }
    
    // Verificar token simple
    if (!token.startsWith('auth_')) {
      console.log('❌ Token no válido, no empieza con auth_')
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      )
    }
    
    // Extraer username del token
    const parts = token.split('_')
    const username = parts[1]
    console.log('👤 Username extraído:', username)
    
    const response = {
      success: true,
      user: {
        username: username,
        isAdmin: true
      }
    }
    
    console.log('✅ Autenticación exitosa:', response)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}