-- Script para corregir políticas RLS en Supabase basado en tu configuración actual
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar las políticas mal configuradas (las que están en {public} role)
DROP POLICY IF EXISTS "admin_manage_clients" ON clientes;
DROP POLICY IF EXISTS "admin_manage_service_orders" ON ordenes_servicio;
DROP POLICY IF EXISTS "admin_manage_products" ON productos;

-- 2. Crear políticas correctas para cada tabla

-- POLÍTICAS PARA PRODUCTOS
-- Mantener la lectura pública (ya existe y está bien)
-- Crear política para service_role (usado por supabaseAdmin)
CREATE POLICY "admin_manage_products_service_role" ON productos
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Crear política para usuarios autenticados (si usas login de Supabase)
CREATE POLICY "admin_manage_products_authenticated" ON productos
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- POLÍTICAS PARA CLIENTES
-- Crear política para service_role
CREATE POLICY "admin_manage_clients_service_role" ON clientes
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Crear política para usuarios autenticados
CREATE POLICY "admin_manage_clients_authenticated" ON clientes
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- POLÍTICAS PARA ÓRDENES DE SERVICIO
-- Crear política para service_role
CREATE POLICY "admin_manage_service_orders_service_role" ON ordenes_servicio
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Crear política para usuarios autenticados
CREATE POLICY "admin_manage_service_orders_authenticated" ON ordenes_servicio
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Verificar que las políticas se crearon correctamente
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename IN ('productos', 'clientes', 'ordenes_servicio')
ORDER BY tablename, policyname;
