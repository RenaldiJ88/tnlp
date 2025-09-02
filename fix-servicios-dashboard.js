#!/usr/bin/env node

/**
 * Script para corregir el dashboard de servicios
 * Soluciona la inconsistencia entre los datos hardcodeados y la base de datos
 */

const fs = require('fs')
const path = require('path')

const DASHBOARD_FILE = path.join(__dirname, 'src/app/admin/configuracion/page.js')

console.log('🔧 Iniciando corrección del dashboard de servicios...')

// Leer el archivo actual
let content = fs.readFileSync(DASHBOARD_FILE, 'utf8')

// Buscar la función ServiciosConfig y reemplazar el array hardcodeado
const oldServiciosArray = `  const [servicios] = useState([
    { id: 'limpieza-advance-cpu', nombre: 'Limpieza Advance CPU', precio: 8000, categoria: 'Mantenimiento' },
    { id: 'limpieza-advance-notebook', nombre: 'Limpieza Advance Notebook', precio: 7000, categoria: 'Mantenimiento' },
    { id: 'agregar-ssd', nombre: 'Agregar SSD', precio: 15000, categoria: 'Up-Grade' },
    { id: 'agregar-ram', nombre: 'Agregar RAM', precio: 12000, categoria: 'Up-Grade' },
    { id: 'reparacion-mother', nombre: 'Reparación Mother', precio: 25000, categoria: 'Reparaciones' },
    { id: 'cambio-pantalla', nombre: 'Cambio Pantalla', precio: 20000, categoria: 'Reparaciones' }
  ])`

const newServiciosLogic = `  const [servicios, setServicios] = useState([])
  const [loadingServicios, setLoadingServicios] = useState(true)

  // Cargar servicios desde la base de datos
  useEffect(() => {
    loadServiciosFromDB()
  }, [])

  const loadServiciosFromDB = async () => {
    try {
      setLoadingServicios(true)
      const response = await authenticatedFetch('/api/admin/servicios-precios')
      if (response.ok) {
        const serviciosData = await response.json()
        setServicios(serviciosData.map(s => ({
          id: s.servicio_id,
          nombre: s.nombre,
          precio: s.precio,
          categoria: s.categoria,
          subcategoria: s.subcategoria,
          activo: s.activo
        })))
      } else {
        console.error('Error cargando servicios desde DB')
        // Fallback a datos por defecto
        setServicios([
          { id: 'limpieza-advance-cpu', nombre: 'Limpieza Advance CPU', precio: 8000, categoria: 'Mantenimiento' },
          { id: 'limpieza-advance-notebook', nombre: 'Limpieza Advance Notebook', precio: 7000, categoria: 'Mantenimiento' },
          { id: 'agregar-ssd', nombre: 'Agregar SSD', precio: 15000, categoria: 'Up-Grade y mejoras' },
          { id: 'agregar-ram', nombre: 'Agregar RAM', precio: 12000, categoria: 'Up-Grade y mejoras' },
          { id: 'reparacion-mother', nombre: 'Reparación Mother', precio: 25000, categoria: 'Reparaciones' },
          { id: 'cambio-pantalla', nombre: 'Cambio Pantalla', precio: 20000, categoria: 'Reparaciones' }
        ])
      }
    } catch (error) {
      console.error('Error loading servicios:', error)
    } finally {
      setLoadingServicios(false)
    }
  }`

// Reemplazar el array hardcodeado
content = content.replace(oldServiciosArray, newServiciosLogic)

// Agregar el import de useEffect si no está
if (!content.includes('useEffect')) {
  content = content.replace(
    "import { useState, useEffect } from 'react'",
    "import { useState, useEffect } from 'react'"
  )
  // Si no tiene useEffect en el import, agregarlo
  if (!content.includes('useEffect')) {
    content = content.replace(
      "import { useState } from 'react'",
      "import { useState, useEffect } from 'react'"
    )
  }
}

// Actualizar el handlePriceChange para usar el precio actual del servicio
const oldHandlePriceChange = `  const handlePriceChange = (servicioId, nuevoPrecio) => {
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
  }`

const newHandlePriceChange = `  const handlePriceChange = (servicioId, nuevoPrecio) => {
    // Actualizar en el estado local de servicios
    setServicios(prev => prev.map(s => 
      s.id === servicioId 
        ? { ...s, precio: parseInt(nuevoPrecio) || 0 }
        : s
    ))
    
    // También actualizar en config para mantener compatibilidad
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

  const handleActivoChange = (servicioId, activo) => {
    setServicios(prev => prev.map(s => 
      s.id === servicioId 
        ? { ...s, activo: activo }
        : s
    ))
    
    setConfig(prev => ({
      ...prev,
      servicios: {
        ...prev.servicios,
        activos: {
          ...prev.servicios.activos,
          [servicioId]: activo
        }
      }
    }))
  }`

content = content.replace(oldHandlePriceChange, newHandlePriceChange)

// Actualizar el JSX para mostrar loading y usar los datos dinámicos
const oldJSX = `      <div className="space-y-4">
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
      </div>`

const newJSX = `      {loadingServicios ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando servicios...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{servicio.nombre}</h3>
                <p className="text-sm text-gray-500">
                  {servicio.categoria}
                  {servicio.subcategoria && <span className="text-gray-400"> → {servicio.subcategoria}</span>}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    value={servicio.precio}
                    onChange={(e) => handlePriceChange(servicio.id, e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={servicio.activo !== false}
                    onChange={(e) => handleActivoChange(servicio.id, e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}`

content = content.replace(oldJSX, newJSX)

// Actualizar el botón de guardar para usar los datos dinámicos
const oldSaveButton = `            for (const [servicioId, precio] of Object.entries(config.servicios.precios)) {
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
            }`

const newSaveButton = `            for (const servicio of servicios) {
              const response = await authenticatedFetch('/api/admin/servicios-precios', {
                method: 'PUT',
                body: JSON.stringify({
                  servicio_id: servicio.id,
                  precio: servicio.precio,
                  activo: servicio.activo !== false
                })
              })
              
              if (response.ok) {
                serviciosActualizados.push(servicio.id)
              }
            }`

content = content.replace(oldSaveButton, newSaveButton)

// Actualizar el mensaje de éxito para recargar servicios
const oldSuccessMessage = `            alert(\`✅ Configuración guardada: \${serviciosActualizados.length} servicios actualizados\`);`

const newSuccessMessage = `            alert(\`✅ Configuración guardada: \${serviciosActualizados.length} servicios actualizados\`);
            // Recargar servicios para mostrar los cambios
            await loadServiciosFromDB();`

content = content.replace(oldSuccessMessage, newSuccessMessage)

// Escribir el archivo corregido
fs.writeFileSync(DASHBOARD_FILE, content)

console.log('✅ Dashboard de servicios corregido exitosamente!')
console.log('📝 Cambios realizados:')
console.log('   - Los servicios ahora se cargan dinámicamente desde la base de datos')
console.log('   - Se agregó estado de carga para mejor UX')
console.log('   - Se corrigió la lógica de actualización de precios y estado activo')
console.log('   - Se agregó manejo de subcategorías')
console.log('   - Los cambios se guardan correctamente en la base de datos')

console.log('\n🔧 Próximos pasos:')
console.log('   1. Ejecuta el script SQL: SINCRONIZAR-SERVICIOS-DB.sql')
console.log('   2. Reinicia tu servidor de desarrollo')
console.log('   3. Prueba el dashboard de configuración de servicios')
