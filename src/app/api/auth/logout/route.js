import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    // Log de logout
    const token = request.cookies.get('adminToken')?.value
    if (token) {
      const { verifyToken } = require('../../../../lib/auth')
      const verification = verifyToken(token)
      
      if (verification.success) {
        console.log(`Logout para usuario: ${verification.payload.username}`)
      }
    }
    
    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Logout exitoso'
    })
    
    // Eliminar cookie de autenticación
    response.cookies.set('adminToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,              // Expira inmediatamente
      path: '/admin'
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