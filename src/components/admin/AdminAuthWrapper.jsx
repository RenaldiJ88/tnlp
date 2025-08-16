"use client";

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminAuthWrapper({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 AdminAuthWrapper: Verificando autenticación...')
      console.log('📍 Ruta actual:', pathname)
      
      // Debug: verificar cookies y localStorage
      if (typeof window !== 'undefined') {
        console.log('🍪 Cookies disponibles:', document.cookie)
        console.log('📦 LocalStorage:', localStorage.getItem('adminAuth'))
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'GET',
        credentials: 'include', // ¡Esto es clave para enviar cookies!
        cache: 'no-store'
      })
      console.log('📡 Response status:', response.status)
      
      const data = await response.json()
      console.log('📄 Response data:', data)
      
      if (data.success) {
        console.log('✅ Usuario autenticado:', data.user)
        
        // Guardar token en localStorage para usar en APIs
        if (typeof window !== 'undefined') {
          const authData = {
            user: data.user,
            token: data.token || 'auth_token_placeholder', // Token del backend
            timestamp: Date.now()
          }
          localStorage.setItem('adminAuth', JSON.stringify(authData))
        }
        
        setUser(data.user)
      } else {
        console.log('❌ No autenticado:', data.error)
        
        // Fallback: verificar localStorage
        if (typeof window !== 'undefined') {
          const localAuth = localStorage.getItem('adminAuth')
          if (localAuth) {
            try {
              const authData = JSON.parse(localAuth)
              const isRecent = (Date.now() - authData.timestamp) < (24 * 60 * 60 * 1000) // 24 horas
              
              if (isRecent && authData.user) {
                console.log('📦 Usando autenticación desde localStorage:', authData.user)
                setUser(authData.user)
                return
              } else {
                console.log('📦 LocalStorage expirado, limpiando...')
                localStorage.removeItem('adminAuth')
              }
            } catch (e) {
              console.log('📦 Error al leer localStorage, limpiando...')
              localStorage.removeItem('adminAuth')
            }
          }
        }
        
        setUser(null)
        // Solo redirigir si no está en la página de login
        if (pathname !== '/admin/login') {
          console.log('🔄 Redirigiendo a login...')
          router.push('/admin/login')
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } finally {
      console.log('🏁 Verificación completada, loading = false')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      router.push('/admin/login')
    }
  }

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
          <p className="text-gray-400 text-sm mt-2">Ruta: {pathname}</p>
          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={() => {
                console.log('🔄 Forzando recarga de auth...')
                setLoading(false)
                setUser({ username: 'tnlp-admin', isAdmin: true })
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              🛠️ Debug: Saltar autenticación
            </button>
          )}
        </div>
      </div>
    )
  }

  // Si está en la página de login, mostrar sin layout admin
  if (pathname === '/admin/login') {
    return children
  }

  // Si no está autenticado y no está en login, no mostrar nada
  // (el middleware ya debería haber redirigido)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  // Usuario autenticado, mostrar layout admin completo
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          <AdminHeader user={user} onLogout={handleLogout} />
          
          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}