// Script para crear tablas automáticamente desde Node.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variables de entorno faltantes')
  console.log('Asegúrate de tener configuradas:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupDatabase() {
  console.log('🚀 Iniciando setup de base de datos...')
  
  try {
    // Crear tabla configuracion_sitio
    console.log('📋 Creando tabla configuracion_sitio...')
    
    const { error: configTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS configuracion_sitio (
          id SERIAL PRIMARY KEY,
          seccion VARCHAR(50) NOT NULL UNIQUE,
          configuracion JSONB NOT NULL,
          activo BOOLEAN DEFAULT true,
          date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (configTableError) {
      console.error('❌ Error creando tabla configuracion_sitio:', configTableError)
    } else {
      console.log('✅ Tabla configuracion_sitio creada')
    }
    
    // Insertar datos iniciales
    console.log('💾 Insertando datos iniciales...')
    
    const { error: insertError } = await supabase
      .from('configuracion_sitio')
      .upsert([
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
      ], { onConflict: 'seccion' })
    
    if (insertError) {
      console.error('❌ Error insertando datos:', insertError)
    } else {
      console.log('✅ Datos iniciales insertados')
    }
    
    console.log('🎉 Setup completado exitosamente!')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

setupDatabase()








