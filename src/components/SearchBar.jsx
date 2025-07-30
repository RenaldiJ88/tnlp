"use client";

import React from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ searchText, onSearchChange, onClearSearch }) => {
  const handleChange = (e) => {
    const searchValue = e.target.value;
    onSearchChange(searchValue);
    
    // Track búsqueda si tiene más de 3 caracteres
    if (searchValue.length > 3 && typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'search', {
          search_term: searchValue,
          results_count: 0,
          event_category: 'site_search'
        });
      }
      
      // Microsoft Clarity
      if (window.clarity) {
        window.clarity('event', 'product_search', { term: searchValue });
      }
    }
  };

  const handleClear = () => {
    onClearSearch();
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        {/* Ícono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Input de búsqueda */}
        <input
          type="text"
          value={searchText}
          onChange={handleChange}
          placeholder="Buscar por marca, modelo, procesador, características..."
          className="w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-600 rounded-xl 
                     text-white placeholder-gray-400 text-lg
                     focus:border-[#dd40d5] focus:ring-2 focus:ring-[#dd40d5]/20 
                     focus:outline-none transition-all duration-300
                     shadow-lg hover:shadow-xl"
        />

        {/* Botón de limpiar */}
        {searchText && (
          <motion.button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Texto de ayuda */}
      <motion.div 
        className="mt-2 text-center text-gray-400 text-sm font-roboto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Prueba buscar: &quot;Intel i7&quot;, &quot;RTX 4060&quot;, &quot;16GB RAM&quot;, &quot;15.6 pulgadas&quot;
      </motion.div>

      {/* Sugerencias rápidas */}
      {!searchText && (
        <motion.div 
          className="mt-4 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {['Gaming', 'Office', 'Intel', 'AMD', 'RTX', '16GB'].map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => onSearchChange(suggestion)}
              className="px-3 py-1 bg-gray-700 hover:bg-[#dd40d5] text-gray-300 hover:text-black 
                         rounded-full text-sm transition-colors duration-200 font-roboto"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar; 