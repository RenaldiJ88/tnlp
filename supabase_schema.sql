-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA TNLP
-- =====================================================

-- Tabla de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(50) NOT NULL,
    image VARCHAR(500),
    categoria VARCHAR(50),
    is_offer INTEGER DEFAULT 0,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para productos
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_offer ON productos(is_offer);

-- Tabla de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    documento VARCHAR(50),
    email VARCHAR(255),
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para clientes
CREATE INDEX idx_clientes_telefono ON clientes(telefono);
CREATE INDEX idx_clientes_documento ON clientes(documento);

-- Tabla de órdenes de servicio
CREATE TABLE ordenes_servicio (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    equipo_tipo VARCHAR(100),
    equipo_marca VARCHAR(100),
    equipo_modelo VARCHAR(100),
    problema TEXT,
    urgencia VARCHAR(50) DEFAULT 'Media',
    servicios_seleccionados JSONB,
    total DECIMAL(10,2) DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'Recibido',
    notas TEXT,
    fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_estimada TIMESTAMP WITH TIME ZONE,
    fecha_completado TIMESTAMP WITH TIME ZONE,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para órdenes de servicio
CREATE INDEX idx_ordenes_cliente ON ordenes_servicio(cliente_id);
CREATE INDEX idx_ordenes_estado ON ordenes_servicio(estado);
CREATE INDEX idx_ordenes_urgencia ON ordenes_servicio(urgencia);
CREATE INDEX idx_ordenes_fecha ON ordenes_servicio(fecha_ingreso);

-- Función para actualizar last_modified automáticamente
CREATE OR REPLACE FUNCTION update_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar last_modified
CREATE TRIGGER productos_update_last_modified
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

CREATE TRIGGER clientes_update_last_modified
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

CREATE TRIGGER ordenes_update_last_modified
    BEFORE UPDATE ON ordenes_servicio
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

-- Habilitar Row Level Security (RLS)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_servicio ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (permitir lectura pública para productos, admin completo para todo)
CREATE POLICY "Productos visibles públicamente" ON productos
    FOR SELECT USING (true);

CREATE POLICY "Admin puede todo en productos" ON productos
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin puede todo en clientes" ON clientes
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin puede todo en órdenes" ON ordenes_servicio
    FOR ALL USING (auth.role() = 'service_role');
