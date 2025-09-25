"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, StarIcon, ArrowUpIcon, ArrowDownIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../utils/cloudinary';

const ProductImageManager = ({ productId, onImagesChange }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        if (productId) {
            loadImages();
        }
    }, [productId]);

    const loadImages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('producto_imagenes')
                .select('*')
                .eq('producto_id', productId)
                .order('orden', { ascending: true });

            if (!error) {
                setImages(data || []);
                if (onImagesChange) {
                    onImagesChange(data || []);
                }
            }
        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Subir a Cloudinary
                const cloudinaryUrl = await uploadToCloudinary(file);
                
                if (cloudinaryUrl) {
                    // Determinar el siguiente orden
                    const maxOrden = images.length > 0 ? Math.max(...images.map(img => img.orden)) : 0;
                    const nuevoOrden = maxOrden + i + 1;
                    
                    // Es principal si es la primera imagen del producto
                    const esPrimera = images.length === 0 && i === 0;
                    
                    // Guardar en base de datos
                    const { data, error } = await supabase
                        .from('producto_imagenes')
                        .insert([{
                            producto_id: productId,
                            imagen_url: cloudinaryUrl,
                            descripcion: `Imagen ${nuevoOrden}`,
                            orden: nuevoOrden,
                            es_principal: esPrimera
                        }])
                        .select();

                    if (!error && data) {
                        console.log('Imagen guardada:', data[0]);
                    }
                }
            }
            
            await loadImages();
            event.target.value = ''; // Limpiar input
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error subiendo imágenes');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!confirm('¿Eliminar esta imagen?')) return;

        try {
            const { error } = await supabase
                .from('producto_imagenes')
                .delete()
                .eq('id', imageId);

            if (!error) {
                await loadImages();
            } else {
                alert('Error eliminando imagen');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error eliminando imagen');
        }
    };

    const handleSetPrincipal = async (imageId) => {
        try {
            // Quitar principal de todas las imágenes del producto
            await supabase
                .from('producto_imagenes')
                .update({ es_principal: false })
                .eq('producto_id', productId);

            // Marcar la nueva imagen como principal
            await supabase
                .from('producto_imagenes')
                .update({ es_principal: true })
                .eq('id', imageId);

            await loadImages();
        } catch (error) {
            console.error('Error setting principal image:', error);
            alert('Error estableciendo imagen principal');
        }
    };

    const handleUpdateDescription = async (imageId, descripcion) => {
        try {
            await supabase
                .from('producto_imagenes')
                .update({ descripcion })
                .eq('id', imageId);

            await loadImages();
        } catch (error) {
            console.error('Error updating description:', error);
        }
    };

    const handleReorderImage = async (imageId, direction) => {
        const currentIndex = images.findIndex(img => img.id === imageId);
        if (currentIndex === -1) return;

        const currentImage = images[currentIndex];
        let targetIndex;

        if (direction === 'up' && currentIndex > 0) {
            targetIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < images.length - 1) {
            targetIndex = currentIndex + 1;
        } else {
            return; // No se puede mover
        }

        const targetImage = images[targetIndex];

        try {
            // Intercambiar órdenes
            await supabase
                .from('producto_imagenes')
                .update({ orden: targetImage.orden })
                .eq('id', currentImage.id);

            await supabase
                .from('producto_imagenes')
                .update({ orden: currentImage.orden })
                .eq('id', targetImage.id);

            await loadImages();
        } catch (error) {
            console.error('Error reordering images:', error);
            alert('Error reordenando imágenes');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                    Galería de Imágenes ({images.length})
                </h3>
                <label className="flex items-center space-x-2 bg-[#dd40d5] text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer">
                    <PlusIcon className="w-4 h-4" />
                    <span>{uploading ? 'Subiendo...' : 'Agregar Imágenes'}</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        layout
                        className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                    >
                        {/* Imagen */}
                        <div className="relative h-40 bg-gray-900 flex items-center justify-center">
                            <img
                                src={image.imagen_url}
                                alt={image.descripcion}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    e.target.src = '/img/placeholder.jpg';
                                }}
                            />
                            
                            {/* Badge de imagen principal */}
                            {image.es_principal && (
                                <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                    PRINCIPAL
                                </div>
                            )}

                            {/* Controles overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                {/* Establecer como principal */}
                                <button
                                    onClick={() => handleSetPrincipal(image.id)}
                                    className={`p-2 rounded-full ${
                                        image.es_principal 
                                            ? 'bg-yellow-500 text-black' 
                                            : 'bg-gray-700 text-white hover:bg-yellow-500 hover:text-black'
                                    }`}
                                    title="Establecer como principal"
                                >
                                    {image.es_principal ? <StarIconSolid className="w-4 h-4" /> : <StarIcon className="w-4 h-4" />}
                                </button>

                                {/* Subir */}
                                <button
                                    onClick={() => handleReorderImage(image.id, 'up')}
                                    disabled={index === 0}
                                    className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Subir"
                                >
                                    <ArrowUpIcon className="w-4 h-4" />
                                </button>

                                {/* Bajar */}
                                <button
                                    onClick={() => handleReorderImage(image.id, 'down')}
                                    disabled={index === images.length - 1}
                                    className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Bajar"
                                >
                                    <ArrowDownIcon className="w-4 h-4" />
                                </button>

                                {/* Eliminar */}
                                <button
                                    onClick={() => handleDeleteImage(image.id)}
                                    className="p-2 rounded-full bg-red-600 text-white hover:bg-red-500"
                                    title="Eliminar"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Información y descripción */}
                        <div className="p-3">
                            <input
                                type="text"
                                value={image.descripcion || ''}
                                onChange={(e) => handleUpdateDescription(image.id, e.target.value)}
                                onBlur={(e) => handleUpdateDescription(image.id, e.target.value)}
                                placeholder="Descripción de la imagen..."
                                className="w-full bg-gray-700 text-white text-sm border border-gray-600 rounded px-2 py-1"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Orden: {image.orden}</span>
                                <span>{image.es_principal ? 'Principal' : 'Secundaria'}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Estado vacío */}
                {images.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        <PhotoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No hay imágenes</p>
                        <p className="text-sm">Agrega la primera imagen de este producto</p>
                    </div>
                )}
            </div>

            {/* Estado de carga */}
            {(loading || uploading) && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dd40d5] mx-auto"></div>
                    <p className="text-sm text-gray-400 mt-2">
                        {uploading ? 'Subiendo imágenes...' : 'Cargando...'}
                    </p>
                </div>
            )}

            {/* Información de ayuda */}
            {images.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-white mb-2">💡 Tips:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                        <li>• La imagen marcada como "PRINCIPAL" se mostrará primero en la galería</li>
                        <li>• Usa las flechas para cambiar el orden de las imágenes</li>
                        <li>• Agrega descripciones como "Vista frontal", "Lateral izquierda", etc.</li>
                        <li>• Las imágenes se suben automáticamente a Cloudinary</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProductImageManager;
