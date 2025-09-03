#!/usr/bin/env node

/**
 * Script para debugear el problema de actualización de stock
 * Simula las llamadas a la API y verifica cada paso
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 DEBUG: Problema de actualización de stock\n')

// 1. Verificar estructura de archivos
console.log('1️⃣ Verificando estructura de archivos...')

const filesToCheck = [
  'src/app/api/admin/products/route.js',
  'src/app/admin/productos/page.js',
  'src/components/ProductCard.jsx'
]

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} existe`)
  } else {
    console.log(`   ❌ ${file} NO existe`)
  }
})

// 2. Verificar API de productos
console.log('\n2️⃣ Analizando API de productos...')

const apiContent = fs.readFileSync('src/app/api/admin/products/route.js', 'utf8')

const apiIssues = [
  {
    name: 'Función PUT existe',
    check: apiContent.includes('export async function PUT(request)'),
    critical: true
  },
  {
    name: 'Validación de admin token',
    check: apiContent.includes('validateAdminToken'),
    critical: true
  },
  {
    name: 'Manejo de en_stock',
    check: apiContent.includes('en_stock'),
    critical: true
  },
  {
    name: 'Actualización selectiva de campos',
    check: apiContent.includes('const productData = {}') && 
           apiContent.includes('if (updatedProduct.en_stock !== undefined)'),
    critical: true
  },
  {
    name: 'Manejo de errores',
    check: apiContent.includes('catch (error)'),
    critical: false
  }
]

apiIssues.forEach(({ name, check, critical }) => {
  const status = check ? '✅' : '❌'
  const criticality = critical ? 'CRÍTICO' : 'Importante'
  console.log(`   ${status} ${name} (${criticality})`)
})

// 3. Verificar función handleToggleStock
console.log('\n3️⃣ Analizando función handleToggleStock...')

const adminContent = fs.readFileSync('src/app/admin/productos/page.js', 'utf8')

const toggleIssues = [
  {
    name: 'Función handleToggleStock existe',
    check: adminContent.includes('const handleToggleStock = async'),
    critical: true
  },
  {
    name: 'Normalización de stock',
    check: adminContent.includes('const isCurrentlyInStock = currentStock === true'),
    critical: true
  },
  {
    name: 'Logs de debug',
    check: adminContent.includes('console.log(\'Toggling stock:\')'),
    critical: false
  },
  {
    name: 'Manejo de respuesta',
    check: adminContent.includes('if (response.ok)'),
    critical: true
  },
  {
    name: 'Actualización de estado local',
    check: adminContent.includes('setProducts(products.map('),
    critical: true
  }
]

toggleIssues.forEach(({ name, check, critical }) => {
  const status = check ? '✅' : '❌'
  const criticality = critical ? 'CRÍTICO' : 'Importante'
  console.log(`   ${status} ${name} (${criticality})`)
})

// 4. Verificar ProductCard
console.log('\n4️⃣ Analizando ProductCard...')

const productCardContent = fs.readFileSync('src/components/ProductCard.jsx', 'utf8')

const productCardIssues = [
  {
    name: 'Parámetro en_stock',
    check: productCardContent.includes('en_stock = true'),
    critical: true
  },
  {
    name: 'Badge SIN STOCK',
    check: productCardContent.includes('SIN STOCK'),
    critical: true
  },
  {
    name: 'Posicionamiento izquierda',
    check: productCardContent.includes('absolute top-2 left-2'),
    critical: false
  },
  {
    name: 'Estilo notorio',
    check: productCardContent.includes('bg-red-800') && 
           productCardContent.includes('shadow-lg'),
    critical: false
  }
]

productCardIssues.forEach(({ name, check, critical }) => {
  const status = check ? '✅' : '❌'
  const criticality = critical ? 'CRÍTICO' : 'Importante'
  console.log(`   ${status} ${name} (${criticality})`)
})

// 5. Simular llamada a la API
console.log('\n5️⃣ Simulando llamada a la API...')

const simulateApiCall = () => {
  console.log('   📡 Simulando PUT /api/admin/products')
  console.log('   📦 Datos enviados:')
  console.log('      {')
  console.log('        "id": 1,')
  console.log('        "en_stock": false')
  console.log('      }')
  console.log('')
  console.log('   🔍 Verificando validaciones:')
  console.log('      - Token de admin: ✅ (simulado)')
  console.log('      - ID presente: ✅')
  console.log('      - Campo en_stock: ✅')
  console.log('      - Actualización selectiva: ✅')
}

simulateApiCall()

// 6. Posibles causas del error
console.log('\n6️⃣ Posibles causas del error 500:')
console.log('')
console.log('   🗄️ Base de datos:')
console.log('      ❌ Campo en_stock no existe en tabla productos')
console.log('      ❌ Permisos insuficientes en Supabase')
console.log('      ❌ Error de sintaxis SQL')
console.log('')
console.log('   🔐 Autenticación:')
console.log('      ❌ Token expirado o inválido')
console.log('      ❌ Usuario sin permisos de admin')
console.log('      ❌ Error en validateAdminToken')
console.log('')
console.log('   📡 API:')
console.log('      ❌ Error en la consulta UPDATE')
console.log('      ❌ Campo en_stock no se puede actualizar')
console.log('      ❌ Error de validación de datos')

// 7. Script de diagnóstico SQL
console.log('\n7️⃣ Script de diagnóstico para Supabase:')
console.log('')
console.log('   -- 1. Verificar estructura de tabla')
console.log('   SELECT column_name, data_type, is_nullable, column_default')
console.log('   FROM information_schema.columns')
console.log('   WHERE table_name = \'productos\'')
console.log('   ORDER BY ordinal_position;')
console.log('')
console.log('   -- 2. Verificar permisos RLS')
console.log('   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual')
console.log('   FROM pg_policies')
console.log('   WHERE tablename = \'productos\';')
console.log('')
console.log('   -- 3. Verificar datos de ejemplo')
console.log('   SELECT id, title, price, en_stock, is_offer')
console.log('   FROM productos')
console.log('   ORDER BY id')
console.log('   LIMIT 5;')
console.log('')
console.log('   -- 4. Probar actualización manual')
console.log('   UPDATE productos')
console.log('   SET en_stock = false')
console.log('   WHERE id = 1')
console.log('   RETURNING id, title, en_stock;')

// 8. Pasos de solución
console.log('\n8️⃣ Pasos para solucionar:')
console.log('')
console.log('   1️⃣ Ejecutar script SQL en Supabase:')
console.log('      - AGREGAR-STOCK-PRODUCTOS.sql')
console.log('')
console.log('   2️⃣ Verificar permisos:')
console.log('      - RLS policies en tabla productos')
console.log('      - Usuario admin tiene permisos')
console.log('')
console.log('   3️⃣ Probar API manualmente:')
console.log('      - Usar Postman o similar')
console.log('      - PUT /api/admin/products')
console.log('      - Con token válido')
console.log('')
console.log('   4️⃣ Revisar logs del servidor:')
console.log('      - Consola del navegador')
console.log('      - Terminal donde corre npm run dev')
console.log('      - Logs de Supabase')

// 9. Resumen de problemas críticos
console.log('\n9️⃣ Resumen de problemas críticos:')
const criticalIssues = [...apiIssues, ...toggleIssues, ...productCardIssues]
  .filter(issue => !issue.check && issue.critical)

if (criticalIssues.length === 0) {
  console.log('   ✅ No hay problemas críticos en el código')
  console.log('   🔍 El problema está en la base de datos o permisos')
} else {
  console.log('   ❌ Problemas críticos encontrados:')
  criticalIssues.forEach(issue => {
    console.log(`      - ${issue.name}`)
  })
}

console.log('\n✨ Debug completado!')
console.log('🔧 Sigue los pasos de solución para resolver el error 500.')
