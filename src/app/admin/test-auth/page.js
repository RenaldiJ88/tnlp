"use client";

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function TestAuth() {
  const [session, setSession] = useState(null)
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
  }

  const testAPI = async (endpoint, method = 'GET') => {
    setLoading(true)
    setTestResults(prev => ({ ...prev, [endpoint]: { loading: true } }))

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setTestResults(prev => ({ 
          ...prev, 
          [endpoint]: { error: 'No hay sesión activa' }
        }))
        return
      }

      console.log('🔍 Probando', method, endpoint)
      console.log('🔑 Token:', session.access_token ? `${session.access_token.substring(0, 20)}...` : 'Ausente')

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      }

      const options = {
        method,
        headers,
        ...(method !== 'GET' && { body: JSON.stringify({ test: true }) })
      }

      const response = await fetch(endpoint, options)
      const responseText = await response.text()
      
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = { raw: responseText }
      }

      console.log('📡 Respuesta:', response.status, responseData)

      setTestResults(prev => ({ 
        ...prev, 
        [endpoint]: { 
          status: response.status,
          data: responseData,
          success: response.ok
        }
      }))

    } catch (error) {
      console.error('❌ Error probando', endpoint, ':', error)
      setTestResults(prev => ({ 
        ...prev, 
        [endpoint]: { error: error.message }
      }))
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = () => {
    testAPI('/api/admin/products')
    testAPI('/api/admin/clients')
    testAPI('/api/admin/service-orders')
  }

  const renderTestResult = (endpoint, result) => {
    if (!result) return null

    if (result.loading) {
      return <div className="text-blue-600">🔄 Probando...</div>
    }

    if (result.error) {
      return (
        <div className="text-red-600">
          ❌ Error: {result.error}
        </div>
      )
    }

    if (result.success) {
      return (
        <div className="text-green-600">
          ✅ {result.status} - {Array.isArray(result.data) ? `${result.data.length} items` : 'Success'}
        </div>
      )
    }

    return (
      <div className="text-red-600">
        ❌ {result.status} - {result.data?.message || result.data?.error || 'Unknown error'}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🧪 Test de Autenticación y APIs
          </h1>
          
          <div className="space-y-6">
            {/* Estado de la sesión */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Estado de la Sesión:</h3>
              {session ? (
                <div className="text-blue-800">
                  ✅ Usuario: {session.user.email}<br/>
                  🔑 Token: {session.access_token ? 'Presente' : 'Ausente'}
                </div>
              ) : (
                <div className="text-blue-800">
                  ❌ No hay sesión activa
                </div>
              )}
            </div>

            {/* Botones de prueba */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => testAPI('/api/admin/products')}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  🧪 Probar /products
                </button>
                
                <button
                  onClick={() => testAPI('/api/admin/clients')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  🧪 Probar /clients
                </button>
                
                <button
                  onClick={() => testAPI('/api/admin/service-orders')}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  🧪 Probar /service-orders
                </button>
              </div>
              
              <button
                onClick={runAllTests}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
              >
                🚀 Ejecutar Todas las Pruebas
              </button>
            </div>

            {/* Resultados */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Resultados de las Pruebas:</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">/api/admin/products</h4>
                  {renderTestResult('/api/admin/products', testResults['/api/admin/products'])}
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">/api/admin/clients</h4>
                  {renderTestResult('/api/admin/clients', testResults['/api/admin/clients'])}
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">/api/admin/service-orders</h4>
                  {renderTestResult('/api/admin/service-orders', testResults['/api/admin/service-orders'])}
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">Instrucciones:</h4>
                  <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1">
                    <li>Verifica que tengas sesión activa</li>
                    <li>Ejecuta las pruebas individuales o todas juntas</li>
                    <li>Revisa la consola para logs detallados</li>
                    <li>Si hay errores 401, verifica las variables de entorno</li>
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

