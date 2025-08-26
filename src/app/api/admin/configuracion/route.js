import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Verificar variables de entorno
const requiredEnvVars = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars)
  throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`)
}

const supabaseAdmin = createClient(
  requiredEnvVars.supabaseUrl,
  requiredEnvVars.serviceRoleKey
)

// Función para validar token de admin (reutilizada del products/route.js)
async function validateAdminToken(request) {
  try {
    console.log('🔍 Validando token de admin...')
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Token no proporcionado' }
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return { valid: false, error: 'Token inválido' }
    }
    
    // Verificar rol en auth.users
    const userRole = user.app_metadata?.role || user.raw_app_meta_data?.role
    
    // Verificar rol en tabla user_roles
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
    const isAdmin = 
      userRole === 'admin' || 
      userRole === 'super-admin' || 
      roleData?.role === 'admin' || 
      roleData?.role === 'super-admin'
    
    if (!isAdmin) {
      return { valid: false, error: 'Usuario no tiene permisos de administrador' }
    }
    
    return { valid: true, user }
  } catch (error) {
    console.error('❌ Error validando token:', error)
    return { valid: false, error: `Error inesperado: ${error.message}` }
  }
}

// GET - Obtener configuración por sección
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const seccion = searchParams.get('seccion')
    
    let query = supabaseAdmin
      .from('configuracion_sitio')
      .select('*')
    
    if (seccion) {
      query = query.eq('seccion', seccion)
    }
    
    const { data, error } = await query.eq('activo', true)
    
    if (error) {
      console.error('Error fetching configuracion:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Si se pidió una sección específica, devolver solo esa configuración
    if (seccion && data.length > 0) {
      return NextResponse.json(data[0].configuracion)
    }
    
    // Si no, devolver todas las configuraciones organizadas por sección
    const configuraciones = {}
    data.forEach(item => {
      configuraciones[item.seccion] = item.configuracion
    })
    
    return NextResponse.json(configuraciones)
  } catch (error) {
    console.error('Error reading configuracion:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nueva configuración (requiere admin)
export async function POST(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    const { seccion, configuracion } = await request.json()
    
    if (!seccion || !configuracion) {
      return NextResponse.json(
        { success: false, message: 'Sección y configuración son requeridas' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabaseAdmin
      .from('configuracion_sitio')
      .insert([{ seccion, configuracion }])
      .select()
    
    if (error) {
      console.error('Error creating configuracion:', error)
      return NextResponse.json(
        { success: false, message: 'Error al crear configuración', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuración creada exitosamente',
      data: data[0] 
    })
  } catch (error) {
    console.error('Error creating configuracion:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear configuración', error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración existente (requiere admin)
export async function PUT(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    const { seccion, configuracion } = await request.json()
    
    if (!seccion || !configuracion) {
      return NextResponse.json(
        { success: false, message: 'Sección y configuración son requeridas' },
        { status: 400 }
      )
    }
    
    // Upsert: actualizar si existe, crear si no existe
    const { data, error } = await supabaseAdmin
      .from('configuracion_sitio')
      .upsert([{ seccion, configuracion }], { onConflict: 'seccion' })
      .select()
    
    if (error) {
      console.error('Error updating configuracion:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar configuración', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuración actualizada exitosamente',
      data: data[0] 
    })
  } catch (error) {
    console.error('Error updating configuracion:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar configuración', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar configuración (requiere admin)
export async function DELETE(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const seccion = searchParams.get('seccion')
    
    if (!seccion) {
      return NextResponse.json(
        { success: false, message: 'Sección requerida' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabaseAdmin
      .from('configuracion_sitio')
      .delete()
      .eq('seccion', seccion)
      .select()
    
    if (error) {
      console.error('Error deleting configuracion:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar configuración', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Configuración no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuración eliminada exitosamente',
      data: data[0]
    })
  } catch (error) {
    console.error('Error deleting configuracion:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar configuración', error: error.message },
      { status: 500 }
    )
  }
}
