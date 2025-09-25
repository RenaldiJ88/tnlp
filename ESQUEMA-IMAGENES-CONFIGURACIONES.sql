-- =====================================================
-- ESQUEMA PARA MÚLTIPLES IMÁGENES Y CONFIGURACIONES DE PRODUCTOS
-- Estilo Amazon con galería de imágenes y variantes
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
    nombre VARCHAR(100) NOT NULL, -- 'RAM 16GB + SSD 512GB', 'RAM 32GB + SSD 1TB'
    configuracion JSONB NOT NULL, -- {'ram': '16GB', 'ssd': '512GB', 'os': 'Windows 11 Pro'}
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
    categoria VARCHAR(50) NOT NULL, -- 'ram', 'ssd', 'os', 'procesador', 'gpu'
    valor VARCHAR(100) NOT NULL, -- '16GB', '32GB', '512GB', '1TB', 'Windows 11 Pro'
    display_name VARCHAR(150) NOT NULL, -- '16 GB DE RAM', '1TB SSD', 'Windows 11 Pro'
    descripcion TEXT, -- Descripción adicional
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para opciones_configuracion
CREATE INDEX IF NOT EXISTS idx_opciones_configuracion_categoria ON opciones_configuracion(categoria);
CREATE INDEX IF NOT EXISTS idx_opciones_configuracion_activo ON opciones_configuracion(activo);

-- 4. INSERTAR OPCIONES DE CONFIGURACIÓN INICIALES

-- Opciones de RAM
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('ram', '8GB', '8 GB DE RAM', 1),
('ram', '16GB', '16 GB DE RAM', 2),
('ram', '32GB', '32 GB DE RAM', 3),
('ram', '64GB', '64 GB DE RAM', 4)
ON CONFLICT DO NOTHING;

-- Opciones de SSD
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('ssd', '256GB', 'SSD 256GB', 1),
('ssd', '512GB', 'SSD 512GB', 2),
('ssd', '1TB', 'SSD 1TB', 3),
('ssd', '2TB', 'SSD 2TB', 4)
ON CONFLICT DO NOTHING;

-- Opciones de Sistema Operativo
INSERT INTO opciones_configuracion (categoria, valor, display_name, orden) VALUES 
('os', 'Windows 10 Home', 'Windows 10 Home', 1),
('os', 'Windows 10 Pro', 'Windows 10 Pro', 2),
('os', 'Windows 11 Home', 'Windows 11 Home', 3),
('os', 'Windows 11 Pro', 'Windows 11 Pro', 4),
('os', 'Sin Sistema', 'Sin Sistema Operativo', 5)
ON CONFLICT DO NOTHING;

-- 5. FUNCIÓN PARA OBTENER PRECIO BASE MÁS BARATO DE UN PRODUCTO
CREATE OR REPLACE FUNCTION get_precio_base_producto(producto_id_param INTEGER)
RETURNS DECIMAL(12,2) AS $$
BEGIN
    RETURN (
        SELECT MIN(precio) 
        FROM producto_configuraciones 
        WHERE producto_id = producto_id_param AND activo = true
    );
END;
$$ LANGUAGE plpgsql;

-- 6. VISTA PARA PRODUCTOS CON SUS CONFIGURACIONES
CREATE OR REPLACE VIEW productos_completos AS
SELECT 
    p.*,
    get_precio_base_producto(p.id) as precio_desde,
    COUNT(pc.id) as total_configuraciones,
    COUNT(CASE WHEN pc.stock > 0 THEN 1 END) as configuraciones_en_stock,
    pi_principal.imagen_url as imagen_principal,
    CASE 
        WHEN COUNT(CASE WHEN pc.stock > 0 THEN 1 END) > 0 THEN true
        ELSE false
    END as tiene_stock
FROM productos p
LEFT JOIN producto_configuraciones pc ON p.id = pc.producto_id AND pc.activo = true
LEFT JOIN producto_imagenes pi_principal ON p.id = pi_principal.producto_id AND pi_principal.es_principal = true
GROUP BY p.id, pi_principal.imagen_url;

-- 7. POLÍTICAS DE SEGURIDAD RLS
ALTER TABLE producto_imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE opciones_configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas para producto_imagenes
DROP POLICY IF EXISTS "Allow read access to producto_imagenes for all users" ON producto_imagenes;
CREATE POLICY "Allow read access to producto_imagenes for all users" 
ON producto_imagenes FOR SELECT 
USING (true);

-- Políticas para producto_configuraciones
DROP POLICY IF EXISTS "Allow read access to producto_configuraciones for all users" ON producto_configuraciones;
CREATE POLICY "Allow read access to producto_configuraciones for all users" 
ON producto_configuraciones FOR SELECT 
USING (true);

-- Políticas para opciones_configuracion
DROP POLICY IF EXISTS "Allow read access to opciones_configuracion for all users" ON opciones_configuracion;
CREATE POLICY "Allow read access to opciones_configuracion for all users" 
ON opciones_configuracion FOR SELECT 
USING (true);

-- 8. FUNCIÓN PARA ACTUALIZAR last_modified
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

-- 9. COMENTARIOS PARA DOCUMENTACIÓN
COMMENT ON TABLE producto_imagenes IS 'Múltiples imágenes por producto estilo Amazon';
COMMENT ON TABLE producto_configuraciones IS 'Diferentes configuraciones/variantes de un producto con precios específicos';
COMMENT ON TABLE opciones_configuracion IS 'Opciones disponibles para configurar productos (RAM, SSD, OS, etc.)';
COMMENT ON VIEW productos_completos IS 'Vista que combina productos con sus configuraciones e imágenes';

-- 10. DATOS DE EJEMPLO PARA UN PRODUCTO HP SPECTRE x360
-- (Asumiendo que existe un producto con id = 1)
/*
-- Ejemplo de imágenes para producto HP Spectre x360
INSERT INTO producto_imagenes (producto_id, imagen_url, descripcion, orden, es_principal) VALUES 
(1, '/img/products/hp-spectre-frontal.jpg', 'Vista frontal', 1, true),
(1, '/img/products/hp-spectre-lateral.jpg', 'Vista lateral izquierda', 2, false),
(1, '/img/products/hp-spectre-teclado.jpg', 'Vista del teclado', 3, false),
(1, '/img/products/hp-spectre-puertos.jpg', 'Puertos laterales', 4, false),
(1, '/img/products/hp-spectre-trasera.jpg', 'Vista trasera', 5, false);

-- Ejemplo de configuraciones para producto HP Spectre x360
INSERT INTO producto_configuraciones (producto_id, nombre, configuracion, precio, stock, sku) VALUES 
(1, '16 GB DE RAM | SSD 512GB', '{"ram": "16GB", "ssd": "512GB", "os": "Windows 11 Pro"}', 1739.00, 5, 'HP-SPECTRE-16GB-512GB'),
(1, '16GB RAM | 2TB SSD', '{"ram": "16GB", "ssd": "2TB", "os": "Windows 11 Pro"}', 1859.00, 3, 'HP-SPECTRE-16GB-2TB'),
(1, '16GB RAM | 4TB SSD', '{"ram": "16GB", "ssd": "4TB", "os": "Windows 11 Pro"}', 2039.00, 2, 'HP-SPECTRE-16GB-4TB');
*/
