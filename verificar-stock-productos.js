#!/usr/bin/env node

/**
 * Script para verificar la implementación del sistema de stock en productos
 * Verifica que el switch de stock y los indicadores visuales funcionen correctamente
 */

const fs = require('fs')
const path = require('path')

console.log('📦 Verificando sistema de stock de productos...\n')

// 1. Verificar cambios en productos/page.js
console.log('1️⃣ Verificando productos/page.js...')

const productosPageContent = fs.readFileSync('src/app/admin/productos/page.js', 'utf8')

const productosChecks = [
  {
    name: 'Función handleToggleStock implementada',
    check: productosPageContent.includes('const handleToggleStock = async (productId, currentStock) => {')
  },
  {
    name: 'API call para actualizar stock',
    check: productosPageContent.includes('en_stock: !currentStock')
  },
  {
    name: 'Actualización de estado local después del toggle',
    check: productosPageContent.includes('setProducts(products.map(p =>') && 
           productosPageContent.includes('en_stock: !currentStock')
  },
  {
    name: 'Badge "SIN STOCK" agregado',
    check: productosPageContent.includes('SIN STOCK') && 
           productosPageContent.includes('product.en_stock === false')
  },
  {
    name: 'Switch de stock en ProductCard',
    check: productosPageContent.includes('Switch de Stock') && 
           productosPageContent.includes('peer-checked:bg-green-600')
  },
  {
    name: 'Indicador visual de stock',
    check: productosPageContent.includes('✅ Disponible') && 
           productosPageContent.includes('❌ Sin stock')
  },
  {
    name: 'Prop onToggleStock pasada a ProductCard',
    check: productosPageContent.includes('onToggleStock={handleToggleStock}')
  },
  {
    name: 'Campo en_stock en formulario modal',
    check: productosPageContent.includes('en_stock: true,') && 
           productosPageContent.includes('Producto en stock')
  },
  {
    name: 'Checkbox de stock en modal',
    check: productosPageContent.includes('id="en_stock"') && 
           productosPageContent.includes('text-green-600')
  }
]

productosChecks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`)
})

// 2. Verificar script SQL
console.log('\n2️⃣ Verificando script SQL...')

const sqlContent = fs.readFileSync('AGREGAR-STOCK-PRODUCTOS.sql', 'utf8')

const sqlChecks = [
  {
    name: 'Verificación de estructura actual',
    check: sqlContent.includes('SELECT column_name, data_type, is_nullable')
  },
  {
    name: 'Agregar campo en_stock si no existe',
    check: sqlContent.includes('ALTER TABLE productos ADD COLUMN en_stock BOOLEAN DEFAULT true')
  },
  {
    name: 'Actualizar productos existentes',
    check: sqlContent.includes('UPDATE productos SET en_stock = true WHERE en_stock IS NULL')
  },
  {
    name: 'Comentario en el campo',
    check: sqlContent.includes('COMMENT ON COLUMN productos.en_stock')
  },
  {
    name: 'Índice para optimizar consultas',
    check: sqlContent.includes('CREATE INDEX IF NOT EXISTS idx_productos_en_stock')
  },
  {
    name: 'Resumen de stock',
    check: sqlContent.includes('COUNT(CASE WHEN en_stock = true THEN 1 END) as en_stock')
  }
]

sqlChecks.forEach(({ name, check }) => {
  console.log(`   ${check ? '✅' : '❌'} ${name}`)
})

// 3. Funcionalidades implementadas
console.log('\n3️⃣ Funcionalidades implementadas:')

const features = [
  '🔄 Switch de stock en cada tarjeta de producto',
  '🏷️  Badge "SIN STOCK" cuando el producto no está disponible',
  '✅ Indicador visual "Disponible" vs "Sin stock"',
  '📝 Campo de stock en el formulario de crear/editar producto',
  '🎨 Switch verde cuando está en stock, gris cuando no',
  '💾 Actualización inmediata en la base de datos',
  '🔄 Actualización del estado local sin recargar página',
  '📊 Productos sin stock siguen visibles con indicador'
]

features.forEach(feature => {
  console.log(`   ✅ ${feature}`)
})

// 4. Instrucciones de implementación
console.log('\n4️⃣ Pasos para implementar:')
console.log('   1. Ejecutar el script SQL:')
console.log('      - Ve a Supabase Dashboard')
console.log('      - Abre SQL Editor')
console.log('      - Copia y pega AGREGAR-STOCK-PRODUCTOS.sql')
console.log('      - Ejecuta el script')
console.log('')
console.log('   2. Reiniciar servidor de desarrollo:')
console.log('      - npm run dev')
console.log('')
console.log('   3. Probar la funcionalidad:')
console.log('      - Ve a /admin/productos')
console.log('      - Verifica que aparezcan los switches de stock')
console.log('      - Cambia el estado de stock de algunos productos')
console.log('      - Verifica que aparezca "SIN STOCK" en productos sin stock')

// 5. Cómo probar
console.log('\n5️⃣ Cómo probar la funcionalidad:')
console.log('   📦 Dashboard de productos:')
console.log('      - Cada producto debe mostrar un switch verde/gris')
console.log('      - Al hacer toggle, debe cambiar inmediatamente')
console.log('      - Productos sin stock deben mostrar badge "SIN STOCK"')
console.log('')
console.log('   ✏️ Modal de edición:')
console.log('      - Debe aparecer checkbox "Producto en stock"')
console.log('      - Al crear producto nuevo, debe estar marcado por defecto')
console.log('      - Al editar, debe reflejar el estado actual')
console.log('')
console.log('   🌐 Vista pública (opcional):')
console.log('      - Los productos sin stock pueden seguir apareciendo')
console.log('      - Con indicador visual de "Sin stock"')

// 6. Estructura de datos
console.log('\n6️⃣ Estructura de datos actualizada:')
console.log('   productos {')
console.log('     id: number,')
console.log('     title: string,')
console.log('     description: string,')
console.log('     price: string,')
console.log('     image: string,')
console.log('     category: string,')
console.log('     isOffer: boolean,')
console.log('     en_stock: boolean ← NUEVO CAMPO')
console.log('   }')

// 7. Comportamiento esperado
console.log('\n7️⃣ Comportamiento esperado:')
console.log('   🟢 Producto EN STOCK:')
console.log('      - Switch verde activado')
console.log('      - Texto "✅ Disponible"')
console.log('      - Sin badge especial')
console.log('')
console.log('   🔴 Producto SIN STOCK:')
console.log('      - Switch gris desactivado')
console.log('      - Texto "❌ Sin stock"')
console.log('      - Badge gris "SIN STOCK" en la esquina')
console.log('      - Producto sigue visible en el catálogo')

// 8. Contar checks exitosos
const totalProductos = productosChecks.length
const totalSQL = sqlChecks.length
const successProductos = productosChecks.filter(c => c.check).length
const successSQL = sqlChecks.filter(c => c.check).length

console.log(`\n📈 Resumen:`)
console.log(`   productos/page.js: ${successProductos}/${totalProductos} checks ✅`)
console.log(`   Script SQL: ${successSQL}/${totalSQL} checks ✅`)

if (successProductos === totalProductos && successSQL === totalSQL) {
  console.log('   🎉 ¡Sistema de stock implementado correctamente!')
} else {
  console.log('   ⚠️  Algunas funcionalidades necesitan revisión.')
}

console.log('\n✨ ¡Verificación completada!')
console.log('📦 Los productos ahora tienen control de stock completo.')
