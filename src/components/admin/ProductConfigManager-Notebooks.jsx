"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const ProductConfigManagerNotebooks = ({ productId, onConfigurationsChange }) => {
    const [configurations, setConfigurations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [newConfig, setNewConfig] = useState({
        nombre: '',
        configuracion: {
            procesador: '',
            ram: '',
            almacenamiento: '',
            pantalla_tamano: '',
            pantalla_resolucion: '',
            gpu: '',
            os: 'Windows 11 Home',
            color: 'Negro'
        },
        precio: '',
        precio_original: '',
        stock: 1,
        sku: ''
    });

    // Opciones para notebooks completos
    const opcionesNotebook = {
        procesador: [
            'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9',
            'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'
        ],
        ram: ['4GB', '8GB', '16GB', '32GB', '64GB'],
        almacenamiento: [
            '256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD',
            '500GB HDD', '1TB HDD'
        ],
        pantalla_tamano: ['13"', '14"', '15.6"', '17"'],
        pantalla_resolucion: ['HD', 'Full HD', '2K', '4K'],
        gpu: [
            'Integrada', 'GTX 1650', 'RTX 3050', 'RTX 3060', 
            'RTX 3070', 'RTX 3080', 'RTX 4050', 'RTX 4060', 'RTX 4070'
        ],
        os: [
            'Windows 10 Home', 'Windows 10 Pro', 
            'Windows 11 Home', 'Windows 11 Pro', 'Sin Sistema'
        ],
        color: ['Negro', 'Plata', 'Blanco', 'Gris', 'Azul']
    };

    // Labels amigables
    const categoryLabels = {
        procesador: 'Procesador',
        ram: 'Memoria RAM',
        almacenamiento: 'Almacenamiento',
        pantalla_tamano: 'Tamaño de Pantalla',
        pantalla_resolucion: 'Resolución',
        gpu: 'Tarjeta Gráfica',
        os: 'Sistema Operativo',
        color: 'Color'
    };

    // Cargar configuraciones existentes
    useEffect(() => {
        if (productId) {
            loadConfigurations();
        }
    }, [productId]);

    const loadConfigurations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('producto_configuraciones')
                .select('*')
                .eq('producto_id', productId)
                .order('precio', { ascending: true });

            if (!error) {
                setConfigurations(data || []);
                if (onConfigurationsChange) {
                    onConfigurationsChange(data || []);
                }
            }
        } catch (error) {
            console.error('Error loading configurations:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateConfigName = (config) => {
        const parts = [];
        
        // Procesador (siempre mostrar)
        if (config.procesador) {
            const proc = config.procesador.replace('Intel Core ', '').replace('AMD ', '');
            parts.push(proc);
        }
        
        // RAM
        if (config.ram) parts.push(`${config.ram} RAM`);
        
        // GPU (si no es integrada)
        if (config.gpu && config.gpu !== 'Integrada') {
            parts.push(config.gpu);
        }
        
        // Pantalla
        if (config.pantalla_tamano && config.pantalla_resolucion) {
            parts.push(`${config.pantalla_tamano} ${config.pantalla_resolucion}`);
        }
        
        // Almacenamiento
        if (config.almacenamiento) {
            parts.push(config.almacenamiento);
        }

        return parts.join(' | ') || 'Configuración personalizada';
    };

    const generateSKU = (config) => {
        const proc = config.procesador ? config.procesador.split(' ').pop() : 'X';
        const ram = config.ram ? config.ram.replace('GB', '') : 'X';
        const gpu = config.gpu ? config.gpu.replace('RTX ', '').replace('GTX ', '').replace(' ', '') : 'INT';
        return `NB-${productId}-${proc}-${ram}G-${gpu}`;
    };

    const handleConfigChange = (field, value) => {
        const updatedConfig = {
            ...newConfig,
            configuracion: {
                ...newConfig.configuracion,
                [field]: value
            }
        };

        // Auto-generar nombre y SKU
        updatedConfig.nombre = generateConfigName(updatedConfig.configuracion);
        updatedConfig.sku = generateSKU(updatedConfig.configuracion);

        setNewConfig(updatedConfig);
    };

    const handleSaveConfiguration = async () => {
        if (!newConfig.precio || !newConfig.configuracion.procesador) {
            alert('Procesador y precio son requeridos');
            return;
        }

        try {
            const configData = {
                producto_id: productId,
                nombre: newConfig.nombre,
                configuracion: newConfig.configuracion,
                precio: parseFloat(newConfig.precio),
                precio_original: newConfig.precio_original ? parseFloat(newConfig.precio_original) : null,
                stock: parseInt(newConfig.stock) || 0,
                sku: newConfig.sku || generateSKU(newConfig.configuracion),
                activo: true
            };

            let result;
            if (editingConfig) {
                result = await supabase
                    .from('producto_configuraciones')
                    .update(configData)
                    .eq('id', editingConfig.id);
            } else {
                result = await supabase
                    .from('producto_configuraciones')
                    .insert([configData]);
            }

            if (!result.error) {
                await loadConfigurations();
                setShowAddForm(false);
                setEditingConfig(null);
                setNewConfig({
                    nombre: '',
                    configuracion: {
                        procesador: '', ram: '', almacenamiento: '', pantalla_tamano: '',
                        pantalla_resolucion: '', gpu: '', os: 'Windows 11 Home', color: 'Negro'
                    },
                    precio: '', precio_original: '', stock: 1, sku: ''
                });
            } else {
                alert('Error guardando configuración: ' + result.error.message);
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            alert('Error guardando configuración');
        }
    };

    const handleEditConfiguration = (config) => {
        setEditingConfig(config);
        setNewConfig({
            nombre: config.nombre,
            configuracion: config.configuracion || {},
            precio: config.precio.toString(),
            precio_original: config.precio_original?.toString() || '',
            stock: config.stock.toString(),
            sku: config.sku
        });
        setShowAddForm(true);
    };

    const handleDeleteConfiguration = async (configId) => {
        if (!confirm('¿Eliminar esta configuración?')) return;

        try {
            const { error } = await supabase
                .from('producto_configuraciones')
                .delete()
                .eq('id', configId);

            if (!error) {
                await loadConfigurations();
            } else {
                alert('Error eliminando configuración');
            }
        } catch (error) {
            console.error('Error deleting configuration:', error);
            alert('Error eliminando configuración');
        }
    };

    const cancelEdit = () => {
        setShowAddForm(false);
        setEditingConfig(null);
        setNewConfig({
            nombre: '',
            configuracion: {
                procesador: '', ram: '', almacenamiento: '', pantalla_tamano: '',
                pantalla_resolucion: '', gpu: '', os: 'Windows 11 Home', color: 'Negro'
            },
            precio: '', precio_original: '', stock: 1, sku: ''
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                    Configuraciones de Notebook ({configurations.length})
                </h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 bg-[#dd40d5] text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Agregar</span>
                </button>
            </div>

            {/* Lista de configuraciones existentes */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
                {configurations.map((config) => (
                    <div key={config.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-medium text-white">{config.nombre}</h4>
                                <div className="text-2xl font-bold text-[#dd40d5]">
                                    US${config.precio.toLocaleString()}
                                </div>
                                {config.precio_original && config.precio_original > config.precio && (
                                    <div className="text-sm text-gray-400 line-through">
                                        US${config.precio_original.toLocaleString()}
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditConfiguration(config)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteConfiguration(config.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Stock: {config.stock}</span>
                            <span>SKU: {config.sku}</span>
                        </div>
                        
                        {/* Preview de configuración */}
                        <div className="mt-2 text-xs text-gray-400">
                            {config.configuracion?.procesador && `${config.configuracion.procesador} • `}
                            {config.configuracion?.ram && `${config.configuracion.ram} • `}
                            {config.configuracion?.gpu && config.configuracion.gpu !== 'Integrada' && `${config.configuracion.gpu} • `}
                            {config.configuracion?.pantalla_tamano && config.configuracion?.pantalla_resolucion && 
                                `${config.configuracion.pantalla_tamano} ${config.configuracion.pantalla_resolucion}`}
                        </div>
                    </div>
                ))}
                
                {configurations.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No hay configuraciones. Agrega la primera configuración completa de notebook.
                    </div>
                )}
            </div>

            {/* Modal/Form para agregar/editar configuración */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                        <h4 className="text-lg font-medium text-white mb-4">
                            {editingConfig ? 'Editar' : 'Nueva'} Configuración de Notebook
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(opcionesNotebook).map(([category, options]) => (
                                <div key={category}>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        {categoryLabels[category]}
                                        {category === 'procesador' && <span className="text-red-400"> *</span>}
                                    </label>
                                    <select
                                        value={newConfig.configuracion[category] || ''}
                                        onChange={(e) => handleConfigChange(category, e.target.value)}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {options.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Precio (US$) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newConfig.precio}
                                    onChange={(e) => setNewConfig({...newConfig, precio: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            {/* Precio Original */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Precio Original (Opcional)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newConfig.precio_original}
                                    onChange={(e) => setNewConfig({...newConfig, precio_original: e.target.value})}
                                    placeholder="Para mostrar descuento"
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newConfig.stock}
                                    onChange={(e) => setNewConfig({...newConfig, stock: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Nombre auto-generado y SKU */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Nombre de la configuración
                                </label>
                                <input
                                    type="text"
                                    value={newConfig.nombre}
                                    onChange={(e) => setNewConfig({...newConfig, nombre: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                    placeholder="Se genera automáticamente"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={newConfig.sku}
                                    onChange={(e) => setNewConfig({...newConfig, sku: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                    placeholder="Se genera automáticamente"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={handleSaveConfiguration}
                                className="bg-[#dd40d5] text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                {editingConfig ? 'Actualizar' : 'Agregar'} Configuración
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dd40d5] mx-auto"></div>
                </div>
            )}
        </div>
    );
};

export default ProductConfigManagerNotebooks;
