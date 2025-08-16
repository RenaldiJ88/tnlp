"use client";

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function SetupAdmin() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const setupAdminRole = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      // Obtener el usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('No hay usuario autenticado')
        return
      }

      console.log('Usuario actual:', user.email)

      // Crear la tabla user_roles si no existe
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_roles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            role VARCHAR(50) NOT NULL DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
          );
        `
      })

      if (createTableError) {
        console.log('Tabla ya existe o error creándola:', createTableError.message)
      }

      // Habilitar RLS
      const { error: rlsError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;'
      })

      if (rlsError) {
        console.log('RLS ya habilitado o error:', rlsError.message)
      }

      // Crear política simple
      const { error: policyError } = await supabase.rpc('exec_sql', {
        sql: `
          DROP POLICY IF EXISTS "Allow all operations for now" ON user_roles;
          CREATE POLICY "Allow all operations for now" ON user_roles
            FOR ALL USING (true);
        `
      })

      if (policyError) {
        console.log('Política ya existe o error:', policyError.message)
      }

      // Insertar rol de admin
      const { data: insertData, error: insertError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'admin'
        }, {
          onConflict: 'user_id'
        })
        .select()

      if (insertError) {
        setError(`Error insertando rol: ${insertError.message}`)
        return
      }

      setMessage(`✅ Rol de admin asignado exitosamente a ${user.email}`)
      console.log('Rol asignado:', insertData)

    } catch (error) {
      console.error('Error en setup:', error)
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkAdminRole = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('No hay usuario autenticado')
        return
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (roleError) {
        setError(`Error verificando rol: ${roleError.message}`)
        return
      }

      if (roleData && roleData.role === 'admin') {
        setMessage(`✅ ${user.email} tiene rol de ADMIN`)
      } else {
        setMessage(`❌ ${user.email} NO tiene rol de admin (rol: ${roleData?.role || 'sin rol'})`)
      }

    } catch (error) {
      console.error('Error verificando rol:', error)
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔧 Configuración de Administrador
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400">ℹ️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Esta página te permite configurar el rol de administrador para tu usuario.
                    Ejecuta primero "Configurar Rol de Admin" y luego "Verificar Rol".
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={setupAdminRole}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? 'Configurando...' : '🔧 Configurar Rol de Admin'}
              </button>

              <button
                onClick={checkAdminRole}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
              >
                {loading ? 'Verificando...' : '✅ Verificar Rol'}
              </button>
            </div>

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

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Nota:</strong> Si tienes problemas con RPC, ejecuta el script SQL directamente en el SQL Editor de Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
