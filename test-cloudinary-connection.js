// Script para probar la conexión con Cloudinary
const https = require('https')

console.log('🧪 PROBANDO CONEXIÓN CON CLOUDINARY')
console.log('=' .repeat(50))

const cloudName = 'dsck9cpdb'
const uploadPreset = 'product-image'

console.log(`Cloud Name: ${cloudName}`)
console.log(`Upload Preset: ${uploadPreset}`)

// Probar si el preset existe
const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload_presets/${uploadPreset}`

console.log(`\n🔍 Probando URL: ${testUrl}`)

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}

const req = https.request(testUrl, options, (res) => {
  console.log(`\n📊 Respuesta del servidor:`)
  console.log(`Status: ${res.statusCode}`)
  console.log(`Headers:`, res.headers)
  
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    console.log(`\n📄 Respuesta completa:`)
    console.log(data)
    
    if (res.statusCode === 200) {
      console.log('\n✅ Upload preset encontrado y configurado correctamente!')
    } else if (res.statusCode === 404) {
      console.log('\n❌ Upload preset NO encontrado')
      console.log('   Necesitas crearlo en tu dashboard de Cloudinary')
    } else {
      console.log('\n⚠️  Respuesta inesperada del servidor')
    }
  })
})

req.on('error', (error) => {
  console.log('\n❌ Error de conexión:', error.message)
})

req.end()
