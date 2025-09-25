"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const ProductConfigManagerSimple = ({ productId, onConfigurationsChange }) => {
    const [configurations, setConfigurations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [newConfig, setNewConfig] = useState({
        // Specs fijas (iguales para todas las configuraciones)
        specs_fijas: {
            procesador: 'Intel Core i7',
            pantalla: '15.6" Full HD',
            gpu: 'RTX 3060',
            os: 'Windows 11 Pro'
        },
        // Variables simples
        capacidad_ram: '16GB',
        capacidad_ssd: '1TB',
        color: 'Negro',
        precio: '',
        precio_original: '',
        stock: 1
    });

    // Opciones predefinidas simples
    const ramOptions = ['8GB', '16GB', '32GB', '64GB'];
    const ssdOptions = ['256GB', '512GB', '1TB', '2TB', '4TB'];
    const colorOptions = ['Negro', 'Plata', 'Gris', 'Blanco'];

    // Opciones para specs fijas
    const processorOptions = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7'];
    const pantallaOptions = ['13.3" Full HD', '14" Full HD', '15.6" Full HD', '17" Full HD', '15.6" 4K'];
    const gpuOptions = ['Integrada', 'GTX 1650', 'RTX 3050', 'RTX 3060', 'RTX 3070', 'RTX 4060'];
    const osOptions = ['Windows 10 Home', 'Windows 10 Pro', 'Windows 11 Home', 'Windows 11 Pro'];

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
                .order('orden_capacidad', { ascending: true });

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

    const generateCapacidad = (ram, ssd) => {
        return `${ram} RAM | ${ssd} SSD`;
    };

    const generateSKU = (specs, ram, ssd, color) => {
        const marca = specs.procesador?.includes('Intel') ? 'INTEL' : 'AMD';
        const ramNum = ram.replace('GB', '');
        const ssdShort = ssd.replace('GB', '').replace('TB', 'T');
        const colorShort = color.substring(0, 3).toUpperCase();
        return `${marca}-${ramNum}G-${ssdShort}-${colorShort}`;
    };

    const handleSaveConfiguration = async () => {
        if (!newConfig.precio) {
            alert('El precio es requerido');
            return;
        }

        try {
            const capacidad = generateCapacidad(newConfig.capacidad_ram, newConfig.capacidad_ssd);
            const sku = generateSKU(newConfig.specs_fijas, newConfig.capacidad_ram, newConfig.capacidad_ssd, newConfig.color);
            
            const configData = {
                producto_id: productId,
                specs_fijas: newConfig.specs_fijas,
                capacidad: capacidad,
                capacidad_ram: newConfig.capacidad_ram,
                capacidad_ssd: newConfig.capacidad_ssd,
                color: newConfig.color,
                precio: parseFloat(newConfig.precio),
                precio_original: newConfig.precio_original ? parseFloat(newConfig.precio_original) : null,
                stock: parseInt(newConfig.stock) || 0,
                sku: sku,
                orden_capacidad: configurations.length + 1,
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
                resetForm();
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
            specs_fijas: config.specs_fijas || {
                procesador: 'Intel Core i7',
                pantalla: '15.6" Full HD', 
                gpu: 'RTX 3060',
                os: 'Windows 11 Pro'
            },
            capacidad_ram: config.capacidad_ram,
            capacidad_ssd: config.capacidad_ssd,
            color: config.color,
            precio: config.precio.toString(),
            precio_original: config.precio_original?.toString() || '',
            stock: config.stock.toString()
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

    const resetForm = () => {
        setNewConfig({
            specs_fijas: {
                procesador: 'Intel Core i7',
                pantalla: '15.6" Full HD',
                gpu: 'RTX 3060', 
                os: 'Windows 11 Pro'
            },
            capacidad_ram: '16GB',
            capacidad_ssd: '1TB',
            color: 'Negro',
            precio: '',
            precio_original: '',
            stock: 1
        });
    };

    const cancelEdit = () => {
        setShowAddForm(false);
        setEditingConfig(null);
        resetForm();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                    Configuraciones Estilo Amazon ({configurations.length})
                </h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 bg-[#dd40d5] text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Agregar Paquete</span>
                </button>
            </div>

            {/* Lista de configuraciones existentes */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
                {configurations.map((config, index) => (
                    <div key={config.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-medium text-white text-lg">{config.capacidad}</h4>
                                <div className="text-2xl font-bold text-[#dd40d5]">
                                    US${config.precio.toLocaleString()}
                                </div>
                                {config.precio_original && config.precio_original > config.precio && (
                                    <div className="text-sm text-gray-400 line-through">
                                        US${config.precio_original.toLocaleString()}
                                    </div>
                                )}
                                <div className="text-sm text-gray-300 mt-1">
                                    Color: {config.color} • Stock: {config.stock}
                                </div>
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
                        
                        {/* Specs fijas (se muestran pero no se editan individualmente) */}
                        <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded">
                            <strong>Specs fijas:</strong> {config.specs_fijas?.procesador} • {config.specs_fijas?.pantalla} • {config.specs_fijas?.gpu} • {config.specs_fijas?.os}
                        </div>
                    </div>
                ))}
                
                {configurations.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-2">📦</div>
                        <div>No hay paquetes de configuración.</div>
                        <div className="text-sm">Agrega el primer paquete estilo Amazon.</div>
                    </div>
                )}
            </div>

            {/* Formulario para agregar/editar */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                        <h4 className="text-lg font-medium text-white mb-4">
                            {editingConfig ? 'Editar' : 'Nuevo'} Paquete de Configuración
                        </h4>

                        {/* Specs Fijas */}
                        <div className="bg-gray-900 p-3 rounded mb-4">
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Especificaciones Fijas del Producto:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Procesador</label>
                                    <select
                                        value={newConfig.specs_fijas.procesador}
                                        onChange={(e) => setNewConfig({
                                            ...newConfig,
                                            specs_fijas: {...newConfig.specs_fijas, procesador: e.target.value}
                                        })}
                                        className="w-full bg-gray-700 text-white text-sm border border-gray-600 rounded px-2 py-1"
                                    >
                                        {processorOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Pantalla</label>
                                    <select
                                        value={newConfig.specs_fijas.pantalla}
                                        onChange={(e) => setNewConfig({
                                            ...newConfig,
                                            specs_fijas: {...newConfig.specs_fijas, pantalla: e.target.value}
                                        })}
                                        className="w-full bg-gray-700 text-white text-sm border border-gray-600 rounded px-2 py-1"
                                    >
                                        {pantallaOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">GPU</label>
                                    <select
                                        value={newConfig.specs_fijas.gpu}
                                        onChange={(e) => setNewConfig({
                                            ...newConfig,
                                            specs_fijas: {...newConfig.specs_fijas, gpu: e.target.value}
                                        })}
                                        className="w-full bg-gray-700 text-white text-sm border border-gray-600 rounded px-2 py-1"
                                    >
                                        {gpuOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Sistema Operativo</label>
                                    <select
                                        value={newConfig.specs_fijas.os}
                                        onChange={(e) => setNewConfig({
                                            ...newConfig,
                                            specs_fijas: {...newConfig.specs_fijas, os: e.target.value}
                                        })}
                                        className="w-full bg-gray-700 text-white text-sm border border-gray-600 rounded px-2 py-1"
                                    >
                                        {osOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Variables Simples */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    RAM <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={newConfig.capacidad_ram}
                                    onChange={(e) => setNewConfig({...newConfig, capacidad_ram: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                >
                                    {ramOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Almacenamiento <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={newConfig.capacidad_ssd}
                                    onChange={(e) => setNewConfig({...newConfig, capacidad_ssd: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                >
                                    {ssdOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                                <select
                                    value={newConfig.color}
                                    onChange={(e) => setNewConfig({...newConfig, color: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                >
                                    {colorOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Preview del paquete */}
                        <div className="bg-[#dd40d5] bg-opacity-10 border border-[#dd40d5] p-3 rounded mb-4">
                            <div className="text-white font-medium">
                                Preview: {generateCapacidad(newConfig.capacidad_ram, newConfig.capacidad_ssd)}
                            </div>
                            <div className="text-sm text-gray-300">
                                SKU: {generateSKU(newConfig.specs_fijas, newConfig.capacidad_ram, newConfig.capacidad_ssd, newConfig.color)}
                            </div>
                        </div>

                        {/* Precio y Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Precio (US$) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newConfig.precio}
                                    onChange={(e) => setNewConfig({...newConfig, precio: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                    placeholder="1799.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Precio Original (Descuento)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newConfig.precio_original}
                                    onChange={(e) => setNewConfig({...newConfig, precio_original: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                    placeholder="1999.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newConfig.stock}
                                    onChange={(e) => setNewConfig({...newConfig, stock: e.target.value})}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleSaveConfiguration}
                                className="bg-[#dd40d5] text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                {editingConfig ? 'Actualizar' : 'Crear'} Paquete
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

            {/* Ayuda */}
            {configurations.length > 0 && (
                <div className="bg-blue-900 bg-opacity-20 border border-blue-500 p-3 rounded text-sm text-blue-200">
                    <strong>💡 Lógica Amazon:</strong> Las specs fijas se muestran en el título del producto. 
                    Solo RAM+SSD y color cambian. El usuario hace 1 clic = selecciona paquete completo.
                </div>
            )}
        </div>
    );
};

export default ProductConfigManagerSimple;
