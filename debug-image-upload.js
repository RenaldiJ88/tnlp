const fs = require('fs')
const path = require('path')

console.log('🔍 DEBUGGER DE UPLOAD DE IMÁGENES A CLOUDINARY')
console.log('=' .repeat(60))

// Función para verificar variables de entorno
function checkEnvironmentVariables() {
  console.log('\n🔑 VERIFICANDO VARIABLES DE ENTORNO:')
  
  const envFile = '.env.local'
  if (!fs.existsSync(envFile)) {
    console.log('❌ Archivo .env.local no encontrado')
    return false
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8')

  
  const cloudName = envContent.match(/NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=(.+)/)
  const uploadPreset = envContent.match(/NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=(.+)/)
  
  
  if (!cloudName || !uploadPreset) {
    console.log('❌ Variables de entorno faltantes o mal configuradas')
    return false
  }
  
  console.log('✅ Variables de entorno configuradas correctamente')
  return true
}

// Función para verificar la función de upload
function checkUploadFunction() {
  console.log('\n☁️ VERIFICANDO FUNCIÓN DE UPLOAD:')
  
  try {
    const cloudinaryContent = fs.readFileSync('src/utils/cloudinary.js', 'utf8')
    console.log('📄 Contenido de cloudinary.js:')
    console.log(cloudinaryContent)
    
    // Verificar estructura de la función
    const hasExport = cloudinaryContent.includes('export const uploadToCloudinary')
    const hasFormData = cloudinaryContent.includes('FormData')
    const hasFetch = cloudinaryContent.includes('fetch')
    const hasErrorHandling = cloudinaryContent.includes('try')
    
    
    return hasExport && hasFormData && hasFetch && hasErrorHandling
  } catch (error) {
    console.log('❌ Error leyendo cloudinary.js:', error.message)
    return false
  }
}

// Función para verificar el componente ImageUpload
function checkImageUploadComponent() {
  
  
  try {
    const imageUploadContent = fs.readFileSync('src/components/ImageUpload.jsx', 'utf8')
    
    
    // Verificar props y funcionalidad
    const hasOnImageUpload = imageUploadContent.includes('onImageUpload')
    const hasCurrentImage = imageUploadContent.includes('currentImage')
    const hasUploading = imageUploadContent.includes('uploading')
    const hasDragDrop = imageUploadContent.includes('onDrop')
    
    
    
    return hasOnImageUpload && hasCurrentImage && hasUploading && hasDragDrop
  } catch (error) {
    console.log('❌ Error leyendo ImageUpload.jsx:', error.message)
    return false
  }
}

// Función para verificar la integración en el modal
function checkModalIntegration() {
  console.log('\n🎯 VERIFICANDO INTEGRACIÓN EN MODAL:')
  
  try {
    const productosContent = fs.readFileSync('src/app/admin/productos/page.js', 'utf8')
    
    // Verificar imports
    const hasImageUploadImport = productosContent.includes('import ImageUpload')
    const hasCloudinaryImport = productosContent.includes('import { uploadToCloudinary }')
    
    // Verificar función handleImageUpload
    const handleImageUploadMatch = productosContent.match(/const handleImageUpload = async \(file\) => \{[\s\S]*?\}/)
    const hasHandleImageUpload = !!handleImageUploadMatch
    
    // Verificar uso del componente
    const hasImageUploadComponent = productosContent.includes('<ImageUpload')
    
    console.log('\n🔍 Integración en modal:')
    console.log(`${hasImageUploadImport ? '✅' : '❌'} Import de ImageUpload`)
    console.log(`${hasCloudinaryImport ? '✅' : '❌'} Import de uploadToCloudinary`)
    console.log(`${hasHandleImageUpload ? '✅' : '❌'} Función handleImageUpload`)
    console.log(`${hasImageUploadComponent ? '✅' : '❌'} Componente ImageUpload en modal`)
    
    if (handleImageUploadMatch) {
      console.log('\n📄 Función handleImageUpload encontrada:')
      console.log(handleImageUploadMatch[0])
    }
    
    return hasImageUploadImport && hasCloudinaryImport && hasHandleImageUpload && hasImageUploadComponent
  } catch (error) {
    console.log('❌ Error leyendo productos/page.js:', error.message)
    return false
  }
}

// Función para simular una llamada de upload
function simulateUploadCall() {
  console.log('\n🧪 SIMULANDO LLAMADA DE UPLOAD:')
  
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8')
    const cloudName = envContent.match(/NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=(.+)/)
    const uploadPreset = envContent.match(/NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=(.+)/)
    
    if (!cloudName || !uploadPreset) {
      console.log('❌ No se pueden simular las variables de entorno')
      return false
    }
    
    const cloudNameValue = cloudName[1].trim()
    const uploadPresetValue = uploadPreset[1].trim()
    
    console.log(`\n🔍 Simulando upload con:`)
    console.log(`Cloud Name: ${cloudNameValue}`)
    console.log(`Upload Preset: ${uploadPresetValue}`)
    
    const simulatedUrl = `https://api.cloudinary.com/v1_1/${cloudNameValue}/image/upload`
    console.log(`URL de upload: ${simulatedUrl}`)
    
    // Verificar que las variables no sean placeholders
    if (cloudNameValue === 'tu-cloud-name' || uploadPresetValue === 'product-images') {
      console.log('⚠️  ADVERTENCIA: Las variables parecen ser placeholders')
      console.log('   Asegúrate de usar valores reales de tu cuenta de Cloudinary')
    }
    
    return true
  } catch (error) {
    console.log('❌ Error simulando upload:', error.message)
    return false
  }
}

