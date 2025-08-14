# 🚀 GUÍA DE DEPLOY A PRODUCCIÓN - TNLP

## 📋 **CHECKLIST PRE-DEPLOY**

### **✅ VERIFICACIONES FINALES**
- [ ] ✅ Testing completado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Base de datos migrada a Supabase
- [ ] ✅ Analytics configurados
- [ ] ✅ Imágenes optimizadas

## 🔧 **PASO 1: PREPARAR EL REPOSITORIO**

### **1.1 Verificar .gitignore**
```bash
# Asegúrate de que .env.local esté en .gitignore
# Pero las variables públicas SÍ deben estar en Vercel
```

### **1.2 Commit final**
```bash
git add .
git commit -m "🚀 Ready for production deployment"
git push origin master
```

## 🌐 **PASO 2: DEPLOY A VERCEL**

### **2.1 Conectar con Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Selecciona el repositorio `tnlp`

### **2.2 Configurar variables de entorno**
En Vercel, agrega estas variables:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=XXXXXXXXXX
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_USERNAME=tnlp-admin
ADMIN_PASSWORD_HASH=$2b$10$4XIOYsGfsGO17iacJUTsx.ffLjmi6UXVVs681is2rP5YejxLB7Idq
JWT_SECRET=your-jwt-secret
```

### **2.3 Configurar build settings**
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### **2.4 Deploy**
1. Click "Deploy"
2. Espera a que termine el build
3. Verifica que funcione en la URL de Vercel

## 🔗 **PASO 3: CONFIGURAR DOMINIO**

### **3.1 Dominio personalizado**
1. En Vercel, ve a "Settings" → "Domains"
2. Agrega tu dominio personalizado
3. Configura los DNS records

### **3.2 SSL/HTTPS**
- Vercel lo configura automáticamente
- Verifica que funcione con `https://`

## 📊 **PASO 4: VERIFICACIONES POST-DEPLOY**

### **4.1 Testing en producción**
- [ ] ✅ Página principal carga
- [ ] ✅ Productos se muestran
- [ ] ✅ Admin panel funciona
- [ ] ✅ Analytics funcionan
- [ ] ✅ Responsive design
- [ ] ✅ WhatsApp funciona

### **4.2 Performance**
- [ ] ✅ Lighthouse score > 90
- [ ] ✅ Core Web Vitals
- [ ] ✅ Tiempo de carga < 3s

## 🔒 **PASO 5: SEGURIDAD**

### **5.1 Verificar seguridad**
- [ ] ✅ Variables de entorno protegidas
- [ ] ✅ Admin panel protegido
- [ ] ✅ Base de datos segura
- [ ] ✅ HTTPS habilitado

## 📈 **PASO 6: MONITOREO**

### **6.1 Configurar monitoreo**
- [ ] ✅ Google Analytics
- [ ] ✅ Microsoft Clarity
- [ ] ✅ Vercel Analytics (opcional)
- [ ] ✅ Error tracking (opcional)

## 🎯 **URLS FINALES**
- **Sitio público**: `https://tu-dominio.com`
- **Admin panel**: `https://tu-dominio.com/admin`
- **Supabase**: Dashboard en Supabase

## 🚨 **EN CASO DE PROBLEMAS**

### **Problemas comunes:**
1. **Variables de entorno**: Verificar que estén configuradas en Vercel
2. **Build errors**: Revisar logs en Vercel
3. **Base de datos**: Verificar conexión a Supabase
4. **Imágenes**: Verificar rutas en producción

### **Rollback:**
- Vercel mantiene versiones anteriores
- Puedes hacer rollback fácilmente

---

## ✅ **RESULTADO FINAL**
- [ ] ✅ SITIO EN PRODUCCIÓN
- [ ] ✅ DOMINIO CONFIGURADO
- [ ] ✅ SSL/HTTPS ACTIVO
- [ ] ✅ MONITOREO CONFIGURADO
- [ ] ✅ BACKUP CONFIGURADO
