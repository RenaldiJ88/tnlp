"use client";

import { useState, useEffect } from 'react'

export default function CheckConfig() {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    setLoading(true)
    
    try {
      const configData = {
        // Variables del cliente (públicas)
        client: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'No definida',
          supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'No definida',
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'No definida',
          nodeEnv: process.env.NODE_ENV || 'No definida'
        },
        // Información del navegador
        browser: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language
        },
        // Información de la página
        page: {
          url: window.location.href,
          origin: window.location.origin,
          hostname: window.location.hostname
        }
      }

      // Probar conexión a Supabase si la URL está definida
      if (configData.client.supabaseUrl && configData.client.supabaseUrl !== 'No definida') {
        try {
          const response = await fetch(`${configData.client.supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
              'apikey': configData.client.supabaseAnonKey || '',
              'Authorization': `Bearer ${configData.client.supabaseAnonKey || ''}`
            }
          })
          
          configData.supabaseTest = {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            url: configData.client.supabaseUrl
          }
        } catch (error) {
          configData.supabaseTest = {
            error: error.message,
            url: configData.client.supabaseUrl
          }
        }
      }

      setConfig(configData)
    } catch (error) {
      console.error('Error verificando configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderConfigSection = (title, data) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="font-medium text-gray-700">{key}:</span>
            <span className="text-sm text-gray-600 break-all max-w-md">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSupabaseTest = () => {
    if (!config.supabaseTest) return null

    const { supabaseTest } = config
    const isError = supabaseTest.error || !supabaseTest.ok

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Test de Conexión a Supabase</h3>
        
        {isError ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">❌</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Error de conexión:</strong> {supabaseTest.error || `${supabaseTest.status} ${supabaseTest.statusText}`}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  <strong>URL probada:</strong> {supabaseTest.url}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>Conexión exitosa:</strong> {supabaseTest.status} {supabaseTest.statusText}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <strong>URL:</strong> {supabaseTest.url}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔧 Verificación de Configuración
          </h1>
          
          <div className="space-y-6">
            {/* Botón de verificación */}
            <div className="flex justify-center">
              <button
                onClick={checkConfiguration}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium text-lg"
              >
                {loading ? '🔍 Verificando...' : '🔍 Verificar configuración'}
              </button>
            </div>

            {/* Resultados */}
            {Object.keys(config).length > 0 && (
              <>
                {renderConfigSection('📱 Variables del Cliente', config.client)}
                {renderConfigSection('🌐 Información del Navegador', config.browser)}
                {renderConfigSection('📍 Información de la Página', config.page)}
                {renderSupabaseTest()}
              </>
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
                    <li>Verifica que la URL de Supabase no tenga guiones bajos</li>
                    <li>La URL debe ser: <code>https://[project-id].supabase.co</code></li>
                    <li>Si hay errores, actualiza las variables en Vercel</li>
                    <li>Haz redeploy después de actualizar las variables</li>
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
