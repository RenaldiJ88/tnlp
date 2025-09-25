-- =====================================================
-- ESQUEMA COMPLETO PARA NOTEBOOKS CON TODAS LAS CARACTERÍSTICAS
-- Sistema de múltiples imágenes y configuraciones estilo Amazon
-- =====================================================

-- 1. TABLA PARA MÚLTIPLES IMÁGENES POR PRODUCTO
CREATE TABLE IF NOT EXISTS producto_imagenes (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    imagen_url VARCHAR(500) NOT NULL,
    descripcion VARCHAR(255), -- 'Frontal', 'Lateral izquierdo', 'Teclado', 'Puertos', etc.
    orden INTEGER DEFAULT 0, -- Para definir el orden de las imágenes
    es_principal BOOLEAN DEFAULT false, -- Para marcar la imagen principal
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para producto_imagenes
CREATE INDEX IF NOT EXISTS idx_producto_imagenes_producto ON producto_imagenes(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_imagenes_orden ON producto_imagenes(producto_id, orden);

-- 2. TABLA PARA CONFIGURACIONES/VARIANTES DE PRODUCTOS
CREATE TABLE IF NOT EXISTS producto_configuraciones (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL, -- 'Intel i7 + 16GB RAM + RTX 3060 + 15.6" Full HD'
    configuracion JSONB NOT NULL, -- Todas las características del notebook
    precio DECIMAL(12,2) NOT NULL,
    precio_original DECIMAL(12,2), -- Para mostrar descuentos
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100), -- Código único de la configuración
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para producto_configuraciones
CREATE INDEX IF NOT EXISTS idx_producto_configuraciones_producto ON producto_configuraciones(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_configuraciones_activo ON producto_configuraciones(activo);
CREATE INDEX IF NOT EXISTS idx_producto_configuraciones_sku ON producto_configuraciones(sku);

-- 3. TABLA PARA OPCIONES DE CONFIGURACIÓN DISPONIBLES
CREATE TABLE IF NOT EXISTS opciones_configuracion (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para opciones_configuracion
CREATE INDEX IF NOT EXISTS idx_opciones_configuracion_categoria ON opciones_configuracion(categoria);
CREATE INDEX IF NOT EXISTS idx_opciones_configuracion_activo ON opciones_configuracion(activo);

-- 4. INSERTAR TODAS LAS OPCIONES DE CONFIGURACIÓN PARA NOTEBOOKS

-- ============= HARDWARE PRINCIPAL =============

-- Procesadores
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('procesador', 'Intel Core i3', 'Intel Core i3', 1),
('procesador', 'Intel Core i5', 'Intel Core i5', 2),
('procesador', 'Intel Core i7', 'Intel Core i7', 3),
('procesador', 'Intel Core i9', 'Intel Core i9', 4),
('procesador', 'AMD Ryzen 3', 'AMD Ryzen 3', 5),
('procesador', 'AMD Ryzen 5', 'AMD Ryzen 5', 6),
('procesador', 'AMD Ryzen 7', 'AMD Ryzen 7', 7),
('procesador', 'AMD Ryzen 9', 'AMD Ryzen 9', 8)
ON CONFLICT DO NOTHING;

-- Memoria RAM
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('ram', '4GB', '4 GB RAM', 1),
('ram', '8GB', '8 GB RAM', 2),
('ram', '16GB', '16 GB RAM', 3),
('ram', '32GB', '32 GB RAM', 4),
('ram', '64GB', '64 GB RAM', 5)
ON CONFLICT DO NOTHING;

-- Almacenamiento
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('almacenamiento', '256GB SSD', 'SSD 256GB', 1),
('almacenamiento', '512GB SSD', 'SSD 512GB', 2),
('almacenamiento', '1TB SSD', 'SSD 1TB', 3),
('almacenamiento', '2TB SSD', 'SSD 2TB', 4),
('almacenamiento', '500GB HDD', 'HDD 500GB', 5),
('almacenamiento', '1TB HDD', 'HDD 1TB', 6)
ON CONFLICT DO NOTHING;

-- Tamaño de Pantalla
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('pantalla_tamano', '13"', '13 pulgadas', 1),
('pantalla_tamano', '14"', '14 pulgadas', 2),
('pantalla_tamano', '15.6"', '15.6 pulgadas', 3),
('pantalla_tamano', '17"', '17 pulgadas', 4)
ON CONFLICT DO NOTHING;

-- Resolución de Pantalla
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('pantalla_resolucion', 'HD', 'HD (1366x768)', 1),
('pantalla_resolucion', 'Full HD', 'Full HD (1920x1080)', 2),
('pantalla_resolucion', '2K', '2K (2560x1440)', 3),
('pantalla_resolucion', '4K', '4K (3840x2160)', 4)
ON CONFLICT DO NOTHING;

-- Tarjeta Gráfica
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('gpu', 'Integrada', 'Gráficos Integrados', 1),
('gpu', 'GTX 1650', 'NVIDIA GTX 1650', 2),
('gpu', 'RTX 3050', 'NVIDIA RTX 3050', 3),
('gpu', 'RTX 3060', 'NVIDIA RTX 3060', 4),
('gpu', 'RTX 3070', 'NVIDIA RTX 3070', 5),
('gpu', 'RTX 3080', 'NVIDIA RTX 3080', 6),
('gpu', 'RTX 4050', 'NVIDIA RTX 4050', 7),
('gpu', 'RTX 4060', 'NVIDIA RTX 4060', 8),
('gpu', 'RTX 4070', 'NVIDIA RTX 4070', 9)
ON CONFLICT DO NOTHING;

-- ============= CARACTERÍSTICAS ADICIONALES =============

-- Sistema Operativo
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('os', 'Windows 10 Home', 'Windows 10 Home', 1),
('os', 'Windows 10 Pro', 'Windows 10 Pro', 2),
('os', 'Windows 11 Home', 'Windows 11 Home', 3),
('os', 'Windows 11 Pro', 'Windows 11 Pro', 4),
('os', 'Sin Sistema', 'Sin Sistema Operativo', 5)
ON CONFLICT DO NOTHING;

-- Colores Disponibles
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('color', 'Negro', 'Negro', 1),
('color', 'Plata', 'Plata', 2),
('color', 'Blanco', 'Blanco', 3),
('color', 'Gris', 'Gris Espacial', 4),
('color', 'Azul', 'Azul', 5)
ON CONFLICT DO NOTHING;

-- 5. POLÍTICAS DE SEGURIDAD RLS
ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE opciones_configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
DROP POLICY IF EXISTS "Allow read access to producto_imagenes for all users" ON producto_imagenes;
CREATE POLICY "Allow read access to producto_imagenes for all users" 
ON producto_imagenes FOR SELECT 
TO public
USING (true);

DROP POLICY IF EXISTS "Allow read access to producto_configuraciones for all users" ON producto_configuraciones;
CREATE POLICY "Allow read access to producto_configuraciones for all users" 
ON producto_configuraciones FOR SELECT 
TO public
USING (true);

DROP POLICY IF EXISTS "Allow read access to opciones_configuracion for all users" ON opciones_configuracion;
CREATE POLICY "Allow read access to opciones_configuracion for all users" 
ON opciones_configuracion FOR SELECT 
TO public
USING (true);

-- Políticas para administradores
DROP POLICY IF EXISTS "Allow admin operations on producto_imagenes" ON producto_imagenes;
CREATE POLICY "Allow admin operations on producto_imagenes" 
ON producto_imagenes FOR ALL 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow admin operations on producto_configuraciones" ON producto_configuraciones;
CREATE POLICY "Allow admin operations on producto_configuraciones" 
ON producto_configuraciones FOR ALL 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow admin operations on opciones_configuracion" ON opciones_configuracion;
CREATE POLICY "Allow admin operations on opciones_configuracion" 
ON opciones_configuracion FOR ALL 
TO authenticated
USING (true);

-- 6. FUNCIÓN PARA ACTUALIZAR last_modified
CREATE OR REPLACE FUNCTION update_configuraciones_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para producto_configuraciones
DROP TRIGGER IF EXISTS update_producto_configuraciones_last_modified ON producto_configuraciones;
CREATE TRIGGER update_producto_configuraciones_last_modified
    BEFORE UPDATE ON producto_configuraciones
    FOR EACH ROW
    EXECUTE FUNCTION update_configuraciones_last_modified();

-- 7. COMENTARIOS PARA DOCUMENTACIÓN
COMMENT ON TABLE producto_imagenes IS 'Múltiples imágenes por producto estilo Amazon';
COMMENT ON TABLE producto_configuraciones IS 'Diferentes configuraciones/variantes de notebooks con todas las características';
COMMENT ON TABLE opciones_configuracion IS 'Opciones completas para configurar notebooks (procesador, RAM, SSD, pantalla, GPU, OS, color)';

-- 8. VERIFICACIÓN FINAL
SELECT 'ESQUEMA COMPLETO PARA NOTEBOOKS CREADO EXITOSAMENTE' as resultado;

SELECT 'Tablas creadas:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('producto_imagenes', 'producto_configuraciones', 'opciones_configuracion')
AND table_schema = 'public';

SELECT 'Opciones de configuración por categoría:' as info;
SELECT categoria, COUNT(*) as cantidad 
FROM opciones_configuracion 
GROUP BY categoria 
ORDER BY categoria;

-- =====================================================
-- EJEMPLO DE CONFIGURACIÓN COMPLETA:
-- =====================================================

/*
EJEMPLO DE CONFIGURACIÓN JSON COMPLETA:

{
  "procesador": "Intel Core i7",
  "ram": "16GB", 
  "almacenamiento": "1TB SSD",
  "pantalla_tamano": "15.6\"",
  "pantalla_resolucion": "Full HD",
  "gpu": "RTX 3060",
  "os": "Windows 11 Pro",
  "color": "Negro"
}

NOMBRE AUTO-GENERADO:
"Intel i7 | 16GB RAM | SSD 1TB | 15.6\" Full HD | RTX 3060"

ESTO SE REFLEJARÍA EN EL FRONTEND COMO:
- Selector de Procesador: Intel i7 ✓
- Selector de RAM: 16GB ✓  
- Selector de Almacenamiento: SSD 1TB ✓
- Selector de Pantalla: 15.6" Full HD ✓
- Selector de GPU: RTX 3060 ✓
- Selector de OS: Windows 11 Pro ✓
- Selector de Color: Negro ✓
- Precio: US$1,899.00
*/
