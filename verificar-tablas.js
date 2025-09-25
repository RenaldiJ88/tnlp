const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kjrqhdldxqkwwpkyhqyj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcnFoZGxkeHFrd3dwa3locXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMDM5MTgsImV4cCI6MjA0NzY3OTkxOH0.JHdmNSR7qJgQI7ZBjqbgzwW2e4q9nKpZVx-gzm-X-i8'
);

async function verificarTablas() {
  console.log('🔍 Verificando tablas creadas...\n');
  
  const tables = ['producto_imagenes', 'producto_configuraciones', 'opciones_configuracion'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Existe y funciona`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Error - ${err.message}`);
    }
  }
  
  console.log('\n🔍 Verificando datos en opciones_configuracion...');
  
  try {
    const { data, error } = await supabase
      .from('opciones_configuracion')
      .select('categoria')
      .limit(10);
    
    if (error) {
      console.log(`❌ Error consultando opciones: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`✅ opciones_configuracion tiene ${data.length} registros`);
      console.log('📋 Categorías encontradas:', data.map(d => d.categoria).join(', '));
    } else {
      console.log(`⚠️ opciones_configuracion está vacía`);
    }
  } catch (err) {
    console.log(`❌ Error verificando datos: ${err.message}`);
  }
  
  console.log('\n📊 Resumen:');
  console.log('Si todas las tablas aparecen con ✅, puedes ejecutar el paso 2');
  console.log('Si hay ❌, necesitas ejecutar nuevamente LIMPIAR-E-IMPLEMENTAR.sql');
}

verificarTablas();
