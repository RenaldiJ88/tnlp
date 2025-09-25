-- =====================================================
-- DATOS DE EJEMPLO PARA SISTEMA DE IMÁGENES Y CONFIGURACIONES
-- Ejemplo con HP Spectre x360 (producto ID 1, ajustar según necesario)
-- =====================================================

-- NOTA: Cambiar el producto_id por el ID real de tu producto HP Spectre x360
-- Para verificar los IDs de productos existentes:
-- SELECT id, title FROM productos ORDER BY id;

-- Ejemplo para producto HP Spectre x360 (asumiendo ID = 1)
-- Ajusta el producto_id según tu base de datos

-- 1. INSERTAR MÚLTIPLES IMÁGENES PARA UN PRODUCTO
INSERT INTO producto_imagenes (producto_id, imagen_url, descripcion, orden, es_principal) VALUES 
-- Reemplaza '1' por el ID real del producto HP Spectre x360
(1, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/hp-spectre-frontal.jpg', 'Vista frontal completa', 1, true),
(1, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/hp-spectre-lateral.jpg', 'Vista lateral izquierda', 2, false),
(1, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/hp-spectre-teclado.jpg', 'Vista del teclado y touchpad', 3, false),
(1, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/hp-spectre-puertos.jpg', 'Puertos y conectores', 4, false),
(1, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/hp-spectre-trasera.jpg', 'Vista trasera y ventilación', 5, false),
(1, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/hp-spectre-pantalla.jpg', 'Calidad de pantalla', 6, false)
ON CONFLICT DO NOTHING;

-- 2. INSERTAR CONFIGURACIONES PARA EL PRODUCTO
INSERT INTO producto_configuraciones (producto_id, nombre, configuracion, precio, precio_original, stock, sku, activo) VALUES 
-- Configuración básica
(1, '16 GB DE RAM | SSD 512GB', 
 '{"ram": "16GB", "ssd": "512GB", "os": "Windows 11 Pro"}', 
 1739.00, 1899.00, 5, 'HP-SPECTRE-16GB-512GB', true),

-- Configuración intermedia  
(1, '16GB RAM | 2TB SSD', 
 '{"ram": "16GB", "ssd": "2TB", "os": "Windows 11 Pro"}', 
 1859.00, 2099.00, 3, 'HP-SPECTRE-16GB-2TB', true),

-- Configuración premium
(1, '16GB RAM | 4TB SSD', 
 '{"ram": "16GB", "ssd": "4TB", "os": "Windows 11 Pro"}', 
 2039.00, 2299.00, 2, 'HP-SPECTRE-16GB-4TB', true),

-- Configuración sin stock (para probar la funcionalidad)
(1, '32GB RAM | 2TB SSD', 
 '{"ram": "32GB", "ssd": "2TB", "os": "Windows 11 Pro"}', 
 2199.00, 2499.00, 0, 'HP-SPECTRE-32GB-2TB', true)
ON CONFLICT DO NOTHING;

-- 3. EJEMPLO CON OTRO PRODUCTO (MSI Gaming - asumiendo ID = 2)
-- Ajusta el producto_id según tu base de datos

INSERT INTO producto_imagenes (producto_id, imagen_url, descripcion, orden, es_principal) VALUES 
(2, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/msi-gaming-frontal.jpg', 'Vista frontal gaming', 1, true),
(2, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/msi-gaming-rgb.jpg', 'Iluminación RGB', 2, false),
(2, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/msi-gaming-interior.jpg', 'Componentes internos', 3, false),
(2, 'https://res.cloudinary.com/tu-cloud/image/upload/v1/tnlp/msi-gaming-pantalla.jpg', 'Pantalla gaming 144Hz', 4, false)
ON CONFLICT DO NOTHING;

INSERT INTO producto_configuraciones (producto_id, nombre, configuracion, precio, stock, sku, activo) VALUES 
(2, '16GB RAM | RTX 3060 | SSD 512GB', 
 '{"ram": "16GB", "gpu": "RTX 3060", "ssd": "512GB", "os": "Windows 11 Home"}', 
 1299.00, 4, 'MSI-GAMING-3060-512GB', true),

(2, '32GB RAM | RTX 3070 | SSD 1TB', 
 '{"ram": "32GB", "gpu": "RTX 3070", "ssd": "1TB", "os": "Windows 11 Home"}', 
 1599.00, 2, 'MSI-GAMING-3070-1TB', true),

(2, '32GB RAM | RTX 3080 | SSD 2TB', 
 '{"ram": "32GB", "gpu": "RTX 3080", "ssd": "2TB", "os": "Windows 11 Pro"}', 
 1999.00, 1, 'MSI-GAMING-3080-2TB', true)
ON CONFLICT DO NOTHING;

-- 4. VERIFICAR LOS DATOS INSERTADOS
SELECT 'VERIFICACIÓN - IMÁGENES POR PRODUCTO' as info;
SELECT 
    p.title,
    pi.descripcion,
    pi.orden,
    pi.es_principal,
    pi.imagen_url
FROM productos p 
LEFT JOIN producto_imagenes pi ON p.id = pi.producto_id 
WHERE pi.id IS NOT NULL
ORDER BY p.id, pi.orden;

SELECT 'VERIFICACIÓN - CONFIGURACIONES POR PRODUCTO' as info;
SELECT 
    p.title,
    pc.nombre,
    pc.precio,
    pc.stock,
    pc.configuracion,
    pc.sku
FROM productos p 
LEFT JOIN producto_configuraciones pc ON p.id = pc.producto_id 
WHERE pc.id IS NOT NULL
ORDER BY p.id, pc.precio;

-- 5. CONSULTA PARA VER PRODUCTOS COMPLETOS
SELECT 'PRODUCTOS CON TODAS SUS VARIANTES' as info;
SELECT * FROM productos_completos ORDER BY id;

-- =====================================================
-- INSTRUCCIONES PARA USO REAL:
-- =====================================================

/*
1. EJECUTAR EL ESQUEMA PRINCIPAL PRIMERO:
   - Ejecuta ESQUEMA-IMAGENES-CONFIGURACIONES.sql

2. ADAPTAR ESTE ARCHIVO:
   - Cambiar los producto_id por los IDs reales de tus productos
   - Actualizar las URLs de imágenes por las reales de Cloudinary
   - Ajustar precios y configuraciones según tus productos

3. VERIFICAR PRODUCTOS EXISTENTES:
   SELECT id, title, categoria FROM productos ORDER BY id;

4. SUBIR IMÁGENES A CLOUDINARY:
   - Usar el script migrate-all-to-cloudinary.js
   - O subir manualmente y obtener las URLs

5. PROBAR LA FUNCIONALIDAD:
   - Visitar /productos/[id] donde [id] es el producto configurado
   - Verificar que aparezca la galería y el configurador
*/
