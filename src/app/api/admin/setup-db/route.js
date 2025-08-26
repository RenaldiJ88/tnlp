import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Verificar variables de entorno
const requiredEnvVars = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars)
}

const supabaseAdmin = createClient(
  requiredEnvVars.supabaseUrl,
  requiredEnvVars.serviceRoleKey
)

// GET - Verificar y configurar la base de datos
export async function GET() {
  try {
    const results = {
      tablesChecked: [],
      tablesCreated: [],
      dataInitialized: [],
      errors: []
    }

    // Verificar si las tablas existen
    const tablesToCheck = ['configuracion_sitio', 'servicios_generales', 'servicios_precios']
    
    for (const tableName of tablesToCheck) {
      try {
        // Intentar hacer una consulta simple para verificar si la tabla existe
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('id')
          .limit(1)
        
        if (error && error.code === '42P01') {
          // Tabla no existe
          results.errors.push(`Tabla ${tableName} no existe`)
        } else if (error) {
          results.errors.push(`Error verificando tabla ${tableName}: ${error.message}`)
        } else {
          results.tablesChecked.push(tableName)
        }
      } catch (err) {
        results.errors.push(`Error inesperado verificando tabla ${tableName}: ${err.message}`)
      }
    }

    // Si hay problemas con las tablas, inicializar datos básicos en configuracion_sitio
    if (results.tablesChecked.includes('configuracion_sitio')) {
      try {
        // Verificar si ya hay configuración
        const { data: existingConfig } = await supabaseAdmin
          .from('configuracion_sitio')
          .select('seccion')
          .in('seccion', ['sitio', 'tema'])
        
        if (!existingConfig || existingConfig.length === 0) {
          // Insertar configuración inicial
          const initialConfig = [
            {
              seccion: 'sitio',
              configuracion: {
                whatsapp: '5492216767615',
                email: 'info@tunotebooklaplata.com',
                direccion: 'La Plata, Buenos Aires',
                horarios: 'Lun-Vie 9:00-18:00, Sab 9:00-13:00',
                redes: {
                  instagram: '@tunotebooklaplata',
                  facebook: 'tunotebooklaplata'
                }
              }
            },
            {
              seccion: 'tema',
              configuracion: {
                colorPrimario: '#dd40d5',
                colorSecundario: '#1A1A1A',
                titulo: 'Tu Notebook La Plata',
                eslogan: 'Expertos en Notebooks'
              }
            }
          ]

          const { error: insertError } = await supabaseAdmin
            .from('configuracion_sitio')
            .insert(initialConfig)

          if (insertError) {
            results.errors.push(`Error insertando configuración inicial: ${insertError.message}`)
          } else {
            results.dataInitialized.push('configuracion_sitio')
          }
        }
      } catch (err) {
        results.errors.push(`Error inicializando configuración: ${err.message}`)
      }
    }

    // Similar para servicios_precios
    if (results.tablesChecked.includes('servicios_precios')) {
      try {
        const { data: existingServices } = await supabaseAdmin
          .from('servicios_precios')
          .select('servicio_id')
          .limit(1)
        
        if (!existingServices || existingServices.length === 0) {
          const initialServices = [
            { servicio_id: 'limpieza-advance-cpu', nombre: 'Limpieza Advance CPU', categoria: 'Mantenimiento', subcategoria: 'Limpiezas', precio: 8000 },
            { servicio_id: 'limpieza-advance-notebook', nombre: 'Limpieza Advance Notebook', categoria: 'Mantenimiento', subcategoria: 'Limpiezas', precio: 7000 },
            { servicio_id: 'agregar-ssd', nombre: 'Agregar SSD', categoria: 'Up-Grade y mejoras', subcategoria: 'Mejoras', precio: 15000 },
            { servicio_id: 'agregar-ram', nombre: 'Agregar RAM', categoria: 'Up-Grade y mejoras', subcategoria: 'Mejoras', precio: 12000 },
            { servicio_id: 'reparacion-mother', nombre: 'Reparación Mother', categoria: 'Reparaciones', subcategoria: 'Componentes', precio: 25000 },
            { servicio_id: 'cambio-pantalla', nombre: 'Cambio Pantalla', categoria: 'Reparaciones', subcategoria: 'Hardware', precio: 20000 }
          ]

          const { error: insertError } = await supabaseAdmin
            .from('servicios_precios')
            .insert(initialServices)

          if (insertError) {
            results.errors.push(`Error insertando servicios iniciales: ${insertError.message}`)
          } else {
            results.dataInitialized.push('servicios_precios')
          }
        }
      } catch (err) {
        results.errors.push(`Error inicializando servicios: ${err.message}`)
      }
    }

    return NextResponse.json({
      success: results.errors.length === 0,
      message: results.errors.length === 0 ? 'Base de datos verificada correctamente' : 'Se encontraron algunos problemas',
      results
    })

  } catch (error) {
    console.error('Error setting up database:', error)
    return NextResponse.json({
      success: false,
      message: 'Error verificando la base de datos',
      error: error.message
    }, { status: 500 })
  }
}
