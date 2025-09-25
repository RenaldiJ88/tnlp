"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ProductGallery = ({ images = [], productTitle = "Producto" }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Si no hay imágenes, mostrar placeholder
    if (!images || images.length === 0) {
        return (
            <div className="w-full">
                <div className="relative w-full h-96 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-gray-400 font-orbitron">Sin imágenes disponibles</span>
                </div>
            </div>
        );
    }

    // Si solo hay una imagen, mostrar vista simple
    if (images.length === 1) {
        return (
            <div className="w-full">
                <div className="relative w-full h-96 bg-black rounded-xl overflow-hidden">
                    <Image
                        src={images[0].imagen_url}
                        alt={images[0].descripcion || productTitle}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>
        );
    }

    const nextImage = () => {
        setSelectedImageIndex((prev) => 
            prev === images.length - 1 ? 0 : prev + 1
        );
        setIsImageLoading(true);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => 
            prev === 0 ? images.length - 1 : prev - 1
        );
        setIsImageLoading(true);
    };

    const selectedImage = images[selectedImageIndex];

    return (
        <div className="w-full">
            {/* Imagen Principal */}
            <div className="relative mb-4">
                <div className="relative w-full h-96 bg-black rounded-xl overflow-hidden group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full"
                        >
                            <Image
                                src={selectedImage.imagen_url}
                                alt={selectedImage.descripcion || productTitle}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                onLoad={() => setIsImageLoading(false)}
                                priority={selectedImageIndex === 0}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Loading overlay */}
                    {isImageLoading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dd40d5]"></div>
                        </div>
                    )}

                    {/* Botones de navegación - solo en hover */}
                    <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>

                    {/* Indicador de imagen actual */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-orbitron">
                        {selectedImageIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Descripción de la imagen actual */}
                {selectedImage.descripcion && (
                    <div className="mt-2 text-center text-gray-400 text-sm font-orbitron">
                        {selectedImage.descripcion}
                    </div>
                )}
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {images.map((image, index) => (
                    <motion.button
                        key={image.id || index}
                        onClick={() => {
                            setSelectedImageIndex(index);
                            setIsImageLoading(true);
                        }}
                        className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            index === selectedImageIndex
                                ? 'border-[#dd40d5] ring-2 ring-[#dd40d5] ring-opacity-50'
                                : 'border-gray-600 hover:border-gray-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Image
                            src={image.imagen_url}
                            alt={image.descripcion || `Vista ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                        
                        {/* Overlay cuando está seleccionada */}
                        {index === selectedImageIndex && (
                            <div className="absolute inset-0 bg-[#dd40d5] bg-opacity-20" />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Navegación con teclado (accesibilidad) */}
            <div className="hidden">
                <button 
                    onClick={prevImage}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') prevImage();
                        if (e.key === 'ArrowRight') nextImage();
                    }}
                    aria-label="Imagen anterior"
                />
            </div>
        </div>
    );
};

export default ProductGallery;
