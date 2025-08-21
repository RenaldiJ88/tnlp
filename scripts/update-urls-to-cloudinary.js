const fs = require('fs');
const path = require('path');

// Cargar mapeo de URLs
const urlMappings = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'cloudinary-url-mappings.json'), 'utf8')
);

// Función para encontrar archivos recursivamente
function findFiles(dir, extensions, excludeDirs = []) {
  const files = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(item)) {
        files.push(...findFiles(fullPath, extensions, excludeDirs));
      }
    } else {
      const ext = path.extname(item).toLowerCase();
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// Función para reemplazar URLs en un archivo
function updateFileUrls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let hasChanges = false;
  
  // Reemplazar URLs exactas
  Object.entries(urlMappings).forEach(([localPath, cloudinaryUrl]) => {
    // Buscar diferentes formatos de URLs:
    
    // 1. src="/img/..." o src='/img/...'
    const srcPattern1 = new RegExp(`src=["']${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    const srcPattern2 = new RegExp(`src=["']${localPath.replace(/^\//, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    
    // 2. Variables que contengan la ruta
    const pathPattern = new RegExp(`["'\`]${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\`]`, 'g');
    
    // 3. Template literals
    const templatePattern = new RegExp(`\\\${[^}]*}${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    
    // Realizar reemplazos
    if (srcPattern1.test(updatedContent)) {
      updatedContent = updatedContent.replace(srcPattern1, `src="${cloudinaryUrl}"`);
      hasChanges = true;
    }
    
    if (srcPattern2.test(updatedContent)) {
      updatedContent = updatedContent.replace(srcPattern2, `src="${cloudinaryUrl}"`);
      hasChanges = true;
    }
    
    if (pathPattern.test(updatedContent)) {
      updatedContent = updatedContent.replace(pathPattern, `"${cloudinaryUrl}"`);
      hasChanges = true;
    }
  });
  
  // Reemplazos específicos para patrones comunes
  Object.entries(urlMappings).forEach(([localPath, cloudinaryUrl]) => {
    // Para casos como: image='/img/...'
    const imagePattern = new RegExp(`image=["']${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    if (imagePattern.test(updatedContent)) {
      updatedContent = updatedContent.replace(imagePattern, `image="${cloudinaryUrl}"`);
      hasChanges = true;
    }
    
    // Para casos como: backgroundImage: url('/img/...')
    const bgImagePattern = new RegExp(`url\\(["']?${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\)`, 'g');
    if (bgImagePattern.test(updatedContent)) {
      updatedContent = updatedContent.replace(bgImagePattern, `url("${cloudinaryUrl}")`);
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Actualizado: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  
  return false;
}

// Función principal
function updateAllUrls() {
  console.log('🚀 Actualizando URLs a Cloudinary...\n');
  
  const srcDir = path.join(process.cwd(), 'src');
  
  // Buscar archivos JS, JSX, TS, TSX en src/
  const codeFiles = findFiles(srcDir, ['.js', '.jsx', '.ts', '.tsx'], ['node_modules', '.next']);
  
  let updatedCount = 0;
  
  codeFiles.forEach(file => {
    if (updateFileUrls(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\n✅ ¡Actualización completada!`);
  console.log(`📁 Archivos procesados: ${codeFiles.length}`);
  console.log(`📝 Archivos actualizados: ${updatedCount}`);
  console.log(`🚀 URLs migradas: ${Object.keys(urlMappings).length}`);
  
  if (updatedCount > 0) {
    console.log('\n🔗 Ejemplos de URLs actualizadas:');
    Object.entries(urlMappings).slice(0, 3).forEach(([local, cloudinary]) => {
      console.log(`   ${local}`);
      console.log(`   → ${cloudinary}\n`);
    });
  }
}

// Ejecutar actualización
updateAllUrls();
