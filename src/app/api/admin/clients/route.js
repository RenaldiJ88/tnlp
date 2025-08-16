import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase.js'

export const runtime = 'nodejs'

// GET - Obtener todos los clientes
export async function GET() {
  try {
    const { data: clients, error } = await supabaseAdmin
      .from('clientes')
      .select('*')
      .order('id', { ascending: true })
    
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

// POST - Crear nuevo cliente
export async function POST(request) {
  try {
    const newClient = await request.json()
    
    // Preparar datos para inserción
    const clientData = {
      nombre: newClient.nombre,
      telefono: newClient.telefono,
      direccion: newClient.direccion,
      documento: newClient.documento,
      email: newClient.email || null
    }
    
    const { data, error } = await supabaseAdmin
      .from('clientes')
      .insert([clientData])
      .select()
    
    if (error) {
      console.error('Error creating client:', error)
      return NextResponse.json(
        { success: false, message: 'Error al crear cliente' },
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
      { success: false, message: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente existente
export async function PUT(request) {
  try {
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
      documento: updatedClient.documento,
      email: updatedClient.email || null
    }
    
    const { data, error } = await supabaseAdmin
      .from('clientes')
      .update(clientData)
      .eq('id', updatedClient.id)
      .select()
    
    if (error) {
      console.error('Error updating client:', error)
      return NextResponse.json(
        { success: false, message: 'Error al actualizar cliente' },
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
      { success: false, message: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('id')
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, message: 'ID de cliente requerido' },
        { status: 400 }
      )
    }
    
    const { error } = await supabaseAdmin
      .from('clientes')
      .delete()
      .eq('id', clientId)
    
    if (error) {
      console.error('Error deleting client:', error)
      return NextResponse.json(
        { success: false, message: 'Error al eliminar cliente' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cliente eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar cliente' },
      { status: 500 }
    )
  }
}