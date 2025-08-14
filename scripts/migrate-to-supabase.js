// migrate-to-supabase.js
// Script para migrar datos de JSON a Supabase

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Para usar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Variables de entorno de Supabase no encontradas');
    console.log('Asegúrate de que NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY estén en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateProducts() {
    console.log('🔄 Migrando productos...');
    
    try {
        // Leer archivo de productos
        const productsPath = path.join(__dirname, '../src/data/products-unified.json');
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        
        console.log(`📦 Encontrados ${productsData.productos.length} productos`);
        
        // Preparar datos para inserción
        const productosParaInsertar = productsData.productos.map(producto => ({
            id: parseInt(producto.id),
            title: producto.title,
            description: producto.description,
            price: producto.price,
            image: producto.image,
            categoria: producto.categoria,
            is_offer: producto.isOffer || 0,
            last_modified: producto.lastModified || new Date().toISOString()
        }));
        
        // Insertar productos en Supabase
        const { data, error } = await supabase
            .from('productos')
            .upsert(productosParaInsertar, { onConflict: 'id' });
        
        if (error) {
            console.error('❌ Error al insertar productos:', error);
            return false;
        }
        
        console.log('✅ Productos migrados exitosamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error al migrar productos:', error);
        return false;
    }
}

async function migrateClients() {
    console.log('🔄 Migrando clientes...');
    
    try {
        // Leer archivo de clientes
        const clientsPath = path.join(__dirname, '../src/data/clients.json');
        const clientsData = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));
        
        console.log(`👥 Encontrados ${clientsData.clientes ? clientsData.clientes.length : 0} clientes`);
        
        if (!clientsData.clientes || clientsData.clientes.length === 0) {
            console.log('📝 No hay clientes para migrar');
            return true;
        }
        
        // Preparar datos para inserción
        const clientesParaInsertar = clientsData.clientes.map(cliente => ({
            id: cliente.id,
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            direccion: cliente.direccion,
            documento: cliente.documento,
            email: cliente.email || null
        }));
        
        // Insertar clientes en Supabase
        const { data, error } = await supabase
            .from('clientes')
            .upsert(clientesParaInsertar, { onConflict: 'id' });
        
        if (error) {
            console.error('❌ Error al insertar clientes:', error);
            return false;
        }
        
        console.log('✅ Clientes migrados exitosamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error al migrar clientes:', error);
        return false;
    }
}

async function migrateServiceOrders() {
    console.log('🔄 Migrando órdenes de servicio...');
    
    try {
        // Leer archivo de órdenes de servicio
        const ordersPath = path.join(__dirname, '../src/data/service-orders.json');
        const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        
        console.log(`🔧 Encontradas ${ordersData.ordenes ? ordersData.ordenes.length : 0} órdenes`);
        
        if (!ordersData.ordenes || ordersData.ordenes.length === 0) {
            console.log('📝 No hay órdenes para migrar');
            return true;
        }
        
        // Preparar datos para inserción
        const ordenesParaInsertar = ordersData.ordenes.map(orden => ({
            id: orden.id,
            cliente_id: orden.clienteId,
            equipo_tipo: orden.detalles?.descripcionEquipo || 'No especificado',
            equipo_marca: 'No especificado', // No hay en la estructura actual
            equipo_modelo: 'No especificado', // No hay en la estructura actual
            problema: orden.detalles?.problema || '',
            urgencia: orden.detalles?.urgencia || 'Media',
            servicios_seleccionados: orden.servicios || [],
            total: parseFloat(orden.total) || 0,
            estado: orden.estado || 'Recibido',
            notas: orden.detalles?.notas || '',
            fecha_ingreso: orden.fechaCreacion || orden.fecha,
            fecha_estimada: null,
            fecha_completado: null
        }));
        
        // Insertar órdenes en Supabase
        const { data, error } = await supabase
            .from('ordenes_servicio')
            .upsert(ordenesParaInsertar, { onConflict: 'id' });
        
        if (error) {
            console.error('❌ Error al insertar órdenes:', error);
            return false;
        }
        
        console.log('✅ Órdenes de servicio migradas exitosamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error al migrar órdenes:', error);
        return false;
    }
}

async function testConnection() {
    console.log('🔗 Probando conexión a Supabase...');
    
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('❌ Error de conexión:', error);
            return false;
        }
        
        console.log('✅ Conexión a Supabase exitosa');
        return true;
        
    } catch (error) {
        console.error('❌ Error al probar conexión:', error);
        return false;
    }
}

async function main() {
    console.log('🚀 Iniciando migración a Supabase...\n');
    
    // Probar conexión
    const connectionOk = await testConnection();
    if (!connectionOk) {
        console.log('❌ Migración abortada debido a problemas de conexión');
        process.exit(1);
    }
    
    console.log('');
    
    // Migrar datos
    const productsOk = await migrateProducts();
    console.log('');
    
    const clientsOk = await migrateClients();
    console.log('');
    
    const ordersOk = await migrateServiceOrders();
    console.log('');
    
    // Resumen
    if (productsOk && clientsOk && ordersOk) {
        console.log('🎉 ¡Migración completada exitosamente!');
        console.log('📊 Todos los datos han sido transferidos a Supabase');
        
        // Mostrar estadísticas finales
        try {
            const { data: productos } = await supabase
                .from('productos')
                .select('id');
            
            const { data: clientes } = await supabase
                .from('clientes')
                .select('id');
            
            const { data: ordenes } = await supabase
                .from('ordenes_servicio')
                .select('id');
            
            console.log('\n📈 Estadísticas finales:');
            console.log(`   • Productos: ${productos?.length || 0}`);
            console.log(`   • Clientes: ${clientes?.length || 0}`);
            console.log(`   • Órdenes: ${ordenes?.length || 0}`);
            
        } catch (error) {
            console.log('ℹ️ No se pudieron obtener estadísticas finales');
        }
        
    } else {
        console.log('❌ La migración se completó con errores');
        console.log('📝 Revisa los mensajes de error anteriores');
    }
}

// Ejecutar migración
main().catch(console.error);
