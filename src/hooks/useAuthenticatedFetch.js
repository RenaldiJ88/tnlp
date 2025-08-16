import { useCallback } from 'react'
import { supabase } from '../supabase'

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
      
      // Hacer la llamada con headers autenticados
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      })
      
      return response
    } catch (error) {
      console.error('Error en authenticatedFetch:', error)
      throw error
    }
  }, [])
  
  return { authenticatedFetch }
}
