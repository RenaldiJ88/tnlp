import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

export const runtime = 'nodejs'

// GET - Obtener todas las órdenes de servicio
export async function GET() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('ordenes_servicio')
      .select(`
        *,
        clientes (
          id,
          nombre,
          telefono,
          direccion,
          documento,
          email
        )
      `)
      .order('id', { ascending: false })
    
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

// POST - Crear nueva orden de servicio
export async function POST(request) {
  try {
    const newOrder = await request.json()
    
    // Preparar datos para inserción
    const orderData = {
      cliente_id: newOrder.clienteId,
      equipo_tipo: newOrder.equipoTipo || 'No especificado',
      equipo_marca: newOrder.equipoMarca || 'No especificado',
      equipo_modelo: newOrder.equipoModelo || 'No especificado',
      problema: newOrder.problema || '',
      urgencia: newOrder.urgencia || 'Media',
      servicios_seleccionados: newOrder.servicios || [],
      total: parseFloat(newOrder.total) || 0,
      estado: newOrder.estado || 'Recibido',
      notas: newOrder.notas || ''
    }
    
    const { data, error } = await supabaseAdmin
      .from('ordenes_servicio')
      .insert([orderData])
      .select(`
        *,
        clientes (
          id,
          nombre,
          telefono,
          direccion,
          documento,
          email
        )
      `)
    
    if (error) {
      console.error('Error creating service order:', error)
      return NextResponse.json(
        { success: false, message: 'Error al crear orden de servicio' },
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
      { success: false, message: 'Error al crear orden de servicio' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar orden de servicio existente
export async function PUT(request) {
  try {
    const updatedOrder = await request.json()
    
    if (!updatedOrder.id) {
      return NextResponse.json(
        { success: false, message: 'ID de orden requerido' },
        { status: 400 }
      )
    }
    
    // Preparar datos para actualización
    const orderData = {
      cliente_id: updatedOrder.cliente_id,
      equipo_tipo: updatedOrder.equipo_tipo || 'No especificado',
      equipo_marca: updatedOrder.equipo_marca || 'No especificado',
      equipo_modelo: updatedOrder.equipo_modelo || 'No especificado',
      problema: updatedOrder.problema || '',
      urgencia: updatedOrder.urgencia || 'Media',
      servicios_seleccionados: updatedOrder.servicios_seleccionados || [],
      total: parseFloat(updatedOrder.total) || 0,
      estado: updatedOrder.estado || 'Recibido',
      notas: updatedOrder.notas || ''
    }
    
    // Si se está marcando como completado, agregar fecha
    if (updatedOrder.estado === 'Completado') {
      orderData.fecha_completado = new Date().toISOString()
    }
    
    const { data, error } = await supabaseAdmin
      .from('ordenes_servicio')
      .update(orderData)
      .eq('id', updatedOrder.id)
      .select(`
        *,
        clientes (
          id,
          nombre,
          telefono,
          direccion,
          documento,
          email
        )
      `)
    
    if (error) {
      console.error('Error updating service order:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar orden de servicio' },
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
      { success: false, message: 'Error al actualizar orden de servicio' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar orden de servicio
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'ID de orden requerido' },
        { status: 400 }
      )
    }
    
    const { error } = await supabaseAdmin
      .from('ordenes_servicio')
      .delete()
      .eq('id', orderId)
    
    if (error) {
      console.error('Error deleting service order:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar orden de servicio' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Orden de servicio eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting service order:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar orden de servicio' },
      { status: 500 }
    )
  }
}