import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Verificar variables de entorno críticas
const requiredEnvVars = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Verificar que todas las variables estén definidas
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars)
  throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`)
}

// Crear cliente Supabase con service_role para operaciones admin
const supabaseAdmin = createClient(
  requiredEnvVars.supabaseUrl,
  requiredEnvVars.serviceRoleKey
)

// Función para validar token de Supabase y verificar rol de admin
async function validateAdminToken(request) {
  try {
    console.log('🔍 Iniciando validación de token...')
    
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Auth header:', authHeader ? 'Presente' : 'Ausente')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Token no proporcionado' }
    }
    
    const token = authHeader.replace('Bearer ', '')
    console.log('🔍 Token extraído:', token ? `${token.substring(0, 20)}...` : 'Ausente')
    
    // Verificar el token con Supabase
    console.log('🔍 Verificando token con Supabase...')
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error) {
      console.error('❌ Error verificando token:', error)
      return { valid: false, error: `Error verificando token: ${error.message}` }
    }
    
    if (!user) {
      console.error('❌ No se encontró usuario para el token')
      return { valid: false, error: 'Token inválido - usuario no encontrado' }
    }
    
    console.log('🔍 Usuario encontrado:', user.email, 'ID:', user.id)
    
    // Verificar rol en auth.users (raw_app_meta_data)
    const userRole = user.app_metadata?.role || user.raw_app_meta_data?.role
    console.log('🔑 Rol en auth.users:', userRole)
    
    // Verificar rol en tabla user_roles
    console.log('🔍 Verificando rol en tabla user_roles...')
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
    if (roleError && roleError.code !== 'PGRST116') {
      console.error('❌ Error consultando user_roles:', roleError)
    }
    
    console.log('🔑 Rol en user_roles:', roleData?.role, 'Error:', roleError)
    
    // Verificar si es admin en cualquiera de los dos lugares
    const isAdmin = 
      userRole === 'admin' || 
      userRole === 'super-admin' || 
      roleData?.role === 'admin' || 
      roleData?.role === 'super-admin'
    
    if (!isAdmin) {
      console.log('❌ Usuario no es admin. Roles encontrados:', { userRole, tableRole: roleData?.role })
      return { valid: false, error: 'Usuario no tiene permisos de administrador' }
    }
    
    console.log('✅ Usuario autorizado como admin con roles:', { userRole, tableRole: roleData?.role })
    return { valid: true, user }
  } catch (error) {
    console.error('❌ Error inesperado validando token de admin:', error)
    return { valid: false, error: `Error inesperado: ${error.message}` }
  }
}

// GET - Obtener todas las órdenes de servicio (requiere admin)
export async function GET(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ GET /service-orders - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ GET /service-orders - Usuario autorizado')
    
    const { data: orders, error } = await supabaseAdmin
      .from('ordenes_servicio')
      .select('*')
      .order('date_added', { ascending: false })
    
    if (error) {
      console.error('Error fetching service orders:', error)
      return NextResponse.json([], { status: 500 })
    }
    
    return NextResponse.json(orders || [])
  } catch (error) {
    console.error('Error reading service orders:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nueva orden de servicio (requiere admin)
export async function POST(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ POST /service-orders - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ POST /service-orders - Usuario autorizado')
    
    const orderData = await request.json()
    console.log('📋 Datos recibidos:', JSON.stringify(orderData, null, 2))
    
    // Preparar datos para inserción
    const serviceOrderData = {
      cliente_id: orderData.clienteId,
      servicios_seleccionados: orderData.servicios,
      equipo_tipo: orderData.detalles?.descripcionEquipo || orderData.descripcionEquipo || '',
      problema: orderData.detalles?.problema || orderData.problema || '',
      urgencia: orderData.detalles?.urgencia || orderData.urgencia || 'Media',
      notas: orderData.detalles?.notas || orderData.notas || '',
      total: orderData.total || 0,
      estado: orderData.estado || 'Recibido'
    }
    
    console.log('🔧 Datos preparados para Supabase:', JSON.stringify(serviceOrderData, null, 2))
    
    const { data, error } = await supabaseAdmin
      .from('ordenes_servicio')
      .insert([serviceOrderData])
      .select()
    
    if (error) {
      console.error('❌ Error detallado creando orden de servicio:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        data: serviceOrderData
      })
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error al crear orden de servicio', 
          error: error.message,
          details: error.details,
          hint: error.hint
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Orden de servicio creada exitosamente',
      order: data[0] 
    })
  } catch (error) {
    console.error('Error creating service order:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear orden de servicio', error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar orden de servicio existente (requiere admin)
export async function PUT(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ PUT /service-orders - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ PUT /service-orders - Usuario autorizado')
    
    const updatedOrder = await request.json()
    
    if (!updatedOrder.id) {
      return NextResponse.json(
        { success: false, message: 'ID de orden requerido' },
        { status: 400 }
      )
    }
    
    // Preparar datos para actualización
    const orderData = {
      servicios_seleccionados: updatedOrder.servicios_seleccionados || updatedOrder.servicios,
      equipo_tipo: updatedOrder.equipo_tipo || updatedOrder.descripcion_equipo || '',
      problema: updatedOrder.problema || '',
      urgencia: updatedOrder.urgencia || 'Media',
      notas: updatedOrder.notas || '',
      total: updatedOrder.total || 0,
      estado: updatedOrder.estado || 'Recibido'
    }
    
    const { data, error } = await supabaseAdmin
      .from('ordenes_servicio')
      .update(orderData)
      .eq('id', updatedOrder.id)
      .select()
    
    if (error) {
      console.error('Error updating service order:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar orden de servicio', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Orden de servicio no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Orden de servicio actualizada exitosamente',
      order: data[0] 
    })
  } catch (error) {
    console.error('Error updating service order:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar orden de servicio', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar orden de servicio (requiere admin)
export async function DELETE(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ DELETE /service-orders - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ DELETE /service-orders - Usuario autorizado')
    
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'ID de orden requerido' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Intentando eliminar orden ID:', orderId)
    
    // Primero verificar que la orden existe
    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from('ordenes_servicio')
      .select('id')
      .eq('id', orderId)
      .single()
    
    if (checkError || !existingOrder) {
      console.log('❌ Orden no encontrada para eliminar:', orderId)
      return NextResponse.json(
        { success: false, message: 'Orden no encontrada' },
        { status: 404 }
      )
    }
    
    console.log('✅ Orden encontrada, procediendo a eliminar')
    
    // Intentar eliminar la orden
    const { data: deletedOrder, error } = await supabaseAdmin
      .from('ordenes_servicio')
      .delete()
      .eq('id', orderId)
      .select()
    
    if (error) {
      console.error('❌ Error eliminando orden:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar orden de servicio', error: error.message },
        { status: 500 }
      )
    }
    
    // Verificar que realmente se eliminó
    if (!deletedOrder || deletedOrder.length === 0) {
      console.error('❌ Orden no se eliminó de la base de datos')
      return NextResponse.json(
        { success: false, message: 'No se pudo eliminar la orden' },
        { status: 500 }
      )
    }
    
    console.log('✅ Orden eliminada exitosamente:', deletedOrder[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Orden de servicio eliminada exitosamente',
      deletedOrder: deletedOrder[0]
    })
  } catch (error) {
    console.error('❌ Error en DELETE /service-orders:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar orden de servicio', error: error.message },
      { status: 500 }
    )
  }
}