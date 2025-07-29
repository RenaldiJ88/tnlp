"use client";

import React from 'react';
import { motion } from 'framer-motion';

const FilterSidebar = ({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onClearFilters, 
  onClose 
}) => {
  
  const FilterSection = ({ title, children }) => (
    <div className="mb-6 pt-20">
      <h3 className="text-white font-bold mb-3 font-orbitron text-sm uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const FilterOption = ({ value, currentValue, onChange, children, count = null }) => (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center">
        <input
          type="radio"
          name={`filter-${Math.random()}`}
          value={value}
          checked={currentValue === value}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        <div className={`
          w-4 h-4 rounded-full border-2 mr-3 transition-colors duration-200
          ${currentValue === value 
            ? 'bg-[#dd40d5] border-[#dd40d5]' 
            : 'border-gray-400 group-hover:border-[#dd40d5]'
          }
        `}>
          {currentValue === value && (
            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
          )}
        </div>
        <span className={`
          text-sm font-roboto transition-colors duration-200
          ${currentValue === value ? 'text-[#dd40d5]' : 'text-gray-300 group-hover:text-white'}
        `}>
          {children}
        </span>
      </div>
      {count !== null && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </label>
  );

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      value !== 'all' && value !== ''
    ).length;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header del sidebar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white font-orbitron">
          FILTROS
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 bg-[#dd40d5] text-black text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </h2>
        
        {/* Botón cerrar en móvil */}
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Botón limpiar filtros */}
      {getActiveFiltersCount() > 0 && (
        <motion.button
          onClick={onClearFilters}
          className="w-full mb-6 bg-gray-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg 
                     transition-colors duration-200 font-roboto text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🗑️ Limpiar todos los filtros
        </motion.button>
      )}

      {/* Categoría */}
      <FilterSection title="Categoría">
        <FilterOption 
          value="all" 
          currentValue={filters.category} 
          onChange={(value) => onFilterChange('category', value)}
        >
          Todos los equipos
        </FilterOption>
        <FilterOption 
          value="office" 
          currentValue={filters.category} 
          onChange={(value) => onFilterChange('category', value)}
        >
          💼 Equipos Office
        </FilterOption>
        <FilterOption 
          value="gamer" 
          currentValue={filters.category} 
          onChange={(value) => onFilterChange('category', value)}
        >
          🎮 Equipos Gamer
        </FilterOption>
      </FilterSection>

      {/* Procesador */}
      <FilterSection title="Procesador">
        <FilterOption 
          value="all" 
          currentValue={filters.processorBrand} 
          onChange={(value) => onFilterChange('processorBrand', value)}
        >
          Todas las marcas
        </FilterOption>
        {filterOptions.processorBrands.map(brand => (
          <FilterOption 
            key={brand}
            value={brand} 
            currentValue={filters.processorBrand} 
            onChange={(value) => onFilterChange('processorBrand', value)}
          >
            {brand === "Intel" ? "🔵" : "🔴"} {brand}
          </FilterOption>
        ))}
      </FilterSection>

      {/* RAM */}
      <FilterSection title="Memoria RAM">
        <FilterOption 
          value="all" 
          currentValue={filters.ram} 
          onChange={(value) => onFilterChange('ram', value)}
        >
          Cualquier cantidad
        </FilterOption>
        {filterOptions.ramOptions.map(ram => (
          <FilterOption 
            key={ram}
            value={ram.toString()} 
            currentValue={filters.ram} 
            onChange={(value) => onFilterChange('ram', value)}
          >
            {ram}GB RAM {ram >= 16 ? "⚡" : ""}
          </FilterOption>
        ))}
      </FilterSection>

      {/* Tamaño de pantalla */}
      <FilterSection title="Tamaño de Pantalla">
        <FilterOption 
          value="all" 
          currentValue={filters.screenSize} 
          onChange={(value) => onFilterChange('screenSize', value)}
        >
          Cualquier tamaño
        </FilterOption>
        <FilterOption 
          value="14" 
          currentValue={filters.screenSize} 
          onChange={(value) => onFilterChange('screenSize', value)}
        >
          📱 14&quot; (Portátil)
        </FilterOption>
        <FilterOption 
          value="15.6" 
          currentValue={filters.screenSize} 
          onChange={(value) => onFilterChange('screenSize', value)}
        >
          💻 15.6&quot; (Estándar)
        </FilterOption>
        <FilterOption 
          value="16+" 
          currentValue={filters.screenSize} 
          onChange={(value) => onFilterChange('screenSize', value)}
        >
          🖥️ 16&quot;+ (Pantalla grande)
        </FilterOption>
      </FilterSection>

      {/* Gráfica */}
      <FilterSection title="Tarjeta Gráfica">
        <FilterOption 
          value="all" 
          currentValue={filters.graphicsType} 
          onChange={(value) => onFilterChange('graphicsType', value)}
        >
          Cualquier tipo
        </FilterOption>
        <FilterOption 
          value="integrated" 
          currentValue={filters.graphicsType} 
          onChange={(value) => onFilterChange('graphicsType', value)}
        >
          📊 Gráfica Integrada
        </FilterOption>
        <FilterOption 
          value="dedicated" 
          currentValue={filters.graphicsType} 
          onChange={(value) => onFilterChange('graphicsType', value)}
        >
          🎮 Gráfica Dedicada
        </FilterOption>
      </FilterSection>

      {/* Rango de precio */}
      <FilterSection title="Rango de Precio">
        <FilterOption 
          value="all" 
          currentValue={filters.priceRange} 
          onChange={(value) => onFilterChange('priceRange', value)}
        >
          Cualquier precio
        </FilterOption>
        {filterOptions.priceRanges.map(range => (
          <FilterOption 
            key={range.value}
            value={range.value} 
            currentValue={filters.priceRange} 
            onChange={(value) => onFilterChange('priceRange', value)}
          >
            💲 {range.label}
          </FilterOption>
        ))}
      </FilterSection>

      {/* Ofertas especiales */}
      <FilterSection title="Ofertas Especiales">
        <FilterOption 
          value="all" 
          currentValue={filters.isOffer} 
          onChange={(value) => onFilterChange('isOffer', value)}
        >
          Todos los productos
        </FilterOption>
        <FilterOption 
          value="true" 
          currentValue={filters.isOffer} 
          onChange={(value) => onFilterChange('isOffer', value)}
        >
          🔥 Solo productos en oferta
        </FilterOption>
        <FilterOption 
          value="false" 
          currentValue={filters.isOffer} 
          onChange={(value) => onFilterChange('isOffer', value)}
        >
          📦 Productos regulares
        </FilterOption>
      </FilterSection>

      {/* Footer informativo */}
      <div className="mt-8 p-4 bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-300 font-roboto text-center">
          💡 Los filtros se aplican automáticamente. 
          Combina múltiples filtros para encontrar exactamente lo que buscas.
        </p>
      </div>
    </div>
  );
};

export default FilterSidebar; 