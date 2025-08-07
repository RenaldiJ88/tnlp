import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const clientsFilePath = path.join(process.cwd(), 'src/data/clients.json')

// GET - Obtener todos los clientes
export async function GET() {
  try {
    const fileContent = fs.readFileSync(clientsFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    return NextResponse.json(data.clientes || [])
  } catch (error) {
    console.error('Error reading clients:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nuevo cliente
export async function POST(request) {
  try {
    const newClient = await request.json()
    
    // Leer archivo actual
    let data = { clientes: [] }
    try {
      const fileContent = fs.readFileSync(clientsFilePath, 'utf-8')
      data = JSON.parse(fileContent)
    } catch (error) {
      console.log('Creating new clients file')
    }
    
    // Generar ID único
    const newId = data.clientes.length > 0 
      ? Math.max(...data.clientes.map(c => c.id)) + 1 
      : 1
    
    // Crear cliente con datos completos
    const clientToAdd = {
      id: newId,
      nombre: newClient.nombre,
      telefono: newClient.telefono,
      direccion: newClient.direccion,
      documento: newClient.documento,
      fechaRegistro: new Date().toISOString().split('T')[0],
      ordenes: []
    }
    
    data.clientes.push(clientToAdd)
    
    // Guardar archivo
    fs.writeFileSync(clientsFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json(clientToAdd, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' }, 
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente
export async function PUT(request) {
  try {
    const updatedClient = await request.json()
    
    // Leer archivo actual
    const fileContent = fs.readFileSync(clientsFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Encontrar y actualizar cliente
    const clientIndex = data.clientes.findIndex(c => c.id === updatedClient.id)
    if (clientIndex === -1) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' }, 
        { status: 404 }
      )
    }
    
    // Mantener datos importantes
    data.clientes[clientIndex] = {
      ...data.clientes[clientIndex],
      ...updatedClient,
      fechaModificacion: new Date().toISOString().split('T')[0]
    }
    
    // Guardar archivo
    fs.writeFileSync(clientsFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json(data.clientes[clientIndex])
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' }, 
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = parseInt(searchParams.get('id'))
    
    // Leer archivo actual
    const fileContent = fs.readFileSync(clientsFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // Filtrar cliente a eliminar
    const filteredClients = data.clientes.filter(c => c.id !== clientId)
    
    if (filteredClients.length === data.clientes.length) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' }, 
        { status: 404 }
      )
    }
    
    data.clientes = filteredClients
    
    // Guardar archivo
    fs.writeFileSync(clientsFilePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cliente' }, 
      { status: 500 }
    )
  }
}