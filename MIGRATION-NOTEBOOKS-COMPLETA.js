const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabase = createClient(
  'https://kjrqhdldxqkwwpkyhqyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcnFoZGxkeHFrd3dwa3locXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDM5MTgsImV4cCI6MjA0NzY3OTkxOH0.JHdmNSR7qJgQI7ZBjqbgzwW2e4q9nKpZVx-gzm-X-i8'
);

// Funciones mejoradas para extraer características completas de notebooks
const extractRAM = (description) => {
  const ramMatch = description.match(/(\d+)\s*gb\s*ram/i) || 
                   description.match(/ram\s*(\d+)\s*gb/i) ||
                   description.match(/(\d+)\s*gb/i);
  return ramMatch ? `${ramMatch[1]}GB` : null;
};

const extractStorage = (description) => {
  const ssdMatch = description.match(/ssd\s*(\d+(?:\.\d+)?)\s*(tb|gb)/i) ||
                   description.match(/(\d+(?:\.\d+)?)\s*(tb|gb)\s*ssd/i);
  if (ssdMatch) {
    const value = parseFloat(ssdMatch[1]);
    const unit = ssdMatch[2].toUpperCase();
    if (unit === 'GB' && value >= 1000) {
      return `${Math.floor(value/1000)}TB SSD`;
    }
    return `${value}${unit} SSD`;
  }
  
  const hddMatch = description.match(/hdd\s*(\d+(?:\.\d+)?)\s*(tb|gb)/i);
  if (hddMatch) {
    return `${hddMatch[1]}${hddMatch[2].toUpperCase()} HDD`;
  }
  
  return '512GB SSD'; // Default
};

const extractProcessor = (description) => {
  if (description.includes('intel')) {
    if (description.includes('i3')) return 'Intel Core i3';
    if (description.includes('i5')) return 'Intel Core i5';
    if (description.includes('i7')) return 'Intel Core i7';
    if (description.includes('i9')) return 'Intel Core i9';
    return 'Intel Core i5'; // Default Intel
  }
  
  if (description.includes('amd') || description.includes('ryzen')) {
    if (description.includes('ryzen 3')) return 'AMD Ryzen 3';
    if (description.includes('ryzen 5')) return 'AMD Ryzen 5';
    if (description.includes('ryzen 7')) return 'AMD Ryzen 7';
    if (description.includes('ryzen 9')) return 'AMD Ryzen 9';
    return 'AMD Ryzen 5'; // Default AMD
  }
  
  return 'Intel Core i5'; // Default general
};

