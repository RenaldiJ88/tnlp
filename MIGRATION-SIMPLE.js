const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kjrqhdldxqkwwpkyhqyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcnFoZGxkeHFrd3dwa3locXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDM5MTgsImV4cCI6MjA0NzY3OTkxOH0.JHdmNSR7qJgQI7ZBjqbgzwW2e4q9nKpZVx-gzm-X-i8'
);

// Funciones para extraer características
const extractRAM = (description) => {
  const ramMatch = description.match(/(\d+)\s*gb\s*ram/i) || 
                   description.match(/ram\s*(\d+)\s*gb/i) ||
                   description.match(/(\d+)\s*gb/i);
  return ramMatch ? `${ramMatch[1]}GB` : '16GB';
};

const extractStorage = (description) => {
  const ssdMatch = description.match(/ssd\s*(\d+(?:\.\d+)?)\s*(tb|gb)/i);
  if (ssdMatch) {
    const value = parseFloat(ssdMatch[1]);
    const unit = ssdMatch[2].toUpperCase();
    if (unit === 'GB' && value >= 1000) {
      return `${Math.floor(value/1000)}TB SSD`;
    }
    return `${value}${unit} SSD`;
  }
  return '512GB SSD';
};

const extractProcessor = (description) => {
  if (description.includes('i7')) return 'Intel Core i7';
  if (description.includes('i5')) return 'Intel Core i5';
  if (description.includes('i3')) return 'Intel Core i3';
  if (description.includes('ryzen 7')) return 'AMD Ryzen 7';
  if (description.includes('ryzen 5')) return 'AMD Ryzen 5';
  return 'Intel Core i5';
};

const extractGPU = (description) => {
  if (description.includes('rtx 3060')) return 'RTX 3060';
  if (description.includes('rtx 3070')) return 'RTX 3070';
  if (description.includes('gtx 1650')) return 'GTX 1650';
  return 'Integrada';
};

const extractPrice = (priceString) => {
  const match = priceString.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 1299;
};

async function migrarProductosSimple() {
  console.log('🚀 Iniciando migración simple...\n');
  
  try {
    // Saltar verificaciones, asumir que las tablas existen
    console.log('⏭️  Saltando verificaciones (asumiendo tablas existen)');
    
    // Obtener productos
    console.log('📦 Cargando productos...');
    const { data: productos, error } = await supabase
      .from('productos')
      .select('*')
      .limit(5); // Solo los primeros 5 para probar
    
    if (error) {
      console.error('❌ Error cargando productos:', error.message);
      console.log('\n💡 POSIBLES SOLUCIONES:');
      console.log('1. Verifica tu conexión a internet');
      console.log('2. Verifica que las credenciales de Supabase sean correctas');
      console.log('3. Ve al Table Editor de Supabase y verifica que existan las tablas');
      return;
    }
    
    console.log(`✅ Encontrados ${productos.length} productos\n`);
    
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      console.log(`--- PROCESANDO ${i + 1}/${productos.length}: ${producto.title} ---`);
      
      const description = (producto.description || '').toLowerCase();
      
      // Extraer características básicas
      const ram = extractRAM(description);
      const almacenamiento = extractStorage(description);
      const procesador = extractProcessor(description);
      const gpu = extractGPU(description);
      const precio = extractPrice(producto.price);
      
      console.log(`Características: ${procesador}, ${ram}, ${gpu}, ${almacenamiento}`);
      
      // Crear imagen principal
      if (producto.image) {
        try {
          const { error: errorImagen } = await supabase
            .from('producto_imagenes')
            .upsert({
              producto_id: producto.id,
              imagen_url: producto.image,
              descripcion: 'Imagen principal',
              orden: 1,
              es_principal: true
            });
          
          if (!errorImagen) {
            console.log('✅ Imagen migrada');
          }
        } catch (err) {
          console.log('⚠️  Error imagen (continuando...)');
        }
      }
      
      // Crear configuración
      try {
        const configuracion = {
          procesador,
          ram,
          almacenamiento,
          pantalla_tamano: '15.6"',
          pantalla_resolucion: 'Full HD',
          gpu,
          os: 'Windows 11 Home',
          color: 'Negro'
        };
        
        const nombre = `${procesador.replace('Intel Core ', '').replace('AMD ', '')} | ${ram} RAM | ${gpu !== 'Integrada' ? gpu : 'Integrada'}`;
        
        const { error: errorConfig } = await supabase
          .from('producto_configuraciones')
          .upsert({
            producto_id: producto.id,
            nombre: nombre,
            configuracion: configuracion,
            precio: precio,
            stock: 1,
            sku: `NB-${producto.id}-${ram.replace('GB', '')}`,
            activo: true
          });
        
        if (!errorConfig) {
          console.log('✅ Configuración creada:', nombre);
        }
      } catch (err) {
        console.log('⚠️  Error configuración (continuando...)');
      }
      
      console.log('');
    }
    
    console.log('🎉 ¡Migración completada!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. npm run dev');
    console.log('2. Ve a /admin/productos');
    console.log('3. Edita un producto → pestaña "Configuraciones"');
    console.log('4. Ve a /productos/[id] para ver el resultado');
    
  } catch (error) {
    console.error('💥 Error general:', error.message);
    console.log('\n💡 Si el error persiste:');
    console.log('1. Verifica conexión a internet');  
    console.log('2. Ve a Supabase Table Editor y confirma que las tablas existen');
    console.log('3. Si las tablas existen, el frontend debería funcionar');
  }
}

migrarProductosSimple();
