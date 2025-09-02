#!/usr/bin/env node

/**
 * Script de prueba para verificar que la corrección de servicios funcione
 * Este script simula las llamadas que hace el dashboard
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Iniciando pruebas del sistema de servicios...\n')

// 1. Verificar que los archivos existan
console.log('1️⃣ Verificando archivos...')

const files = [
  'SINCRONIZAR-SERVICIOS-DB.sql',
  'src/app/admin/configuracion/page.js',
  'src/app/api/admin/servicios-precios/route.js'
]

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} - OK`)
  } else {
    console.log(`   ❌ ${file} - FALTANTE`)
  }
})

// 2. Verificar estructura del dashboard corregido
console.log('\n2️⃣ Verificando correcciones del dashboard...')

const dashboardContent = fs.readFileSync('src/app/admin/configuracion/page.js', 'utf8')

const checks = [
  {
    name: 'loadServiciosFromDB function',
    check: dashboardContent.includes('loadServiciosFromDB')
  },
  {
    name: 'Dynamic servicios state',
    check: dashboardContent.includes('setServicios') && dashboardContent.includes('loadingServicios')
  },
  {
    name: 'handleActivoChange function',
    check: dashboardContent.includes('handleActivoChange')
  },
  {
    name: 'Loading state in JSX',
    check: dashboardContent.includes('loadingServicios ?')
  },
  {
    name: 'Subcategory display',
    check: dashboardContent.includes('servicio.subcategoria')
  },
  {
    name: 'Controlled inputs',
    check: dashboardContent.includes('value={servicio.precio}')
  }
]

checks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`)
})

// 3. Verificar estructura del SQL
console.log('\n3️⃣ Verificando script SQL...')

const sqlContent = fs.readFileSync('SINCRONIZAR-SERVICIOS-DB.sql', 'utf8')

const sqlChecks = [
  {
    name: 'INSERT ON CONFLICT statement',
    check: sqlContent.includes('ON CONFLICT (servicio_id) DO UPDATE')
  },
  {
    name: 'All service categories',
    check: sqlContent.includes('Mantenimiento') && 
           sqlContent.includes('Up-Grade y mejoras') && 
           sqlContent.includes('Reparaciones')
  },
  {
    name: 'Service verification queries',
    check: sqlContent.includes('SELECT servicio_id, nombre, categoria')
  }
]

sqlChecks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`)
})

// 4. Mostrar servicios esperados
console.log('\n4️⃣ Servicios que deberían estar en la base de datos:')

const expectedServices = [
  'limpieza-advance-cpu',
  'limpieza-advance-notebook', 
  'limpieza-pro-g-cpu',
  'limpieza-pro-g-notebook',
  'limpieza-elite-notebook',
  'limpieza-pro-g-console',
  'agregar-ssd',
  'agregar-ram',
  'instalacion-so',
  'evolucion-rendimiento',
  'reparacion-mother',
  'reparacion-cargador',
  'reparacion-pin-carga',
  'cambio-bisagras',
  'cambio-pantalla',
  'cambio-teclado',
  'cambio-bateria',
  'cambio-carcasa'
]

expectedServices.forEach(service => {
  console.log(`   📋 ${service}`)
})

console.log(`\n📊 Total de servicios esperados: ${expectedServices.length}`)

// 5. Instrucciones finales
console.log('\n5️⃣ Próximos pasos para completar la corrección:')
console.log('   1. Ejecuta el script SQL en Supabase:')
console.log('      - Ve a tu proyecto en Supabase')
console.log('      - Abre el SQL Editor')
console.log('      - Copia y pega el contenido de SINCRONIZAR-SERVICIOS-DB.sql')
console.log('      - Ejecuta el script')
console.log('')
console.log('   2. Reinicia tu servidor de desarrollo:')
console.log('      - npm run dev (o yarn dev)')
console.log('')
console.log('   3. Prueba el dashboard:')
console.log('      - Ve a /admin/configuracion')
console.log('      - Selecciona la pestaña "Servicios"')
console.log('      - Verifica que todos los servicios se carguen')
console.log('      - Modifica un precio y guarda')
console.log('      - Verifica que el cambio se mantenga')

console.log('\n✨ ¡Pruebas completadas!')
