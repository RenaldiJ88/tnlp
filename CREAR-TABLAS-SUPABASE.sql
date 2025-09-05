-- =====================================================
-- CREAR TABLAS DE CONFIGURACIÓN EN SUPABASE
-- Copia y pega este código en el SQL Editor de Supabase
-- =====================================================

-- Tabla de configuración general del sitio
CREATE TABLE IF NOT EXISTS configuracion_sitio (
    id SERIAL PRIMARY KEY,
    seccion VARCHAR(50) NOT NULL UNIQUE,
    configuracion JSONB NOT NULL,
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios generales (reemplaza services.json)
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

-- Tabla de precios de servicios técnicos
CREATE TABLE IF NOT EXISTS servicios_precios (
    id SERIAL PRIMARY KEY,
    servicio_id VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    precio DECIMAL(10,2) DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_configuracion_seccion ON configuracion_sitio(seccion);
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios_generales(categoria);
CREATE INDEX IF NOT EXISTS idx_servicios_precios_categoria ON servicios_precios(categoria);
CREATE INDEX IF NOT EXISTS idx_servicios_precios_activo ON servicios_precios(activo);

-- Verificar si la función update_last_modified ya existe, si no crearla
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_last_modified') THEN
        CREATE OR REPLACE FUNCTION update_last_modified()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.last_modified = NOW();
            RETURN NEW;
        END;
        $func$ LANGUAGE plpgsql;
    END IF;
END
$$;

-- Triggers para actualizar last_modified automáticamente
DROP TRIGGER IF EXISTS configuracion_sitio_update_last_modified ON configuracion_sitio;
CREATE TRIGGER configuracion_sitio_update_last_modified
    BEFORE UPDATE ON configuracion_sitio
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

DROP TRIGGER IF EXISTS servicios_generales_update_last_modified ON servicios_generales;
CREATE TRIGGER servicios_generales_update_last_modified
    BEFORE UPDATE ON servicios_generales
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

DROP TRIGGER IF EXISTS servicios_precios_update_last_modified ON servicios_precios;
CREATE TRIGGER servicios_precios_update_last_modified
    BEFORE UPDATE ON servicios_precios
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

-- Habilitar Row Level Security
ALTER TABLE configuracion_sitio ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_generales ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_precios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad

-- Configuración: solo admin puede modificar, lectura pública para algunas secciones
DROP POLICY IF EXISTS "Configuración visible públicamente" ON configuracion_sitio;
CREATE POLICY "Configuración visible públicamente" ON configuracion_sitio
    FOR SELECT USING (seccion IN ('sitio', 'tema'));

DROP POLICY IF EXISTS "Admin puede todo en configuración" ON configuracion_sitio;
CREATE POLICY "Admin puede todo en configuración" ON configuracion_sitio
    FOR ALL USING (auth.role() = 'service_role');

-- Servicios generales: lectura pública, admin completo
DROP POLICY IF EXISTS "Servicios generales visibles públicamente" ON servicios_generales;
CREATE POLICY "Servicios generales visibles públicamente" ON servicios_generales
    FOR SELECT USING (activo = true);

DROP POLICY IF EXISTS "Admin puede todo en servicios generales" ON servicios_generales;
CREATE POLICY "Admin puede todo en servicios generales" ON servicios_generales
    FOR ALL USING (auth.role() = 'service_role');

-- Precios de servicios: solo admin
DROP POLICY IF EXISTS "Admin puede todo en precios servicios" ON servicios_precios;
CREATE POLICY "Admin puede todo en precios servicios" ON servicios_precios
    FOR ALL USING (auth.role() = 'service_role');

-- Insertar datos iniciales
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

INSERT INTO servicios_generales (categoria, descripcion, img_service, orden) VALUES 
('Servicios Tecnicos', 'Un diagnóstico preciso es clave para encontrar la solución adecuada. En TNLP evaluamos notebooks y PCs con un enfoque técnico especializado, identificando fallas tanto en hardware como en software, para brindarte respuestas concretas. Si tu equipo presenta problemas de rendimiento, errores o fallas de encendido, lo analizamos en detalle y te ofrecemos un presupuesto a medida. Consulta ahora y obtené un diagnóstico confiable con nuestros especialistas.', 'img/servicios/servi-tecnico.jpg', 1),
('Mantenimiento', 'Es fundamental para evitar fallas y mantener el rendimiento de tu dispositivo. En TNLP realizamos limpiezas profundas, reemplazo de pasta y pads térmicos; un control técnico de componentes para asegurar una correcta disipación de calor y estabilidad operativa. El polvo acumulado y el desgaste afectan silenciosamente la eficiencia de tu PC o consola. Ya sea para uso gaming, renderizado, hogar u oficina, nuestro servicio de mantenimiento prolonga la vida útil y mejora su rendimiento desde el interior.', 'img/servicios/servi-mantenimiento.jpg', 2),
('Up Grade y Mejoras', 'Si tu equipo ya no rinde como antes, en TNLP analizamos su configuración actual y proponemos mejoras efectivas. Desde ampliar la memoria RAM o instalar un disco solido SSD, hasta optimizar el sistema operativo, cada mejora se realiza con precisión técnica y adaptada a tus necesidades. Renová tu equipo sin necesidad de cambiarlo. Consultá ahora y llevá tu equipo al siguiente nivel con mejoras personalizadas.', 'img/servicios/servi-upgrade.jpg', 3),
('Reparaciones', 'Cada componente cumple un rol clave en el funcionamiento de tu notebook o PC. En TNLP diagnosticamos y reparamos fallas en pantallas, teclados, placas madre, conectores, ventiladores y más. Si tu equipo sufrió un golpe, derrame o dejó de encender, lo restauramos con procedimientos técnicos y repuestos adecuados. Escribinos ahora y restaura tu equipo con profesionales.', 'img/servicios/servi-rep.jpg', 4)
ON CONFLICT DO NOTHING;

INSERT INTO servicios_precios (servicio_id, nombre, categoria, subcategoria, precio) VALUES 
-- Mantenimiento
('limpieza-advance-cpu', 'Limpieza Advance CPU', 'Mantenimiento', 'Limpiezas', 8000),
('limpieza-advance-notebook', 'Limpieza Advance Notebook', 'Mantenimiento', 'Limpiezas', 7000),
('limpieza-pro-g-cpu', 'Limpieza Pro G CPU', 'Mantenimiento', 'Limpiezas', 10000),
('limpieza-pro-g-notebook', 'Limpieza Pro G Notebook', 'Mantenimiento', 'Limpiezas', 9000),
('limpieza-elite-notebook', 'Limpieza Elite Notebook', 'Mantenimiento', 'Limpiezas', 12000),
('limpieza-pro-g-console', 'Limpieza Pro G Play/Xbox', 'Mantenimiento', 'Limpiezas', 8500),

-- Up-Grade y mejoras
('agregar-ssd', 'Agregar SSD', 'Up-Grade y mejoras', 'Mejoras', 15000),
('agregar-ram', 'Agregar RAM', 'Up-Grade y mejoras', 'Mejoras', 12000),
('instalacion-so', 'Instalación SO', 'Up-Grade y mejoras', 'Mejoras', 5000),
('evolucion-rendimiento', 'Evolución de rendimiento', 'Up-Grade y mejoras', 'Mejoras', 18000),

-- Reparaciones
('reparacion-mother', 'Reparación Mother', 'Reparaciones', 'Componentes', 25000),
('reparacion-cargador', 'Reparación Cargador', 'Reparaciones', 'Componentes', 8000),
('reparacion-pin-carga', 'Reparación Pin de carga', 'Reparaciones', 'Componentes', 12000),
('cambio-bisagras', 'Cambio Bisagras', 'Reparaciones', 'Hardware', 15000),
('cambio-pantalla', 'Cambio Pantalla', 'Reparaciones', 'Hardware', 20000),
('cambio-teclado', 'Cambio Teclado', 'Reparaciones', 'Hardware', 10000),
('cambio-bateria', 'Cambio Batería', 'Reparaciones', 'Hardware', 12000),
('cambio-carcasa', 'Cambio Carcasa', 'Reparaciones', 'Hardware', 18000)
ON CONFLICT (servicio_id) DO NOTHING;

-- Verificación final
SELECT 'Tablas creadas correctamente' as resultado;
SELECT COUNT(*) as configuracion_sitio_count FROM configuracion_sitio;
SELECT COUNT(*) as servicios_generales_count FROM servicios_generales;
SELECT COUNT(*) as servicios_precios_count FROM servicios_precios;






