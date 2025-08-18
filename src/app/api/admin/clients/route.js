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

// GET - Obtener todos los clientes (requiere admin)
export async function GET(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ GET /clients - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ GET /clients - Usuario autorizado')
    
    const { data: clients, error } = await supabaseAdmin
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching clients:', error)
      return NextResponse.json([], { status: 500 })
    }
    
    return NextResponse.json(clients || [])
  } catch (error) {
    console.error('Error reading clients:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nuevo cliente (requiere admin)
export async function POST(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ POST /clients - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ POST /clients - Usuario autorizado')
    
    const newClient = await request.json()
    
    // Preparar datos para inserción
    const clientData = {
      nombre: newClient.nombre,
      telefono: newClient.telefono,
      direccion: newClient.direccion,
      documento: newClient.documento,
      fecha_registro: new Date().toISOString().split('T')[0]
    }
    
    const { data, error } = await supabaseAdmin
      .from('clientes')
      .insert([clientData])
      .select()
    
    if (error) {
      console.error('Error creating client:', error)
      return NextResponse.json(
        { success: false, message: 'Error al crear cliente', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cliente creado exitosamente',
      client: data[0] 
    })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear cliente', error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente existente (requiere admin)
export async function PUT(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ PUT /clients - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ PUT /clients - Usuario autorizado')
    
    const updatedClient = await request.json()
    
    if (!updatedClient.id) {
      return NextResponse.json(
        { success: false, message: 'ID de cliente requerido' },
        { status: 400 }
      )
    }
    
    // Preparar datos para actualización
    const clientData = {
      nombre: updatedClient.nombre,
      telefono: updatedClient.telefono,
      direccion: updatedClient.direccion,
      documento: updatedClient.documento
    }
    
    const { data, error } = await supabaseAdmin
      .from('clientes')
      .update(clientData)
      .eq('id', updatedClient.id)
      .select()
    
    if (error) {
      console.error('Error updating client:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar cliente', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cliente no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cliente actualizado exitosamente',
      client: data[0] 
    })
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar cliente', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente (requiere admin)
export async function DELETE(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ DELETE /clients - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ DELETE /clients - Usuario autorizado')
    
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('id')
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, message: 'ID de cliente requerido' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Intentando eliminar cliente ID:', clientId)
    
    // Primero verificar que el cliente existe
    const { data: existingClient, error: checkError } = await supabaseAdmin
      .from('clientes')
      .select('id')
      .eq('id', clientId)
      .single()
    
    if (checkError || !existingClient) {
      console.log('❌ Cliente no encontrado para eliminar:', clientId)
      return NextResponse.json(
        { success: false, message: 'Cliente no encontrado' },
        { status: 404 }
      )
    }
    
    console.log('✅ Cliente encontrado, procediendo a eliminar')
    
    // Intentar eliminar el cliente
    const { data: deletedClient, error } = await supabaseAdmin
      .from('clientes')
      .delete()
      .eq('id', clientId)
      .select()
    
    if (error) {
      console.error('❌ Error eliminando cliente:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar cliente', error: error.message },
        { status: 500 }
      )
    }
    
    // Verificar que realmente se eliminó
    if (!deletedClient || deletedClient.length === 0) {
      console.error('❌ Cliente no se eliminó de la base de datos')
      return NextResponse.json(
        { success: false, message: 'No se pudo eliminar el cliente' },
        { status: 500 }
      )
    }
    
    console.log('✅ Cliente eliminado exitosamente:', deletedClient[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cliente eliminado exitosamente',
      deletedClient: deletedClient[0]
    })
  } catch (error) {
    console.error('❌ Error en DELETE /clients:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar cliente', error: error.message },
      { status: 500 }
    )
  }
}