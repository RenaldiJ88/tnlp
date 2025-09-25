"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { uploadToCloudinary } from '../../utils/cloudinary';

const MultiImageUpload = ({ images = [], onImagesChange, disabled = false }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);

    const handleImageUpload = async (file, index = null) => {
        if (!file) return;

        setUploading(true);
        if (index !== null) {
            setUploadingIndex(index);
        }

        try {
            const imageUrl = await uploadToCloudinary(file);
            
            if (index !== null) {
                // Reemplazar imagen existente
                const newImages = [...images];
                newImages[index] = {
                    url: imageUrl,
                    is_primary: images[index]?.is_primary || false,
                    orden: index + 1
                };
                onImagesChange(newImages);
            } else {
                // Agregar nueva imagen
                const newImage = {
                    url: imageUrl,
                    is_primary: images.length === 0, // La primera imagen es principal
                    orden: images.length + 1
                };
                onImagesChange([...images, newImage]);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploading(false);
            setUploadingIndex(null);
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        // Reordenar
        const reorderedImages = newImages.map((img, i) => ({
            ...img,
            orden: i + 1,
            is_primary: i === 0 && newImages.length > 0 // La primera siempre es principal
        }));
        onImagesChange(reorderedImages);
    };

    const handleSetPrimary = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            is_primary: i === index
        }));
        onImagesChange(newImages);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
        e.target.value = ''; // Reset input
    };

    const handleFileReplace = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, index);
        }
        e.target.value = ''; // Reset input
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-300">
                    Galería de Imágenes ({images.length}/10)
                </h4>
                <div className="text-xs text-gray-400">
                    La primera imagen será la principal
                </div>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Imágenes existentes */}
                <AnimatePresence>
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative group"
                        >
                            <div className={`
                                relative bg-gray-800 rounded-lg overflow-hidden aspect-square
                                ${image.is_primary ? 'ring-2 ring-[#dd40d5]' : 'ring-1 ring-gray-600'}
                            `}>
                                {uploadingIndex === index ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dd40d5]"></div>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={image.url}
                                            alt={`Imagen ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {/* Overlay con acciones */}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                                            {/* Botón cambiar imagen */}
                                            <label className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                                <PhotoIcon className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileReplace(e, index)}
                                                    disabled={disabled || uploading}
                                                />
                                            </label>
                                            
                                            {/* Botón eliminar */}
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                disabled={disabled}
                                                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>

                                            {/* Botón hacer principal (solo si no es la primera) */}
                                            {!image.is_primary && (
                                                <button
                                                    onClick={() => handleSetPrimary(index)}
                                                    disabled={disabled}
                                                    className="bg-purple-600 text-white p-1 px-2 rounded-full hover:bg-purple-700 transition-colors text-xs disabled:opacity-50"
                                                >
                                                    Principal
                                                </button>
                                            )}
                                        </div>

                                        {/* Indicador de imagen principal */}
                                        {image.is_primary && (
                                            <div className="absolute top-2 left-2 bg-[#dd40d5] text-white text-xs px-2 py-1 rounded-full">
                                                Principal
                                            </div>
                                        )}

                                        {/* Número de orden */}
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Botón agregar nueva imagen */}
                {images.length < 10 && (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <label className={`
                            cursor-pointer block aspect-square bg-gray-800 border-2 border-dashed border-gray-600 
                            rounded-lg hover:border-[#dd40d5] transition-colors duration-200
                            flex flex-col items-center justify-center text-gray-400 hover:text-[#dd40d5]
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            ${uploading ? 'pointer-events-none' : ''}
                        `}>
                            {uploading && uploadingIndex === null ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dd40d5]"></div>
                            ) : (
                                <>
                                    <PlusIcon className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium">Agregar</span>
                                    <span className="text-xs">Imagen</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                                disabled={disabled || uploading}
                            />
                        </label>
                    </motion.div>
                )}
            </div>

            {/* Ayuda */}
            <div className="bg-blue-900 bg-opacity-20 border border-blue-500 p-3 rounded text-sm text-blue-200">
                <div className="flex items-start space-x-2">
                    <PhotoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="font-medium mb-1">💡 Tips para las imágenes:</div>
                        <ul className="text-xs space-y-1">
                            <li>• La primera imagen será la <strong>imagen principal</strong> del producto</li>
                            <li>• Puedes cambiar cual es la principal haciendo clic en "Principal"</li>
                            <li>• Las imágenes se mostrarán en galería estilo Amazon en el frontend</li>
                            <li>• Formatos soportados: JPG, PNG, WebP (máx. 5MB por imagen)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Estado de carga */}
            {uploading && (
                <div className="text-center py-2">
                    <div className="text-sm text-[#dd40d5]">
                        Subiendo imagen... ⏳
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiImageUpload;
