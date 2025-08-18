"use client";

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch'

export default function DebugAuth() {
  const { authenticatedFetch } = useAuthenticatedFetch()
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

  const testEndpoint = async (name, url, method, body = null) => {
    setTestResults(prev => ({ ...prev, [name]: { loading: true } }))
    
    try {
      console.log(`🧪 Testing ${method} ${url}`)
      
      const options = { method }
      if (body) {
        options.body = JSON.stringify(body)
      }
      
      const response = await authenticatedFetch(url, options)
      const responseText = await response.text()
      
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = { raw: responseText }
      }

      console.log(`📡 ${name} Response:`, {
        status: response.status,
        ok: response.ok,
        data: responseData
      })

      setTestResults(prev => ({ 
        ...prev, 
        [name]: { 
          status: response.status,
          ok: response.ok,
          data: responseData,
          success: response.ok
        }
      }))

    } catch (error) {
      console.error(`❌ ${name} Error:`, error)
      setTestResults(prev => ({ 
        ...prev, 
        [name]: { 
          error: error.message,
          success: false
        }
      }))
    }
  }

  const runAllTests = () => {
    // Test datos mínimos para crear cliente
    const testClient = {
      nombre: "Test Usuario",
      telefono: "221-123-4567", 
      documento: "12345678",
      direccion: "Test Address 123"
    }

    // Test datos mínimos para crear orden
    const testOrder = {
      clienteId: 1, // Asumiendo que existe cliente con ID 1
      servicios: [{
        id: "test-service",
        categoria: "Mantenimiento",
        subcategoria: "Limpiezas", 
        opcion: "Limpieza Advance CPU",
        precio: 8000
      }],
      detalles: {
        descripcionEquipo: "Test Laptop",
        problema: "Test problem",
        urgencia: "normal",
        notas: "Test notes"
      },
      total: 8000,
      estado: "Recibido",
      fecha: new Date().toISOString().split('T')[0]
    }

    // Ejecutar tests
    testEndpoint('GET Clients', '/api/admin/clients', 'GET')
    testEndpoint('POST Client', '/api/admin/clients', 'POST', testClient)
    testEndpoint('GET Service Orders', '/api/admin/service-orders', 'GET')
    testEndpoint('POST Service Order', '/api/admin/service-orders', 'POST', testOrder)
  }

  const renderResult = (name, result) => {
    if (!result) return <div className="text-gray-500">No ejecutado</div>
    
    if (result.loading) return <div className="text-blue-600">🔄 Ejecutando...</div>
    
    if (result.error) {
      return (
        <div className="text-red-600">
          <div>❌ Error: {result.error}</div>
        </div>
      )
    }

    const statusColor = result.success ? 'text-green-600' : 'text-red-600'
    const statusIcon = result.success ? '✅' : '❌'
    
    return (
      <div className={statusColor}>
        <div>{statusIcon} Status: {result.status}</div>
        <div className="text-xs mt-1 text-gray-600">
          {result.data?.message || result.data?.error || 'Success'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔧 Debug de Autenticación - Endpoints Admin
          </h1>
          
          {/* Session Info */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Estado de la Sesión:</h3>
            {session ? (
              <div className="text-blue-800 space-y-1">
                <div>✅ Usuario: {session.user.email}</div>
                <div>🔑 Token presente: {session.access_token ? 'SÍ' : 'NO'}</div>
                <div className="text-xs">
                  🆔 User ID: {session.user.id}
                </div>
                <div className="text-xs">
                  ⏰ Token expires: {new Date(session.expires_at * 1000).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-blue-800">❌ No hay sesión activa</div>
            )}
          </div>

          {/* Test Button */}
          <div className="mb-6">
            <button
              onClick={runAllTests}
              disabled={loading || !session}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              🚀 Ejecutar Todos los Tests
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">📋 Tests de Clientes</h3>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">GET /api/admin/clients</h4>
                {renderResult('GET Clients', testResults['GET Clients'])}
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">POST /api/admin/clients</h4>
                {renderResult('POST Client', testResults['POST Client'])}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">🔧 Tests de Órdenes</h3>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">GET /api/admin/service-orders</h4>
                {renderResult('GET Service Orders', testResults['GET Service Orders'])}
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">POST /api/admin/service-orders</h4>
                {renderResult('POST Service Order', testResults['POST Service Order'])}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h4 className="font-semibold text-yellow-900 mb-2">Instrucciones:</h4>
                <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1">
                  <li>Verifica que estés logueado como super-admin</li>
                  <li>Ejecuta los tests y revisa la consola para logs detallados</li>
                  <li>Compara GET (que funciona) vs POST (que falla)</li>
                  <li>Identifica exactamente dónde está fallando la validación</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
