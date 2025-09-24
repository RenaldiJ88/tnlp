"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'

// Componente para mostrar la lista de proveedores con su número identificatorio
export default function ProveedoresList({ className = "" }) {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProveedores = async () => {
      try {
        const response = await authenticatedFetch('/api/admin/proveedores')
        if (response.ok) {
          const data = await response.json()
          setProveedores(data)
        }
      } catch (error) {
        console.error('Error loading proveedores:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProveedores()
  }, [authenticatedFetch])

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-md p-4 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        📋 Lista de Proveedores
      </h3>
      
      <div className="space-y-3">
        {proveedores.length > 0 ? (
          proveedores.map((proveedor) => (
            <div
              key={proveedor.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full">
                    {proveedor.numero_proveedor}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {proveedor.nombre}
                  </p>
                  <p className="text-xs text-gray-600">
                    Proveedor #{proveedor.numero_proveedor}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {proveedor.telefono && (
                  <span className="bg-white px-2 py-1 rounded border">
                    📞 {proveedor.telefono}
                  </span>
                )}
                {proveedor.email && (
                  <span className="bg-white px-2 py-1 rounded border">
                    ✉️
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-sm">No hay proveedores registrados</p>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="font-semibold text-blue-700">1</div>
            <div className="text-gray-600">Feyma</div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="font-semibold text-green-700">2</div>
            <div className="text-gray-600">Ivan</div>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center">
            <div className="font-semibold text-purple-700">3</div>
            <div className="text-gray-600">Alejandro</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Números de identificación de proveedores
        </p>
      </div>
    </motion.div>
  )
}
