"use client";

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminAuthWrapper({ children }) {
  const { user, loading, isAuthenticated } = useSupabaseAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redirigir automáticamente al dashboard si está autenticado y en login
    if (isAuthenticated && user && pathname === '/admin/login') {
      console.log('🔄 Usuario autenticado, redirigiendo al dashboard...')
      router.push('/admin')
    }
    
    // Redirigir al login si no está autenticado y no está en login
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      console.log('🔒 Usuario no autenticado, redirigiendo al login...')
      router.push('/admin/login')
    }
  }, [isAuthenticated, user, loading, pathname, router])

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
  if (!isAuthenticated || !user) {
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

  // Formatear el usuario para el AdminHeader
  const formattedUser = {
    username: user.email,
    isAdmin: true
  }

  // Usuario autenticado, mostrar layout admin completo
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          <AdminHeader user={formattedUser} />
          
          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}