-- Script rápido para configurar admin en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Habilitar RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Política simple para user_roles
CREATE POLICY "Allow all operations for now" ON user_roles
  FOR ALL USING (true);

-- 4. Asignar rol de admin a jeroslp@gmail.com
-- Primero obtener el UUID del usuario
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Obtener el UUID del usuario por email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = 'jeroslp@gmail.com';
  
  IF target_user_id IS NOT NULL THEN
    -- Insertar o actualizar el rol
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id) 
    DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'Usuario % asignado como admin', 'jeroslp@gmail.com';
  ELSE
    RAISE NOTICE 'Usuario jeroslp@gmail.com no encontrado';
  END IF;
END $$;

-- 5. Verificar que se asignó correctamente
SELECT 
  u.email, 
  ur.role,
  u.created_at as user_created,
  ur.created_at as role_created
FROM auth.users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
WHERE u.email = 'jeroslp@gmail.com';

-- 6. Mostrar todos los usuarios con roles
SELECT 
  u.email, 
  COALESCE(ur.role, 'sin rol') as role,
  u.created_at
FROM auth.users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id 
ORDER BY u.created_at DESC;
