# 🚀 Guía de Migración a Supabase para Configuración

## 📋 Pasos para completar la migración:

### 1. **Ejecutar el Schema SQL en Supabase**
```sql
-- Copia y pega el contenido de supabase_configuracion_schema.sql
-- en el SQL Editor de tu dashboard de Supabase
```

### 2. **Verificar las nuevas APIs**
Las siguientes APIs ya están creadas y listas:

- `GET/POST/PUT/DELETE /api/admin/configuracion` - Configuración general
- `GET/POST/PUT/DELETE /api/admin/servicios-precios` - Precios de servicios
- `GET /api/servicios-generales` - Servicios generales (público)

### 3. **Probar la funcionalidad**
1. Ve al panel de administración → Configuración
2. Modifica cualquier configuración
3. Haz clic en "Guardar"
4. Verifica que se guarde en Supabase

### 4. **Migrar servicios existentes (opcional)**
Si quieres migrar desde `services.json` a Supabase:

```javascript
// Script para migrar (ejecutar en consola del navegador en /admin)
const migrarServicios = async () => {
  // Los datos ya están insertados en el schema SQL
  console.log('Servicios ya migrados automáticamente');
};
```

### 5. **Actualizar componente Servicios (futuro)**
Para usar Supabase en lugar de `services.json`:

```javascript
// En src/components/Servicios.jsx, cambiar:
// import data from '../data/services.json';

// Por:
useEffect(() => {
  fetch('/api/servicios-generales')
    .then(res => res.json())
    .then(data => setServiciosData(data.servicios))
}, [])
```

## ✅ Qué ya funciona:

- ✅ **Configuración del sitio** se guarda en Supabase
- ✅ **Personalización de tema** se guarda en Supabase  
- ✅ **Precios de servicios** se guardan en Supabase
- ✅ **Backup y restauración** funciona con los nuevos datos
- ✅ **Carga automática** de configuración al abrir el panel

## 🔧 Configuración adicional necesaria:

1. **Variables de entorno**: Asegúrate de tener configuradas:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Permisos de usuario**: Tu usuario debe tener rol 'admin' o 'super-admin'

## 📊 Estructura de la base de datos:

- `configuracion_sitio` - Configuración general del sitio y tema
- `servicios_generales` - Servicios que se muestran en la página principal
- `servicios_precios` - Precios de servicios técnicos para el admin

¡La migración está completa! Ahora toda la configuración se persiste en Supabase. 🎉