const extractScreenSize = (description) => {
  const screenMatch = description.match(/(\d{2}\.?\d?)"?\s*(pulg|inch|pulgadas)/i) ||
                     description.match(/(\d{2}\.?\d?)\s*pulg/i);
  if (screenMatch) {
    return `${screenMatch[1]}"`;
  }
  return '15.6"'; // Default
};

const extractScreenResolution = (description) => {
  if (description.includes('4k') || description.includes('2160')) return '4K';
  if (description.includes('2k') || description.includes('1440')) return '2K';
  if (description.includes('full hd') || description.includes('1080')) return 'Full HD';
  if (description.includes('hd') || description.includes('720')) return 'HD';
  return 'Full HD'; // Default
};

const extractGPU = (description) => {
  if (description.includes('rtx 4070')) return 'RTX 4070';
  if (description.includes('rtx 4060')) return 'RTX 4060';
  if (description.includes('rtx 4050')) return 'RTX 4050';
  if (description.includes('rtx 3080')) return 'RTX 3080';
  if (description.includes('rtx 3070')) return 'RTX 3070';
  if (description.includes('rtx 3060')) return 'RTX 3060';
  if (description.includes('rtx 3050')) return 'RTX 3050';
  if (description.includes('gtx 1650')) return 'GTX 1650';
  if (description.includes('nvidia') || description.includes('geforce')) return 'RTX 3050';
  return 'Integrada'; // Default
};

const extractOS = (description) => {
  if (description.includes('windows 11 pro')) return 'Windows 11 Pro';
  if (description.includes('windows 11')) return 'Windows 11 Home';
  if (description.includes('windows 10 pro')) return 'Windows 10 Pro';
  if (description.includes('windows 10')) return 'Windows 10 Home';
  if (description.includes('sin sistema') || description.includes('no os')) return 'Sin Sistema';
  return 'Windows 11 Home'; // Default
};

const extractColor = (description, title) => {
  const text = (description + ' ' + title).toLowerCase();
  if (text.includes('plata') || text.includes('silver')) return 'Plata';
  if (text.includes('blanco') || text.includes('white')) return 'Blanco';
  if (text.includes('gris') || text.includes('gray') || text.includes('grey')) return 'Gris';
  if (text.includes('azul') || text.includes('blue')) return 'Azul';
  return 'Negro'; // Default
};

const extractNumericPrice = (priceString) => {
  const match = priceString.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 1299;
};

// Generar nombre de configuración completa
const generateNotebookConfigName = (config) => {
  const parts = [];
  
  // Procesador (abreviado)
  if (config.procesador) {
    const proc = config.procesador.replace('Intel Core ', '').replace('AMD ', '');
    parts.push(proc);
  }
  
  // RAM
  if (config.ram) parts.push(`${config.ram} RAM`);
  
  // GPU (si no es integrada)
  if (config.gpu && config.gpu !== 'Integrada') {
    parts.push(config.gpu);
  }
  
  // Pantalla
  if (config.pantalla_tamano && config.pantalla_resolucion) {
    parts.push(`${config.pantalla_tamano} ${config.pantalla_resolucion}`);
  }
  
  // Almacenamiento
  if (config.almacenamiento) {
    parts.push(config.almacenamiento);
  }

  return parts.join(' | ') || 'Configuración base';
};

// Generar SKU para notebook
const generateNotebookSKU = (productId, config) => {
  const proc = config.procesador ? config.procesador.split(' ').pop().replace('Core ', '') : 'X';
  const ram = config.ram ? config.ram.replace('GB', '') : 'X';
  const gpu = config.gpu && config.gpu !== 'Integrada' 
    ? config.gpu.replace('RTX ', '').replace('GTX ', '').replace(' ', '') 
    : 'INT';
  return `NB-${productId}-${proc}-${ram}G-${gpu}`;
};

async function migrarNotebooksCompleto() {
  console.log('🚀 Iniciando migración completa de notebooks...\n');
  
  try {
    // 1. Obtener todos los productos existentes
    console.log('📦 Cargando productos existentes...');
    const { data: productos, error: errorProductos } = await supabase
      .from('productos')
      .select('*')
      .order('id');
    
    if (errorProductos) {
      console.error('❌ Error cargando productos:', errorProductos);
      return;
    }
    
    console.log(`✅ Encontrados ${productos.length} productos para migrar\n`);
    
    // 2. Procesar cada producto
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      console.log(`--- PROCESANDO ${i + 1}/${productos.length}: ${producto.title} ---`);
      
      // Extraer características completas del notebook
      const description = (producto.description || '').toLowerCase();
      const title = (producto.title || '').toLowerCase();
      
      const procesador = extractProcessor(description);
      const ram = extractRAM(description);
      const almacenamiento = extractStorage(description);
      const pantalla_tamano = extractScreenSize(description);
      const pantalla_resolucion = extractScreenResolution(description);
      const gpu = extractGPU(description);
      const os = extractOS(description);
      const color = extractColor(description, title);
      const precio = extractNumericPrice(producto.price);
      
      console.log(`🖥️ Características extraídas:`, {
        procesador, ram, almacenamiento, pantalla_tamano, 
        pantalla_resolucion, gpu, os, color, precio
      });
      
      // 3. Crear imagen principal (migrar imagen actual)
      if (producto.image) {
        console.log('🖼️ Migrando imagen principal...');
        const { error: errorImagen } = await supabase
          .from('producto_imagenes')
          .upsert({
            producto_id: producto.id,
            imagen_url: producto.image,
            descripcion: 'Imagen principal',
            orden: 1,
            es_principal: true
          }, {
            onConflict: 'producto_id,orden'
          });
        
        if (errorImagen) {
          console.error('❌ Error migrando imagen:', errorImagen);
        } else {
          console.log('✅ Imagen migrada');
        }
      }
      
      // 4. Crear configuración completa de notebook
      console.log('💻 Creando configuración completa de notebook...');
      
      const configuracionCompleta = {
        procesador,
        ram,
        almacenamiento,
        pantalla_tamano,
        pantalla_resolucion,
        gpu,
        os,
        color
      };
      
      const nombreConfig = generateNotebookConfigName(configuracionCompleta);
      const sku = generateNotebookSKU(producto.id, configuracionCompleta);
      
      const { error: errorConfig } = await supabase
        .from('producto_configuraciones')
        .upsert({
          producto_id: producto.id,
          nombre: nombreConfig,
          configuracion: configuracionCompleta,
          precio: precio,
          stock: 1, // Stock inicial
          sku: sku,
          activo: true
        }, {
          onConflict: 'producto_id,sku'
        });
      
      if (errorConfig) {
        console.error('❌ Error creando configuración:', errorConfig);
      } else {
        console.log('✅ Configuración creada:', nombreConfig);
      }
      
      console.log(''); // Línea vacía para separar
    }
    
    // 5. Verificar resultados
    console.log('📊 VERIFICANDO RESULTADOS...\n');
    
    const { data: imagenes } = await supabase
      .from('producto_imagenes')
      .select('producto_id')
      .eq('es_principal', true);
    
    const { data: configuraciones } = await supabase
      .from('producto_configuraciones')
      .select('producto_id, nombre, precio');
    
    console.log(`✅ Migración de notebooks completada:`);
    console.log(`   - ${imagenes?.length || 0} imágenes principales creadas`);
    console.log(`   - ${configuraciones?.length || 0} configuraciones completas creadas`);
    
    if (configuraciones && configuraciones.length > 0) {
      console.log(`\n📋 Ejemplos de configuraciones creadas:`);
      configuraciones.slice(0, 3).forEach(config => {
        console.log(`   • ${config.nombre} - US$${config.precio}`);
      });
    }
    
    console.log(`\n🎉 ¡Migración de notebooks completada exitosamente!`);
    console.log(`\n📝 Próximos pasos:`);
    console.log(`   1. Ejecuta el servidor: npm run dev`);
    console.log(`   2. Ve al panel admin: /admin/productos`);
    console.log(`   3. Edita un producto y ve a la pestaña "Configuraciones"`);
    console.log(`   4. Agrega más configuraciones (diferentes RAM, GPU, etc.)`);
    console.log(`   5. Ve el producto en el frontend: /productos/[id]`);
    console.log(`   6. ¡Disfruta tu sistema estilo Amazon!`);
    
  } catch (error) {
    console.error('💥 Error general en migración:', error);
  }
}