// Función para verificar la consola del navegador
function checkBrowserConsole() {
  console.log('\n🌐 VERIFICANDO CONSOLA DEL NAVEGADOR:')
  console.log('📋 Abre la consola del navegador (F12) y busca estos errores:')
  console.log('   1. "Error uploading to Cloudinary:"')
  console.log('   2. "Error al subir la imagen"')
  console.log('   3. Errores de CORS')
  console.log('   4. Errores de red (Network tab)')
  console.log('   5. Variables de entorno undefined')
}

// Función principal de debug
function runDebug() {
  console.log('🚀 Iniciando debug completo...\n')
  
  const envOk = checkEnvironmentVariables()
  const uploadOk = checkUploadFunction()
  const componentOk = checkImageUploadComponent()
  const modalOk = checkModalIntegration()
  const simulationOk = simulateUploadCall()
  
  console.log('\n' + '=' .repeat(60))
  console.log('📊 RESUMEN DEL DEBUG:')
  console.log(`${envOk ? '✅' : '❌'} Variables de entorno`)
  console.log(`${uploadOk ? '✅' : '❌'} Función de upload`)
  console.log(`${componentOk ? '✅' : '❌'} Componente ImageUpload`)
  console.log(`${modalOk ? '✅' : '❌'} Integración en modal`)
  console.log(`${simulationOk ? '✅' : '❌'} Simulación de upload`)
  
  if (!envOk) {
    console.log('\n❌ PROBLEMA PRINCIPAL: Variables de entorno')
    console.log('   Solución: Configura NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET')
  } else if (!uploadOk) {
    console.log('\n❌ PROBLEMA PRINCIPAL: Función de upload')
    console.log('   Solución: Revisa src/utils/cloudinary.js')
  } else if (!componentOk) {
    console.log('\n❌ PROBLEMA PRINCIPAL: Componente ImageUpload')
    console.log('   Solución: Revisa src/components/ImageUpload.jsx')
  } else if (!modalOk) {
    console.log('\n❌ PROBLEMA PRINCIPAL: Integración en modal')
    console.log('   Solución: Revisa src/app/admin/productos/page.js')
  } else {
    console.log('\n✅ TODO PARECE ESTAR BIEN CONFIGURADO')
    console.log('   El problema podría estar en:')
    console.log('   - Credenciales de Cloudinary incorrectas')
    console.log('   - Upload preset no configurado')
    console.log('   - Problemas de red/CORS')
  }
  
  checkBrowserConsole()
  
  console.log('\n🔧 PRÓXIMOS PASOS:')
  console.log('1. Verifica las variables de entorno en .env.local')
  console.log('2. Revisa la consola del navegador para errores específicos')
  console.log('3. Confirma que tu cuenta de Cloudinary esté activa')
  console.log('4. Verifica que el upload preset esté configurado')
}

// Ejecutar debug
runDebug()
