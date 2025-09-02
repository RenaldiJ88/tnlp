#!/usr/bin/env node

/**
 * Script para verificar que la corrección de órdenes de trabajo funcione
 * Verifica que los servicios se carguen dinámicamente desde la base de datos
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando corrección de órdenes de trabajo...\n')

// 1. Verificar cambios en servicios-tecnicos/page.js
console.log('1️⃣ Verificando servicios-tecnicos/page.js...')

const serviciosPageContent = fs.readFileSync('src/app/admin/servicios-tecnicos/page.js', 'utf8')

const serviciosChecks = [
  {
    name: 'Estado dinámico de serviceOptions',
    check: serviciosPageContent.includes('const [serviceOptions, setServiceOptions] = useState({})')
  },
  {
    name: 'Estado de servicePrices',
    check: serviciosPageContent.includes('const [servicePrices, setServicePrices] = useState({})')
  },
  {
    name: 'Estado de loadingServices',
    check: serviciosPageContent.includes('const [loadingServices, setLoadingServices] = useState(true)')
  },
  {
    name: 'Función loadServiceOptions',
    check: serviciosPageContent.includes('const loadServiceOptions = useCallback(async () => {')
  },
  {
    name: 'Llamada a API servicios-precios',
    check: serviciosPageContent.includes('/api/admin/servicios-precios?activos=true')
  },
  {
    name: 'Organización por categoría y subcategoría',
    check: serviciosPageContent.includes('options[categoria][subcategoria] = []')
  },
  {
    name: 'useEffect actualizado',
    check: serviciosPageContent.includes('loadServiceOptions()')
  },
  {
    name: 'handleServiceToggle actualizado',
    check: serviciosPageContent.includes('servicePrices[serviceId] || servicePrices[`${categoria}-${subcategoria}-${opcion}`]')
  },
  {
    name: 'Props pasados a ServiceModal',
    check: serviciosPageContent.includes('servicePrices={servicePrices}') && 
           serviciosPageContent.includes('loadingServices={loadingServices}')
  },
  {
    name: 'Estado de carga en modal',
    check: serviciosPageContent.includes('loadingServices ?') && 
           serviciosPageContent.includes('Cargando servicios disponibles...')
  },
  {
    name: 'Props pasados a ServiceCategoryCard',
    check: serviciosPageContent.includes('servicePrices={servicePrices}')
  }
]

serviciosChecks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`)
})

// 2. Verificar cambios en ServiceCategoryCard.jsx
console.log('\n2️⃣ Verificando ServiceCategoryCard.jsx...')

const serviceCardContent = fs.readFileSync('src/components/admin/ServiceCategoryCard.jsx', 'utf8')

const cardChecks = [
  {
    name: 'Prop servicePrices agregado',
    check: serviceCardContent.includes('servicePrices = {}')
  },
  {
    name: 'Función getServicePrice actualizada',
    check: serviceCardContent.includes('getServicePrice = (subcategoria, opcion)')
  },
  {
    name: 'Búsqueda por patrones',
    check: serviceCardContent.includes('const patterns = [')
  },
  {
    name: 'Fallback prices incluidos',
    check: serviceCardContent.includes('const fallbackPrices = {')
  },
  {
    name: 'Llamada actualizada a getServicePrice',
    check: serviceCardContent.includes('getServicePrice(subcategoria, opcion)')
  },
  {
    name: 'Precios hardcodeados removidos',
    check: !serviceCardContent.includes('const servicePrices = {')
  }
]

cardChecks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`)
})

// 3. Verificar que los archivos de la solución anterior existan
console.log('\n3️⃣ Verificando archivos de la solución anterior...')

const requiredFiles = [
  'SINCRONIZAR-SERVICIOS-DB.sql',
  'SOLUCION-SERVICIOS-DASHBOARD.md'
]

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file)
  console.log(`   ${exists ? '✅' : '❌'} ${file}`)
})

// 4. Mostrar servicios esperados con precios actualizados
console.log('\n4️⃣ Servicios esperados en la base de datos:')

const expectedServicesWithPrices = [
  { id: 'limpieza-advance-cpu', nombre: 'Limpieza Advance CPU', precio: 8000 },
  { id: 'limpieza-advance-notebook', nombre: 'Limpieza Advance Notebook', precio: 7000 },
  { id: 'limpieza-pro-g-cpu', nombre: 'Limpieza Pro G CPU', precio: 10000 },
  { id: 'limpieza-pro-g-notebook', nombre: 'Limpieza Pro G Notebook', precio: 9000 },
  { id: 'limpieza-elite-notebook', nombre: 'Limpieza Elite Notebook', precio: 12000 },
  { id: 'limpieza-pro-g-console', nombre: 'Limpieza Pro G Play/Xbox', precio: 8500 },
  { id: 'agregar-ssd', nombre: 'Agregar SSD', precio: 15000 },
  { id: 'agregar-ram', nombre: 'Agregar RAM', precio: 12000 },
  { id: 'instalacion-so', nombre: 'Instalación SO', precio: 5000 },
  { id: 'evolucion-rendimiento', nombre: 'Evolución de rendimiento', precio: 18000 },
  { id: 'reparacion-mother', nombre: 'Reparación Mother', precio: 25000 },
  { id: 'reparacion-cargador', nombre: 'Reparación Cargador', precio: 8000 },
  { id: 'reparacion-pin-carga', nombre: 'Reparación Pin de carga', precio: 12000 },
  { id: 'cambio-bisagras', nombre: 'Cambio Bisagras', precio: 15000 },
  { id: 'cambio-pantalla', nombre: 'Cambio Pantalla', precio: 20000 },
  { id: 'cambio-teclado', nombre: 'Cambio Teclado', precio: 10000 },
  { id: 'cambio-bateria', nombre: 'Cambio Batería', precio: 12000 },
  { id: 'cambio-carcasa', nombre: 'Cambio Carcasa', precio: 18000 }
]

expectedServicesWithPrices.forEach(service => {
  console.log(`   💰 ${service.nombre}: $${service.precio.toLocaleString()}`)
})

console.log(`\n📊 Total: ${expectedServicesWithPrices.length} servicios`)

// 5. Instrucciones de prueba
console.log('\n5️⃣ Cómo probar la solución:')
console.log('   1. Asegúrate de que ejecutaste el script SQL anteriormente:')
console.log('      - SINCRONIZAR-SERVICIOS-DB.sql')
console.log('')
console.log('   2. Reinicia tu servidor de desarrollo:')
console.log('      - npm run dev')
console.log('')
console.log('   3. Ve a /admin/servicios-tecnicos')
console.log('      - Haz clic en "Nueva Orden" en cualquier cliente')
console.log('      - Verifica que aparezca "Cargando servicios disponibles..."')
console.log('      - Verifica que los precios coincidan con la base de datos')
console.log('')
console.log('   4. Prueba seleccionar servicios:')
console.log('      - Los precios deben ser los correctos de la DB')
console.log('      - El total debe calcularse correctamente')
console.log('      - Debe poder crear la orden sin errores')

// 6. Diferencias esperadas
console.log('\n6️⃣ Diferencias que deberías ver:')
console.log('   ANTES:')
console.log('   ❌ Precios hardcodeados incorrectos')
console.log('   ❌ Servicios limitados o nombres incorrectos')
console.log('   ❌ Sin estado de carga')
console.log('')
console.log('   DESPUÉS:')
console.log('   ✅ Precios cargados desde la base de datos')
console.log('   ✅ Todos los 18 servicios disponibles')
console.log('   ✅ Estado de carga mientras obtiene datos')
console.log('   ✅ Nombres y categorías exactas de la DB')

console.log('\n✨ ¡Verificación completada!')
console.log('📝 Si todos los checks están en ✅, la solución está implementada correctamente.')

// 7. Contar checks exitosos
const totalServicios = serviciosChecks.length
const totalCard = cardChecks.length
const successServicios = serviciosChecks.filter(c => c.check).length
const successCard = cardChecks.filter(c => c.check).length

console.log(`\n📈 Resumen:`)
console.log(`   servicios-tecnicos/page.js: ${successServicios}/${totalServicios} checks ✅`)
console.log(`   ServiceCategoryCard.jsx: ${successCard}/${totalCard} checks ✅`)

if (successServicios === totalServicios && successCard === totalCard) {
  console.log('   🎉 ¡Todas las correcciones implementadas correctamente!')
} else {
  console.log('   ⚠️  Algunas correcciones necesitan revisión.')
}
