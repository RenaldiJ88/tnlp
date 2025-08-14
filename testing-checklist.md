# 🧪 CHECKLIST DE TESTING COMPLETO - TNLP

## 📱 **FRONTEND PÚBLICO**

### **1. PÁGINA PRINCIPAL (/)**
- [ ] ✅ Carga correctamente
- [ ] ✅ Hero section con imágenes
- [ ] ✅ Botón "Ver Equipos" funciona
- [ ] ✅ Navegación responsive
- [ ] ✅ WhatsApp button visible y funcional
- [ ] ✅ Analytics funcionando (GA4 + Clarity)

### **2. NAVEGACIÓN**
- [ ] ✅ Navbar responsive (móvil/desktop)
- [ ] ✅ Logo clickeable → Home
- [ ] ✅ Menú hamburguesa en móvil
- [ ] ✅ Todos los enlaces funcionan:
  - [ ] Home
  - [ ] Servicios
  - [ ] Productos
  - [ ] Nosotros
  - [ ] Contacto

### **3. PÁGINA DE PRODUCTOS (/productos)**
- [ ] ✅ Carga todos los productos
- [ ] ✅ Barra de búsqueda funciona
- [ ] ✅ Filtros laterales funcionan:
  - [ ] Categoría (Gaming/Office)
  - [ ] Marca de procesador
  - [ ] RAM
  - [ ] Tamaño de pantalla
  - [ ] Rango de precio
  - [ ] Tipo de gráficos
  - [ ] Ofertas
- [ ] ✅ Botón "Limpiar filtros" funciona
- [ ] ✅ Ordenamiento funciona
- [ ] ✅ Productos se muestran correctamente
- [ ] ✅ Botón "Ver más" en cada producto
- [ ] ✅ Paginación (si existe)

### **4. PÁGINAS ESPECÍFICAS**
- [ ] ✅ /EquiposGamer - Muestra solo productos gaming
- [ ] ✅ /EquiposOffice - Muestra solo productos office
- [ ] ✅ Navegación entre páginas funciona

### **5. DETALLE DE PRODUCTO (/productos/[id])**
- [ ] ✅ Carga información completa del producto
- [ ] ✅ Imágenes se muestran correctamente
- [ ] ✅ Especificaciones técnicas
- [ ] ✅ Botón WhatsApp funciona
- [ ] ✅ Productos relacionados
- [ ] ✅ Breadcrumbs funcionan

### **6. PÁGINA DE SERVICIOS (/servicios)**
- [ ] ✅ Lista todos los servicios
- [ ] ✅ Cards de servicios se muestran
- [ ] ✅ Botones WhatsApp funcionan
- [ ] ✅ Navegación a detalle de servicio

### **7. DETALLE DE SERVICIO (/servicios/[id])**
- [ ] ✅ Información completa del servicio
- [ ] ✅ Imágenes se muestran
- [ ] ✅ Botón WhatsApp funciona

### **8. PÁGINA NOSOTROS**
- [ ] ✅ Información de la empresa
- [ ] ✅ Imágenes se muestran
- [ ] ✅ Contenido responsive

### **9. CONTACTO/MAPA**
- [ ] ✅ Mapa de Google se muestra
- [ ] ✅ Formulario de newsletter funciona
- [ ] ✅ Información de contacto visible

### **10. FOOTER**
- [ ] ✅ Enlaces funcionan
- [ ] ✅ Redes sociales
- [ ] ✅ Información de contacto

## 🔧 **ADMIN PANEL**

### **11. LOGIN ADMIN**
- [ ] ✅ Página de login carga
- [ ] ✅ Credenciales funcionan (tnlp-admin / TNLP@2024LaPlata)
- [ ] ✅ Redirección después del login
- [ ] ✅ Logout funciona

### **12. DASHBOARD ADMIN**
- [ ] ✅ Métricas se muestran
- [ ] ✅ Navegación lateral funciona
- [ ] ✅ Quick actions funcionan

### **13. GESTIÓN DE PRODUCTOS**
- [ ] ✅ Lista todos los productos
- [ ] ✅ Búsqueda funciona
- [ ] ✅ Filtros funcionan
- [ ] ✅ Crear nuevo producto
- [ ] ✅ Editar producto existente
- [ ] ✅ Eliminar producto
- [ ] ✅ Imágenes se suben correctamente

### **14. GESTIÓN DE CLIENTES**
- [ ] ✅ Lista todos los clientes
- [ ] ✅ Búsqueda funciona
- [ ] ✅ Crear nuevo cliente
- [ ] ✅ Editar cliente
- [ ] ✅ Eliminar cliente

### **15. SERVICIOS TÉCNICOS**
- [ ] ✅ Lista clientes con órdenes
- [ ] ✅ Crear nueva orden de servicio
- [ ] ✅ Ver órdenes de cliente
- [ ] ✅ Editar orden de servicio
- [ ] ✅ Eliminar orden
- [ ] ✅ Estados de órdenes

### **16. CONFIGURACIÓN**
- [ ] ✅ Página de configuración carga
- [ ] ✅ Opciones de configuración

## 📊 **ANALYTICS Y PERFORMANCE**

### **17. GOOGLE ANALYTICS**
- [ ] ✅ GA4 está configurado
- [ ] ✅ Eventos se disparan:
  - [ ] page_view
  - [ ] search
  - [ ] view_item
  - [ ] whatsapp_click
  - [ ] filter_applied

### **18. MICROSOFT CLARITY**
- [ ] ✅ Clarity está configurado
- [ ] ✅ Eventos se disparan
- [ ] ✅ Heatmaps funcionan

### **19. PERFORMANCE**
- [ ] ✅ Páginas cargan rápido
- [ ] ✅ Imágenes optimizadas
- [ ] ✅ No hay errores en consola
- [ ] ✅ Responsive en todos los dispositivos

## 🐛 **ERRORES Y BUGS**

### **20. CONSOLA DEL NAVEGADOR**
- [ ] ✅ No hay errores JavaScript
- [ ] ✅ No hay warnings críticos
- [ ] ✅ Imágenes cargan correctamente

### **21. RESPONSIVE DESIGN**
- [ ] ✅ Móvil (320px+)
- [ ] ✅ Tablet (768px+)
- [ ] ✅ Desktop (1024px+)
- [ ] ✅ Large Desktop (1440px+)

## 📱 **DISPOSITIVOS A PROBAR**
- [ ] ✅ Chrome Desktop
- [ ] ✅ Firefox Desktop
- [ ] ✅ Safari Desktop
- [ ] ✅ Chrome Mobile
- [ ] ✅ Safari Mobile

## 🔗 **ENLACES EXTERNOS**
- [ ] ✅ WhatsApp funciona
- [ ] ✅ Redes sociales
- [ ] ✅ Google Maps
- [ ] ✅ Enlaces externos

---

## 📝 **NOTAS DE TESTING**
- Fecha de testing: _________
- Tester: _________
- Versión: _________
- Navegador: _________

## 🚨 **PROBLEMAS ENCONTRADOS**
1. _________
2. _________
3. _________

## ✅ **RESULTADO FINAL**
- [ ] ✅ SITIO LISTO PARA PRODUCCIÓN
- [ ] ⚠️ REQUIERE AJUSTES MENORES
- [ ] ❌ REQUIERE CORRECCIONES MAYORES
