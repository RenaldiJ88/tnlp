-- Script para verificar y crear las tablas necesarias en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Verificar si existe la tabla productos
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'productos'
) as productos_existe;

-- 2. Verificar si existe la tabla user_roles
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_roles'
) as user_roles_existe;

-- 3. Verificar si existe la tabla clientes
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'clientes'
) as clientes_existe;

-- 4. Verificar si existe la tabla service_orders
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'service_orders'
) as service_orders_existe;

-- 5. Crear tabla productos si no existe
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image VARCHAR(500),
  categoria VARCHAR(100),
  is_offer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Crear tabla user_roles si no existe
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 7. Crear tabla clientes si no existe
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  direccion TEXT,
  documento VARCHAR(50),
  fecha_registro DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Crear tabla service_orders si no existe
CREATE TABLE IF NOT EXISTS service_orders (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  servicios JSONB,
  descripcion_equipo TEXT,
  problema TEXT,
  urgencia VARCHAR(20) DEFAULT 'normal',
  notas TEXT,
  total DECIMAL(10,2) DEFAULT 0,
  estado VARCHAR(50) DEFAULT 'Recibido',
  fecha DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Habilitar RLS en todas las tablas
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- 10. Crear políticas para productos (permite lectura pública, escritura solo para admins)
DROP POLICY IF EXISTS "Allow public read access" ON productos;
CREATE POLICY "Allow public read access" ON productos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write access" ON productos;
CREATE POLICY "Allow admin write access" ON productos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super-admin')
    )
  );

-- 11. Crear políticas para user_roles (permite todo por ahora)
DROP POLICY IF EXISTS "Allow all operations for now" ON user_roles;
CREATE POLICY "Allow all operations for now" ON user_roles
  FOR ALL USING (true);

-- 12. Crear políticas para clientes (solo admins)
DROP POLICY IF EXISTS "Allow admin access to clientes" ON clientes;
CREATE POLICY "Allow admin access to clientes" ON clientes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super-admin')
    )
  );

-- 13. Crear políticas para service_orders (solo admins)
DROP POLICY IF EXISTS "Allow admin access to service_orders" ON service_orders;
CREATE POLICY "Allow admin access to service_orders" ON service_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super-admin')
    )
  );

-- 14. Insertar algunos productos de ejemplo si la tabla está vacía
INSERT INTO productos (title, description, price, image, categoria, is_offer)
SELECT 'Producto de Prueba', 'Descripción de prueba', 99.99, 'test.jpg', 'test', false
WHERE NOT EXISTS (SELECT 1 FROM productos LIMIT 1);

-- 15. Insertar algunos clientes de ejemplo si la tabla está vacía
INSERT INTO clientes (nombre, telefono, direccion, documento)
SELECT 'Cliente de Prueba', '+54 221 123-4567', 'Calle de Prueba 123', '12345678'
WHERE NOT EXISTS (SELECT 1 FROM clientes LIMIT 1);

-- 16. Verificar que el usuario jeroslp@gmail.com tenga rol de admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'super-admin'
FROM auth.users 
WHERE email = 'jeroslp@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super-admin';

-- 17. Verificar el estado final
SELECT 
  'productos' as tabla,
  COUNT(*) as registros
FROM productos
UNION ALL
SELECT 
  'user_roles' as tabla,
  COUNT(*) as registros
FROM user_roles
UNION ALL
SELECT 
  'clientes' as tabla,
  COUNT(*) as registros
FROM clientes
UNION ALL
SELECT 
  'service_orders' as tabla,
  COUNT(*) as registros
FROM service_orders;

-- 18. Verificar el rol del usuario
SELECT 
  u.email,
  ur.role,
  u.raw_app_meta_data->>'role' as auth_role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'jeroslp@gmail.com';
