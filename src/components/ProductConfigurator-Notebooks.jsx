"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

const ProductConfiguratorNotebooks = ({ 
    configuraciones = [], 
    onConfigurationChange,
    productTitle = "Notebook"
}) => {
    const [selectedConfigId, setSelectedConfigId] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});

    // Extraer opciones únicas de todas las configuraciones para notebooks
    const availableOptions = useMemo(() => {
        if (!configuraciones.length) return {};

        const options = {};
        
        configuraciones.forEach(config => {
            if (config.configuracion) {
                Object.entries(config.configuracion).forEach(([key, value]) => {
                    if (!options[key]) options[key] = new Set();
                    options[key].add(value);
                });
            }
        });

        // Convertir Sets a arrays ordenados
        Object.keys(options).forEach(key => {
            options[key] = Array.from(options[key]).sort();
        });

        return options;
    }, [configuraciones]);

    // Seleccionar la configuración más barata por defecto
    useEffect(() => {
        if (configuraciones.length > 0 && !selectedConfigId) {
            const cheapestConfig = configuraciones.reduce((prev, current) => 
                (prev.precio < current.precio) ? prev : current
            );
            
            setSelectedConfigId(cheapestConfig.id);
            setSelectedOptions(cheapestConfig.configuracion || {});
            
            if (onConfigurationChange) {
                onConfigurationChange(cheapestConfig);
            }
        }
    }, [configuraciones, selectedConfigId, onConfigurationChange]);

    // Encontrar configuración que coincida con opciones seleccionadas
    const findMatchingConfiguration = (options) => {
        return configuraciones.find(config => {
            if (!config.configuracion) return false;
            
            return Object.entries(options).every(([key, value]) => 
                config.configuracion[key] === value
            );
        });
    };

    // Manejar cambio de opción
    const handleOptionChange = (category, value) => {
        const newOptions = { ...selectedOptions, [category]: value };
        setSelectedOptions(newOptions);
        
        const matchingConfig = findMatchingConfiguration(newOptions);
        if (matchingConfig) {
            setSelectedConfigId(matchingConfig.id);
            if (onConfigurationChange) {
                onConfigurationChange(matchingConfig);
            }
        }
    };

    // Verificar si una configuración específica está disponible
    const isOptionAvailable = (category, value) => {
        const testOptions = { ...selectedOptions, [category]: value };
        return findMatchingConfiguration(testOptions) !== undefined;
    };

    // Configuración seleccionada actual
    const selectedConfig = configuraciones.find(c => c.id === selectedConfigId);

    // Mapeo de categorías a nombres amigables para notebooks
    const categoryLabels = {
        'procesador': 'Procesador',
        'ram': 'Memoria RAM',
        'almacenamiento': 'Almacenamiento', 
        'pantalla_tamano': 'Tamaño de Pantalla',
        'pantalla_resolucion': 'Resolución',
        'gpu': 'Tarjeta Gráfica',
        'os': 'Sistema Operativo',
        'color': 'Color'
    };

    // Mapeo de valores a nombres amigables para notebooks
    const getDisplayValue = (category, value) => {
        const displayMaps = {
            'procesador': {
                'Intel Core i3': 'Intel Core i3',
                'Intel Core i5': 'Intel Core i5',
                'Intel Core i7': 'Intel Core i7',
                'Intel Core i9': 'Intel Core i9',
                'AMD Ryzen 3': 'AMD Ryzen 3',
                'AMD Ryzen 5': 'AMD Ryzen 5',
                'AMD Ryzen 7': 'AMD Ryzen 7',
                'AMD Ryzen 9': 'AMD Ryzen 9'
            },
            'ram': {
                '4GB': '4 GB RAM',
                '8GB': '8 GB RAM',
                '16GB': '16 GB RAM',
                '32GB': '32 GB RAM',
                '64GB': '64 GB RAM'
            },
            'almacenamiento': {
                '256GB SSD': 'SSD 256GB',
                '512GB SSD': 'SSD 512GB',
                '1TB SSD': 'SSD 1TB',
                '2TB SSD': 'SSD 2TB',
                '500GB HDD': 'HDD 500GB',
                '1TB HDD': 'HDD 1TB'
            },
            'pantalla_tamano': {
                '13"': '13 pulgadas',
                '14"': '14 pulgadas',
                '15.6"': '15.6 pulgadas',
                '17"': '17 pulgadas'
            },
            'pantalla_resolucion': {
                'HD': 'HD (1366x768)',
                'Full HD': 'Full HD (1920x1080)',
                '2K': '2K (2560x1440)',
                '4K': '4K (3840x2160)'
            },
            'gpu': {
                'Integrada': 'Gráficos Integrados',
                'GTX 1650': 'NVIDIA GTX 1650',
                'RTX 3050': 'NVIDIA RTX 3050',
                'RTX 3060': 'NVIDIA RTX 3060',
                'RTX 3070': 'NVIDIA RTX 3070',
                'RTX 3080': 'NVIDIA RTX 3080',
                'RTX 4050': 'NVIDIA RTX 4050',
                'RTX 4060': 'NVIDIA RTX 4060',
                'RTX 4070': 'NVIDIA RTX 4070'
            }
        };

        return displayMaps[category]?.[value] || value;
    };

    if (!configuraciones.length) {
        return (
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
                <h3 className="text-white font-orbitron text-lg mb-4">Configuración</h3>
                <p className="text-gray-400">No hay configuraciones disponibles para este notebook.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <h3 className="text-white font-orbitron text-lg mb-6">Configuración del Notebook</h3>
            
            {/* Mostrar configuración seleccionada */}
            {selectedConfig && (
                <div className="mb-6 p-4 bg-[#2a2a2a] rounded-lg border border-[#dd40d5]">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{selectedConfig.nombre}</h4>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-[#dd40d5]">
                                US${selectedConfig.precio.toLocaleString()}
                            </div>
                            {selectedConfig.precio_original && selectedConfig.precio_original > selectedConfig.precio && (
                                <div className="text-sm text-gray-400 line-through">
                                    US${selectedConfig.precio_original.toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Stock */}
                    <div className="flex items-center justify-between">
                        <div className={`text-sm ${selectedConfig.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {selectedConfig.stock > 0 
                                ? `✅ En stock (${selectedConfig.stock} disponibles)`
                                : '❌ Sin stock'
                            }
                        </div>
                        {selectedConfig.sku && (
                            <div className="text-xs text-gray-500">
                                SKU: {selectedConfig.sku}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Opciones de configuración para notebooks */}
            <div className="space-y-6">
                {Object.entries(availableOptions).map(([category, values]) => (
                    <div key={category}>
                        <h4 className="text-white font-orbitron text-sm mb-3">
                            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                        </h4>
                        
                        <div className={`grid gap-3 ${
                            category === 'color' || category === 'pantalla_resolucion' ? 'grid-cols-2 sm:grid-cols-3' :
                            category === 'procesador' || category === 'gpu' ? 'grid-cols-1 sm:grid-cols-2' :
                            'grid-cols-2 sm:grid-cols-3'
                        }`}>
                            {values.map((value) => {
                                const isSelected = selectedOptions[category] === value;
                                const isAvailable = isOptionAvailable(category, value);
                                const matchingConfig = findMatchingConfiguration({ ...selectedOptions, [category]: value });
                                
                                return (
                                    <motion.button
                                        key={value}
                                        onClick={() => isAvailable && handleOptionChange(category, value)}
                                        disabled={!isAvailable}
                                        className={`relative p-3 rounded-lg border text-left transition-all duration-200 ${
                                            isSelected
                                                ? 'border-[#dd40d5] bg-[#dd40d5] bg-opacity-10 text-white'
                                                : isAvailable
                                                ? 'border-gray-600 hover:border-gray-400 text-gray-200 hover:bg-gray-800'
                                                : 'border-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                                        }`}
                                        whileHover={isAvailable ? { scale: 1.02 } : {}}
                                        whileTap={isAvailable ? { scale: 0.98 } : {}}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold text-sm truncate">
                                                    {getDisplayValue(category, value)}
                                                </div>
                                                {matchingConfig && matchingConfig.id !== selectedConfigId && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        US${matchingConfig.precio.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {isSelected && (
                                                <CheckIcon className="w-5 h-5 text-[#dd40d5] flex-shrink-0 ml-2" />
                                            )}
                                        </div>
                                        
                                        {!isAvailable && (
                                            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                                                <span className="text-xs text-red-400">No disponible</span>
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen rápido de la configuración */}
            {selectedConfig && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-white font-orbitron text-sm mb-3">Tu notebook configurado:</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        {Object.entries(selectedOptions).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-gray-300">
                                <span className="capitalize">{categoryLabels[key] || key}:</span>
                                <span className="font-medium text-right">{getDisplayValue(key, value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductConfiguratorNotebooks;
