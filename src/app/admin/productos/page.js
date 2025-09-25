"use client";

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch'
import { supabase } from '../../../lib/supabase'
import ProductModalNew from '../../../components/admin/ProductModalNew'

export default function ProductosAdmin() {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('id-asc')
  const [uploading, setUploading] = useState(false)

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch('/api/admin/products')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Asegurar que data sea un array
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.warn('Products data is not an array:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([]) // Inicializar como array vacío en caso de error
      alert('Error al cargar productos. Verifica que el archivo products-unified.json existe.')
    } finally {
      setLoading(false)
    }
  }, [authenticatedFetch])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      const response = await authenticatedFetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
        alert('Producto eliminado exitosamente')
      } else {
        alert('Error al eliminar producto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar producto')
    }
  }

  const handleToggleStock = async (productId, currentStock) => {
    try {
      // Normalizar el valor actual del stock (undefined, null o false = false, true = true)
      const isCurrentlyInStock = currentStock === true
      const newStockValue = !isCurrentlyInStock
      
      console.log('Toggling stock:', { productId, currentStock, isCurrentlyInStock, newStockValue })
      
      const response = await authenticatedFetch('/api/admin/products', {
        method: 'PUT',
        body: JSON.stringify({
          id: productId,
          en_stock: newStockValue
        })
      })
      
      if (response.ok) {
        // Actualizar el producto en el estado local
        setProducts(products.map(p => 
          p.id === productId 
            ? { ...p, en_stock: newStockValue }
            : p
        ))
        console.log('Stock updated successfully')
      } else {
        const errorData = await response.text()
        console.error('Error response:', errorData)
        alert('Error al actualizar stock')
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Error al actualizar stock')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  // Filtrar y ordenar productos - Asegurar que products sea un array
  const filteredProducts = (Array.isArray(products) ? products : [])
    .filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || (product.categoria || product.category) === filterCategory
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'id-asc':
          return a.id - b.id
        case 'id-desc':
          return b.id - a.id
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '')
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '')
        case 'price-asc':
          const priceA = parseFloat((a.price || '0').replace(/[^0-9.-]/g, '')) || 0
          const priceB = parseFloat((b.price || '0').replace(/[^0-9.-]/g, '')) || 0
          return priceA - priceB
        case 'price-desc':
          const priceA2 = parseFloat((a.price || '0').replace(/[^0-9.-]/g, '')) || 0
          const priceB2 = parseFloat((b.price || '0').replace(/[^0-9.-]/g, '')) || 0
          return priceB2 - priceA2
        case 'category-asc':
          return ((a.categoria || a.category) || '').localeCompare((b.categoria || b.category) || '')
        case 'category-desc':
          return ((b.categoria || b.category) || '').localeCompare((a.categoria || a.category) || '')
        case 'stock-asc':
          return (a.en_stock === false ? 0 : 1) - (b.en_stock === false ? 0 : 1)
        case 'stock-desc':
          return (b.en_stock === false ? 0 : 1) - (a.en_stock === false ? 0 : 1)
        default:
          return 0
      }
    })

  // Obtener categorías únicas - Asegurar que products sea un array
  const categories = [...new Set((Array.isArray(products) ? products : []).map(p => p.categoria || p.category).filter(Boolean))]

  // Función para obtener la URL correcta de la imagen
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return ''
    
    // Si es una URL de Cloudinary, usarla directamente
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl
    }
    
    // Si es una ruta local, construir la URL completa
    if (imageUrl.startsWith('/')) {
      return imageUrl
    }
    
    // Si no tiene / al inicio, agregarlo
    return `/${imageUrl}`
  }

  const ProductCard = ({ product, onToggleStock }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-md overflow-hidden h-fit"
    >
      {/* Imagen del producto */}
      <div className="h-64 bg-gray-200 relative">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500" style={{display: product.image ? 'none' : 'flex'}}>
          📷 Sin imagen
        </div>
        
        {/* Badge de oferta (derecha) - solo si tiene stock */}
        {(product.is_offer === 1 || product.isOffer === true) && product.en_stock !== false && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            OFERTA
          </div>
        )}

        {/* Badge de sin stock (izquierda, más notorio) */}
        {product.en_stock === false && (
          <div className="absolute top-2 left-2 z-10 bg-red-800 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg border-2 border-red-600">
            ❌ SIN STOCK
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-base">{product.title}</h3>
          <span className="text-sm text-gray-500 ml-2">#{product.id}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[3rem]">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-blue-600">{product.price}</span>
          {(product.categoria || product.category) && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              {product.categoria || product.category}
            </span>
          )}
        </div>

        {/* Switch de Stock */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Stock:</span>
            <span className={`text-sm font-bold ${
              product.en_stock !== false ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.en_stock !== false ? '✅ Disponible' : '❌ Sin stock'}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={product.en_stock !== false}
              onChange={() => onToggleStock(product.id, product.en_stock)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Acciones */}
        <div className="flex space-x-3">
          <button
            onClick={() => handleEditProduct(product)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => handleDeleteProduct(product.id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Total: {Array.isArray(products) ? products.length : 0} productos</p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>➕</span>
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar productos
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="id-asc">ID (Menor a Mayor)</option>
              <option value="id-desc">ID (Mayor a Menor)</option>
              <option value="title-asc">Nombre (A-Z)</option>
              <option value="title-desc">Nombre (Z-A)</option>
              <option value="price-asc">Precio (Menor a Mayor)</option>
              <option value="price-desc">Precio (Mayor a Menor)</option>
              <option value="category-asc">Categoría (A-Z)</option>
              <option value="category-desc">Categoría (Z-A)</option>
              <option value="stock-asc">Sin stock primero</option>
              <option value="stock-desc">Con stock primero</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {Array.isArray(products) ? products.length : 0} productos
        </div>
      </div>

      {/* Grid de productos */}
      <div 
        key={`${searchTerm}-${filterCategory}-${sortBy}`} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onToggleStock={handleToggleStock}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer producto'
            }
          </p>
        </div>
      )}

      {/* Modal para crear/editar producto */}
      {showModal && (
        <ProductModalNew
          product={editingProduct}
          authenticatedFetch={authenticatedFetch}
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
          onSave={() => {
            loadProducts()
            setShowModal(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

// Modal viejo eliminado - ahora se usa ProductModalNew