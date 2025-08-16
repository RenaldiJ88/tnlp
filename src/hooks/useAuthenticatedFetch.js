import { useCallback } from 'react'

export const useAuthenticatedFetch = () => {
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    // Obtener el token del localStorage
    const adminAuth = localStorage.getItem('adminAuth')
    let token = null
    
    if (adminAuth) {
      try {
        const authData = JSON.parse(adminAuth)
        token = authData.token || authData.adminToken
      } catch (e) {
        console.error('Error parsing adminAuth:', e)
      }
    }
    
    // Configurar headers con autenticación
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Hacer la llamada con headers autenticados
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    })
    
    return response
  }, [])
  
  return { authenticatedFetch }
}
