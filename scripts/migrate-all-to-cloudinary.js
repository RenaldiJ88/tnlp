const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dkj7padnu',
  api_key: '141814469922666',
  api_secret: 'Iv1rDa0y177QiSfQjxBzJ0KMtaw'
});

const inputDir = path.join(process.cwd(), 'public', 'img');
const urlMappings = {};

// Función para subir una imagen a Cloudinary
async function uploadImage(filePath, publicId) {
  try {
    console.log(`🚀 Subiendo: ${publicId}`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: 'tnlp', // Organizar en carpeta
      resource_type: 'image',
      // Auto-optimización
      quality: 'auto:best',
      fetch_format: 'auto',
      // Generar responsive breakpoints
      responsive_breakpoints: {
        create_derived: true,
        bytes_step: 20000,
        min_width: 320,
        max_width: 1200,
        transformation: {
          quality: 'auto:best'
        }
      }
    });
    
    // Guardar mapeo de URL local → URL Cloudinary
    const localPath = filePath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');
    urlMappings[localPath] = result.secure_url;
    
    console.log(`✅ Subida exitosa: ${result.secure_url}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Error subiendo ${publicId}:`, error.message);
    return null;
  }
}

// Función recursiva para procesar directorios
async function processDirectory(dir, basePath = '') {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Procesar subdirectorio recursivamente
      await processDirectory(filePath, path.join(basePath, file));
    } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
      // Procesar imagen
      const { name, ext } = path.parse(file);
      
      // Solo subir una versión por imagen (preferir WebP, luego original)
      if (ext.toLowerCase() === '.webp' || 
          (!fs.existsSync(path.join(dir, name + '.webp')) && 
           !fs.existsSync(path.join(dir, name + '.avif')))) {
        
        // Crear public_id manteniendo estructura
        const publicId = path.join(basePath, name).replace(/\\/g, '/');
        
        await uploadImage(filePath, publicId);
        
        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.log(`⏭️  Saltando ${file} (ya existe versión WebP/AVIF)`);
      }
    }
  }
}

// Función principal
async function migrateAllImages() {
  console.log('🚀 Iniciando migración masiva a Cloudinary...\n');
  
  try {
    // Procesar todas las imágenes
    await processDirectory(inputDir);
    
    // Guardar mapeo de URLs para actualizar el código
    const mappingPath = path.join(process.cwd(), 'cloudinary-url-mappings.json');
    fs.writeFileSync(mappingPath, JSON.stringify(urlMappings, null, 2));
    
    console.log('\n✅ ¡MIGRACIÓN COMPLETADA!');
    console.log(`📁 Imágenes subidas: ${Object.keys(urlMappings).length}`);
    console.log(`📋 Mapeo guardado en: ${mappingPath}`);
    console.log('\n🔗 URLs de ejemplo:');
    
    // Mostrar algunas URLs de ejemplo
    Object.entries(urlMappings).slice(0, 5).forEach(([local, cloudinary]) => {
      console.log(`   ${local} → ${cloudinary}`);
    });
    
    if (Object.keys(urlMappings).length > 5) {
      console.log(`   ... y ${Object.keys(urlMappings).length - 5} más`);
    }
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  }
}

// Ejecutar migración
migrateAllImages().catch(console.error);
