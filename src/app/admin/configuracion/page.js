"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch'
import { supabase } from '../../../lib/supabase'

export default function ConfiguracionPage() {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [activeTab, setActiveTab] = useState('servicios')
  const [config, setConfig] = useState({
    servicios: {
      precios: {},
      activos: {}
    },
    sitio: {
      whatsapp: '5492216767615',
      email: 'info@tunotebooklaplata.com',
      direccion: 'La Plata, Buenos Aires',
      horarios: 'Lun-Vie 9:00-18:00, Sab 9:00-13:00',
      redes: {
        instagram: '@tunotebooklaplata',
        facebook: 'tunotebooklaplata'
      }
    },
    tema: {
      colorPrimario: '#dd40d5',
      colorSecundario: '#1A1A1A',
      titulo: 'Tu Notebook La Plata',
      eslogan: 'Expertos en Notebooks'
    }
  })
  const [loading, setLoading] = useState(true)

  // Cargar configuración desde la base de datos
  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    try {
      setLoading(true)
      
      // Cargar configuración general (con manejo de errores mejorado)
      try {
        const configResponse = await authenticatedFetch('/api/admin/configuracion')
        if (configResponse.ok) {
          const configData = await configResponse.json()
          
          setConfig(prev => ({
            ...prev,
            sitio: { ...prev.sitio, ...configData.sitio },
            tema: { ...prev.tema, ...configData.tema }
          }))
        } else {
          console.warn('No se pudo cargar configuración desde la DB, usando valores por defecto')
        }
      } catch (configError) {
        console.warn('Error cargando configuración:', configError.message)
      }
      
      // Cargar precios de servicios (con manejo de errores mejorado)  
      try {
        const serviciosResponse = await authenticatedFetch('/api/admin/servicios-precios')
        if (serviciosResponse.ok) {
          const serviciosData = await serviciosResponse.json()
          
          const precios = {}
          const activos = {}
          
          serviciosData.forEach(servicio => {
            precios[servicio.servicio_id] = servicio.precio
            activos[servicio.servicio_id] = servicio.activo
          })
          
          setConfig(prev => ({
            ...prev,
            servicios: { precios, activos }
          }))
        } else {
          console.warn('No se pudo cargar precios de servicios desde la DB, usando valores por defecto')
        }
      } catch (serviciosError) {
        console.warn('Error cargando servicios:', serviciosError.message)
      }
      
    } catch (error) {
      console.error('Error general loading configuration:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    try {
      const response = await authenticatedFetch('/api/admin/setup-db')
      const result = await response.json()
      
      if (result.success) {
        alert('✅ Base de datos verificada correctamente')
        loadConfiguration() // Recargar configuración
      } else {
        alert(`⚠️ ${result.message}\n\nDetalles:\n${result.results.errors.join('\n')}`)
      }
    } catch (error) {
      alert('❌ Error verificando la base de datos: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'servicios', name: '🔧 Servicios', description: 'Precios y configuración de servicios' },
    { id: 'sitio', name: '🌐 Sitio Web', description: 'Información de contacto y redes' },
    { id: 'datos', name: '💾 Datos', description: 'Backup, importar y gestión de datos' },
    { id: 'tema', name: '🎨 Personalización', description: 'Colores, textos y estilo' }
  ]

  const TabButton = ({ tab, isActive, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`p-4 rounded-lg text-left transition-all duration-200 w-full ${
        isActive 
          ? 'bg-blue-50 border-l-4 border-blue-500 shadow-md' 
          : 'bg-white hover:bg-gray-50 border border-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{tab.name.split(' ')[0]}</span>
        <div>
          <p className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
            {tab.name.substring(2)}
          </p>
          <p className={`text-sm ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            {tab.description}
          </p>
        </div>
      </div>
    </motion.button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Configuración</h1>
          <p className="text-gray-600">Personaliza y configura tu sistema administrativo</p>
        </div>
        <button
          onClick={setupDatabase}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>🔧</span>
          <span>Verificar DB</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de tabs */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            {activeTab === 'servicios' && <ServiciosConfig config={config} setConfig={setConfig} authenticatedFetch={authenticatedFetch} />}
            {activeTab === 'sitio' && <SitioConfig config={config} setConfig={setConfig} authenticatedFetch={authenticatedFetch} />}
            {activeTab === 'datos' && <DatosConfig config={config} setConfig={setConfig} authenticatedFetch={authenticatedFetch} />}
            {activeTab === 'tema' && <TemaConfig config={config} setConfig={setConfig} authenticatedFetch={authenticatedFetch} />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Componente para configuración de servicios
function ServiciosConfig({ config, setConfig, authenticatedFetch }) {
  const [servicios] = useState([
    { id: 'limpieza-advance-cpu', nombre: 'Limpieza Advance CPU', precio: 8000, categoria: 'Mantenimiento' },
    { id: 'limpieza-advance-notebook', nombre: 'Limpieza Advance Notebook', precio: 7000, categoria: 'Mantenimiento' },
    { id: 'agregar-ssd', nombre: 'Agregar SSD', precio: 15000, categoria: 'Up-Grade' },
    { id: 'agregar-ram', nombre: 'Agregar RAM', precio: 12000, categoria: 'Up-Grade' },
    { id: 'reparacion-mother', nombre: 'Reparación Mother', precio: 25000, categoria: 'Reparaciones' },
    { id: 'cambio-pantalla', nombre: 'Cambio Pantalla', precio: 20000, categoria: 'Reparaciones' }
  ])

  const handlePriceChange = (servicioId, nuevoPrecio) => {
    setConfig(prev => ({
      ...prev,
      servicios: {
        ...prev.servicios,
        precios: {
          ...prev.servicios.precios,
          [servicioId]: parseInt(nuevoPrecio) || 0
        }
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">🔧 Configuración de Servicios</h2>
        <p className="text-gray-600">Gestiona precios y disponibilidad de tus servicios técnicos</p>
      </div>

      <div className="space-y-4">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{servicio.nombre}</h3>
              <p className="text-sm text-gray-500">{servicio.categoria}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">$</span>
                <input
                  type="number"
                  defaultValue={servicio.precio}
                  onChange={(e) => handlePriceChange(servicio.id, e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={async () => {
          try {
            // Actualizar precios de servicios
            const serviciosActualizados = []
            
            for (const [servicioId, precio] of Object.entries(config.servicios.precios)) {
              const response = await authenticatedFetch('/api/admin/servicios-precios', {
                method: 'PUT',
                body: JSON.stringify({
                  servicio_id: servicioId,
                  precio: precio,
                  activo: config.servicios.activos[servicioId] !== false
                })
              })
              
              if (response.ok) {
                serviciosActualizados.push(servicioId)
              }
            }
            
            alert(`✅ Configuración guardada: ${serviciosActualizados.length} servicios actualizados`);
          } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al guardar configuración');
          }
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
      >
        💾 Guardar Configuración de Servicios
      </button>
    </div>
  )
}

// Componente para configuración del sitio
function SitioConfig({ config, setConfig, authenticatedFetch }) {
  const handleSitioChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      sitio: {
        ...prev.sitio,
        [field]: value
      }
    }))
  }

  const handleRedesChange = (red, value) => {
    setConfig(prev => ({
      ...prev,
      sitio: {
        ...prev.sitio,
        redes: {
          ...prev.sitio.redes,
          [red]: value
        }
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">🌐 Configuración del Sitio</h2>
        <p className="text-gray-600">Información de contacto y datos del negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📱 Número de WhatsApp
          </label>
          <input
            type="text"
            value={config.sitio.whatsapp}
            onChange={(e) => handleSitioChange('whatsapp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="5492216767615"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📧 Email de Contacto
          </label>
          <input
            type="email"
            value={config.sitio.email}
            onChange={(e) => handleSitioChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="info@tunotebooklaplata.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 Dirección
          </label>
          <input
            type="text"
            value={config.sitio.direccion}
            onChange={(e) => handleSitioChange('direccion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="La Plata, Buenos Aires"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🕒 Horarios de Atención
          </label>
          <input
            type="text"
            value={config.sitio.horarios}
            onChange={(e) => handleSitioChange('horarios', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Lun-Vie 9:00-18:00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📷 Instagram
          </label>
          <input
            type="text"
            value={config.sitio.redes.instagram}
            onChange={(e) => handleRedesChange('instagram', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="@tunotebooklaplata"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📘 Facebook
          </label>
          <input
            type="text"
            value={config.sitio.redes.facebook}
            onChange={(e) => handleRedesChange('facebook', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="tunotebooklaplata"
          />
        </div>
      </div>

      <button 
        onClick={async () => {
          try {
            const response = await authenticatedFetch('/api/admin/configuracion', {
              method: 'PUT',
              body: JSON.stringify({
                seccion: 'sitio',
                configuracion: config.sitio
              })
            })
            
            if (response.ok) {
              alert('✅ Configuración del sitio guardada en la base de datos');
            } else {
              const errorData = await response.json()
              throw new Error(errorData.message || 'Error del servidor')
            }
          } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al guardar configuración: ' + error.message);
          }
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
      >
        💾 Guardar Configuración del Sitio
      </button>
    </div>
  )
}

// Componente para gestión de datos
function DatosConfig({ config, setConfig, authenticatedFetch }) {
  const [stats, setStats] = useState({
    clientes: 0,
    ordenes: 0,
    productos: 0,
    tamanoTotal: '0 MB'
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [clientsRes, ordersRes, productsRes] = await Promise.all([
        authenticatedFetch('/api/admin/clients'),
        authenticatedFetch('/api/admin/service-orders'),
        authenticatedFetch('/api/admin/products')
      ])
      
      const clients = await clientsRes.json()
      const orders = await ordersRes.json()
      const products = await productsRes.json()

      setStats({
        clientes: clients.length,
        ordenes: orders.length,
        productos: products.length,
        tamanoTotal: '2.5 MB' // Estimado
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleBackup = async (tipo) => {
    try {
      const response = await authenticatedFetch(`/api/admin/${tipo}`)
      const data = await response.json()
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-${tipo}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error creating backup:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">💾 Gestión de Datos</h2>
        <p className="text-gray-600">Backup, restauración y gestión de tu información</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.clientes}</div>
          <div className="text-sm text-blue-700">Clientes</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.ordenes}</div>
          <div className="text-sm text-green-700">Órdenes</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.productos}</div>
          <div className="text-sm text-purple-700">Productos</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.tamanoTotal}</div>
          <div className="text-sm text-gray-700">Tamaño Total</div>
        </div>
      </div>

      {/* Backup Individual */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">🔄 Backup por Categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleBackup('clients')}
            className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="mr-2">👥</span>
            Descargar Clientes
          </button>
          <button
            onClick={() => handleBackup('service-orders')}
            className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="mr-2">🔧</span>
            Descargar Órdenes
          </button>
          <button
            onClick={() => handleBackup('products')}
            className="flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="mr-2">💻</span>
            Descargar Productos
          </button>
        </div>
      </div>

      {/* Backup Completo */}
      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">📦 Backup Completo</h3>
        <div className="space-y-4">
          <button 
            onClick={async () => {
              try {
                const backupData = {
                  fecha: new Date().toISOString(),
                  configuracion: config,
                  estadisticas: stats
                };
                const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-completo-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                alert('✅ Backup completo descargado');
              } catch (error) {
                console.error('Error:', error);
                alert('❌ Error al crear backup');
              }
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            📥 Descargar Backup Completo
          </button>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input 
              type="file" 
              id="restore" 
              accept=".json" 
              className="hidden" 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    const text = await file.text();
                    const backupData = JSON.parse(text);
                    console.log('Datos de backup cargados:', backupData);
                    if (backupData.configuracion) {
                      setConfig(backupData.configuracion);
                      alert('✅ Configuración restaurada exitosamente');
                    } else {
                      alert('⚠️ Archivo de backup no válido');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    alert('❌ Error al restaurar backup');
                  }
                }
              }}
            />
            <label htmlFor="restore" className="cursor-pointer">
              <div className="text-gray-600">
                <span className="text-2xl block mb-2">📤</span>
                <span className="text-sm">Arrastra un archivo JSON aquí o haz click para restaurar datos</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para personalización del tema
function TemaConfig({ config, setConfig, authenticatedFetch }) {
  const handleTemaChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      tema: {
        ...prev.tema,
        [field]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">🎨 Personalización</h2>
        <p className="text-gray-600">Customiza colores, textos y estilo de tu sitio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎨 Color Primario
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={config.tema.colorPrimario}
              onChange={(e) => handleTemaChange('colorPrimario', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={config.tema.colorPrimario}
              onChange={(e) => handleTemaChange('colorPrimario', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🖤 Color Secundario
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={config.tema.colorSecundario}
              onChange={(e) => handleTemaChange('colorSecundario', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={config.tema.colorSecundario}
              onChange={(e) => handleTemaChange('colorSecundario', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 Título Principal
          </label>
          <input
            type="text"
            value={config.tema.titulo}
            onChange={(e) => handleTemaChange('titulo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tu Notebook La Plata"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💫 Eslogan
          </label>
          <input
            type="text"
            value={config.tema.eslogan}
            onChange={(e) => handleTemaChange('eslogan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Expertos en Notebooks"
          />
        </div>
      </div>

      {/* Vista previa */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-3">👀 Vista Previa</h3>
        <div className="bg-white p-4 rounded-md shadow-sm" style={{ borderLeft: `4px solid ${config.tema.colorPrimario}` }}>
          <h4 className="font-bold text-lg" style={{ color: config.tema.colorSecundario }}>
            {config.tema.titulo}
          </h4>
          <p className="text-sm mt-1" style={{ color: config.tema.colorPrimario }}>
            {config.tema.eslogan}
          </p>
        </div>
      </div>

      <button 
        onClick={async () => {
          try {
            const response = await authenticatedFetch('/api/admin/configuracion', {
              method: 'PUT',
              body: JSON.stringify({
                seccion: 'tema',
                configuracion: config.tema
              })
            })
            
            if (response.ok) {
              alert('✅ Cambios de tema guardados en la base de datos');
            } else {
              const errorData = await response.json()
              throw new Error(errorData.message || 'Error del servidor')
            }
          } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al aplicar cambios: ' + error.message);
          }
        }}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
      >
        💾 Aplicar Cambios de Tema
      </button>
    </div>
  )
}