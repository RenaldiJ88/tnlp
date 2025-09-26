"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import MultiImageUpload from './MultiImageUpload';
import ProductConfigManagerSimple from './ProductConfigManager-Simple';
import ProductImageManager from './ProductImageManager';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function ProductModalNew({ product, authenticatedFetch, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isOffer: false,
    en_stock: true,
    // Mapear campos de la base de datos al formato del frontend
    ...product,
    category: product?.categoria || product?.category || '',
    isOffer: product?.is_offer === 1 || product?.is_offer === true || product?.isOffer || false,
    en_stock: product?.en_stock !== false && product?.en_stock !== 0
  });
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [productImages, setProductImages] = useState([]);
  const [tempProductId, setTempProductId] = useState(null);

  const tabs = [
    { id: 'basic', name: 'Información Básica', icon: '📝' },
    { id: 'images', name: 'Galería', icon: '🖼️', disabled: false }, // Permitir siempre
    { id: 'configs', name: 'Configuraciones', icon: '⚙️', disabled: !product?.id && !tempProductId }
  ];

  // Función removida: ahora todas las imágenes se manejan en la galería

  // Función para guardar múltiples imágenes en la base de datos
  const saveProductImages = async (productId) => {
    try {
      for (const image of productImages) {
        await authenticatedFetch('/api/admin/product-images', {
          method: 'POST',
          body: JSON.stringify({
            producto_id: productId,
            imagen_url: image.url,
            is_primary: image.is_primary,
            orden: image.orden
          })
        });
      }
    } catch (error) {
      console.error('Error saving product images:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = '/api/admin/products';
      const method = product ? 'PUT' : 'POST';
      
      // Mapear campos al formato esperado por la API
      const productData = {
        ...formData,
        id: product?.id,
        categoria: formData.category,
        is_offer: formData.isOffer ? 1 : 0,
        // Usar la primera imagen de la galería como imagen principal
        image: productImages.length > 0 ? productImages.find(img => img.is_primary)?.url || productImages[0]?.url : formData.image
      };

      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        
        // Si es un producto nuevo y hay imágenes, guardarlas
        if (!product && updatedProduct.id && productImages.length > 0) {
          setTempProductId(updatedProduct.id);
          await saveProductImages(updatedProduct.id);
        }
        
        onSave(updatedProduct);
        
        // Si es un producto nuevo, cambiar a la pestaña de configuraciones
        if (!product && updatedProduct.id) {
          setActiveTab('configs');
        }
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        alert('Error al guardar producto: ' + errorData);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] rounded-xl border border-gray-800 max-w-6xl w-full max-h-[95vh] overflow-hidden"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-orbitron font-bold text-white">
              {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Pestañas */}
          <div className="flex space-x-1 mb-6 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#dd40d5] text-white'
                    : tab.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                {tab.disabled && (
                  <span className="text-xs text-gray-500">(Guarda primero)</span>
                )}
              </button>
            ))}
          </div>

          {/* Contenido de pestañas */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'basic' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd40d5]"
                    placeholder="Ej: HP Spectre x360 2 en 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd40d5]"
                    placeholder="Intel Core i7, 16GB RAM, SSD 1TB, Windows 11 Pro..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Precio *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd40d5]"
                      placeholder="US$1,739.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd40d5]"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="gaming">Gaming</option>
                      <option value="office">Office</option>
                      <option value="ultrabook">Ultrabook</option>
                    </select>
                  </div>
                </div>

                {/* Info: Las imágenes se manejan en la pestaña Galería */}
                <div className="p-4 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-300 mb-2">
                    <span className="text-lg">🖼️</span>
                    <span className="font-medium">Imágenes del Producto</span>
                  </div>
                  <p className="text-sm text-blue-200">
                    Ve a la pestaña <strong>"Galería"</strong> para cargar múltiples imágenes de tu producto. 
                    La primera imagen será la principal automáticamente.
                  </p>
                  {productImages.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2 text-green-300">
                      <span>✅</span>
                      <span className="text-sm">{productImages.length} imagen{productImages.length !== 1 ? 'es' : ''} lista{productImages.length !== 1 ? 's' : ''} para subir</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isOffer"
                      checked={formData.isOffer}
                      onChange={(e) => setFormData({...formData, isOffer: e.target.checked})}
                      className="h-4 w-4 text-[#dd40d5] focus:ring-[#dd40d5] border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="isOffer" className="ml-2 block text-sm text-gray-300">
                      Es una oferta
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="en_stock"
                      checked={formData.en_stock}
                      onChange={(e) => setFormData({...formData, en_stock: e.target.checked})}
                      className="h-4 w-4 text-[#dd40d5] focus:ring-[#dd40d5] border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="en_stock" className="ml-2 block text-sm text-gray-300">
                      En stock (legacy)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                  {/* Info de imágenes listas */}
                  {productImages.length > 0 && (
                    <div className="mb-4 flex items-center space-x-2 text-green-400 text-sm">
                      <span>✅</span>
                      <span>{productImages.length} imagen{productImages.length !== 1 ? 'es' : ''} lista{productImages.length !== 1 ? 's' : ''} para guardar</span>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="px-4 py-2 bg-[#dd40d5] text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'images' && (
              <div>
                {(product?.id || tempProductId) ? (
                  <ProductImageManager 
                    productId={product?.id || tempProductId}
                    onImagesChange={(images) => console.log('Images updated:', images.length)}
                  />
                ) : (
                  <div>
                    <MultiImageUpload 
                      images={productImages}
                      onImagesChange={setProductImages}
                    />
                    <div className="mt-4 p-4 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg text-yellow-200 text-sm">
                      <strong>💡 Tip:</strong> Puedes cargar múltiples imágenes aquí. Se guardarán automáticamente cuando crees el producto.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'configs' && (product?.id || tempProductId) && (
              <div>
                <ProductConfigManagerSimple 
                  productId={product?.id || tempProductId}
                  onConfigurationsChange={(configs) => console.log('Configs updated:', configs.length)}
                />
              </div>
            )}
          </div>

          {/* Información de ayuda en la parte inferior */}
          {product?.id && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400">
                <strong className="text-white">ID del producto:</strong> {product.id} | 
                <strong className="text-white"> Última modificación:</strong> {product.last_modified ? new Date(product.last_modified).toLocaleString() : 'N/A'}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
