"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'

// Componente para cada categoría de servicio
export default function ServiceCategoryCard({ categoria, subcategorias, servicePrices = {}, onServiceToggle, isServiceSelected }) {
  const [expandedSubcat, setExpandedSubcat] = useState(null)

  // Íconos para cada categoría
  const categoryIcons = {
    "Mantenimiento": "🧹",
    "Up-Grade y mejoras": "⬆️",
    "Reparaciones": "🔧"
  }

  const getServicePrice = (subcategoria, opcion) => {
    // Buscar precio por diferentes patrones
    const patterns = [
      `${categoria}-${subcategoria}-${opcion}`,
      `${categoria}-${opcion}`,
      opcion
    ]
    
    for (const pattern of patterns) {
      if (servicePrices[pattern]) {
        return servicePrices[pattern]
      }
    }
    
    // Fallback: precios por defecto si no se encuentra en la DB
    const fallbackPrices = {
      "Limpieza Advance CPU": 8000,
      "Limpieza Advance Notebook": 7000,
      "Limpieza Pro G CPU": 10000,
      "Limpieza Pro G Notebook": 9000,
      "Limpieza Elite Notebook": 12000,
      "Limpieza Pro G Play/Xbox": 8500,
      "Agregar SSD": 15000,
      "Agregar RAM": 12000,
      "Instalación SO": 5000,
      "Evolución de rendimiento": 18000,
      "Reparación Mother": 25000,
      "Reparación Cargador": 8000,
      "Reparación Pin de carga": 12000,
      "Cambio Bisagras": 15000,
      "Cambio Pantalla": 20000,
      "Cambio Teclado": 10000,
      "Cambio Batería": 12000,
      "Cambio Carcasa": 18000
    }
    
    return fallbackPrices[opcion] || 0
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{categoryIcons[categoria] || "🔧"}</span>
          <div>
            <h4 className="font-semibold text-lg text-gray-900">{categoria}</h4>
            <p className="text-sm text-gray-500">
              {Object.values(subcategorias).flat().length} opciones disponibles
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {Object.entries(subcategorias).map(([subcategoria, opciones]) => (
          <div key={subcategoria}>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setExpandedSubcat(expandedSubcat === subcategoria ? null : subcategoria)
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-900">{subcategoria}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {opciones.length} opciones
                </span>
                <span className="text-gray-400">
                  {expandedSubcat === subcategoria ? '▲' : '▼'}
                </span>
              </div>
            </button>

            {expandedSubcat === subcategoria && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                {opciones.map(opcion => {
                  const precio = getServicePrice(subcategoria, opcion)
                  const isSelected = isServiceSelected(categoria, subcategoria, opcion)
                  
                  return (
                    <div
                      key={opcion}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onServiceToggle(categoria, subcategoria, opcion, precio)
                      }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className={`text-sm ${isSelected ? 'font-medium text-green-900' : 'text-gray-700'}`}>
                            {opcion}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          ${precio.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}