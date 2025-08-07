"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'

// Componente para cada categoría de servicio
export default function ServiceCategoryCard({ categoria, subcategorias, onServiceToggle, isServiceSelected }) {
  const [expandedSubcat, setExpandedSubcat] = useState(null)
  
  // Definir precios base para cada servicio (puedes ajustarlos)
  const servicePrices = {
    "Mantenimiento": {
      "Limpieza Advance CPU": 8000,
      "Limpieza Advance notebook": 7000, 
      "Limpieza Pro G CPU": 12000,
      "Limpieza Pro G notebook": 10000,
      "Limpieza Elite notebook": 15000,
      "Limpieza Pro G play/xbox": 9000
    },
    "Up-Grade y mejoras": {
      "Agregar SSD": 15000,
      "Agregar RAM": 12000,
      "Instalación SO": 8000,
      "Evolución de rendimiento": 10000
    },
    "Reparaciones": {
      "Mother": 25000,
      "Cargador": 8000,
      "Pin de carga": 12000,
      "Bisagras": 15000,
      "Pantalla": 30000,
      "Teclado": 18000,
      "Batería": 20000,
      "Carcasa": 22000
    }
  }

  // Íconos para cada categoría
  const categoryIcons = {
    "Mantenimiento": "🧹",
    "Up-Grade y mejoras": "⬆️",
    "Reparaciones": "🔧"
  }

  const getServicePrice = (opcion) => {
    return servicePrices[categoria]?.[opcion] || 0
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
                  const precio = getServicePrice(opcion)
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