"use client";

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ServiceCategoryCard from '../../../components/admin/ServiceCategoryCard'
import OrdersModal from '../../../components/admin/OrdersModal'
import EditOrderModal from '../../../components/admin/EditOrderModal'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch'
import { supabase } from '../../../lib/supabase'

export default function ServiciosTecnicosAdmin() {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [clients, setClients] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [showEditOrderModal, setShowEditOrderModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Configuración de servicios y opciones
  const serviceOptions = {
    "Mantenimiento": {
      "Limpiezas": [
        "Limpieza Advance CPU",
        "Limpieza Advance notebook", 
        "Limpieza Pro G CPU",
        "Limpieza Pro G notebook",
        "Limpieza Elite notebook",
        "Limpieza Pro G play/xbox"
      ]
    },
    "Up-Grade y mejoras": {
      "Mejoras": [
        "Agregar SSD",
        "Agregar RAM", 
        "Instalación SO",
        "Evolución de rendimiento"
      ]
    },
    "Reparaciones": {
      "Componentes": [
        "Mother",
        "Cargador", 
        "Pin de carga"
      ],
      "Hardware": [
        "Bisagras",
        "Pantalla",
        "Teclado", 
        "Batería",
        "Carcasa"
      ]
    }
  }

  const loadClients = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch('/api/admin/clients')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setClients(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading clients:', error)
      setClients([])
      alert('Error al cargar clientes.')
    } finally {
      setLoading(false)
    }
  }, [authenticatedFetch])

  const loadOrders = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/api/admin/service-orders')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading orders:', error)
      setOrders([])
    }
  }, [authenticatedFetch])

  useEffect(() => {
    loadClients()
    loadOrders()
  }, [loadClients, loadOrders])

  const handleDeleteClient = async (clientId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return
    }

    try {
      const response = await authenticatedFetch(`/api/admin/clients?id=${clientId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setClients(clients.filter(c => c.id !== clientId))
        alert('Cliente eliminado exitosamente')
      } else {
        alert('Error al eliminar cliente')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error al eliminar cliente')
    }
  }

  const handleCreateServiceOrder = (client) => {
    setSelectedClient(client)
    setShowServiceModal(true)
  }

  const handleEditClient = (client) => {
    setSelectedClient(client)
    setShowClientModal(true)
  }

  const handleViewOrders = (client) => {
    setSelectedClient(client)
    setShowOrdersModal(true)
  }

  const getClientOrders = (clientId) => {
    return orders.filter(order => order.cliente_id === clientId)
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setShowEditOrderModal(true)
  }

  // Filtrar clientes
  const filteredClients = clients.filter(client => 
    client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telefono?.includes(searchTerm) ||
    client.documento?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicios Técnicos</h1>
          <p className="text-gray-600">Gestión de clientes y órdenes de trabajo</p>
        </div>
        <button
          onClick={() => {
            setSelectedClient(null)
            setShowClientModal(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>👤</span>
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar cliente
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, teléfono o documento..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </div>
      </div>

      {/* Grid de clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {filteredClients.map(client => (
            <ClientCard 
              key={client.id} 
              client={client} 
              orders={getClientOrders(client.id)}
              onDelete={handleDeleteClient}
              onCreateOrder={handleCreateServiceOrder}
              onEdit={handleEditClient}
              onViewOrders={handleViewOrders}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Intenta ajustar el término de búsqueda'
              : 'Comienza agregando tu primer cliente'
            }
          </p>
        </div>
      )}

      {/* Modales */}
      {showClientModal && (
        <ClientModal
          client={selectedClient}
          authenticatedFetch={authenticatedFetch}
          onClose={() => {
            setShowClientModal(false)
            setSelectedClient(null)
          }}
          onSave={() => {
            loadClients()
            setShowClientModal(false)
            setSelectedClient(null)
          }}
        />
      )}

      {showServiceModal && selectedClient && (
        <ServiceModal
          client={selectedClient}
          serviceOptions={serviceOptions}
          authenticatedFetch={authenticatedFetch}
          onClose={() => {
            setShowServiceModal(false)
            setSelectedClient(null)
          }}
          onSave={() => {
            loadOrders()
            setShowServiceModal(false)
            setSelectedClient(null)
          }}
        />
      )}

      {showOrdersModal && selectedClient && (
        <OrdersModal
          client={selectedClient}
          orders={getClientOrders(selectedClient.id)}
          onClose={() => {
            setShowOrdersModal(false)
            setSelectedClient(null)
          }}
          onOrderDeleted={() => {
            loadOrders()
          }}
          onEditOrder={handleEditOrder}
        />
      )}

      {showEditOrderModal && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          client={clients.find(c => c.id === selectedOrder.cliente_id)}
          serviceOptions={serviceOptions}
          onClose={() => {
            setShowEditOrderModal(false)
            setSelectedOrder(null)
          }}
          onSave={() => {
            loadOrders()
            setShowEditOrderModal(false)
            setSelectedOrder(null)
          }}
        />
      )}
    </div>
  )
}

// Componente de tarjeta de cliente
function ClientCard({ client, orders, onDelete, onCreateOrder, onEdit, onViewOrders }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{client.nombre}</h3>
          <p className="text-gray-600 text-sm">Cliente #{client.id}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 block">
            {client.fechaRegistro}
          </span>
          {orders.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1 inline-block">
              {orders.length} orden{orders.length !== 1 ? 'es' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">📱</span>
          <span>{client.telefono}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">🆔</span>
          <span>{client.documento}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">📍</span>
          <span className="line-clamp-1">{client.direccion}</span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onCreateOrder(client)}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          🔧 Nueva Orden
        </button>
        <button
          onClick={() => onViewOrders(client)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          📋 Ver Órdenes
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(client)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Modal para nuevo/editar cliente
function ClientModal({ client, onClose, onSave, authenticatedFetch }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    documento: '',
    ...client // Si hay un cliente, pre-cargar los datos
  })
  const [saving, setSaving] = useState(false)
  const isEditing = !!client

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/admin/clients'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(isEditing ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente')
        onSave()
      } else {
        alert(isEditing ? 'Error al actualizar cliente' : 'Error al crear cliente')
      }
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Error al guardar cliente')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+54 221 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documento *
              </label>
              <input
                type="text"
                required
                value={formData.documento}
                onChange={(e) => setFormData({...formData, documento: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <textarea
                required
                rows={2}
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Calle 7 N° 123, La Plata"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Modal para crear orden de servicio
function ServiceModal({ client, serviceOptions, onClose, onSave, authenticatedFetch }) {
  const [selectedServices, setSelectedServices] = useState([])
  const [orderDetails, setOrderDetails] = useState({
    descripcionEquipo: '',
    problema: '',
    urgencia: 'normal',
    notas: ''
  })
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
        clienteId: client.id,
        servicios: selectedServices,
        detalles: orderDetails,
        total: totalEstimado,
        estado: 'Recibido',
        fecha: new Date().toISOString().split('T')[0]
      }

      const response = await authenticatedFetch('/api/admin/service-orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        alert('Orden de trabajo creada exitosamente')
        onSave()
      } else {
        alert('Error al crear orden de trabajo')
      }
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Error al crear orden de trabajo')
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
              <h2 className="text-2xl font-bold text-gray-900">Nueva Orden de Trabajo</h2>
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
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {saving ? 'Creando...' : 'Crear Orden'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}