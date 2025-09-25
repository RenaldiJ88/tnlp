-- =====================================================
-- ESQUEMA MINIMALISTA ESTILO AMAZON REAL
-- Solo capacidad (RAM+SSD) y color cambian
-- =====================================================

-- 1. LIMPIAR Y RECREAR CONFIGURACIONES SIMPLIFICADAS
DROP TABLE IF EXISTS producto_configuraciones CASCADE;

-- 2. NUEVA TABLA DE CONFIGURACIONES MINIMALISTA
CREATE TABLE producto_configuraciones (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    
    -- DATOS FIJOS DEL PRODUCTO (se almacenan pero no cambian)
    specs_fijas JSONB NOT NULL, -- {"procesador": "Intel i7", "pantalla": "15.6\" Full HD", "gpu": "RTX 3060", "os": "Windows 11"}
    
    -- VARIABLES SIMPLES (solo estas cambian)
    capacidad VARCHAR(100) NOT NULL, -- "8GB RAM | 512GB SSD", "16GB RAM | 1TB SSD"
    capacidad_ram VARCHAR(10) NOT NULL, -- "8GB", "16GB", "32GB"
    capacidad_ssd VARCHAR(10) NOT NULL, -- "512GB", "1TB", "2TB"
    
    color VARCHAR(50) DEFAULT 'Negro', -- "Negro", "Plata", "Gris"
    
    -- PRECIO Y STOCK
    precio DECIMAL(12,2) NOT NULL,
    precio_original DECIMAL(12,2), -- Para descuentos
    stock INTEGER DEFAULT 0,
    
    -- METADATA
    sku VARCHAR(100),
    orden_capacidad INTEGER DEFAULT 1, -- Para ordenar las opciones de capacidad
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_producto_config_simple_producto ON producto_configuraciones(producto_id);
CREATE INDEX idx_producto_config_simple_capacidad ON producto_configuraciones(producto_id, orden_capacidad);
CREATE INDEX idx_producto_config_simple_activo ON producto_configuraciones(activo);

-- 3. TABLA DE COLORES DISPONIBLES (SIMPLE)
CREATE TABLE IF NOT EXISTS colores_disponibles (
    id SERIAL PRIMARY KEY,
    color VARCHAR(50) NOT NULL UNIQUE,
    hex_color VARCHAR(7), -- "#000000", "#C0C0C0", "#808080"
    orden INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT true
);

-- Colores básicos
INSERT INTO colores_disponibles (color, hex_color, orden) VALUES 
('Negro', '#000000', 1),
('Plata', '#C0C0C0', 2),
('Gris', '#808080', 3),
('Blanco', '#FFFFFF', 4)
ON CONFLICT (color) DO NOTHING;

-- 4. POLÍTICAS DE SEGURIDAD
ALTER TABLE producto_configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE colores_disponibles ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Allow read access to producto_configuraciones" 
ON producto_configuraciones FOR SELECT TO public USING (true);

CREATE POLICY "Allow read access to colores_disponibles" 
ON colores_disponibles FOR SELECT TO public USING (true);

-- Admin access
CREATE POLICY "Allow admin operations on producto_configuraciones" 
ON producto_configuraciones FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow admin operations on colores_disponibles" 
ON colores_disponibles FOR ALL TO authenticated USING (true);

-- 5. FUNCIÓN PARA ACTUALIZAR last_modified
CREATE OR REPLACE FUNCTION update_config_simple_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_producto_configuraciones_simple_last_modified
    BEFORE UPDATE ON producto_configuraciones
    FOR EACH ROW
    EXECUTE FUNCTION update_config_simple_last_modified();

-- 6. VISTA PARA CONSULTAS FÁCILES
CREATE OR REPLACE VIEW productos_con_configuraciones AS
SELECT 
    p.*,
    -- Precio más barato
    MIN(pc.precio) as precio_desde,
    -- Datos fijos del primer producto (son iguales para todas las configs)
    (SELECT specs_fijas FROM producto_configuraciones WHERE producto_id = p.id LIMIT 1) as specs_fijas,
    -- Configuraciones disponibles
    COUNT(pc.id) as total_configuraciones,
    COUNT(CASE WHEN pc.stock > 0 THEN 1 END) as configuraciones_en_stock
FROM productos p
LEFT JOIN producto_configuraciones pc ON p.id = pc.producto_id AND pc.activo = true
GROUP BY p.id;

-- 7. DATOS DE EJEMPLO PARA HP SPECTRE X360 (ID 1)
-- Ajustar según tu producto real

/*
EJEMPLO DE CONFIGURACIONES PARA UN PRODUCTO:

-- Specs fijas (iguales para todas las configuraciones)
{
  "procesador": "Intel Core i7",
  "pantalla": "15.6\" Full HD",
  "gpu": "RTX 3060", 
  "os": "Windows 11 Pro",
  "marca": "HP",
  "modelo": "Spectre x360"
}

-- Configuración 1: Básica
INSERT INTO producto_configuraciones (
  producto_id, specs_fijas, capacidad, capacidad_ram, capacidad_ssd, 
  color, precio, stock, sku, orden_capacidad
) VALUES (
  1, 
  '{"procesador": "Intel Core i7", "pantalla": "15.6\" Full HD", "gpu": "RTX 3060", "os": "Windows 11 Pro"}',
  '8GB RAM | 512GB SSD', '8GB', '512GB',
  'Negro', 1299.00, 5, 'HP-SPECTRE-8G-512G-NEGRO', 1
);

-- Configuración 2: Intermedia  
INSERT INTO producto_configuraciones (
  producto_id, specs_fijas, capacidad, capacidad_ram, capacidad_ssd,
  color, precio, precio_original, stock, sku, orden_capacidad
) VALUES (
  1,
  '{"procesador": "Intel Core i7", "pantalla": "15.6\" Full HD", "gpu": "RTX 3060", "os": "Windows 11 Pro"}', 
  '16GB RAM | 1TB SSD', '16GB', '1TB',
  'Negro', 1799.00, 1999.00, 3, 'HP-SPECTRE-16G-1TB-NEGRO', 2
);

-- Configuración 3: Premium
INSERT INTO producto_configuraciones (
  producto_id, specs_fijas, capacidad, capacidad_ram, capacidad_ssd,
  color, precio, stock, sku, orden_capacidad  
) VALUES (
  1,
  '{"procesador": "Intel Core i7", "pantalla": "15.6\" Full HD", "gpu": "RTX 3060", "os": "Windows 11 Pro"}',
  '32GB RAM | 2TB SSD', '32GB', '2TB', 
  'Negro', 2399.00, 1, 'HP-SPECTRE-32G-2TB-NEGRO', 3
);
*/

-- 8. VERIFICACIÓN
SELECT '🎉 ESQUEMA MINIMALISTA IMPLEMENTADO' as resultado;
SELECT 'Tablas creadas:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('producto_configuraciones', 'colores_disponibles')
AND table_schema = 'public';

SELECT '✅ LISTO PARA CONFIGURACIONES SIMPLES ESTILO AMAZON' as final_status;
