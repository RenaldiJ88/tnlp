-- =====================================================
-- ACTUALIZAR POLÍTICAS DE SEGURIDAD PARA ACCESO PÚBLICO
-- =====================================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Productos visibles públicamente" ON productos;
DROP POLICY IF EXISTS "Admin puede todo en productos" ON productos;

-- Crear políticas más específicas
-- 1. Permitir lectura pública de productos
CREATE POLICY "Lectura pública de productos" ON productos
    FOR SELECT USING (true);

-- 2. Solo admin puede insertar, actualizar y eliminar productos
CREATE POLICY "Admin puede crear productos" ON productos
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin puede actualizar productos" ON productos
    FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Admin puede eliminar productos" ON productos
    FOR DELETE USING (auth.role() = 'service_role');

-- Verificar que RLS esté habilitado
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
