"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ServiceCategoryCard from './ServiceCategoryCard'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import { supabase } from '../../lib/supabase'

// Modal para editar orden de servicio
export default function EditOrderModal({ order, client, serviceOptions, onClose, onSave }) {
  const [selectedServices, setSelectedServices] = useState(order.servicios_seleccionados || [])
  const [orderDetails, setOrderDetails] = useState({
    descripcionEquipo: order.equipo_tipo || '',
    problema: order.problema || '',
    urgencia: order.urgencia || 'normal',
    notas: order.notas || ''
  })
  const [estado, setEstado] = useState(order.estado || 'Recibido')
  const [saving, setSaving] = useState(false)

  const handleServiceToggle = (categoria, subcategoria, opcion, precio = 0) => {
    const serviceId = `${categoria}-${subcategoria}-${opcion}`
    const existingIndex = selectedServices.findIndex(s => s.id === serviceId)
    
    if (existingIndex >= 0) {
      // Remover servicio
      setSelectedServices(selectedServices.filter((_, index) => index !== existingIndex))
    } else {
      // Agregar servicio
      const newService = {
        id: serviceId,
        categoria,
        subcategoria,
        opcion,
        precio: precio || 0
      }
      setSelectedServices([...selectedServices, newService])
    }
  }

  const isServiceSelected = (categoria, subcategoria, opcion) => {
    const serviceId = `${categoria}-${subcategoria}-${opcion}`
    return selectedServices.some(s => s.id === serviceId)
  }

  const totalEstimado = selectedServices.reduce((total, service) => total + service.precio, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const orderData = {
        id: order.id,
        cliente_id: order.cliente_id,
        servicios_seleccionados: selectedServices,
        equipo_tipo: orderDetails.descripcionEquipo,
        problema: orderDetails.problema,
        urgencia: orderDetails.urgencia,
        notas: orderDetails.notas,
        estado: estado,
        total: totalEstimado
      }

      const response = await fetch('/api/admin/service-orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        alert('Orden actualizada exitosamente')
        onSave()
      } else {
        alert('Error al actualizar orden')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error al actualizar orden')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Editar Orden #{order.id}</h2>
              <p className="text-gray-600">Cliente: {client.nombre} - #{client.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Estado de la orden */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Estado de la Orden</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Recibido', 'En proceso', 'Completado', 'Cancelado'].map(est => (
                  <button
                    key={est}
                    type="button"
                    onClick={() => setEstado(est)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      estado === est
                        ? 'border-blue-500 bg-blue-100 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {est}
                  </button>
                ))}
              </div>
            </div>

            {/* Información del equipo */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Información del Equipo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del equipo *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderDetails.descripcionEquipo}
                    onChange={(e) => setOrderDetails({...orderDetails, descripcionEquipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Laptop HP Pavilion 15.6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgencia
                  </label>
                  <select
                    value={orderDetails.urgencia}
                    onChange={(e) => setOrderDetails({...orderDetails, urgencia: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problema reportado *
                </label>
                <textarea
                  required
                  rows={3}
                  value={orderDetails.problema}
                  onChange={(e) => setOrderDetails({...orderDetails, problema: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el problema que reporta el cliente..."
                />
              </div>
            </div>

            {/* Selector de servicios */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Servicios a Realizar</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(serviceOptions).map(([categoria, subcategorias]) => (
                  <ServiceCategoryCard
                    key={categoria}
                    categoria={categoria}
                    subcategorias={subcategorias}
                    onServiceToggle={handleServiceToggle}
                    isServiceSelected={isServiceSelected}
                  />
                ))}
              </div>
            </div>

            {/* Servicios seleccionados */}
            {selectedServices.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">
                  Servicios Seleccionados ({selectedServices.length})
                </h4>
                <div className="space-y-2">
                  {selectedServices.map(service => (
                    <div key={service.id} className="flex justify-between items-center bg-white rounded px-3 py-2">
                      <span className="text-sm">
                        <span className="font-medium">{service.categoria}</span>
                        {service.subcategoria && <span className="text-gray-500"> → {service.subcategoria}</span>}
                        <span className="text-gray-700"> → {service.opcion}</span>
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">
                          ${service.precio.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleServiceToggle(service.categoria, service.subcategoria, service.opcion)
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-900">Total Estimado:</span>
                    <span className="text-xl font-bold text-blue-900">${totalEstimado.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notas adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                rows={3}
                value={orderDetails.notas}
                onChange={(e) => setOrderDetails({...orderDetails, notas: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones, piezas a solicitar, etc..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || selectedServices.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {saving ? 'Actualizando...' : 'Actualizar Orden'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}