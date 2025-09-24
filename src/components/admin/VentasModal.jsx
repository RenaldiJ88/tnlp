"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'

// Modal para registrar nueva venta
export default function VentasModal({ client, onClose, onSave }) {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [loading, setLoading] = useState(false)
  const [proveedores, setProveedores] = useState([])
  const [metodosPago, setMetodosPago] = useState([])
  
  const [ventaData, setVentaData] = useState({
    fecha_venta: new Date().toISOString().split('T')[0],
    precio_compra: '',
    precio_venta: '',
    proveedor_id: '',
    metodo_pago_id: '',
    descripcion: '',
    observaciones: ''
  })

  // Cargar proveedores y métodos de pago al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Cargar proveedores
        const proveedoresResponse = await authenticatedFetch('/api/admin/proveedores')
        if (proveedoresResponse.ok) {
          const proveedoresData = await proveedoresResponse.json()
          setProveedores(proveedoresData)
        }

        // Cargar métodos de pago
        const metodosPagoResponse = await authenticatedFetch('/api/admin/metodos-pago')
        if (metodosPagoResponse.ok) {
          const metodosPagoData = await metodosPagoResponse.json()
          setMetodosPago(metodosPagoData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [authenticatedFetch])

  const handleInputChange = (field, value) => {
    setVentaData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!ventaData.proveedor_id || !ventaData.metodo_pago_id) {
      alert('Por favor selecciona proveedor y método de pago')
      return
    }

    if (!ventaData.precio_compra || !ventaData.precio_venta) {
      alert('Por favor ingresa los precios de compra y venta')
      return
    }

    try {
      setLoading(true)

      const newVenta = {
        cliente_id: client.id,
        ...ventaData,
        proveedor_id: parseInt(ventaData.proveedor_id),
        metodo_pago_id: parseInt(ventaData.metodo_pago_id)
      }

      const response = await authenticatedFetch('/api/admin/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVenta)
      })

      if (response.ok) {
        const result = await response.json()
        alert('Venta registrada exitosamente')
        onSave && onSave(result.venta)
        onClose()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating venta:', error)
      alert('Error al registrar la venta')
    } finally {
      setLoading(false)
    }
  }

  const gananciaEstimada = ventaData.precio_venta && ventaData.precio_compra 
    ? parseFloat(ventaData.precio_venta) - parseFloat(ventaData.precio_compra)
    : 0

  if (loading && proveedores.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">💰 Registrar Nueva Venta</h2>
              <p className="text-gray-600">Cliente: {client?.nombre} (#{client?.id})</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📅 Fecha de Venta
                </label>
                <input
                  type="date"
                  value={ventaData.fecha_venta}
                  onChange={(e) => handleInputChange('fecha_venta', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🏪 Proveedor
                </label>
                <select
                  value={ventaData.proveedor_id}
                  onChange={(e) => handleInputChange('proveedor_id', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      #{proveedor.numero_proveedor} - {proveedor.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  💸 Precio de Compra
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={ventaData.precio_compra}
                  onChange={(e) => handleInputChange('precio_compra', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  💰 Precio de Venta
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={ventaData.precio_venta}
                  onChange={(e) => handleInputChange('precio_venta', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📈 Ganancia Estimada
                </label>
                <div className={`w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold ${
                  gananciaEstimada >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                }`}>
                  ${gananciaEstimada.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💳 Método de Pago
              </label>
              <select
                value={ventaData.metodo_pago_id}
                onChange={(e) => handleInputChange('metodo_pago_id', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar método de pago...</option>
                {metodosPago.map((metodo) => (
                  <option key={metodo.id} value={metodo.id}>
                    {metodo.nombre} ({metodo.moneda})
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 Descripción del Producto/Servicio
              </label>
              <input
                type="text"
                value={ventaData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Notebook HP Pavilion 15, Memoria RAM 8GB, etc."
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📋 Observaciones (Opcional)
              </label>
              <textarea
                value={ventaData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notas adicionales sobre la venta..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Registrando...' : '💰 Registrar Venta'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
