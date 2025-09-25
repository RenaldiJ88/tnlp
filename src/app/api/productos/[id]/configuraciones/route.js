import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        if (!id) {
            return Response.json({ error: 'ID del producto requerido' }, { status: 400 });
        }

        // Obtener configuraciones del producto
        const { data: configurations, error } = await supabase
            .from('producto_configuraciones')
            .select('*')
            .eq('producto_id', id)
            .eq('activo', true)
            .order('orden_capacidad', { ascending: true });

        if (error) {
            console.error('Error fetching configurations:', error);
            return Response.json({ error: 'Error cargando configuraciones' }, { status: 500 });
        }

        // Si no hay configuraciones, devolver array vacío
        if (!configurations || configurations.length === 0) {
            return Response.json({ 
                configurations: [],
                message: 'No hay configuraciones disponibles para este producto'
            });
        }

        // Transformar datos para el frontend
        const transformedConfigurations = configurations.map(config => ({
            id: config.id,
            producto_id: config.producto_id,
            specs_fijas: config.specs_fijas,
            capacidad: config.capacidad,
            capacidad_ram: config.capacidad_ram,
            capacidad_ssd: config.capacidad_ssd,
            color: config.color,
            precio: parseFloat(config.precio),
            precio_original: config.precio_original ? parseFloat(config.precio_original) : null,
            stock: config.stock,
            sku: config.sku,
            orden_capacidad: config.orden_capacidad,
            activo: config.activo,
            date_added: config.date_added,
            last_modified: config.last_modified
        }));

        return Response.json({
            configurations: transformedConfigurations,
            total: transformedConfigurations.length
        });

    } catch (error) {
        console.error('Error in configurations API:', error);
        return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// POST - Crear nueva configuración
export async function POST(request, { params }) {
    try {
        const { id } = params;
        const configData = await request.json();
        
        if (!id) {
            return Response.json({ error: 'ID del producto requerido' }, { status: 400 });
        }

        // Validaciones básicas
        if (!configData.capacidad_ram || !configData.capacidad_ssd || !configData.precio) {
            return Response.json({ 
                error: 'RAM, SSD y precio son requeridos' 
            }, { status: 400 });
        }

        // Generar capacidad automáticamente
        const capacidad = `${configData.capacidad_ram} RAM | ${configData.capacidad_ssd} SSD`;
        
        // Generar SKU automáticamente
        const generateSKU = (specs, ram, ssd, color) => {
            const marca = specs?.procesador?.includes('Intel') ? 'INTEL' : 'AMD';
            const ramNum = ram.replace('GB', '');
            const ssdShort = ssd.replace('GB', '').replace('TB', 'T');
            const colorShort = color.substring(0, 3).toUpperCase();
            return `${marca}-${ramNum}G-${ssdShort}-${colorShort}`;
        };

        const sku = generateSKU(
            configData.specs_fijas, 
            configData.capacidad_ram, 
            configData.capacidad_ssd, 
            configData.color || 'Negro'
        );

        // Obtener el siguiente orden
        const { data: existingConfigs } = await supabase
            .from('producto_configuraciones')
            .select('orden_capacidad')
            .eq('producto_id', id)
            .order('orden_capacidad', { ascending: false })
            .limit(1);

        const nextOrder = existingConfigs && existingConfigs.length > 0 
            ? existingConfigs[0].orden_capacidad + 1 
            : 1;

        // Preparar datos para inserción
        const newConfig = {
            producto_id: parseInt(id),
            specs_fijas: configData.specs_fijas || {
                procesador: 'Intel Core i7',
                pantalla: '15.6" Full HD',
                gpu: 'RTX 3060',
                os: 'Windows 11 Pro'
            },
            capacidad: capacidad,
            capacidad_ram: configData.capacidad_ram,
            capacidad_ssd: configData.capacidad_ssd,
            color: configData.color || 'Negro',
            precio: parseFloat(configData.precio),
            precio_original: configData.precio_original ? parseFloat(configData.precio_original) : null,
            stock: parseInt(configData.stock) || 0,
            sku: sku,
            orden_capacidad: nextOrder,
            activo: true
        };

        // Insertar en la base de datos
        const { data, error } = await supabase
            .from('producto_configuraciones')
            .insert([newConfig])
            .select();

        if (error) {
            console.error('Error creating configuration:', error);
            return Response.json({ error: 'Error creando configuración' }, { status: 500 });
        }

        return Response.json({ 
            configuration: data[0],
            message: 'Configuración creada exitosamente'
        });

    } catch (error) {
        console.error('Error in POST configurations API:', error);
        return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
