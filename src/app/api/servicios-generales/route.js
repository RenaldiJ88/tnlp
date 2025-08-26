import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Crear cliente Supabase público (no requiere admin para leer)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase faltantes')
  throw new Error('Variables de entorno de Supabase faltantes')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// GET - Obtener servicios generales (público)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('servicios_generales')
      .select('*')
      .eq('activo', true)
      .order('orden')
    
    if (error) {
      console.error('Error fetching servicios generales:', error)
      return NextResponse.json([], { status: 500 })
    }
    
    // Mapear a formato esperado por el frontend
    const servicios = data.map(servicio => ({
      id: servicio.id,
      categoria: servicio.categoria,
      descripcion: servicio.descripcion,
      imgService: servicio.img_service
    }))
    
    return NextResponse.json({ servicios })
  } catch (error) {
    console.error('Error reading servicios generales:', error)
    return NextResponse.json({ servicios: [] }, { status: 500 })
  }
}
