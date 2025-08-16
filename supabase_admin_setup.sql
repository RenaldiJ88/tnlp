-- Script para configurar sistema de roles de administrador en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Crear tabla de roles de usuario
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas RLS para user_roles
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Crear función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS VARCHAR AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM user_roles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Crear función para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Insertar el usuario jeroslp@gmail.com como admin
-- Primero necesitamos obtener su UUID
-- Ejecutar esto después de obtener el UUID del usuario

-- 8. Crear políticas RLS para la tabla productos (si existe)
-- Asumiendo que tienes una tabla 'productos'
CREATE POLICY "Admins can manage all products" ON productos
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view products" ON productos
  FOR SELECT USING (true);

-- 9. Crear políticas RLS para otras tablas admin si las tienes
-- Clientes
CREATE POLICY "Admins can manage all clients" ON clientes
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view clients" ON clientes
  FOR SELECT USING (true);

-- Órdenes de servicio
CREATE POLICY "Admins can manage all service orders" ON service_orders
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view service orders" ON service_orders
  FOR SELECT USING (true);

-- Servicios
CREATE POLICY "Admins can manage all services" ON servicios
  FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view services" ON servicios
  FOR SELECT USING (true);

-- 10. Función para asignar rol de admin a un usuario por email
CREATE OR REPLACE FUNCTION assign_admin_role(user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Obtener el UUID del usuario por email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado con email: %', user_email;
  END IF;
  
  -- Insertar o actualizar el rol
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();
    
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Ejecutar la función para asignar admin a jeroslp@gmail.com
-- SELECT assign_admin_role('jeroslp@gmail.com');

-- 12. Verificar que se asignó correctamente
-- SELECT u.email, ur.role 
-- FROM auth.users u 
-- JOIN user_roles ur ON u.id = ur.user_id 
-- WHERE u.email = 'jeroslp@gmail.com';
