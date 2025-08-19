const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const imageExtensions = ['.jpg', '.jpeg', '.png'];
  
  async function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        await processDirectory(filePath);
      } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
        await optimizeImage(filePath);
      }
    }
  }
  
  async function optimizeImage(imagePath) {
    try {
      const ext = path.extname(imagePath);
      const nameWithoutExt = path.basename(imagePath, ext);
      const dir = path.dirname(imagePath);
      
      // Crear versiones optimizadas
      const webpPath = path.join(dir, `${nameWithoutExt}.webp`);
      const avifPath = path.join(dir, `${nameWithoutExt}.avif`);
      
      // Solo procesar si no existen ya
      if (!fs.existsSync(webpPath)) {
        await sharp(imagePath)
          .webp({ quality: 70, effort: 6 })
          .toFile(webpPath);
        console.log(`✅ WebP: ${webpPath}`);
      }
      
      if (!fs.existsSync(avifPath)) {
        await sharp(imagePath)
          .avif({ quality: 65, effort: 9 })
          .toFile(avifPath);
        console.log(`✅ AVIF: ${avifPath}`);
      }
      
      // Optimizar original también
      const originalSize = fs.statSync(imagePath).size;
      const optimizedPath = imagePath + '.temp';
      
      await sharp(imagePath)
        .jpeg({ quality: 75, progressive: true })
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(optimizedPath);
      
      const optimizedSize = fs.statSync(optimizedPath).size;
      
      if (optimizedSize < originalSize) {
        fs.renameSync(optimizedPath, imagePath);
        console.log(`📉 Optimizado: ${imagePath} (${Math.round((originalSize - optimizedSize) / 1024)}KB ahorrados)`);
      } else {
        fs.unlinkSync(optimizedPath);
      }
      
    } catch (error) {
      console.error(`❌ Error optimizando ${imagePath}:`, error.message);
    }
  }
  
  console.log('🚀 Iniciando optimización de imágenes...');
  await processDirectory(path.join(publicDir, 'img'));
  console.log('✅ Optimización completada!');
}

optimizeImages().catch(console.error);
