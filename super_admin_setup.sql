-- Script para configurar super-admin en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Actualizar el rol en auth.users
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "super-admin"}' 
WHERE id = '46fd26a1-6d63-4dec-ad13-c4701889d924';

-- 2. Verificar que se actualizó correctamente
SELECT 
  id,
  email,
  raw_app_meta_data->>'role' as role,
  raw_app_meta_data
FROM auth.users 
WHERE id = '46fd26a1-6d63-4dec-ad13-c4701889d924';

-- 3. Crear la tabla user_roles si no existe
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Habilitar RLS en user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Crear política para user_roles (permite todo por ahora)
DROP POLICY IF EXISTS "Allow all operations for now" ON user_roles;
CREATE POLICY "Allow all operations for now" ON user_roles
  FOR ALL USING (true);

-- 6. Insertar/actualizar rol en user_roles
INSERT INTO user_roles (user_id, role) 
VALUES ('46fd26a1-6d63-4dec-ad13-c4701889d924', 'super-admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super-admin';

-- 7. Verificar la tabla user_roles
SELECT * FROM user_roles WHERE user_id = '46fd26a1-6d63-4dec-ad13-c4701889d924';

-- 8. Crear función para verificar si es admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  -- Si no se pasa user_uuid, usar el usuario actual
  IF user_uuid IS NULL THEN
    user_uuid := auth.uid();
  END IF;
  
  -- Verificar en user_roles
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'super-admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Crear función para obtener el rol del usuario
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Si no se pasa user_uuid, usar el usuario actual
  IF user_uuid IS NULL THEN
    user_uuid := auth.uid();
  END IF;
  
  -- Obtener rol de user_roles
  SELECT role INTO user_role FROM user_roles WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Verificar las funciones
SELECT is_admin('46fd26a1-6d63-4dec-ad13-c4701889d924');
SELECT get_user_role('46fd26a1-6d63-4dec-ad13-c4701889d924');
