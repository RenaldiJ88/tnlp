import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PRODUCTS_FILE = path.join(process.cwd(), 'src/data/products-unified.json')

// GET - Obtener todos los productos
export async function GET() {
  try {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    
    // El archivo tiene estructura { "productos": [...] }
    const products = data.productos || []
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error reading products:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nuevo producto
export async function POST(request) {
  try {
    const newProduct = await request.json()
    
    // Leer productos existentes
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    const products = data.productos || []
    
    // Agregar ID único
    const newId = Math.max(...products.map(p => parseInt(p.id) || 0)) + 1
    newProduct.id = newId.toString()
    newProduct.dateAdded = new Date().toISOString()
    
    // Agregar al array
    products.push(newProduct)
    
    // Actualizar estructura completa
    data.productos = products
    
    // Escribir de vuelta al archivo
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Producto creado exitosamente',
      product: newProduct 
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
    
    // Leer productos existentes
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    const products = data.productos || []
    
    // Encontrar y actualizar el producto
    const productIndex = products.findIndex(p => p.id === updatedProduct.id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    // Actualizar con timestamp
    updatedProduct.lastModified = new Date().toISOString()
    products[productIndex] = updatedProduct
    
    // Actualizar estructura completa
    data.productos = products
    
    // Escribir de vuelta al archivo
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Producto actualizado exitosamente',
      product: updatedProduct 
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
    
    // Leer productos existentes
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    const products = data.productos || []
    
    // Filtrar el producto a eliminar
    const filteredProducts = products.filter(p => p.id !== productId)
    
    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    // Actualizar estructura completa
    data.productos = filteredProducts
    
    // Escribir de vuelta al archivo
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Producto eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}