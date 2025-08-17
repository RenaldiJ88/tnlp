"use client";

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ApiDiagnostics() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setLoading(true)
    setError('')
    setResults({})

    try {
      const diagnostics = {}

      // 1. Verificar sesión de Supabase
      console.log('🔍 Verificando sesión de Supabase...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        diagnostics.session = { error: sessionError.message }
      } else if (!session) {
        diagnostics.session = { error: 'No hay sesión activa' }
      } else {
        diagnostics.session = { 
          success: true, 
          user: session.user.email,
          token: session.access_token ? `${session.access_token.substring(0, 20)}...` : 'Ausente'
        }
      }

      // 2. Verificar variables de entorno del cliente
      console.log('🔍 Verificando variables de entorno...')
      diagnostics.env = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'No definida',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'No definida',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'No definida',
        nodeEnv: process.env.NODE_ENV || 'No definida'
      }

      // 3. Probar conexión a Supabase
      console.log('🔍 Probando conexión a Supabase...')
      try {
        const { data, error: supabaseError } = await supabase
          .from('productos')
          .select('count')
          .limit(1)
        
        if (supabaseError) {
          diagnostics.supabaseConnection = { error: supabaseError.message }
        } else {
          diagnostics.supabaseConnection = { success: true, data: 'Conexión exitosa' }
        }
      } catch (error) {
        diagnostics.supabaseConnection = { error: error.message }
      }

      // 4. Probar API GET (público)
      console.log('🔍 Probando API GET...')
      try {
        const response = await fetch('/api/admin/products')
        diagnostics.apiGet = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        }
        
        if (response.ok) {
          const data = await response.json()
          diagnostics.apiGet.data = Array.isArray(data) ? `${data.length} productos` : 'Formato inesperado'
        }
      } catch (error) {
        diagnostics.apiGet = { error: error.message }
      }

      // 5. Probar API POST con token
      if (session?.access_token) {
        console.log('🔍 Probando API POST...')
        try {
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              title: 'Test Product',
              description: 'Producto de prueba para diagnóstico',
              price: '100',
              image: 'test.jpg',
              categoria: 'test',
              isOffer: false
            })
          })

          const responseText = await response.text()
          let responseData
          try {
            responseData = JSON.parse(responseText)
          } catch {
            responseData = { raw: responseText }
          }

          diagnostics.apiPost = {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            data: responseData
          }
        } catch (error) {
          diagnostics.apiPost = { error: error.message }
        }
      }

      // 6. Verificar estructura de la base de datos
      console.log('🔍 Verificando estructura de la base de datos...')
      try {
        const { data: tables, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
        
        if (tablesError) {
          diagnostics.databaseStructure = { error: tablesError.message }
        } else {
          const tableNames = tables.map(t => t.table_name).filter(name => 
            ['productos', 'user_roles', 'clientes', 'service_orders'].includes(name)
          )
          diagnostics.databaseStructure = { 
            success: true, 
            tables: tableNames,
            missing: ['productos', 'user_roles', 'clientes', 'service_orders'].filter(name => !tableNames.includes(name))
          }
        }
      } catch (error) {
        diagnostics.databaseStructure = { error: error.message }
      }

      setResults(diagnostics)

    } catch (error) {
      console.error('Error en diagnóstico:', error)
      setError(`Error ejecutando diagnóstico: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const renderResult = (key, result) => {
    if (result.error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>{key}:</strong> {result.error}
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (result.success) {
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-400">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>{key}:</strong> {result.data || 'Exitoso'}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-400">ℹ️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>{key}:</strong> {JSON.stringify(result)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔍 Diagnóstico de la API
          </h1>
          
          <div className="space-y-6">
            {/* Botón de diagnóstico */}
            <div className="flex justify-center">
              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium text-lg"
              >
                {loading ? '🔍 Ejecutando diagnóstico...' : '🔍 Ejecutar diagnóstico completo'}
              </button>
            </div>

            {/* Resultados */}
            {Object.keys(results).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Resultados del diagnóstico:</h2>
                
                {Object.entries(results).map(([key, result]) => (
                  <div key={key}>
                    {renderResult(key, result)}
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
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
                    <li>Ejecuta el diagnóstico completo</li>
                    <li>Revisa cada sección para identificar problemas</li>
                    <li>Si hay errores 500, verifica las variables de entorno en Vercel</li>
                    <li>Si faltan tablas, ejecuta el script SQL en Supabase</li>
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
