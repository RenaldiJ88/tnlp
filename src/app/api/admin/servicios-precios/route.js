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

// Función para validar token de admin
async function validateAdminToken(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Token no proporcionado' }
    }
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return { valid: false, error: 'Token inválido' }
    }
    
    const userRole = user.app_metadata?.role || user.raw_app_meta_data?.role
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

// GET - Obtener precios de servicios
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const activos = searchParams.get('activos') !== 'false' // Por defecto true
    
    let query = supabaseAdmin
      .from('servicios_precios')
      .select('*')
      .order('categoria')
      .order('subcategoria')
      .order('nombre')
    
    if (categoria) {
      query = query.eq('categoria', categoria)
    }
    
    if (activos) {
      query = query.eq('activo', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching servicios precios:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error reading servicios precios:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nuevo precio de servicio (requiere admin)
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
    
    const newService = await request.json()
    
    if (!newService.servicio_id || !newService.nombre || !newService.categoria) {
      return NextResponse.json(
        { success: false, message: 'servicio_id, nombre y categoria son requeridos' },
        { status: 400 }
      )
    }
    
    const serviceData = {
      servicio_id: newService.servicio_id,
      nombre: newService.nombre,
      categoria: newService.categoria,
      subcategoria: newService.subcategoria || null,
      precio: parseFloat(newService.precio) || 0,
      activo: newService.activo !== false // Por defecto true
    }
    
    const { data, error } = await supabaseAdmin
      .from('servicios_precios')
      .insert([serviceData])
      .select()
    
    if (error) {
      console.error('Error creating servicio precio:', error)
      return NextResponse.json(
        { success: false, message: 'Error al crear precio de servicio', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Precio de servicio creado exitosamente',
      data: data[0] 
    })
  } catch (error) {
    console.error('Error creating servicio precio:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear precio de servicio', error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar precio de servicio existente (requiere admin)
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
    
    const updatedService = await request.json()
    
    if (!updatedService.servicio_id) {
      return NextResponse.json(
        { success: false, message: 'servicio_id es requerido' },
        { status: 400 }
      )
    }
    
    const updateData = {
      nombre: updatedService.nombre,
      categoria: updatedService.categoria,
      subcategoria: updatedService.subcategoria || null,
      precio: parseFloat(updatedService.precio) || 0,
      activo: updatedService.activo !== false
    }
    
    // Filtrar campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    
    const { data, error } = await supabaseAdmin
      .from('servicios_precios')
      .update(updateData)
      .eq('servicio_id', updatedService.servicio_id)
      .select()
    
    if (error) {
      console.error('Error updating servicio precio:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar precio de servicio', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Precio de servicio no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Precio de servicio actualizado exitosamente',
      data: data[0] 
    })
  } catch (error) {
    console.error('Error updating servicio precio:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar precio de servicio', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar precio de servicio (requiere admin)
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
    const servicioId = searchParams.get('servicio_id')
    
    if (!servicioId) {
      return NextResponse.json(
        { success: false, message: 'servicio_id requerido' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabaseAdmin
      .from('servicios_precios')
      .delete()
      .eq('servicio_id', servicioId)
      .select()
    
    if (error) {
      console.error('Error deleting servicio precio:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar precio de servicio', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Precio de servicio no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Precio de servicio eliminado exitosamente',
      data: data[0]
    })
  } catch (error) {
    console.error('Error deleting servicio precio:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar precio de servicio', error: error.message },
      { status: 500 }
    )
  }
}
