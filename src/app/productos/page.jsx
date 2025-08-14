"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import SearchBar from '../../components/SearchBar';
import { supabase } from '../../lib/supabase';
import { extractProductSpecs, filterProducts, sortProducts, getUniqueFilterValues } from '../../utils/productFilters';

const ProductsSearchPage = () => {
  // Estados para filtros y búsqueda
  const [filters, setFilters] = useState({
    category: 'all',
    processorBrand: 'all',
    ram: 'all',
    screenSize: 'all',
    priceRange: 'all',
    graphicsType: 'all',
    isOffer: 'all',
    searchText: ''
  });
  
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);

  // Cargar productos desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔄 Cargando productos desde Supabase...');

        
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) {
          console.error('❌ Error loading products:', error);
          console.log('🔍 Detalles del error:', {
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          setProducts([]);
        } else {
          console.log('✅ Productos cargados:', data.length);
          
          // Mapear campos de Supabase a formato esperado
          const mappedProducts = data.map(product => ({
            ...product,
            isOffer: product.is_offer,
            lastModified: product.last_modified
          }));
          
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('❌ Error loading products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Procesar productos con especificaciones extraídas
  const processedProducts = useMemo(() => {
    const processed = products.map(product => extractProductSpecs(product));
    return processed;
  }, [products]);

  // Obtener valores únicos para filtros
  const filterOptions = useMemo(() => {
    return getUniqueFilterValues(processedProducts);
  }, [processedProducts]);

  // Aplicar filtros y ordenamiento
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(processedProducts, filters);
    const sorted = sortProducts(filtered, sortBy);
    return sorted;
  }, [processedProducts, filters, sortBy]);

  // Función para actualizar filtros
  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      processorBrand: 'all',
      ram: 'all',
      screenSize: 'all',
      priceRange: 'all',
      graphicsType: 'all',
      isOffer: 'all',
      searchText: ''
    });
  };

  if (isLoading) {
    return (
      <div className="bg-black-tnlp">
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Cargando productos...</div>
        </div>
        <WhatsAppButton />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black-tnlp">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-black to-gray-900 pt-32 pb-12">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-2 font-orbitron tracking-wider"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#dd40d5]">BUSCADOR</span> DE EQUIPOS
          </motion.h1>
          <motion.p 
            className="text-gray-300 text-center text-lg font-roboto max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Encuentra el equipo perfecto para tus necesidades con nuestro sistema avanzado de filtros
          </motion.p>
        </div>
      </div>

      {/* Barra de búsqueda principal */}
      <motion.div 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <SearchBar 
          searchText={filters.searchText}
          onSearchChange={(value) => updateFilter('searchText', value)}
          onClearSearch={() => updateFilter('searchText', '')}
        />
      </motion.div>

      <div className="container mx-auto px-4 flex gap-6">
        {/* Botón para mostrar filtros en móvil */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden fixed top-20 right-4 z-50 bg-[#dd40d5] text-black px-4 py-2 rounded-lg font-orbitron font-bold"
        >
          {showFilters ? 'Ocultar' : 'Filtros'}
        </button>

        {/* Sidebar de filtros */}
        <div className={`
          ${showFilters ? 'block' : 'hidden'} lg:block
          fixed lg:relative top-0 left-0 lg:top-auto lg:left-auto
          w-80 lg:w-80 min-h-screen lg:min-h-auto
          bg-gray-800 lg:bg-transparent
          z-40 lg:z-auto
          overflow-y-auto lg:overflow-visible
          transition-all duration-300
        `}>
          <FilterSidebar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={updateFilter}
            onClearFilters={clearAllFilters}
            onClose={() => setShowFilters(false)}
          />
        </div>

        {/* Overlay para móvil */}
        {showFilters && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Barra de herramientas */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-white font-roboto">
              <span className="text-[#dd40d5] font-bold">{filteredProducts.length}</span> productos encontrados
            </div>
            
            <div className="flex items-center gap-4">
              <label className="text-white font-roboto">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-[#dd40d5] focus:outline-none"
              >
                <option value="name-asc">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Resultados */}
          {filteredProducts.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2 font-orbitron">No se encontraron productos</h3>
              <p className="text-gray-400 font-roboto">Intenta ajustar los filtros o busca con otros términos</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 bg-[#dd40d5] hover:bg-[#b8359f] text-black font-bold py-2 px-6 rounded-lg transition-colors duration-300 font-orbitron"
              >
                Limpiar filtros
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    image={product.image}
                    description={product.description}
                    price={product.price}
                    isOffer={product.isOffer === 1}
                    categoria={product.categoria}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default ProductsSearchPage; 