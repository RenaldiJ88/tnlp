import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SERVICES_FILE = path.join(process.cwd(), 'src/data/servicios-tecnicos.json')

// Función para asegurar que el archivo existe
function ensureServicesFile() {
  if (!fs.existsSync(SERVICES_FILE)) {
    const initialData = {
      servicios: [],
      lastUpdated: new Date().toISOString()
    }
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(initialData, null, 2))
  }
}

// GET - Obtener todos los servicios técnicos
export async function GET() {
  try {
    ensureServicesFile()
    
    const fileContent = fs.readFileSync(SERVICES_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data.servicios || [])
  } catch (error) {
    console.error('Error reading services:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Crear nuevo servicio técnico
export async function POST(request) {
  try {
    ensureServicesFile()
    
    const newService = await request.json()
    
    // Leer servicios existentes
    const fileContent = fs.readFileSync(SERVICES_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    const servicios = data.servicios || []
    
    // Generar ID único
    const newId = `ST${String(Date.now()).slice(-6)}` // ST + últimos 6 dígitos del timestamp
    newService.id = newId
    newService.fecha_ingreso = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    newService.estado = newService.estado || 'pendiente'
    newService.observaciones = newService.observaciones || []
    newService.repuestos = newService.repuestos || []
    
    // Agregar al array
    servicios.push(newService)
    
    // Actualizar datos
    data.servicios = servicios
    data.lastUpdated = new Date().toISOString()
    
    // Escribir de vuelta al archivo
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Servicio creado exitosamente',
      service: newService 
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear servicio' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar servicio existente
export async function PUT(request) {
  try {
    ensureServicesFile()
    
    const updatedService = await request.json()
    
    // Leer servicios existentes
    const fileContent = fs.readFileSync(SERVICES_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    const servicios = data.servicios || []
    
    // Encontrar y actualizar el servicio
    const serviceIndex = servicios.findIndex(s => s.id === updatedService.id)
    
    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Servicio no encontrado' },
        { status: 404 }
      )
    }
    
    // Actualizar con timestamp
    updatedService.last_modified = new Date().toISOString()
    servicios[serviceIndex] = updatedService
    
    // Actualizar datos
    data.servicios = servicios
    data.lastUpdated = new Date().toISOString()
    
    // Escribir de vuelta al archivo
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Servicio actualizado exitosamente',
      service: updatedService 
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, message: 'Error al actualizar servicio' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar servicio
export async function DELETE(request) {
  try {
    ensureServicesFile()
    
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('id')
    
    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: 'ID de servicio requerido' },
        { status: 400 }
      )
    }
    
    // Leer servicios existentes
    const fileContent = fs.readFileSync(SERVICES_FILE, 'utf8')
    const data = JSON.parse(fileContent)
    const servicios = data.servicios || []
    
    // Filtrar el servicio a eliminar
    const filteredServices = servicios.filter(s => s.id !== serviceId)
    
    if (filteredServices.length === servicios.length) {
      return NextResponse.json(
        { success: false, message: 'Servicio no encontrado' },
        { status: 404 }
      )
    }
    
    // Actualizar datos
    data.servicios = filteredServices
    data.lastUpdated = new Date().toISOString()
    
    // Escribir de vuelta al archivo
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Servicio eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, message: 'Error al eliminar servicio' },
      { status: 500 }
    )
  }
}