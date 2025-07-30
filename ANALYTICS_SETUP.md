# 📊 Configuración de Analytics para TNLP

## 🚀 PASO 1: Configurar Google Analytics 4

### 1.1 Crear cuenta de Google Analytics
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Haz clic en **"Empezar"**
3. Configura tu cuenta:
   - **Nombre de cuenta**: `TNLP - Tu Notebook La Plata`
   - **Nombre de propiedad**: `tnlp.com.ar`
   - **País**: Argentina
   - **Moneda**: Peso argentino

### 1.2 Obtener tu Measurement ID
1. En el panel de Analytics, ve a **Admin** (rueda dentada)
2. En la columna **Propiedad**, haz clic en **Flujos de datos**
3. Haz clic en **Agregar flujo de datos** > **Web**
4. Agrega:
   - **URL del sitio web**: `https://tu-dominio-vercel.vercel.app`
   - **Nombre del flujo**: `TNLP Website`
5. **¡IMPORTANTE!** Copia el **Measurement ID** (formato: `G-XXXXXXXXXX`)

---

## 🔍 PASO 2: Configurar Microsoft Clarity

### 2.1 Crear cuenta de Microsoft Clarity
1. Ve a [Microsoft Clarity](https://clarity.microsoft.com/)
2. Inicia sesión con tu cuenta Microsoft (o crea una)
3. Haz clic en **"Create new project"**

### 2.2 Configurar tu proyecto
1. **Project name**: `TNLP - Analytics`
2. **Website URL**: `https://tu-dominio-vercel.vercel.app`
3. Haz clic en **"Create"**
4. **¡IMPORTANTE!** Copia el **Project ID** (formato: `abc123def456`)

---

## ⚙️ PASO 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env.local
En la raíz de tu proyecto, crea un archivo llamado `.env.local` con:

```env
# Google Analytics 4 Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Microsoft Clarity Configuration  
NEXT_PUBLIC_CLARITY_PROJECT_ID=abc123def456
```

### 3.2 Configurar en Vercel
1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto TNLP
3. Ve a **Settings** > **Environment Variables**
4. Agrega ambas variables:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
   - `NEXT_PUBLIC_CLARITY_PROJECT_ID` = `abc123def456`
5. **Redeploy** tu proyecto

---

## 📈 PASO 4: Verificar que funciona

### 4.1 Verificar Google Analytics
1. Ve a tu panel de Analytics
2. En **Informes** > **Tiempo real**
3. Visita tu sitio web
4. Deberías ver **1 usuario activo** en tiempo real

### 4.2 Verificar Microsoft Clarity
1. Ve a tu dashboard de Clarity
2. Visita tu sitio web y navega un poco
3. En 5-10 minutos deberías ver datos en **Dashboard**

---

## 🎯 EVENTOS PERSONALIZADOS CONFIGURADOS

### Para Google Analytics:
- ✅ **whatsapp_click**: Cada clic en WhatsApp
- ✅ **search**: Búsquedas en el buscador
- ✅ **filter_applied**: Uso de filtros
- ✅ **view_service**: Visualización de servicios
- ✅ **view_item**: Visualización de productos

### Para Microsoft Clarity:
- ✅ **whatsapp_click**: Mapas de calor de WhatsApp
- ✅ **product_search**: Interacciones de búsqueda
- ✅ **filter_interaction**: Uso de filtros
- ✅ **service_selected**: Selección de servicios

---

## 🔥 SIGUIENTES PASOS

Una vez configurado, podrás analizar:

### 📊 En Google Analytics:
- **Audiencia**: ¿Quiénes visitan tu sitio?
- **Comportamiento**: ¿Qué páginas ven más?
- **Conversiones**: ¿Cuántos contactan por WhatsApp?
- **Fuentes de tráfico**: ¿De dónde vienen?

### 🔍 En Microsoft Clarity:
- **Mapas de calor**: ¿Dónde hacen clic?
- **Grabaciones**: ¿Cómo navegan?
- **Scroll maps**: ¿Hasta dónde bajan?
- **Rage clicks**: ¿Dónde se frustran?

---

## ⚠️ IMPORTANTE

1. **Privacidad**: Ambas herramientas cumplen con GDPR
2. **Rendimiento**: No afectan la velocidad del sitio
3. **Datos**: Tardan 24-48 horas en mostrar datos completos
4. **Gratis**: Ambas son 100% gratuitas

---

¿Necesitas ayuda? ¡Pregúntame! 🚀 