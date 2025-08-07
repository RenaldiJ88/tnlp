import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const ordersFilePath = path.join(process.cwd(), 'src/data/service-orders.json')

// GET - Obtener todas las órdenes
export async function GET() {
  try {
    const fileContent = fs.readFileSync(ordersFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data.ordenes || [])
  } catch (error) {
    console.error('Error reading service orders:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nueva orden
export async function POST(request) {
  try {
    const newOrder = await request.json()
    
    // Leer archivo actual
    let data = { ordenes: [] }
    try {
      const fileContent = fs.readFileSync(ordersFilePath, 'utf-8')
      data = JSON.parse(fileContent)
    } catch (error) {
      console.log('Creating new service orders file')
    }
    
    // Generar ID único
    const newId = data.ordenes.length > 0 
      ? Math.max(...data.ordenes.map(o => o.id)) + 1 
      : 1
    
    // Crear orden con datos completos
    const orderToAdd = {
      id: newId,
      clienteId: newOrder.clienteId,
      servicios: newOrder.servicios,
      detalles: newOrder.detalles,
      total: newOrder.total,
      estado: newOrder.estado || 'Recibido',
      fecha: newOrder.fecha,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString()
    }
    
    data.ordenes.push(orderToAdd)
    
    // Guardar archivo
    fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json(orderToAdd, { status: 201 })
  } catch (error) {
    console.error('Error creating service order:', error)
    return NextResponse.json(
      { error: 'Error al crear orden de servicio' }, 
      { status: 500 }
    )
  }
}

// PUT - Actualizar orden
export async function PUT(request) {
  try {
    const updatedOrder = await request.json()
    
    // Leer archivo actual
    const fileContent = fs.readFileSync(ordersFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Encontrar y actualizar orden
    const orderIndex = data.ordenes.findIndex(o => o.id === updatedOrder.id)
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Orden no encontrada' }, 
        { status: 404 }
      )
    }
    
    // Mantener datos importantes
    data.ordenes[orderIndex] = {
      ...data.ordenes[orderIndex],
      ...updatedOrder,
      fechaModificacion: new Date().toISOString()
    }
    
    // Guardar archivo
    fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json(data.ordenes[orderIndex])
  } catch (error) {
    console.error('Error updating service order:', error)
    return NextResponse.json(
      { error: 'Error al actualizar orden' }, 
      { status: 500 }
    )
  }
}

// DELETE - Eliminar orden
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = parseInt(searchParams.get('id'))
    
    // Leer archivo actual
    const fileContent = fs.readFileSync(ordersFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Filtrar orden a eliminar
    const filteredOrders = data.ordenes.filter(o => o.id !== orderId)
    
    if (filteredOrders.length === data.ordenes.length) {
      return NextResponse.json(
        { error: 'Orden no encontrada' }, 
        { status: 404 }
      )
    }
    
    data.ordenes = filteredOrders
    
    // Guardar archivo
    fs.writeFileSync(ordersFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service order:', error)
    return NextResponse.json(
      { error: 'Error al eliminar orden' }, 
      { status: 500 }
    )
  }
}