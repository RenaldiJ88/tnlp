"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const ProductConfigManager = ({ productId, onConfigurationsChange }) => {
    const [configurations, setConfigurations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [newConfig, setNewConfig] = useState({
        nombre: '',
        configuracion: {
            ram: '',
            ssd: '',
            procesador: '',
            os: 'Windows 11 Home',
            gpu: ''
        },
        precio: '',
        precio_original: '',
        stock: 1,
        sku: ''
    });

    // Opciones disponibles
    const ramOptions = ['8GB', '16GB', '32GB', '64GB'];
    const ssdOptions = ['256GB', '512GB', '1TB', '2TB', '4TB'];
    const osOptions = [
        'Windows 10 Home',
        'Windows 10 Pro', 
        'Windows 11 Home',
        'Windows 11 Pro',
        'Sin Sistema'
    ];
    const processorOptions = [
        'Intel Core i3',
        'Intel Core i5', 
        'Intel Core i7',
        'Intel Core i9',
        'AMD Ryzen 3',
        'AMD Ryzen 5',
        'AMD Ryzen 7',
        'AMD Ryzen 9'
    ];

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
        if (config.ram) parts.push(`${config.ram} RAM`);
        if (config.ssd) parts.push(config.ssd);
        if (config.gpu && config.gpu !== '') parts.push(config.gpu);
        if (config.os && config.os !== 'Windows 11 Home') parts.push(config.os);
        return parts.join(' | ') || 'Configuración personalizada';
    };

    const generateSKU = (config) => {
        const product = configurations.length > 0 ? 'PROD' : 'NEW';
        const ram = config.ram ? config.ram.replace('GB', '') : 'X';
        const ssd = config.ssd ? config.ssd.replace('GB', '').replace('TB', 'T') : 'X';
        return `${product}-${productId}-${ram}G-${ssd}`;
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
        if (!newConfig.precio || !newConfig.nombre) {
            alert('Precio y configuración son requeridos');
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
                // Actualizar existente
                result = await supabase
                    .from('producto_configuraciones')
                    .update(configData)
                    .eq('id', editingConfig.id);
            } else {
                // Crear nueva
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
                    configuracion: { ram: '', ssd: '', procesador: '', os: 'Windows 11 Home', gpu: '' },
                    precio: '',
                    precio_original: '',
                    stock: 1,
                    sku: ''
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
            configuracion: { ram: '', ssd: '', procesador: '', os: 'Windows 11 Home', gpu: '' },
            precio: '',
            precio_original: '',
            stock: 1,
            sku: ''
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                    Configuraciones ({configurations.length})
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
                    </div>
                ))}
                {configurations.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No hay configuraciones. Agrega la primera.
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
                            {editingConfig ? 'Editar' : 'Nueva'} Configuración
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* RAM */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    RAM
                                </label>
                                <select
                                    value={newConfig.configuracion.ram}
                                    onChange={(e) => handleConfigChange('ram', e.target.value)}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                >
                                    <option value="">Seleccionar...</option>
                                    {ramOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* SSD */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Almacenamiento
                                </label>
                                <select
                                    value={newConfig.configuracion.ssd}
                                    onChange={(e) => handleConfigChange('ssd', e.target.value)}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                >
                                    <option value="">Seleccionar...</option>
                                    {ssdOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sistema Operativo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Sistema Operativo
                                </label>
                                <select
                                    value={newConfig.configuracion.os}
                                    onChange={(e) => handleConfigChange('os', e.target.value)}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                >
                                    {osOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* GPU (opcional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    GPU (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={newConfig.configuracion.gpu}
                                    onChange={(e) => handleConfigChange('gpu', e.target.value)}
                                    placeholder="RTX 3060, GTX 1650..."
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                />
                            </div>

                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Precio (US$) *
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

                            {/* Precio Original (descuento) */}
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

                            {/* SKU (auto-generado pero editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={newConfig.sku}
                                    onChange={(e) => setNewConfig({...newConfig, sku: e.target.value})}
                                    placeholder="Se genera automáticamente"
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Nombre auto-generado */}
                        <div className="mt-4">
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

export default ProductConfigManager;
