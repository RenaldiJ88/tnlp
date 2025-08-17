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

-- 3. Crear tabla productos si no existe
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

-- 4. Crear tabla user_roles si no existe
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 5. Habilitar RLS en ambas tablas
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas para productos (permite lectura pública, escritura solo para admins)
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

-- 7. Crear políticas para user_roles (permite todo por ahora)
DROP POLICY IF EXISTS "Allow all operations for now" ON user_roles;
CREATE POLICY "Allow all operations for now" ON user_roles
  FOR ALL USING (true);

-- 8. Insertar algunos productos de ejemplo si la tabla está vacía
INSERT INTO productos (title, description, price, image, categoria, is_offer)
SELECT 'Producto de Prueba', 'Descripción de prueba', 99.99, 'test.jpg', 'test', false
WHERE NOT EXISTS (SELECT 1 FROM productos LIMIT 1);

-- 9. Verificar que el usuario jeroslp@gmail.com tenga rol de admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'super-admin'
FROM auth.users 
WHERE email = 'jeroslp@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super-admin';

-- 10. Verificar el estado final
SELECT 
  'productos' as tabla,
  COUNT(*) as registros
FROM productos
UNION ALL
SELECT 
  'user_roles' as tabla,
  COUNT(*) as registros
FROM user_roles;

-- 11. Verificar el rol del usuario
SELECT 
  u.email,
  ur.role,
  u.raw_app_meta_data->>'role' as auth_role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'jeroslp@gmail.com';
