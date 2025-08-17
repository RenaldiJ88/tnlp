import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Crear cliente Supabase con service_role para operaciones admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
    
    console.log('🔍 Validando usuario:', user.email, 'ID:', user.id)
    
    // Verificar rol en auth.users (raw_app_meta_data)
    const userRole = user.app_metadata?.role || user.raw_app_meta_data?.role
    console.log('🔑 Rol en auth.users:', userRole)
    
    // Verificar rol en tabla user_roles
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
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
    console.error('Error validando token de admin:', error)
    return { valid: false, error: 'Error validando token de admin' }
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
    const productData = {
      title: newProduct.title,
      description: newProduct.description,
      price: parseFloat(newProduct.price) || 0,
      image: newProduct.image,
      categoria: newProduct.categoria,
      is_offer: (newProduct.isOffer === true || newProduct.isOffer === 'true' || newProduct.isOffer === 1) ? 1 : 0
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
    
    // Preparar datos para actualización
    const productData = {
      title: updatedProduct.title,
      description: updatedProduct.description,
      price: parseFloat(updatedProduct.price) || 0,
      image: updatedProduct.image,
      categoria: updatedProduct.categoria,
      is_offer: (updatedProduct.isOffer === true || updatedProduct.isOffer === 'true' || updatedProduct.isOffer === 1) ? 1 : 0
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