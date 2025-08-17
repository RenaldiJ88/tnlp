# 🔍 Verificación de Variables de Entorno en Vercel

## 🚨 **Problema identificado:**
Las APIs están devolviendo errores 500 (Internal Server Error) a pesar de que el token se envía correctamente.

## 🔧 **Solución: Verificar variables de entorno en Vercel**

### **Paso 1: Ir a Vercel Dashboard**
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto `tnlp`

### **Paso 2: Verificar Variables de Entorno**
1. Ve a **Settings** → **Environment Variables**
2. Verifica que tengas estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tunotebooklp.com
```

### **Paso 3: Obtener las claves de Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### **Paso 4: Configurar en Vercel**
1. En Vercel, agrega cada variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://your-project.supabase.co`
   - **Environment**: `Production` ✅
   - **Environment**: `Preview` ✅

2. Repite para cada variable

### **Paso 5: Redeploy**
1. Ve a **Deployments**
2. Haz clic en **Redeploy** en el último deployment
3. O haz un nuevo commit y push

## 🧪 **Para probar la solución:**

1. **Ve a** `/admin/api-diagnostics`
2. **Ejecuta el diagnóstico completo**
3. **Verifica que no haya errores 500**

## 📋 **Variables críticas que deben estar definidas:**

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NODE_ENV=production`

## 🔍 **Si sigues teniendo problemas:**

1. **Revisa los logs** en Vercel → **Functions**
2. **Verifica la consola** del navegador
3. **Ejecuta el diagnóstico** en `/admin/api-diagnostics`
4. **Verifica que las tablas existan** en Supabase
