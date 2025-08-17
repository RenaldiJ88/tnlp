"use client";

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function VerifyRoles() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const [roleInfo, setRoleInfo] = useState(null)

  useEffect(() => {
    checkUserRoles()
  }, [])

  const checkUserRoles = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      // Obtener usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('No hay usuario autenticado')
        return
      }

      setUserInfo({
        id: user.id,
        email: user.email,
        appMetadata: user.app_metadata,
        userMetadata: user.user_metadata
      })

      // Verificar rol en user_roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setRoleInfo(roleData)

      if (roleError && roleError.code !== 'PGRST116') {
        console.log('Error verificando user_roles:', roleError)
      }

      // Verificar si es admin
      const isAdmin = 
        user.app_metadata?.role === 'admin' || 
        user.app_metadata?.role === 'super-admin' || 
        roleData?.role === 'admin' || 
        roleData?.role === 'super-admin'

      if (isAdmin) {
        setMessage(`✅ ${user.email} tiene permisos de ADMIN`)
      } else {
        setMessage(`❌ ${user.email} NO tiene permisos de admin`)
      }

    } catch (error) {
      console.error('Error verificando roles:', error)
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const setSuperAdminRole = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('No hay usuario autenticado')
        return
      }

      // Intentar actualizar en user_roles
      const { data: insertData, error: insertError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'super-admin'
        }, {
          onConflict: 'user_id'
        })
        .select()

      if (insertError) {
        console.log('Error en user_roles:', insertError)
        setError(`Error en user_roles: ${insertError.message}`)
        return
      }

      setMessage(`✅ Rol super-admin asignado en user_roles`)
      setRoleInfo(insertData[0])
      
      // Recargar información
      setTimeout(checkUserRoles, 1000)

    } catch (error) {
      console.error('Error asignando rol:', error)
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAdminAPI = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('No hay sesión activa')
        return
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: 'Test Product',
          description: 'Producto de prueba',
          price: '100',
          image: 'test.jpg',
          categoria: 'test',
          isOffer: false
        })
      })

      if (response.ok) {
        setMessage('✅ API admin funcionando correctamente')
      } else {
        const errorData = await response.json()
        setError(`❌ API admin falló: ${response.status} - ${errorData.message || errorData.error}`)
      }

    } catch (error) {
      console.error('Error probando API:', error)
      setError(`Error probando API: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔍 Verificación de Roles y Permisos
          </h1>
          
          <div className="space-y-6">
            {/* Información del usuario */}
            {userInfo && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">👤 Información del Usuario</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>ID:</strong> {userInfo.id}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>App Metadata:</strong> {JSON.stringify(userInfo.appMetadata)}</p>
                  <p><strong>User Metadata:</strong> {JSON.stringify(userInfo.userMetadata)}</p>
                </div>
              </div>
            )}

            {/* Información de roles */}
            {roleInfo && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="font-semibold text-green-900 mb-2">🔑 Rol en user_roles</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p><strong>Rol:</strong> {roleInfo.role}</p>
                  <p><strong>Creado:</strong> {new Date(roleInfo.created_at).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={checkUserRoles}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? 'Verificando...' : '🔍 Verificar Roles'}
              </button>

              <button
                onClick={setSuperAdminRole}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? 'Configurando...' : '👑 Asignar Super-Admin'}
              </button>

              <button
                onClick={testAdminAPI}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? 'Probando...' : '🧪 Probar API Admin'}
              </button>
            </div>

            {/* Mensajes */}
            {message && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-green-400">✅</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">❌</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Instrucciones */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">Instrucciones:</h4>
                  <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1">
                    <li>Ejecuta primero "Verificar Roles" para ver el estado actual</li>
                    <li>Si no tienes rol, ejecuta "Asignar Super-Admin"</li>
                    <li>Prueba la API con "Probar API Admin"</li>
                    <li>Si sigues teniendo problemas, ejecuta el script SQL en Supabase</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
