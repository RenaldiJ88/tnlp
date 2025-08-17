import { useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useAuthenticatedFetch = () => {
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    try {
      // Obtener la sesión actual de Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error obteniendo sesión:', error)
        throw new Error('No hay sesión válida')
      }
      
      if (!session) {
        throw new Error('Usuario no autenticado')
      }
      
      // Configurar headers con el token de Supabase
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...options.headers
      }
      
      console.log('🔐 Enviando request autenticado con token de Supabase')
      console.log('📍 URL:', url)
      console.log('🔑 Token:', session.access_token ? 'Presente' : 'Ausente')
      console.log('🔑 Token completo:', session.access_token ? `${session.access_token.substring(0, 20)}...` : 'Ausente')
      console.log('📋 Headers completos:', headers)
      
      // Hacer la llamada con headers autenticados
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      })
      
      // Log de respuesta para debugging
      console.log('📡 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })
      
      // Si hay error de autorización, intentar refrescar el token
      if (response.status === 401) {
        console.log('🔄 Token expirado, intentando refrescar...')
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError) {
          console.error('Error refrescando sesión:', refreshError)
          throw new Error('Sesión expirada')
        }
        
        if (refreshData.session) {
          console.log('✅ Sesión refrescada, reintentando request...')
          // Reintentar con el nuevo token
          const newHeaders = {
            ...headers,
            'Authorization': `Bearer ${refreshData.session.access_token}`
          }
          
          const retryResponse = await fetch(url, {
            ...options,
            headers: newHeaders,
            credentials: 'include'
          })
          
          return retryResponse
        }
      }
      
      return response
    } catch (error) {
      console.error('Error en authenticatedFetch:', error)
      throw error
    }
  }, [])
  
  return { authenticatedFetch }
}
