-- Script completo para configurar políticas RLS en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Admin puede actualizar productos" ON productos;
DROP POLICY IF EXISTS "Admin puede crear productos" ON productos;
DROP POLICY IF EXISTS "Admin puede eliminar productos" ON productos;
DROP POLICY IF EXISTS "Enable read access for all users" ON productos;
DROP POLICY IF EXISTS "Lectura pública de productos" ON productos;

DROP POLICY IF EXISTS "Admin puede todo en clientes" ON clientes;
DROP POLICY IF EXISTS "Admin puede todo en órdenes" ON ordenes_servicio;

-- 2. Crear políticas correctas para productos
-- Lectura pública (para el frontend)
CREATE POLICY "public_read_products" ON productos
FOR SELECT USING (true);

-- Operaciones admin para usuarios autenticados
CREATE POLICY "authenticated_manage_products" ON productos
FOR ALL USING (auth.role() = 'authenticated');

-- Operaciones admin para service_role (backup)
CREATE POLICY "service_role_manage_products" ON productos
FOR ALL USING (auth.role() = 'service_role');

-- 3. Crear políticas correctas para clientes
-- Lectura pública (para el frontend)
CREATE POLICY "public_read_clients" ON clientes
FOR SELECT USING (true);

-- Operaciones admin para usuarios autenticados
CREATE POLICY "authenticated_manage_clients" ON clientes
FOR ALL USING (auth.role() = 'authenticated');

-- Operaciones admin para service_role (backup)
CREATE POLICY "service_role_manage_clients" ON clientes
FOR ALL USING (auth.role() = 'service_role');

-- 4. Crear políticas correctas para órdenes de servicio
-- Lectura pública (para el frontend)
CREATE POLICY "public_read_service_orders" ON ordenes_servicio
FOR SELECT USING (true);

-- Operaciones admin para usuarios autenticados
CREATE POLICY "authenticated_manage_service_orders" ON ordenes_servicio
FOR ALL USING (auth.role() = 'authenticated');

-- Operaciones admin para service_role (backup)
CREATE POLICY "service_role_manage_service_orders" ON ordenes_servicio
FOR ALL USING (auth.role() = 'service_role');

-- 5. Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('productos', 'clientes', 'ordenes_servicio')
ORDER BY tablename, policyname;
