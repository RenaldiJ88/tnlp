import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

// Credenciales de administrador
const ADMIN_CREDENTIALS = {
  username: 'tnlp-admin',
  passwordHash: '$2b$10$4XIOYsGfsGO17iacJUTsx.ffLjmi6UXVVs681is2rP5YejxLB7Idq'
}

async function verifyCredentials(username, password) {
  try {
    if (username !== ADMIN_CREDENTIALS.username) {
      return { success: false, error: 'Credenciales incorrectas' }
    }
    
    const isValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash)
    
    if (!isValid) {
      return { success: false, error: 'Credenciales incorrectas' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error verificando credenciales:', error)
    return { success: false, error: 'Error interno' }
  }
}

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
    
    // Crear token de autenticación
    const simpleToken = `auth_${username}_${Date.now()}`
    

    
    // Crear respuesta con token
    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        username,
        isAdmin: true
      }
    })
    
    // Configurar cookie de autenticación
    const cookieOptions = {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 horas
      path: '/'
    }
    
    response.cookies.set('adminToken', simpleToken, cookieOptions)
    
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
    const token = request.cookies.get('adminToken')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }
    
    // Verificar formato del token
    if (!token.startsWith('auth_')) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      )
    }
    
    // Extraer username del token
    const parts = token.split('_')
    const username = parts[1]
    
    const response = {
      success: true,
      user: {
        username: username,
        isAdmin: true
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}