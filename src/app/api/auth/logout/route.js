import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    // Log de logout
    const token = request.cookies.get('adminToken')?.value
    if (token && token.startsWith('auth_')) {
      const parts = token.split('_')
      const username = parts[1]
      console.log(`Logout para usuario: ${username}`)
    }
    
    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Logout exitoso'
    })
    
    // Eliminar cookie de autenticación
    response.cookies.set('adminToken', '', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 0,              // Expira inmediatamente
      path: '/'
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}