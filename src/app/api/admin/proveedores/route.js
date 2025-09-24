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

// GET - Obtener todos los proveedores (requiere admin)
export async function GET(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ GET /proveedores - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ GET /proveedores - Usuario autorizado')
    
    const { data: proveedores, error } = await supabaseAdmin
      .from('proveedores')
      .select('*')
      .eq('activo', true)
      .order('numero_proveedor', { ascending: true })
    
    if (error) {
      console.error('Error fetching proveedores:', error)
      return NextResponse.json([], { status: 500 })
    }
    
    return NextResponse.json(proveedores || [])
  } catch (error) {
    console.error('Error reading proveedores:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nuevo proveedor (requiere admin)
export async function POST(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ POST /proveedores - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    const newProveedor = await request.json()
    
    // Preparar datos para inserción
    const proveedorData = {
      numero_proveedor: newProveedor.numero_proveedor,
      nombre: newProveedor.nombre,
      telefono: newProveedor.telefono || null,
      email: newProveedor.email || null,
      direccion: newProveedor.direccion || null
    }
    
    const { data, error } = await supabaseAdmin
      .from('proveedores')
      .insert([proveedorData])
      .select()
    
    if (error) {
      console.error('Error creating proveedor:', error)
      return NextResponse.json(
        { success: false, message: 'Error al crear proveedor', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Proveedor creado exitosamente',
      proveedor: data[0] 
    })
  } catch (error) {
    console.error('Error creating proveedor:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear proveedor', error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar proveedor existente (requiere admin)
export async function PUT(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ PUT /proveedores - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    const updatedProveedor = await request.json()
    
    if (!updatedProveedor.id) {
      return NextResponse.json(
        { success: false, message: 'ID de proveedor requerido' },
        { status: 400 }
      )
    }
    
    // Preparar datos para actualización
    const proveedorData = {
      nombre: updatedProveedor.nombre,
      telefono: updatedProveedor.telefono,
      email: updatedProveedor.email,
      direccion: updatedProveedor.direccion,
      activo: updatedProveedor.activo !== undefined ? updatedProveedor.activo : true
    }
    
    const { data, error } = await supabaseAdmin
      .from('proveedores')
      .update(proveedorData)
      .eq('id', updatedProveedor.id)
      .select()
    
    if (error) {
      console.error('Error updating proveedor:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar proveedor', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Proveedor actualizado exitosamente',
      proveedor: data[0] 
    })
  } catch (error) {
    console.error('Error updating proveedor:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar proveedor', error: error.message },
      { status: 500 }
    )
  }
}
