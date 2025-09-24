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

const supabaseAdmin = createClient(
  requiredEnvVars.supabaseUrl,
  requiredEnvVars.serviceRoleKey
)

export async function GET() {
  try {
    const diagnostico = {
      timestamp: new Date().toISOString(),
      variables_entorno: {
        supabaseUrl: requiredEnvVars.supabaseUrl ? 'Configurada' : 'Faltante',
        serviceRoleKey: requiredEnvVars.serviceRoleKey ? 'Configurada' : 'Faltante',
        missingVars
      },
      tablas: {},
      datos: {},
      errores: []
    }

    // Verificar cada tabla
    const tablesToCheck = ['configuracion_sitio', 'servicios_generales', 'servicios_precios']
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error, count } = await supabaseAdmin
          .from(tableName)
          .select('*', { count: 'exact' })
        
        if (error) {
          diagnostico.errores.push(`Error en tabla ${tableName}: ${error.message}`)
          diagnostico.tablas[tableName] = { existe: false, error: error.message }
        } else {
          diagnostico.tablas[tableName] = { 
            existe: true, 
            registros: count,
            muestra: data.slice(0, 2) // Primeros 2 registros como muestra
          }
        }
      } catch (err) {
        diagnostico.errores.push(`Error inesperado en tabla ${tableName}: ${err.message}`)
        diagnostico.tablas[tableName] = { existe: false, error: err.message }
      }
    }

    // Prueba específica de configuración
    try {
      const { data: configData, error: configError } = await supabaseAdmin
        .from('configuracion_sitio')
        .select('seccion, configuracion')
        .eq('seccion', 'sitio')
        .single()
      
      if (configError) {
        diagnostico.datos.configuracion_sitio = { error: configError.message }
      } else {
        diagnostico.datos.configuracion_sitio = { 
          success: true, 
          data: configData 
        }
      }
    } catch (err) {
      diagnostico.datos.configuracion_sitio = { error: err.message }
    }

    // Prueba específica de servicios precios
    try {
      const { data: serviciosData, error: serviciosError } = await supabaseAdmin
        .from('servicios_precios')
        .select('servicio_id, nombre, precio')
        .limit(3)
      
      if (serviciosError) {
        diagnostico.datos.servicios_precios = { error: serviciosError.message }
      } else {
        diagnostico.datos.servicios_precios = { 
          success: true, 
          count: serviciosData.length,
          muestra: serviciosData 
        }
      }
    } catch (err) {
      diagnostico.datos.servicios_precios = { error: err.message }
    }

    return NextResponse.json({
      success: diagnostico.errores.length === 0,
      diagnostico
    })

  } catch (error) {
    console.error('Error en diagnóstico:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}








