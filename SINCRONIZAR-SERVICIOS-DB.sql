-- =====================================================
-- SCRIPT DE SINCRONIZACIÓN DE SERVICIOS
-- Soluciona problemas de inconsistencia entre el dashboard y la DB
-- =====================================================

-- 1. VERIFICAR ESTADO ACTUAL
SELECT 'ESTADO ACTUAL DE LA TABLA servicios_precios' as info;
SELECT servicio_id, nombre, categoria, subcategoria, precio, activo 
FROM servicios_precios 
ORDER BY categoria, subcategoria, nombre;

-- 2. ACTUALIZAR/INSERTAR TODOS LOS SERVICIOS FALTANTES
-- Esto asegura que todos los servicios estén en la base de datos con los IDs correctos

INSERT INTO servicios_precios (servicio_id, nombre, categoria, subcategoria, precio, activo) VALUES 
-- Mantenimiento - Limpiezas
('limpieza-advance-cpu', 'Limpieza Advance CPU', 'Mantenimiento', 'Limpiezas', 8000, true),
('limpieza-advance-notebook', 'Limpieza Advance Notebook', 'Mantenimiento', 'Limpiezas', 7000, true),
('limpieza-pro-g-cpu', 'Limpieza Pro G CPU', 'Mantenimiento', 'Limpiezas', 10000, true),
('limpieza-pro-g-notebook', 'Limpieza Pro G Notebook', 'Mantenimiento', 'Limpiezas', 9000, true),
('limpieza-elite-notebook', 'Limpieza Elite Notebook', 'Mantenimiento', 'Limpiezas', 12000, true),
('limpieza-pro-g-console', 'Limpieza Pro G Play/Xbox', 'Mantenimiento', 'Limpiezas', 8500, true),

-- Up-Grade y mejoras
('agregar-ssd', 'Agregar SSD', 'Up-Grade y mejoras', 'Mejoras', 15000, true),
('agregar-ram', 'Agregar RAM', 'Up-Grade y mejoras', 'Mejoras', 12000, true),
('instalacion-so', 'Instalación SO', 'Up-Grade y mejoras', 'Mejoras', 5000, true),
('evolucion-rendimiento', 'Evolución de rendimiento', 'Up-Grade y mejoras', 'Mejoras', 18000, true),

-- Reparaciones - Componentes
('reparacion-mother', 'Reparación Mother', 'Reparaciones', 'Componentes', 25000, true),
('reparacion-cargador', 'Reparación Cargador', 'Reparaciones', 'Componentes', 8000, true),
('reparacion-pin-carga', 'Reparación Pin de carga', 'Reparaciones', 'Componentes', 12000, true),

-- Reparaciones - Hardware
('cambio-bisagras', 'Cambio Bisagras', 'Reparaciones', 'Hardware', 15000, true),
('cambio-pantalla', 'Cambio Pantalla', 'Reparaciones', 'Hardware', 20000, true),
('cambio-teclado', 'Cambio Teclado', 'Reparaciones', 'Hardware', 10000, true),
('cambio-bateria', 'Cambio Batería', 'Reparaciones', 'Hardware', 12000, true),
('cambio-carcasa', 'Cambio Carcasa', 'Reparaciones', 'Hardware', 18000, true)

ON CONFLICT (servicio_id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    categoria = EXCLUDED.categoria,
    subcategoria = EXCLUDED.subcategoria,
    precio = CASE 
        WHEN servicios_precios.precio = 0 THEN EXCLUDED.precio 
        ELSE servicios_precios.precio 
    END,
    activo = COALESCE(servicios_precios.activo, EXCLUDED.activo);

-- 3. VERIFICAR SERVICIOS DESPUÉS DE LA SINCRONIZACIÓN
SELECT 'DESPUÉS DE LA SINCRONIZACIÓN' as info;
SELECT servicio_id, nombre, categoria, subcategoria, precio, activo 
FROM servicios_precios 
ORDER BY categoria, subcategoria, nombre;

-- 4. CONTAR SERVICIOS POR CATEGORÍA
SELECT 'RESUMEN POR CATEGORÍA' as info;
SELECT categoria, COUNT(*) as cantidad_servicios, 
       COUNT(CASE WHEN activo = true THEN 1 END) as activos,
       COUNT(CASE WHEN activo = false THEN 1 END) as inactivos
FROM servicios_precios 
GROUP BY categoria
ORDER BY categoria;

-- 5. VERIFICAR QUE NO HAY DUPLICADOS
SELECT 'VERIFICACIÓN DE DUPLICADOS' as info;
SELECT servicio_id, COUNT(*) as duplicados
FROM servicios_precios 
GROUP BY servicio_id
HAVING COUNT(*) > 1;

-- 6. RESULTADO FINAL
SELECT 'SINCRONIZACIÓN COMPLETADA EXITOSAMENTE' as resultado,
       COUNT(*) as total_servicios_en_db
FROM servicios_precios;
