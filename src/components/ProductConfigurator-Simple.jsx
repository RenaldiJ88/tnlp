"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

const ProductConfiguratorSimple = ({ productId, onConfigurationSelect }) => {
    const [configurations, setConfigurations] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [specsFixed, setSpecsFixed] = useState(null);

    useEffect(() => {
        if (productId) {
            loadConfigurations();
        }
    }, [productId]);

    const loadConfigurations = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/productos/${productId}/configuraciones`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.configurations && data.configurations.length > 0) {
                // Ordenar por precio (menor a mayor) 
                const sortedConfigs = data.configurations.sort((a, b) => a.precio - b.precio);
                setConfigurations(sortedConfigs);
                
                // Establecer specs fijas del primer producto
                setSpecsFixed(sortedConfigs[0].specs_fijas);
                
                // Seleccionar la configuración de menor precio por defecto
                const defaultConfig = sortedConfigs[0];
                setSelectedConfig(defaultConfig);
                onConfigurationSelect?.(defaultConfig);
            } else {
                setConfigurations([]);
                setSpecsFixed(null);
                setSelectedConfig(null);
            }
        } catch (error) {
            console.error('Error loading configurations:', error);
            setError('Error cargando configuraciones');
            setConfigurations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfigSelection = (config) => {
        setSelectedConfig(config);
        onConfigurationSelect?.(config);
    };

    // Agrupar configuraciones por capacidad (RAM+SSD)
    const groupedConfigurations = configurations.reduce((groups, config) => {
        const capacityKey = config.capacidad;
        if (!groups[capacityKey]) {
            groups[capacityKey] = [];
        }
        groups[capacityKey].push(config);
        return groups;
    }, {});

    // Obtener colores únicos del producto seleccionado
    const getColorsForCapacity = (capacity) => {
        return groupedConfigurations[capacity] || [];
    };

    const getCurrentPriceInfo = () => {
        if (!selectedConfig) return null;
        
        return {
            precio: selectedConfig.precio,
            precio_original: selectedConfig.precio_original,
            descuento: selectedConfig.precio_original ? 
                Math.round(((selectedConfig.precio_original - selectedConfig.precio) / selectedConfig.precio_original) * 100) : 0,
            stock: selectedConfig.stock
        };
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                        <div className="space-y-2">
                            <div className="h-12 bg-gray-700 rounded"></div>
                            <div className="h-12 bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || configurations.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-gray-400 text-sm">
                    {error || 'No hay configuraciones disponibles para este producto.'}
                </div>
            </div>
        );
    }

    const priceInfo = getCurrentPriceInfo();

    return (
        <div className="space-y-6">
            {/* Precio Actual */}
            {priceInfo && (
                <div className="space-y-2">
                    <div className="flex items-baseline space-x-3">
                        <span className="text-3xl font-bold text-[#dd40d5]">
                            US${priceInfo.precio.toLocaleString()}
                        </span>
                        {priceInfo.precio_original && priceInfo.precio_original > priceInfo.precio && (
                            <>
                                <span className="text-lg text-gray-400 line-through">
                                    US${priceInfo.precio_original.toLocaleString()}
                                </span>
                                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                                    -{priceInfo.descuento}%
                                </span>
                            </>
                        )}
                    </div>
                    
                    {/* Stock Status */}
                    <div className={`text-sm font-medium ${
                        priceInfo.stock > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {priceInfo.stock > 0 ? (
                            <>✅ En stock ({priceInfo.stock} disponible{priceInfo.stock !== 1 ? 's' : ''})</>
                        ) : (
                            <>❌ Sin stock</>
                        )}
                    </div>
                </div>
            )}

            {/* Especificaciones Fijas */}
            {specsFixed && (
                <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Especificaciones:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                        <div><span className="text-white">Procesador:</span> {specsFixed.procesador}</div>
                        <div><span className="text-white">Pantalla:</span> {specsFixed.pantalla}</div>
                        <div><span className="text-white">GPU:</span> {specsFixed.gpu}</div>
                        <div><span className="text-white">OS:</span> {specsFixed.os}</div>
                    </div>
                </div>
            )}

            {/* Selector de Capacidad (Estilo Amazon) */}
            <div className="space-y-3">
                <h4 className="text-lg font-medium text-white">Capacidad:</h4>
                <div className="space-y-2">
                    {Object.keys(groupedConfigurations).map((capacity) => {
                        const configs = groupedConfigurations[capacity];
                        const mainConfig = configs[0]; // Usar el primero como referencia
                        const isSelected = selectedConfig?.capacidad === capacity;
                        
                        return (
                            <motion.div
                                key={capacity}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleConfigSelection(mainConfig)}
                                className={`
                                    relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200
                                    ${isSelected 
                                        ? 'border-[#dd40d5] bg-purple-900 bg-opacity-20' 
                                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }
                                    ${mainConfig.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {/* Radio Button Visual */}
                                        <div className={`
                                            w-4 h-4 rounded-full border-2 flex items-center justify-center
                                            ${isSelected 
                                                ? 'border-[#dd40d5] bg-[#dd40d5]' 
                                                : 'border-gray-400'
                                            }
                                        `}>
                                            {isSelected && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        
                                        {/* Configuración Info */}
                                        <div>
                                            <div className="font-medium text-white">
                                                {capacity}
                                            </div>
                                            {mainConfig.stock === 0 && (
                                                <div className="text-sm text-red-400">Sin stock</div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Precio */}
                                    <div className="text-right">
                                        <div className="font-bold text-[#dd40d5]">
                                            US${mainConfig.precio.toLocaleString()}
                                        </div>
                                        {mainConfig.precio_original && mainConfig.precio_original > mainConfig.precio && (
                                            <div className="text-sm text-gray-400 line-through">
                                                US${mainConfig.precio_original.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Selected Indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2"
                                    >
                                        <CheckIcon className="w-5 h-5 text-[#dd40d5]" />
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Selector de Color (Si hay múltiples colores) */}
            {selectedConfig && getColorsForCapacity(selectedConfig.capacidad).length > 1 && (
                <div className="space-y-3">
                    <h4 className="text-lg font-medium text-white">Color:</h4>
                    <div className="flex space-x-3">
                        {getColorsForCapacity(selectedConfig.capacidad).map((config) => {
                            const isSelected = selectedConfig.id === config.id;
                            
                            return (
                                <motion.button
                                    key={config.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleConfigSelection(config)}
                                    className={`
                                        px-4 py-2 rounded-lg border-2 transition-all duration-200
                                        ${isSelected 
                                            ? 'border-[#dd40d5] bg-[#dd40d5] bg-opacity-20 text-[#dd40d5]' 
                                            : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                        }
                                        ${config.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    disabled={config.stock === 0}
                                >
                                    {config.color}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Información de la Configuración Seleccionada */}
            {selectedConfig && (
                <div className="bg-green-900 bg-opacity-20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-300">
                        <CheckIcon className="w-5 h-5" />
                        <span className="font-medium">Configuración seleccionada:</span>
                    </div>
                    <div className="mt-2 text-sm text-green-200">
                        <div><strong>{selectedConfig.capacidad}</strong> • {selectedConfig.color}</div>
                        <div>SKU: {selectedConfig.sku}</div>
                        <div>Precio: <strong>US${selectedConfig.precio.toLocaleString()}</strong></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductConfiguratorSimple;
