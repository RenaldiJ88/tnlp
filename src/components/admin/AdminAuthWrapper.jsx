"use client";

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../../supabase'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminAuthWrapper({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuthStatus()
    
    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 Auth state change:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ Usuario autenticado:', session.user.email)
          setUser({
            username: session.user.email,
            isAdmin: true
          })
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ Usuario desconectado')
          setUser(null)
          router.push('/admin/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 AdminAuthWrapper: Verificando autenticación con Supabase...')
      console.log('📍 Ruta actual:', pathname)
      
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('❌ Error al verificar usuario:', error)
        setUser(null)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
        return
      }
      
      if (user) {
        console.log('✅ Usuario autenticado con Supabase:', user.email)
        setUser({
          username: user.email,
          isAdmin: true
        })
        
        // Guardar en localStorage para compatibilidad
        localStorage.setItem('adminAuth', JSON.stringify({
          user: {
            username: user.email,
            isAdmin: true
          },
          timestamp: Date.now()
        }))
      } else {
        console.log('❌ No hay usuario autenticado')
        setUser(null)
        if (pathname !== '/admin/login') {
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
      console.log('🚪 Cerrando sesión...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error en logout:', error)
      }
      
      setUser(null)
      localStorage.removeItem('adminAuth')
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
        </div>
      </div>
    )
  }

  // Si está en la página de login, mostrar sin layout admin
  if (pathname === '/admin/login') {
    return children
  }

  // Si no está autenticado y no está en login, no mostrar nada
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