-- =====================================================
-- CREAR LAS TABLAS FALTANTES EN SUPABASE
-- Ejecutar en SQL Editor de Supabase
-- =====================================================

-- 1. CREAR TABLA configuracion_sitio (LA MÁS IMPORTANTE)
CREATE TABLE IF NOT EXISTS configuracion_sitio (
    id SERIAL PRIMARY KEY,
    seccion VARCHAR(50) NOT NULL UNIQUE,
    configuracion JSONB NOT NULL,
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR TABLA servicios_generales
CREATE TABLE IF NOT EXISTS servicios_generales (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    img_service VARCHAR(500),
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_configuracion_seccion ON configuracion_sitio(seccion);
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios_generales(categoria);

-- 4. HABILITAR ROW LEVEL SECURITY
ALTER TABLE configuracion_sitio ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_generales ENABLE ROW LEVEL SECURITY;

-- 5. CREAR POLÍTICAS DE SEGURIDAD
DROP POLICY IF EXISTS "Configuración visible públicamente" ON configuracion_sitio;
CREATE POLICY "Configuración visible públicamente" ON configuracion_sitio
    FOR SELECT USING (seccion IN ('sitio', 'tema'));

DROP POLICY IF EXISTS "Admin puede todo en configuración" ON configuracion_sitio;
CREATE POLICY "Admin puede todo en configuración" ON configuracion_sitio
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Servicios generales visibles públicamente" ON servicios_generales;
CREATE POLICY "Servicios generales visibles públicamente" ON servicios_generales
    FOR SELECT USING (activo = true);

DROP POLICY IF EXISTS "Admin puede todo en servicios generales" ON servicios_generales;
CREATE POLICY "Admin puede todo en servicios generales" ON servicios_generales
    FOR ALL USING (auth.role() = 'service_role');

-- 6. INSERTAR DATOS INICIALES PARA CONFIGURACIÓN
INSERT INTO configuracion_sitio (seccion, configuracion) VALUES 
('sitio', '{
    "whatsapp": "5492216767615",
    "email": "info@tunotebooklaplata.com",
    "direccion": "La Plata, Buenos Aires",
    "horarios": "Lun-Vie 9:00-18:00, Sab 9:00-13:00",
    "redes": {
        "instagram": "@tunotebooklaplata",
        "facebook": "tunotebooklaplata"
    }
}'),
('tema', '{
    "colorPrimario": "#dd40d5",
    "colorSecundario": "#1A1A1A",
    "titulo": "Tu Notebook La Plata",
    "eslogan": "Expertos en Notebooks"
}')
ON CONFLICT (seccion) DO NOTHING;

-- 7. INSERTAR DATOS INICIALES PARA SERVICIOS GENERALES
INSERT INTO servicios_generales (categoria, descripcion, img_service, orden) VALUES 
('Servicios Tecnicos', 'Un diagnóstico preciso es clave para encontrar la solución adecuada. En TNLP evaluamos notebooks y PCs con un enfoque técnico especializado, identificando fallas tanto en hardware como en software, para brindarte respuestas concretas.', 'img/servicios/servi-tecnico.jpg', 1),
('Mantenimiento', 'Es fundamental para evitar fallas y mantener el rendimiento de tu dispositivo. En TNLP realizamos limpiezas profundas, reemplazo de pasta y pads térmicos.', 'img/servicios/servi-mantenimiento.jpg', 2),
('Up Grade y Mejoras', 'Si tu equipo ya no rinde como antes, en TNLP analizamos su configuración actual y proponemos mejoras efectivas.', 'img/servicios/servi-upgrade.jpg', 3),
('Reparaciones', 'Cada componente cumple un rol clave en el funcionamiento de tu notebook o PC. En TNLP diagnosticamos y reparamos fallas.', 'img/servicios/servi-rep.jpg', 4)
ON CONFLICT DO NOTHING;

-- 8. VERIFICACIÓN FINAL
SELECT 'TABLAS CREADAS CORRECTAMENTE' as resultado;
SELECT 'configuracion_sitio' as tabla, COUNT(*) as registros FROM configuracion_sitio
UNION ALL
SELECT 'servicios_generales' as tabla, COUNT(*) as registros FROM servicios_generales;
