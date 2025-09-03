const fs = require('fs')
const path = require('path')

console.log('🧪 Script de prueba para funcionalidad de upload de imágenes')
console.log('=' .repeat(60))

// Verificar que los archivos necesarios existan
const requiredFiles = [
  'src/components/ImageUpload.jsx',
  'src/utils/cloudinary.js',
  'src/app/admin/productos/page.js'
]

console.log('\n📁 Verificando archivos necesarios:')
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file)
  console.log(`${exists ? '✅' : '❌'} ${file}`)
})

// Verificar que las variables de entorno estén configuradas
console.log('\n🔑 Verificando variables de entorno:')
const envFile = '.env.local'
const envExists = fs.existsSync(envFile)

if (envExists) {
  const envContent = fs.readFileSync(envFile, 'utf8')
  const hasCloudinaryName = envContent.includes('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME')
  const hasUploadPreset = envContent.includes('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET')
  
  console.log(`${hasCloudinaryName ? '✅' : '❌'} NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`)
  console.log(`${hasUploadPreset ? '✅' : '❌'} NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`)
} else {
  console.log('❌ Archivo .env.local no encontrado')
}

// Verificar dependencias instaladas
console.log('\n📦 Verificando dependencias:')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const hasCloudinary = packageJson.dependencies && packageJson.dependencies['cloudinary-react']

console.log(`${hasCloudinary ? '✅' : '❌'} cloudinary-react instalado`)

// Verificar estructura del componente ImageUpload
console.log('\n🔍 Verificando estructura del componente ImageUpload:')
try {
  const imageUploadContent = fs.readFileSync('src/components/ImageUpload.jsx', 'utf8')
  const hasDragDrop = imageUploadContent.includes('onDrop')
  const hasFileInput = imageUploadContent.includes('input')
  const hasUploadingState = imageUploadContent.includes('uploading')
  
  console.log(`${hasDragDrop ? '✅' : '❌'} Funcionalidad drag & drop`)
  console.log(`${hasFileInput ? '✅' : '❌'} Input de archivo`)
  console.log(`${hasUploadingState ? '✅' : '❌'} Estado de upload`)
} catch (error) {
  console.log('❌ Error leyendo ImageUpload.jsx:', error.message)
}

// Verificar función de upload a Cloudinary
console.log('\n☁️ Verificando función de upload a Cloudinary:')
try {
  const cloudinaryContent = fs.readFileSync('src/utils/cloudinary.js', 'utf8')
  const hasUploadFunction = cloudinaryContent.includes('uploadToCloudinary')
  const hasFormData = cloudinaryContent.includes('FormData')
  const hasFetch = cloudinaryContent.includes('fetch')
  
  console.log(`${hasUploadFunction ? '✅' : '❌'} Función uploadToCloudinary`)
  console.log(`${hasFormData ? '✅' : '❌'} Uso de FormData`)
  console.log(`${hasFetch ? '✅' : '❌'} Llamada a API de Cloudinary`)
} catch (error) {
  console.log('❌ Error leyendo cloudinary.js:', error.message)
}

// Verificar integración en el modal de productos
console.log('\n🎯 Verificando integración en modal de productos:')
try {
  const productosContent = fs.readFileSync('src/app/admin/productos/page.js', 'utf8')
  const hasImageUploadImport = productosContent.includes('import ImageUpload')
  const hasCloudinaryImport = productosContent.includes('import { uploadToCloudinary }')
  const hasImageUploadComponent = productosContent.includes('<ImageUpload')
  const hasHandleImageUpload = productosContent.includes('handleImageUpload')
  
  console.log(`${hasImageUploadImport ? '✅' : '❌'} Import de ImageUpload`)
  console.log(`${hasCloudinaryImport ? '✅' : '❌'} Import de uploadToCloudinary`)
  console.log(`${hasImageUploadComponent ? '✅' : '❌'} Componente ImageUpload en modal`)
  console.log(`${hasHandleImageUpload ? '✅' : '❌'} Función handleImageUpload`)
} catch (error) {
  console.log('❌ Error leyendo productos/page.js:', error.message)
}

// Verificar ProductCard optimizado
console.log('\n🖼️ Verificando ProductCard optimizado:')
try {
  const productCardContent = fs.readFileSync('src/components/ProductCard.jsx', 'utf8')
  const hasOptimizedImageUrl = productCardContent.includes('getOptimizedImageUrl')
  const hasCloudinaryTransform = productCardContent.includes('cloudinary.com')
  
  console.log(`${hasOptimizedImageUrl ? '✅' : '❌'} Función getOptimizedImageUrl`)
  console.log(`${hasCloudinaryTransform ? '✅' : '❌'} Transformaciones de Cloudinary`)
} catch (error) {
  console.log('❌ Error leyendo ProductCard.jsx:', error.message)
}

console.log('\n' + '=' .repeat(60))
console.log('🎉 Verificación completada!')
console.log('\n📋 Próximos pasos:')
console.log('1. Asegúrate de que las variables de entorno estén configuradas')
console.log('2. Reinicia el servidor de desarrollo')
console.log('3. Prueba crear un nuevo producto con imagen')
console.log('4. Verifica que la imagen se suba a Cloudinary')
console.log('5. Confirma que se muestre correctamente en ProductCard')
