"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import { supabase } from '../../lib/supabase'

// Modal para ver órdenes de un cliente
export default function OrdersModal({ client, orders, onClose, onOrderDeleted, onEditOrder }) {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [deletingOrderId, setDeletingOrderId] = useState(null)

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      return
    }

    try {
      setDeletingOrderId(orderId)
      const response = await authenticatedFetch(`/api/admin/service-orders?id=${orderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Orden eliminada exitosamente')
        // Notificar al componente padre para actualizar la lista
        if (onOrderDeleted) {
          onOrderDeleted()
        }
      } else {
        alert('Error al eliminar orden')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Error al eliminar orden')
    } finally {
      setDeletingOrderId(null)
    }
  }

  const getStatusColor = (estado) => {
    const colors = {
      'Recibido': 'bg-yellow-100 text-yellow-800',
      'En proceso': 'bg-blue-100 text-blue-800',
      'Completado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800'
    }
    return colors[estado] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📋 Órdenes de Trabajo</h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">👤 Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium text-gray-700">Nombre:</span> {client?.nombre || 'N/A'}</p>
                  <p><span className="font-medium text-gray-700">ID Cliente:</span> #{client?.id || 'N/A'}</p>
                  {client?.telefono && (
                    <p><span className="font-medium text-gray-700">Teléfono:</span> {client.telefono}</p>
                  )}
                  {client?.email && (
                    <p><span className="font-medium text-gray-700">Email:</span> {client.email}</p>
                  )}
                  {client?.direccion && (
                    <p className="md:col-span-2"><span className="font-medium text-gray-700">Dirección:</span> {client.direccion}</p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl ml-4 p-2"
            >
              ✕
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay órdenes
              </h3>
              <p className="text-gray-600">
                Este cliente no tiene órdenes de trabajo registradas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">
                        Orden #{order.id}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.equipo_tipo}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.estado)}`}>
                        {order.estado}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.date_added ? new Date(order.date_added).toLocaleDateString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Problema:</h5>
                      <p className="text-sm text-gray-700">{order.problema}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Urgencia:</h5>
                      <span className={`text-sm px-2 py-1 rounded ${
                        order.urgencia === 'urgente' ? 'bg-red-100 text-red-800' :
                        order.urgencia === 'alta' ? 'bg-orange-100 text-orange-800' :
                        order.urgencia === 'normal' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.urgencia}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="font-medium text-gray-900 mb-2">🔧 Servicios seleccionados:</h5>
                    {order.servicios_seleccionados && order.servicios_seleccionados.length > 0 ? (
                      <div className="space-y-2">
                        {order.servicios_seleccionados.map((servicio, index) => {
                          // Construir el nombre del servicio de manera más robusta
                          let servicioNombre = ''
                          
                          if (servicio.categoria) {
                            servicioNombre = servicio.categoria
                          }
                          
                          if (servicio.subcategoria && servicio.subcategoria !== 'null' && servicio.subcategoria !== null) {
                            servicioNombre += ` → ${servicio.subcategoria}`
                          }
                          
                          if (servicio.opcion && servicio.opcion !== 'null' && servicio.opcion !== null) {
                            servicioNombre += ` → ${servicio.opcion}`
                          }
                          
                          // Si no hay nombre construido, usar campos alternativos
                          if (!servicioNombre && servicio.nombre) {
                            servicioNombre = servicio.nombre
                          }
                          
                          // Fallback si no hay nada
                          if (!servicioNombre) {
                            servicioNombre = 'Servicio sin especificar'
                          }

                          return (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border-l-3 border-blue-500">
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800">
                                  {servicioNombre}
                                </span>
                                {servicio.id && (
                                  <p className="text-xs text-gray-500 mt-1">ID: {servicio.id}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-green-600">
                                  ${servicio.precio?.toLocaleString() || '0'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-600 text-sm">No hay servicios seleccionados para esta orden</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        Total: ${order.total?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {onEditOrder && (
                        <button
                          onClick={() => onEditOrder(order)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                        >
                          ✏️ Editar
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingOrderId === order.id}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors disabled:opacity-50"
                      >
                        {deletingOrderId === order.id ? 'Eliminando...' : '🗑️ Eliminar'}
                      </button>
                    </div>
                  </div>

                  {order.notas && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h5 className="font-medium text-gray-900 mb-1">Notas:</h5>
                      <p className="text-sm text-gray-700">{order.notas}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}