// Función para verificar si las tablas existen
async function verificarTablasNotebooks() {
  console.log('🔍 Verificando que las tablas de notebooks existan...\n');
  
  try {
    const { error: errorImagen } = await supabase
      .from('producto_imagenes')
      .select('count')
      .limit(1);
    
    const { error: errorConfig } = await supabase
      .from('producto_configuraciones')
      .select('count')
      .limit(1);
    
    const { error: errorOpciones } = await supabase
      .from('opciones_configuracion')
      .select('count')
      .limit(1);
    
    if (errorImagen || errorConfig || errorOpciones) {
      console.log('⚠️  Las tablas de notebooks no existen. Debes ejecutar primero:');
      console.log('   1. Abre Supabase SQL Editor');
      console.log('   2. Ejecuta: LIMPIAR-E-IMPLEMENTAR.sql');
      console.log('   3. Luego ejecuta este script de migración');
      return false;
    }
    
    // Verificar que las opciones estén cargadas
    const { data: opciones } = await supabase
      .from('opciones_configuracion')
      .select('categoria')
      .limit(1);
    
    if (!opciones || opciones.length === 0) {
      console.log('⚠️  Las opciones de configuración no están cargadas.');
      console.log('   Ejecuta primero: LIMPIAR-E-IMPLEMENTAR.sql');
      return false;
    }
    
    console.log('✅ Tablas de notebooks verificadas correctamente\n');
    return true;
  } catch (error) {
    console.log('⚠️  Error verificando tablas:', error.message);
    return false;
  }
}

// Ejecutar migración
async function main() {
  console.log('=' .repeat(70));
  console.log('🔄 MIGRACIÓN COMPLETA DE NOTEBOOKS CON CARACTERÍSTICAS COMPLETAS');
  console.log('=' .repeat(70));
  console.log('');
  
  const tablasExisten = await verificarTablasNotebooks();
  if (!tablasExisten) {
    return;
  }
  
  await migrarNotebooksCompleto();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { migrarNotebooksCompleto };
