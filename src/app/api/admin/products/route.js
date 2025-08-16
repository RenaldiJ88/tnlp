import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase.js'

export const runtime = 'nodejs'

// GET - Obtener todos los productos
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

// POST - Crear nuevo producto
export async function POST(request) {
  try {
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
        { success: false, message: 'Error al crear producto' },
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
      { success: false, message: 'Error al crear producto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto existente
export async function PUT(request) {
  try {
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
        { success: false, message: 'Error al actualizar producto' },
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
      { success: false, message: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'ID de producto requerido' },
        { status: 400 }
      )
    }
    
    // Primero verificar que el producto existe
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from('productos')
      .select('id')
      .eq('id', productId)
      .single()
    
    if (checkError || !existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    // Intentar eliminar el producto
    const { data: deletedProduct, error } = await supabaseAdmin
      .from('productos')
      .delete()
      .eq('id', productId)
      .select()
    
    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar producto' },
        { status: 500 }
      )
    }
    
    // Verificar que realmente se eliminó
    if (!deletedProduct || deletedProduct.length === 0) {
      console.error('Producto no se eliminó de la base de datos')
      return NextResponse.json(
        { success: false, message: 'No se pudo eliminar el producto' },
        { status: 500 }
      )
    }
    
    console.log('Producto eliminado exitosamente:', deletedProduct[0])
    
    return NextResponse.json({ 
      success: true, 
      message: 'Producto eliminado exitosamente',
      deletedProduct: deletedProduct[0]
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}