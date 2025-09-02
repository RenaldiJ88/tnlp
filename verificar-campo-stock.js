#!/usr/bin/env node

/**
 * Script para verificar que el campo en_stock esté funcionando correctamente
 */

const fs = require('fs')

console.log('🔍 Verificando configuración del campo en_stock...\n')

// 1. Verificar que los archivos tengan las correcciones
console.log('1️⃣ Verificando archivos corregidos...')

const productCardContent = fs.readFileSync('src/components/ProductCard.jsx', 'utf8')
const adminProductsContent = fs.readFileSync('src/app/admin/productos/page.js', 'utf8')

const checks = [
  {
    name: 'Badge SIN STOCK posicionado a la izquierda',
    check: productCardContent.includes('absolute top-2 left-2') && 
           productCardContent.includes('❌ SIN STOCK')
  },
  {
    name: 'Badge más notorio (rojo oscuro, más grande)',
    check: productCardContent.includes('bg-red-800') && 
           productCardContent.includes('px-3 py-2') &&
           productCardContent.includes('shadow-lg')
  },
  {
    name: 'Función handleToggleStock corregida',
    check: adminProductsContent.includes('const isCurrentlyInStock = currentStock === true') &&
           adminProductsContent.includes('console.log(\'Toggling stock:\'')
  },
  {
    name: 'Badge SIN STOCK en admin también corregido',
    check: adminProductsContent.includes('absolute top-2 left-2') &&
           adminProductsContent.includes('❌ SIN STOCK')
  }
]

checks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`)
})

// 2. Instrucciones para verificar en la aplicación
console.log('\n2️⃣ Pasos para verificar en la aplicación:')
console.log('')
console.log('   🗄️ PRIMERO - Verificar base de datos:')
console.log('      1. Ve a Supabase Dashboard')
console.log('      2. Abre SQL Editor')
console.log('      3. Ejecuta: SELECT * FROM productos LIMIT 5;')
console.log('      4. Verifica que aparezca la columna "en_stock"')
console.log('      5. Si no existe, ejecuta AGREGAR-STOCK-PRODUCTOS.sql')
console.log('')
console.log('   🔧 SEGUNDO - Probar en admin:')
console.log('      1. Ve a /admin/productos')
console.log('      2. Cambia el stock de un producto (switch)')
console.log('      3. Verifica en la consola del navegador los logs')
console.log('      4. Recarga la página y verifica que el cambio persista')
console.log('')
console.log('   🌐 TERCERO - Verificar vista pública:')
console.log('      1. Ve a la página principal')
console.log('      2. Los productos sin stock deben mostrar "❌ SIN STOCK" a la izquierda')
console.log('      3. El badge debe ser rojo oscuro y más grande')

// 3. Posibles problemas y soluciones
console.log('\n3️⃣ Posibles problemas y soluciones:')
console.log('')
console.log('   ❌ Error "Cannot read property of undefined":')
console.log('      - El campo en_stock no existe en la base de datos')
console.log('      - Solución: Ejecutar AGREGAR-STOCK-PRODUCTOS.sql')
console.log('')
console.log('   ❌ Badge no aparece:')
console.log('      - Verificar que en_stock sea exactamente false (no null o undefined)')
console.log('      - Revisar en consola: console.log(product.en_stock)')
console.log('')
console.log('   ❌ Switch no funciona:')
console.log('      - Revisar logs en consola del navegador')
console.log('      - Verificar que la API responda correctamente')

// 4. Script de prueba SQL
console.log('\n4️⃣ Script de prueba rápido para Supabase:')
console.log('')
console.log('   -- Verificar estructura de tabla')
console.log('   SELECT column_name, data_type, is_nullable')
console.log('   FROM information_schema.columns')
console.log('   WHERE table_name = \'productos\'')
console.log('   ORDER BY ordinal_position;')
console.log('')
console.log('   -- Ver productos con su estado de stock')
console.log('   SELECT id, title, price, en_stock')
console.log('   FROM productos')
console.log('   ORDER BY id')
console.log('   LIMIT 10;')
console.log('')
console.log('   -- Cambiar stock de un producto para probar')
console.log('   UPDATE productos')
console.log('   SET en_stock = false')
console.log('   WHERE id = 1;')

console.log('\n✨ Verificación completada!')
console.log('📋 Sigue los pasos para identificar y solucionar el problema.')
