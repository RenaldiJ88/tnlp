"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const { authenticatedFetch } = useAuthenticatedFetch()
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

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Cargar clientes
      const clientsResponse = await authenticatedFetch('/api/admin/clients')
      const clients = await clientsResponse.json()
      
      // Cargar órdenes
      const ordersResponse = await authenticatedFetch('/api/admin/service-orders')
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
        .sort((a, b) => new Date(b.fechaCreacion || b.fecha) - new Date(a.fechaCreacion || a.fecha))
        .slice(0, 5)
        .map(order => {
          const cliente = clients.find(c => c.id === order.clienteId)
          return {
            id: order.id,
            cliente: cliente?.nombre || 'Cliente desconocido',
            equipo: order.detalles?.descripcionEquipo || 'Equipo no especificado',
            estado: order.estado,
            total: order.total,
            fecha: order.fecha
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

    } catch (error) {
      console.error('Error loading dashboard data:', error)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Panel de control - Tu Notebook La Plata</p>
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
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Servicio más popular:</span>
              <span className="font-medium text-gray-900">{stats.servicioPopular}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Urgencia promedio:</span>
              <span className={`font-medium ${
                stats.urgenciaPromedio === 'Alta' ? 'text-red-600' :
                stats.urgenciaPromedio === 'Normal' ? 'text-blue-600' : 'text-green-600'
              }`}>
                {stats.urgenciaPromedio}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de finalización:</span>
              <span className="font-medium text-green-600">
                {stats.totalOrdenes > 0 ? Math.round((stats.ordenesCompletadas / stats.totalOrdenes) * 100) : 0}%
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                </div>
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
            onClick={() => window.location.reload()}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl mr-3">🔄</span>
            <div>
              <p className="font-medium text-purple-900">Actualizar Dashboard</p>
              <p className="text-sm text-purple-600">Refrescar todas las métricas</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  )
}