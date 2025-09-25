const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabase = createClient(
  'https://kjrqhdldxqkwwpkyhqyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcnFoZGxkeHFrd3dwa3locXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDM5MTgsImV4cCI6MjA0NzY3OTkxOH0.JHdmNSR7qJgQI7ZBjqbgzwW2e4q9nKpZVx-gzm-X-i8'
);

// Importar funciones de extracción de specs (adaptadas)
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
    const value = ssdMatch[1];
    const unit = ssdMatch[2].toUpperCase();
    return unit === 'TB' ? `${value}TB` : `${Math.floor(parseInt(value)/1000)}TB`;
  }
  
  const hddMatch = description.match(/hdd\s*(\d+(?:\.\d+)?)\s*(tb|gb)/i);
  if (hddMatch) {
    return `${hddMatch[1]}${hddMatch[2].toUpperCase()} HDD`;
  }
  
  return null;
};

const extractProcessor = (description) => {
  if (description.includes('intel')) {
    if (description.includes('i3')) return 'Intel Core i3';
    if (description.includes('i5')) return 'Intel Core i5';
    if (description.includes('i7')) return 'Intel Core i7';
    if (description.includes('i9')) return 'Intel Core i9';
    return 'Intel';
  }
  
  if (description.includes('amd') || description.includes('ryzen')) {
    if (description.includes('ryzen 3')) return 'AMD Ryzen 3';
    if (description.includes('ryzen 5')) return 'AMD Ryzen 5';
    if (description.includes('ryzen 7')) return 'AMD Ryzen 7';
    if (description.includes('ryzen 9')) return 'AMD Ryzen 9';
    return 'AMD Ryzen';
  }
  
  return null;
};

const extractOS = (description) => {
  if (description.includes('windows 11 pro')) return 'Windows 11 Pro';
  if (description.includes('windows 11')) return 'Windows 11 Home';
  if (description.includes('windows 10 pro')) return 'Windows 10 Pro';
  if (description.includes('windows 10')) return 'Windows 10 Home';
  if (description.includes('sin sistema') || description.includes('no os')) return 'Sin Sistema';
  return 'Windows 11 Home'; // Default
};

const extractNumericPrice = (priceString) => {
  const match = priceString.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
};

async function migrarProductosExistentes() {
  console.log('🚀 Iniciando migración automática de productos...\n');
  
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
      
      // Extraer especificaciones
      const description = (producto.description || '').toLowerCase();
      const ram = extractRAM(description);
      const storage = extractStorage(description);
      const processor = extractProcessor(description);
      const os = extractOS(description);
      const precio = extractNumericPrice(producto.price);
      
      console.log(`📊 Specs extraídas:`, {
        ram, storage, processor, os, precio
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
      
      // 4. Crear configuración base
      if (ram || storage || processor) {
        console.log('⚙️ Creando configuración base...');
        
        const configuracion = {};
        if (ram) configuracion.ram = ram;
        if (storage) configuracion.ssd = storage;
        if (processor) configuracion.procesador = processor;
        if (os) configuracion.os = os;
        
        const nombreConfig = [
          ram ? `${ram} RAM` : null,
          storage ? storage : null,
          os && os !== 'Windows 11 Home' ? os : null
        ].filter(Boolean).join(' | ');
        
        const sku = `${producto.categoria?.toUpperCase() || 'PROD'}-${producto.id}-${ram || 'BASE'}`;
        
        const { error: errorConfig } = await supabase
          .from('producto_configuraciones')
          .upsert({
            producto_id: producto.id,
            nombre: nombreConfig || 'Configuración base',
            configuracion: configuracion,
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
      .select('producto_id');
    
    console.log(`✅ Migración completada:`);
    console.log(`   - ${imagenes?.length || 0} imágenes principales creadas`);
    console.log(`   - ${configuraciones?.length || 0} configuraciones base creadas`);
    
    console.log(`\n🎉 ¡Migración automática completada exitosamente!`);
    console.log(`\n📝 Próximos pasos:`);
    console.log(`   1. Ejecuta el servidor: npm run dev`);
    console.log(`   2. Visita cualquier producto: /productos/[id]`);
    console.log(`   3. Verifica que se vea la galería y configurador`);
    console.log(`   4. Usa el panel admin para agregar más configuraciones`);
    
  } catch (error) {
    console.error('💥 Error general en migración:', error);
  }
}

// Función para verificar si las tablas existen
async function verificarTablas() {
  console.log('🔍 Verificando que las tablas nuevas existan...\n');
  
  try {
    const { error: errorImagen } = await supabase
      .from('producto_imagenes')
      .select('count')
      .limit(1);
    
    const { error: errorConfig } = await supabase
      .from('producto_configuraciones')
      .select('count')
      .limit(1);
    
    if (errorImagen || errorConfig) {
      console.log('⚠️  Las tablas nuevas no existen. Debes ejecutar primero:');
      console.log('   1. Abre Supabase SQL Editor');
      console.log('   2. Ejecuta: ESQUEMA-IMAGENES-CONFIGURACIONES.sql');
      console.log('   3. Luego ejecuta este script de migración');
      return false;
    }
    
    console.log('✅ Tablas verificadas correctamente\n');
    return true;
  } catch (error) {
    console.log('⚠️  Error verificando tablas:', error.message);
    return false;
  }
}

// Ejecutar migración
async function main() {
  console.log('=' .repeat(60));
  console.log('🔄 MIGRACIÓN AUTOMÁTICA DE PRODUCTOS EXISTENTES');
  console.log('=' .repeat(60));
  console.log('');
  
  const tablasExisten = await verificarTablas();
  if (!tablasExisten) {
    return;
  }
  
  await migrarProductosExistentes();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { migrarProductosExistentes };
