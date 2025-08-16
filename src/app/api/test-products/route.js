import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API de prueba de productos funcionando',
    timestamp: new Date().toISOString()
  })
}

export async function PUT() {
  return NextResponse.json({ 
    message: 'PUT de prueba funcionando',
    timestamp: new Date().toISOString()
  })
}

export async function DELETE() {
  return NextResponse.json({ 
    message: 'DELETE de prueba funcionando',
    timestamp: new Date().toISOString()
  })
}
