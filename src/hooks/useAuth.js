"use client";

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
      } else {
        setUser(null)
        // Solo redirigir si está en una ruta admin protegida
        if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        router.push('/admin')
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Error de conexión' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Forzar logout local aunque falle el servidor
      setUser(null)
      router.push('/admin/login')
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

// Hook para proteger componentes
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [user, loading, router, pathname])

  return { user, loading }
}