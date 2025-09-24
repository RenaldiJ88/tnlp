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
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Token no proporcionado' }
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verificar el token con Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return { valid: false, error: 'Token inválido' }
    }
    
    // Verificar rol en auth.users (raw_app_meta_data)
    const userRole = user.app_metadata?.role || user.raw_app_meta_data?.role
    
    // Verificar rol en tabla user_roles
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
    // Verificar si es admin en cualquiera de los dos lugares
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
    return { valid: false, error: `Error inesperado: ${error.message}` }
  }
}

// GET - Obtener todas las ventas con información relacionada (requiere admin)
export async function GET(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ GET /ventas - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ GET /ventas - Usuario autorizado')
    
    // Obtener parámetros de query
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('cliente_id')
    
    let query = supabaseAdmin
      .from('ventas')
      .select(`
        *,
        cliente:clientes(id, nombre, telefono),
        proveedor:proveedores(id, numero_proveedor, nombre),
        metodo_pago:metodos_pago(id, nombre, tipo, moneda)
      `)
      .order('fecha_venta', { ascending: false })
    
    // Si se especifica un cliente, filtrar por él
    if (clienteId) {
      query = query.eq('cliente_id', clienteId)
    }
    
    const { data: ventas, error } = await query
    
    if (error) {
      console.error('Error fetching ventas:', error)
      return NextResponse.json([], { status: 500 })
    }
    
    return NextResponse.json(ventas || [])
  } catch (error) {
    console.error('Error reading ventas:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nueva venta (requiere admin)
export async function POST(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ POST /ventas - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ POST /ventas - Usuario autorizado')
    
    const newVenta = await request.json()
    
    // Validar campos requeridos
    if (!newVenta.cliente_id || !newVenta.proveedor_id || !newVenta.metodo_pago_id) {
      return NextResponse.json(
        { success: false, message: 'Cliente, proveedor y método de pago son requeridos' },
        { status: 400 }
      )
    }
    
    // Preparar datos para inserción
    const ventaData = {
      cliente_id: newVenta.cliente_id,
      proveedor_id: newVenta.proveedor_id,
      metodo_pago_id: newVenta.metodo_pago_id,
      fecha_venta: newVenta.fecha_venta || new Date().toISOString().split('T')[0],
      precio_compra: parseFloat(newVenta.precio_compra || 0),
      precio_venta: parseFloat(newVenta.precio_venta || 0),
      descripcion: newVenta.descripcion || '',
      observaciones: newVenta.observaciones || '',
      estado: newVenta.estado || 'Completada'
    }
    
    const { data, error } = await supabaseAdmin
      .from('ventas')
      .insert([ventaData])
      .select(`
        *,
        cliente:clientes(id, nombre, telefono),
        proveedor:proveedores(id, numero_proveedor, nombre),
        metodo_pago:metodos_pago(id, nombre, tipo, moneda)
      `)
    
    if (error) {
      console.error('Error creating venta:', error.message)
      return NextResponse.json(
        { success: false, message: 'Error al crear venta', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Venta registrada exitosamente',
      venta: data[0] 
    })
  } catch (error) {
    console.error('Error creating venta:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear venta', error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar venta existente (requiere admin)
export async function PUT(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ PUT /ventas - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ PUT /ventas - Usuario autorizado')
    
    const updatedVenta = await request.json()
    
    if (!updatedVenta.id) {
      return NextResponse.json(
        { success: false, message: 'ID de venta requerido' },
        { status: 400 }
      )
    }
    
    // Preparar datos para actualización
    const ventaData = {
      proveedor_id: updatedVenta.proveedor_id,
      metodo_pago_id: updatedVenta.metodo_pago_id,
      fecha_venta: updatedVenta.fecha_venta,
      precio_compra: parseFloat(updatedVenta.precio_compra || 0),
      precio_venta: parseFloat(updatedVenta.precio_venta || 0),
      descripcion: updatedVenta.descripcion || '',
      observaciones: updatedVenta.observaciones || '',
      estado: updatedVenta.estado || 'Completada'
    }
    
    const { data, error } = await supabaseAdmin
      .from('ventas')
      .update(ventaData)
      .eq('id', updatedVenta.id)
      .select(`
        *,
        cliente:clientes(id, nombre, telefono),
        proveedor:proveedores(id, numero_proveedor, nombre),
        metodo_pago:metodos_pago(id, nombre, tipo, moneda)
      `)
    
    if (error) {
      console.error('Error updating venta:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar venta', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Venta no encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Venta actualizada exitosamente',
      venta: data[0] 
    })
  } catch (error) {
    console.error('Error updating venta:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar venta', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar venta (requiere admin)
export async function DELETE(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ DELETE /ventas - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ DELETE /ventas - Usuario autorizado')
    
    const { searchParams } = new URL(request.url)
    const ventaId = searchParams.get('id')
    
    if (!ventaId) {
      return NextResponse.json(
        { success: false, message: 'ID de venta requerido' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Intentando eliminar venta ID:', ventaId)
    
    // Primero verificar que la venta existe
    const { data: existingVenta, error: checkError } = await supabaseAdmin
      .from('ventas')
      .select('id')
      .eq('id', ventaId)
      .single()
    
    if (checkError || !existingVenta) {
      console.log('❌ Venta no encontrada para eliminar:', ventaId)
      return NextResponse.json(
        { success: false, message: 'Venta no encontrada' },
        { status: 404 }
      )
    }
    
    console.log('✅ Venta encontrada, procediendo a eliminar')
    
    // Intentar eliminar la venta
    const { data: deletedVenta, error } = await supabaseAdmin
      .from('ventas')
      .delete()
      .eq('id', ventaId)
      .select()
    
    if (error) {
      console.error('❌ Error eliminando venta:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar venta', error: error.message },
        { status: 500 }
      )
    }
    
    // Verificar que realmente se eliminó
    if (!deletedVenta || deletedVenta.length === 0) {
      console.error('❌ Venta no se eliminó de la base de datos')
      return NextResponse.json(
        { success: false, message: 'No se pudo eliminar la venta' },
        { status: 500 }
      )
    }
    
    console.log('✅ Venta eliminada exitosamente:', deletedVenta[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Venta eliminada exitosamente',
      deletedVenta: deletedVenta[0]
    })
  } catch (error) {
    console.error('❌ Error en DELETE /ventas:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar venta', error: error.message },
      { status: 500 }
    )
  }
}
