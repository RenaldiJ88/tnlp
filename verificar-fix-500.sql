-- Verificar que las tablas existan con los nombres correctos
SELECT 
  table_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = table_name
  ) as existe
FROM (VALUES 
  ('productos'),
  ('user_roles'), 
  ('clientes'),
  ('ordenes_servicio')
) AS t(table_name);

-- Verificar estructura de clientes
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'clientes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar estructura de ordenes_servicio
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'ordenes_servicio' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Si las tablas no existen, crearlas:
-- Crear tabla clientes si no existe
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    documento VARCHAR(50),
    email VARCHAR(255),
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla ordenes_servicio si no existe
CREATE TABLE IF NOT EXISTS ordenes_servicio (
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

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_servicio ENABLE ROW LEVEL SECURITY;

-- Crear políticas
DROP POLICY IF EXISTS "Admin puede todo en clientes" ON clientes;
CREATE POLICY "Admin puede todo en clientes" ON clientes
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin puede todo en órdenes" ON ordenes_servicio;
CREATE POLICY "Admin puede todo en órdenes" ON ordenes_servicio
    FOR ALL USING (auth.role() = 'service_role');

-- Verificar el usuario super-admin
SELECT 
  u.email,
  ur.role,
  u.raw_app_meta_data->>'role' as auth_role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'jeroslp@gmail.com';
