-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA SISTEMA DE VENTAS
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id SERIAL PRIMARY KEY,
    numero_proveedor INTEGER UNIQUE NOT NULL, -- 1, 2, 3
    nombre VARCHAR(100) NOT NULL, -- Feyma, Ivan, Alejandro
    telefono VARCHAR(50),
    email VARCHAR(255),
    direccion TEXT,
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE, -- 'Efectivo Pesos', 'Efectivo Dólares', 'Transferencia'
    tipo VARCHAR(20) NOT NULL, -- 'efectivo', 'transferencia'
    moneda VARCHAR(10) NOT NULL DEFAULT 'ARS', -- 'ARS', 'USD'
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE RESTRICT,
    metodo_pago_id INTEGER REFERENCES metodos_pago(id) ON DELETE RESTRICT,
    fecha_venta DATE NOT NULL DEFAULT CURRENT_DATE,
    precio_compra DECIMAL(12,2) NOT NULL DEFAULT 0, -- Lo que pagamos al proveedor
    precio_venta DECIMAL(12,2) NOT NULL DEFAULT 0,  -- Lo que nos pagó el cliente
    ganancia DECIMAL(12,2) GENERATED ALWAYS AS (precio_venta - precio_compra) STORED,
    descripcion TEXT, -- Descripción del producto/servicio vendido
    observaciones TEXT,
    estado VARCHAR(30) DEFAULT 'Completada', -- 'Completada', 'Pendiente', 'Cancelada'
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_proveedor ON ventas(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);
CREATE INDEX IF NOT EXISTS idx_proveedores_numero ON proveedores(numero_proveedor);

-- Insertar proveedores iniciales
INSERT INTO proveedores (numero_proveedor, nombre) VALUES 
(1, 'Feyma'),
(2, 'Ivan'), 
(3, 'Alejandro')
ON CONFLICT (numero_proveedor) DO NOTHING;

-- Insertar métodos de pago iniciales
INSERT INTO metodos_pago (nombre, tipo, moneda) VALUES 
('Efectivo Pesos', 'efectivo', 'ARS'),
('Efectivo Dólares', 'efectivo', 'USD'),
('Transferencia', 'transferencia', 'ARS')
ON CONFLICT (nombre) DO NOTHING;

-- Función para actualizar last_modified automáticamente
CREATE OR REPLACE FUNCTION update_ventas_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar last_modified en ventas
DROP TRIGGER IF EXISTS update_ventas_last_modified ON ventas;
CREATE TRIGGER update_ventas_last_modified
    BEFORE UPDATE ON ventas
    FOR EACH ROW
    EXECUTE FUNCTION update_ventas_last_modified();

-- Trigger para actualizar last_modified en proveedores
DROP TRIGGER IF EXISTS update_proveedores_last_modified ON proveedores;
CREATE TRIGGER update_proveedores_last_modified
    BEFORE UPDATE ON proveedores
    FOR EACH ROW
    EXECUTE FUNCTION update_ventas_last_modified();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE metodos_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

-- Política para proveedores (solo lectura para authenticated users)
DROP POLICY IF EXISTS "Allow read access to proveedores for authenticated users" ON proveedores;
CREATE POLICY "Allow read access to proveedores for authenticated users" 
ON proveedores FOR SELECT 
USING (auth.role() = 'authenticated');

-- Política para métodos de pago (solo lectura para authenticated users)  
DROP POLICY IF EXISTS "Allow read access to metodos_pago for authenticated users" ON metodos_pago;
CREATE POLICY "Allow read access to metodos_pago for authenticated users" 
ON metodos_pago FOR SELECT 
USING (auth.role() = 'authenticated');

-- Políticas para ventas (solo para usuarios autenticados)
DROP POLICY IF EXISTS "Allow all operations on ventas for authenticated users" ON ventas;
CREATE POLICY "Allow all operations on ventas for authenticated users" 
ON ventas FOR ALL 
USING (auth.role() = 'authenticated');

-- Comentarios para documentación
COMMENT ON TABLE proveedores IS 'Tabla de proveedores del negocio';
COMMENT ON TABLE metodos_pago IS 'Métodos de pago disponibles para las ventas';
COMMENT ON TABLE ventas IS 'Registro de ventas realizadas a clientes';
COMMENT ON COLUMN ventas.ganancia IS 'Ganancia calculada automáticamente (precio_venta - precio_compra)';
COMMENT ON COLUMN proveedores.numero_proveedor IS 'Número identificatorio del proveedor (1=Feyma, 2=Ivan, 3=Alejandro)';
