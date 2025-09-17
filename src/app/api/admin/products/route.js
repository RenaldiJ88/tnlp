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

console.log('✅ Variables de entorno verificadas:', {
  supabaseUrl: requiredEnvVars.supabaseUrl ? 'Definida' : 'Faltante',
  serviceRoleKey: requiredEnvVars.serviceRoleKey ? 'Definida' : 'Faltante'
})

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

// GET - Obtener todos los productos (público, no requiere admin)
export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('productos')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json([], { status: 500 })
    }
    
    return NextResponse.json(products || [])
  } catch (error) {
    console.error('Error reading products:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nuevo producto (requiere admin)
export async function POST(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ POST /products - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ POST /products - Usuario autorizado:', authError)
    
    const newProduct = await request.json()
    
    // Preparar datos para inserción
    const isInStock = newProduct.en_stock !== false
    const isOffer = (newProduct.isOffer === true || newProduct.isOffer === 'true' || newProduct.isOffer === 1) && isInStock
    
    const productData = {
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price, // Mantener como string para preservar formato
      image: newProduct.image,
      categoria: newProduct.categoria,
      is_offer: isOffer ? 1 : 0, // Solo puede estar en oferta si tiene stock
      en_stock: isInStock // Si no se especifica, asumir que está en stock
    }
    
    const { data, error } = await supabaseAdmin
      .from('productos')
      .insert([productData])
      .select()
    
    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { success: false, message: 'Error al crear producto', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Producto creado exitosamente',
      product: data[0] 
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear producto', error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto existente (requiere admin)
export async function PUT(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ PUT /products - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ PUT /products - Usuario autorizado')
    
    const updatedProduct = await request.json()
    
    if (!updatedProduct.id) {
      return NextResponse.json(
        { success: false, message: 'ID de producto requerido' },
        { status: 400 }
      )
    }
    
    // Preparar datos para actualización - solo incluir campos que se envían
    const productData = {}
    
    // Solo actualizar campos que se envían en la request
    if (updatedProduct.title !== undefined) productData.title = updatedProduct.title
    if (updatedProduct.description !== undefined) productData.description = updatedProduct.description
    if (updatedProduct.price !== undefined) productData.price = updatedProduct.price
    if (updatedProduct.image !== undefined) productData.image = updatedProduct.image
    if (updatedProduct.categoria !== undefined) productData.categoria = updatedProduct.categoria
    
    // Manejar stock y oferta con lógica de negocio
    if (updatedProduct.en_stock !== undefined) {
      productData.en_stock = updatedProduct.en_stock
    }
    if (updatedProduct.isOffer !== undefined) {
      const isInStock = updatedProduct.en_stock !== undefined ? updatedProduct.en_stock : true
      const isOffer = (updatedProduct.isOffer === true || updatedProduct.isOffer === 'true' || updatedProduct.isOffer === 1) && isInStock
      productData.is_offer = isOffer ? 1 : 0
    }
    
    const { data, error } = await supabaseAdmin
      .from('productos')
      .update(productData)
      .eq('id', updatedProduct.id)
      .select()
    
    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar producto', error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Producto actualizado exitosamente',
      product: data[0] 
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar producto', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto (requiere admin)
export async function DELETE(request) {
  try {
    // Validar token de admin
    const { valid, error: authError } = await validateAdminToken(request)
    
    if (!valid) {
      console.log('❌ DELETE /products - No autorizado:', authError)
      return NextResponse.json(
        { success: false, message: 'No autorizado', error: authError },
        { status: 401 }
      )
    }
    
    console.log('✅ DELETE /products - Usuario autorizado')
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'ID de producto requerido' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Intentando eliminar producto ID:', productId)
    
    // Primero verificar que el producto existe
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from('productos')
      .select('id')
      .eq('id', productId)
      .single()
    
    if (checkError || !existingProduct) {
      console.log('❌ Producto no encontrado para eliminar:', productId)
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    console.log('✅ Producto encontrado, procediendo a eliminar')
    
    // Intentar eliminar el producto
    const { data: deletedProduct, error } = await supabaseAdmin
      .from('productos')
      .delete()
      .eq('id', productId)
      .select()
    
    if (error) {
      console.error('❌ Error eliminando producto:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar producto', error: error.message },
        { status: 500 }
      )
    }
    
    // Verificar que realmente se eliminó
    if (!deletedProduct || deletedProduct.length === 0) {
      console.error('❌ Producto no se eliminó de la base de datos')
      return NextResponse.json(
        { success: false, message: 'No se pudo eliminar el producto' },
        { status: 500 }
      )
    }
    
    console.log('✅ Producto eliminado exitosamente:', deletedProduct[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Producto eliminado exitosamente',
      deletedProduct: deletedProduct[0]
    })
  } catch (error) {
    console.error('❌ Error en DELETE /products:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar producto', error: error.message },
      { status: 500 }
    )
  }
}