"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Verificar si ya está autenticado
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Ya está autenticado, redirigir al admin
        router.push('/admin')
      }
    } catch (error) {
      // No está autenticado, continuar con login
      console.log('No authenticated')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔍 Enviando login a Supabase:', formData)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        console.log('❌ Login fallido:', error.message)
        setError(error.message || 'Error al iniciar sesión')
        return
      }

      if (data.user) {
        console.log('✅ Login exitoso con Supabase:', data.user)
        
        // Redirigir al admin
        router.push('/admin')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 25%), 
                         radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 25%)`
      }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-2xl">🔐</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-blue-100 text-sm mt-1">Tu Notebook La Plata</p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
              >
                <div className="flex">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                  placeholder="Ingresa tu email"
                  autoComplete="email"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📧</span>
                </div>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 pr-12"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔒</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="text-lg">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verificando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>
          </form>

          {/* Development info */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
            >
              <p className="text-xs text-gray-600 font-medium mb-1">
                🔧 Modo Desarrollo - Supabase Auth
              </p>
              <p className="text-xs text-gray-500">
                Usa el email y contraseña que creaste en Supabase
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t">
          <p className="text-xs text-gray-500">
            © 2024 Tu Notebook La Plata. Acceso restringido.
          </p>
        </div>
      </motion.div>
    </div>
  )
}