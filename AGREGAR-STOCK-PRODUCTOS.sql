-- =====================================================
-- AGREGAR CAMPO DE STOCK A LA TABLA PRODUCTOS
-- Ejecutar en SQL Editor de Supabase
-- =====================================================

-- 1. VERIFICAR ESTRUCTURA ACTUAL DE LA TABLA
SELECT 'ESTRUCTURA ACTUAL DE LA TABLA productos' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'productos' 
ORDER BY ordinal_position;

-- 2. AGREGAR CAMPO en_stock SI NO EXISTE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'en_stock'
    ) THEN
        ALTER TABLE productos ADD COLUMN en_stock BOOLEAN DEFAULT true;
        RAISE NOTICE 'Campo en_stock agregado exitosamente';
    ELSE
        RAISE NOTICE 'Campo en_stock ya existe';
    END IF;
END $$;

-- 3. ACTUALIZAR TODOS LOS PRODUCTOS EXISTENTES A "EN STOCK" POR DEFECTO
UPDATE productos 
SET en_stock = true 
WHERE en_stock IS NULL;

-- 4. AGREGAR COMENTARIO AL CAMPO
COMMENT ON COLUMN productos.en_stock IS 'Indica si el producto está disponible en stock (true) o sin stock (false)';

-- 5. VERIFICAR LOS CAMBIOS
SELECT 'DESPUÉS DE AGREGAR EL CAMPO en_stock' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'productos' 
ORDER BY ordinal_position;

-- 6. MOSTRAR ALGUNOS PRODUCTOS DE EJEMPLO
SELECT 'PRODUCTOS DE EJEMPLO CON CAMPO en_stock' as info;
SELECT id, title, price, categoria, en_stock, date_added
FROM productos 
ORDER BY id 
LIMIT 10;

-- 7. CONTAR PRODUCTOS POR ESTADO DE STOCK
SELECT 'RESUMEN DE STOCK' as info;
SELECT 
    COUNT(*) as total_productos,
    COUNT(CASE WHEN en_stock = true THEN 1 END) as en_stock,
    COUNT(CASE WHEN en_stock = false THEN 1 END) as sin_stock,
    COUNT(CASE WHEN en_stock IS NULL THEN 1 END) as stock_null
FROM productos;

-- 8. CREAR ÍNDICE PARA OPTIMIZAR CONSULTAS POR STOCK
CREATE INDEX IF NOT EXISTS idx_productos_en_stock ON productos(en_stock);

SELECT 'CAMPO en_stock AGREGADO EXITOSAMENTE' as resultado;
