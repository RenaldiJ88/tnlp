"use client";

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import { supabase } from '../../lib/supabase'
import OrdersModal from '../../components/admin/OrdersModal'

export default function AdminDashboard() {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalOrdenes: 0,
    ordenesPendientes: 0,
    ordenesCompletadas: 0,
    ingresosTotales: 0,
    ingresosMes: 0,
    servicioPopular: '',
    urgenciaPromedio: ''
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [serviceStats, setServiceStats] = useState([])
  const [monthlyStats, setMonthlyStats] = useState([])
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedClientOrders, setSelectedClientOrders] = useState([])

  const loadDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
        setError(null)
      }

      // Cargar clientes
      const clientsResponse = await authenticatedFetch('/api/admin/clients')
      if (!clientsResponse.ok) {
        throw new Error('Error al cargar clientes')
      }
      const clients = await clientsResponse.json()
      
      // Cargar órdenes
      const ordersResponse = await authenticatedFetch('/api/admin/service-orders')
      if (!ordersResponse.ok) {
        throw new Error('Error al cargar órdenes')
      }
      const orders = await ordersResponse.json()

      // Calcular estadísticas
      const totalOrdenes = orders.length
      const ordenesPendientes = orders.filter(o => o.estado === 'Recibido' || o.estado === 'En proceso').length
      const ordenesCompletadas = orders.filter(o => o.estado === 'Completado').length
      const ingresosTotales = orders.reduce((sum, order) => sum + (order.total || 0), 0)
      
      // Ingresos del mes actual
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const ingresosMes = orders
        .filter(order => {
          const orderDate = new Date(order.fecha)
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
        })
        .reduce((sum, order) => sum + (order.total || 0), 0)

      // Servicio más popular
      const serviceCounts = {}
      orders.forEach(order => {
        order.servicios?.forEach(servicio => {
          const key = `${servicio.categoria} - ${servicio.opcion}`
          serviceCounts[key] = (serviceCounts[key] || 0) + 1
        })
      })
      const servicioPopular = Object.keys(serviceCounts).reduce((a, b) => 
        serviceCounts[a] > serviceCounts[b] ? a : b, 'N/A'
      )

      // Urgencia promedio
      const urgencias = orders.map(o => o.detalles?.urgencia).filter(Boolean)
      const urgenciaMap = { 'baja': 1, 'normal': 2, 'alta': 3, 'urgente': 4 }
      const promedioNum = urgencias.reduce((sum, u) => sum + (urgenciaMap[u] || 2), 0) / urgencias.length
      const urgenciaPromedio = promedioNum >= 3.5 ? 'Alta' : promedioNum >= 2.5 ? 'Normal' : 'Baja'

      setStats({
        totalClientes: clients.length || 0,
        totalOrdenes,
        ordenesPendientes,
        ordenesCompletadas,
        ingresosTotales,
        ingresosMes,
        servicioPopular: servicioPopular || 'N/A',
        urgenciaPromedio: urgenciaPromedio || 'N/A'
      })

      // Órdenes recientes (últimas 5)
      const recientes = orders
        .sort((a, b) => new Date(b.date_added || b.fecha) - new Date(a.date_added || a.fecha))
        .slice(0, 5)
        .map(order => {
          const cliente = clients.find(c => c.id === order.cliente_id)
          return {
            id: order.id,
            clienteId: order.cliente_id,
            cliente: cliente?.nombre || 'Cliente desconocido',
            equipo: order.equipo_tipo || 'Equipo no especificado',
            estado: order.estado,
            total: order.total,
            fecha: order.date_added ? new Date(order.date_added).toLocaleDateString() : 'Fecha no disponible'
          }
        })
      setRecentOrders(recientes)

      // Estadísticas de servicios
      const statsServicios = Object.entries(serviceCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([servicio, cantidad]) => ({ servicio, cantidad }))
      setServiceStats(statsServicios)

      // Estadísticas mensuales (últimos 6 meses)
      const monthlyData = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.toLocaleString('es', { month: 'short' })
        
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.fecha)
          return orderDate.getMonth() === date.getMonth() && 
                 orderDate.getFullYear() === date.getFullYear()
        })
        
        monthlyData.push({
          mes: month,
          ordenes: monthOrders.length,
          ingresos: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        })
      }
      setMonthlyStats(monthlyData)
      setLastUpdate(new Date())

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError(error.message)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [authenticatedFetch])

  // Función para actualizar con confirmación
  const handleRefreshDashboard = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres actualizar todas las métricas del dashboard?\n\n' +
      'Esto recargará todos los datos desde la base de datos.'
    )
    
    if (confirmed) {
      await loadDashboardData(true)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Auto-refresh cada 5 minutos si está habilitado
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadDashboardData(false) // Sin mostrar loading para auto-refresh
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [autoRefresh, loadDashboardData])

  // Función para manejar click en una orden
  const handleOrderClick = async (order) => {
    if (!order.clienteId) {
      console.log('No hay cliente asociado a esta orden')
      return
    }

    try {
      // Cargar información del cliente
      const clientsResponse = await authenticatedFetch('/api/admin/clients')
      if (!clientsResponse.ok) {
        throw new Error('Error al cargar clientes')
      }
      const clients = await clientsResponse.json()
      const client = clients.find(c => c.id === order.clienteId)

      if (!client) {
        console.log('Cliente no encontrado')
        return
      }

      // Cargar todas las órdenes del cliente
      const ordersResponse = await authenticatedFetch('/api/admin/service-orders')
      if (!ordersResponse.ok) {
        throw new Error('Error al cargar órdenes')
      }
      const allOrders = await ordersResponse.json()
      const clientOrders = allOrders.filter(o => o.cliente_id === order.clienteId)

      setSelectedClient(client)
      setSelectedClientOrders(clientOrders)
      setShowOrdersModal(true)
    } catch (error) {
      console.error('Error cargando detalles del cliente:', error)
    }
  }

  const StatCard = ({ title, value, icon, color = "blue" }) => (
    <motion.div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`text-${color}-500 text-4xl`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )

  // Estado de carga general
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando dashboard...</p>
          <p className="text-gray-500 text-sm">Obteniendo datos de la base de datos</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadDashboardData(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Panel de control - Tu Notebook La Plata</p>
        </div>
        <div className="flex items-center space-x-6">
          {/* Toggle Auto-refresh */}
          <div className="flex items-center space-x-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm text-gray-600">
              Auto-actualizar {autoRefresh && '(5 min)'}
            </span>
          </div>

          {/* Última actualización */}
          {lastUpdate && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Última actualización:</p>
              <p className="text-sm font-medium text-gray-700">
                {lastUpdate.toLocaleString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Clientes"
          value={stats.totalClientes}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Órdenes Totales"
          value={stats.totalOrdenes}
          icon="📋"
          color="indigo"
        />
        <StatCard
          title="Órdenes Pendientes"
          value={stats.ordenesPendientes}
          icon="⏰"
          color="yellow"
        />
        <StatCard
          title="Completadas"
          value={stats.ordenesCompletadas}
          icon="✅"
          color="green"
        />
      </div>

      {/* Métricas financieras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Ingresos Totales"
          value={`$${stats.ingresosTotales.toLocaleString()}`}
          icon="💰"
          color="purple"
        />
        <StatCard
          title="Ingresos Este Mes"
          value={`$${stats.ingresosMes.toLocaleString()}`}
          icon="📈"
          color="emerald"
        />
        <StatCard
          title="Promedio por Orden"
          value={stats.totalOrdenes > 0 ? `$${Math.round(stats.ingresosTotales / stats.totalOrdenes).toLocaleString()}` : '$0'}
          icon="💵"
          color="teal"
        />
      </div>

      {/* Insights del negocio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Insights del Negocio</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Servicio más popular:</span>
              <span className="font-medium text-gray-900 text-sm">
                {stats.servicioPopular || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Urgencia promedio:</span>
              <span className={`font-medium px-2 py-1 rounded text-sm ${
                stats.urgenciaPromedio === 'Alta' ? 'bg-red-100 text-red-700' :
                stats.urgenciaPromedio === 'Normal' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {stats.urgenciaPromedio || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Tasa de finalización:</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${stats.totalOrdenes > 0 ? Math.round((stats.ordenesCompletadas / stats.totalOrdenes) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="font-medium text-green-600 text-sm">
                  {stats.totalOrdenes > 0 ? Math.round((stats.ordenesCompletadas / stats.totalOrdenes) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Ticket promedio:</span>
              <span className="font-medium text-purple-600">
                ${stats.totalOrdenes > 0 ? Math.round(stats.ingresosTotales / stats.totalOrdenes).toLocaleString() : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Servicios más populares */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Top Servicios</h3>
          <div className="space-y-3">
            {serviceStats.length > 0 ? (
              serviceStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">{stat.servicio}</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 rounded-full px-2 py-1">
                      <span className="text-blue-800 text-xs font-medium">{stat.cantidad}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay servicios registrados</p>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas mensuales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Tendencia Mensual</h3>
        <div className="grid grid-cols-6 gap-4">
          {monthlyStats.map((month, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div 
                  className="bg-blue-500 rounded-t mx-auto"
                  style={{ 
                    height: `${Math.max((month.ordenes / Math.max(...monthlyStats.map(m => m.ordenes), 1)) * 60, 5)}px`,
                    width: '20px'
                  }}
                ></div>
                <div 
                  className="bg-green-500 mx-auto"
                  style={{ 
                    height: `${Math.max((month.ingresos / Math.max(...monthlyStats.map(m => m.ingresos), 1)) * 40, 2)}px`,
                    width: '20px'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 font-medium">{month.mes}</p>
              <p className="text-xs text-blue-600">{month.ordenes}</p>
              <p className="text-xs text-green-600">${(month.ingresos / 1000).toFixed(0)}K</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
            <span>Órdenes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            <span>Ingresos</span>
          </div>
        </div>
      </div>

      {/* Órdenes recientes */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">📋 Órdenes Recientes</h2>
        </div>
        <div className="p-6">
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleOrderClick(order)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      order.estado === 'Completado' ? 'bg-green-500' :
                      order.estado === 'En proceso' ? 'bg-blue-500' :
                      order.estado === 'Recibido' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Orden #{order.id} - {order.cliente}
                      </p>
                      <p className="text-xs text-gray-500">{order.equipo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">${order.total?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{order.fecha}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay órdenes registradas
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <motion.a
            href="/admin/productos"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl mr-3">💻</span>
            <div>
              <p className="font-medium text-blue-900">Gestionar Productos</p>
              <p className="text-sm text-blue-600">Catálogo de notebooks y PCs</p>
            </div>
          </motion.a>

          <motion.a
            href="/admin/servicios-tecnicos"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl mr-3">🔧</span>
            <div>
              <p className="font-medium text-green-900">Servicios Técnicos</p>
              <p className="text-sm text-green-600">Clientes y órdenes de trabajo</p>
            </div>
          </motion.a>

          <motion.button
            onClick={handleRefreshDashboard}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            disabled={loading}
          >
            <span className="text-2xl mr-3">{loading ? '⏳' : '🔄'}</span>
            <div>
              <p className="font-medium text-purple-900">
                {loading ? 'Actualizando...' : 'Actualizar Dashboard'}
              </p>
              <p className="text-sm text-purple-600">
                {loading ? 'Refrescando métricas...' : 'Refrescar todas las métricas'}
              </p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Modal de órdenes del cliente */}
      {showOrdersModal && selectedClient && (
        <OrdersModal
          client={selectedClient}
          orders={selectedClientOrders}
          onClose={() => {
            setShowOrdersModal(false)
            setSelectedClient(null)
            setSelectedClientOrders([])
          }}
          onOrderDeleted={() => {
            loadDashboardData(false)
          }}
        />
      )}
    </div>
  )
}