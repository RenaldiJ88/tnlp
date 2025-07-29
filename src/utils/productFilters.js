// Utilidades para extraer especificaciones de productos y filtrado

/**
 * Extrae especificaciones estructuradas de la descripción del producto
 */
export const extractProductSpecs = (product) => {
  const description = product.description.toLowerCase();
  
  // Extraer procesador
  const processorInfo = extractProcessor(description);
  
  // Extraer RAM
  const ramInfo = extractRAM(description);
  
  // Extraer tamaño de pantalla
  const screenSize = extractScreenSize(description);
  
  // Extraer almacenamiento
  const storage = extractStorage(description);
  
  // Extraer gráfica
  const graphics = extractGraphics(description);
  
  // Extraer precio numérico
  const numericPrice = extractNumericPrice(product.price);
  
  return {
    ...product,
    specs: {
      processor: processorInfo,
      ram: ramInfo,
      screenSize: screenSize,
      storage: storage,
      graphics: graphics,
      numericPrice: numericPrice,
      category: product.categoria === '1' ? 'office' : 'gamer',
      isOffer: product.isOffer === 1
    }
  };
};

/**
 * Extrae información del procesador
 */
const extractProcessor = (description) => {
  const processor = {
    brand: null,
    series: null,
    model: null
  };
  
  // Detectar marca
  if (description.includes('intel')) {
    processor.brand = 'Intel';
    
    // Detectar serie Intel
    if (description.includes('i3')) processor.series = 'i3';
    else if (description.includes('i5')) processor.series = 'i5';
    else if (description.includes('i7')) processor.series = 'i7';
    else if (description.includes('i9')) processor.series = 'i9';
    else if (description.includes('core 5')) processor.series = 'Core 5';
    else if (description.includes('ultra 7')) processor.series = 'Ultra 7';
    
  } else if (description.includes('amd') || description.includes('ryzen')) {
    processor.brand = 'AMD';
    
    // Detectar serie AMD
    if (description.includes('ryzen 3')) processor.series = 'Ryzen 3';
    else if (description.includes('ryzen 5')) processor.series = 'Ryzen 5';
    else if (description.includes('ryzen 7')) processor.series = 'Ryzen 7';
    else if (description.includes('ryzen 9')) processor.series = 'Ryzen 9';
  }
  
  return processor;
};

/**
 * Extrae información de RAM
 */
const extractRAM = (description) => {
  const ramMatch = description.match(/(\d+)\s*gb\s*(ram|memory|ddr\d*)/i);
  if (ramMatch) {
    return parseInt(ramMatch[1]);
  }
  return null;
};

/**
 * Extrae tamaño de pantalla
 */
const extractScreenSize = (description) => {
  const screenMatch = description.match(/(\d+\.?\d*)\s*[\"\'″]/);
  if (screenMatch) {
    return parseFloat(screenMatch[1]);
  }
  return null;
};

/**
 * Extrae información de almacenamiento
 */
const extractStorage = (description) => {
  const storage = {
    type: null,
    capacity: null
  };
  
  // Detectar tipo
  if (description.includes('ssd')) storage.type = 'SSD';
  else if (description.includes('hdd')) storage.type = 'HDD';
  else if (description.includes('usf')) storage.type = 'USF';
  
  // Detectar capacidad
  const storageMatch = description.match(/(\d+)\s*(gb|tb)\s*(ssd|hdd|usf)/i);
  if (storageMatch) {
    const capacity = parseInt(storageMatch[1]);
    const unit = storageMatch[2].toLowerCase();
    storage.capacity = unit === 'tb' ? capacity * 1000 : capacity;
  }
  
  return storage;
};

/**
 * Extrae información de gráfica
 */
const extractGraphics = (description) => {
  const graphics = {
    type: 'integrated', // por defecto integrada
    model: null,
    vram: null
  };
  
  // Detectar gráficas dedicadas
  if (description.includes('rtx') || description.includes('gtx') || description.includes('geforce')) {
    graphics.type = 'dedicated';
    
    // Extraer modelo NVIDIA
    const nvidiaMatch = description.match(/(rtx|gtx)\s*(\d+)/i);
    if (nvidiaMatch) {
      graphics.model = `${nvidiaMatch[1].toUpperCase()} ${nvidiaMatch[2]}`;
    }
    
  } else if (description.includes('rx') || description.includes('radeon')) {
    graphics.type = 'dedicated';
    
    // Extraer modelo AMD
    const amdMatch = description.match(/rx\s*(\d+)/i);
    if (amdMatch) {
      graphics.model = `RX ${amdMatch[1]}`;
    }
  }
  
  // Extraer VRAM
  const vramMatch = description.match(/(\d+)\s*gb.*?(?:rtx|gtx|rx|geforce)/i);
  if (vramMatch) {
    graphics.vram = parseInt(vramMatch[1]);
  }
  
  return graphics;
};

/**
 * Extrae precio numérico del string
 */
const extractNumericPrice = (priceString) => {
  const priceMatch = priceString.match(/\$(\d+)/);
  return priceMatch ? parseInt(priceMatch[1]) : 0;
};

/**
 * Filtra productos basado en criterios seleccionados
 */
export const filterProducts = (products, filters) => {
  return products.filter(product => {
    const specs = product.specs;
    
    // Filtro por categoría
    if (filters.category && filters.category !== 'all' && specs.category !== filters.category) {
      return false;
    }
    
    // Filtro por marca de procesador
    if (filters.processorBrand && filters.processorBrand !== 'all' && 
        specs.processor.brand !== filters.processorBrand) {
      return false;
    }
    
    // Filtro por RAM
    if (filters.ram && filters.ram !== 'all') {
      const ramFilter = parseInt(filters.ram);
      if (!specs.ram || specs.ram < ramFilter) {
        return false;
      }
    }
    
    // Filtro por tamaño de pantalla
    if (filters.screenSize && filters.screenSize !== 'all') {
      if (!specs.screenSize) return false;
      
      switch (filters.screenSize) {
        case '14':
          if (specs.screenSize >= 15) return false;
          break;
        case '15.6':
          if (specs.screenSize < 15 || specs.screenSize >= 16) return false;
          break;
        case '16+':
          if (specs.screenSize < 16) return false;
          break;
      }
    }
    
    // Filtro por rango de precio
    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
      if (specs.numericPrice < min || (max && specs.numericPrice > max)) {
        return false;
      }
    }
    
    // Filtro por tipo de gráfica
    if (filters.graphicsType && filters.graphicsType !== 'all' && 
        specs.graphics.type !== filters.graphicsType) {
      return false;
    }
    
    // Filtro por ofertas
    if (filters.isOffer && filters.isOffer !== 'all') {
      const showOffers = filters.isOffer === 'true';
      if (specs.isOffer !== showOffers) {
        return false;
      }
    }
    
    // Filtro por búsqueda de texto
    if (filters.searchText && filters.searchText.trim()) {
      const searchTerm = filters.searchText.toLowerCase();
      const searchableText = `${product.title} ${product.description}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Ordena productos según criterio seleccionado
 */
export const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.specs.numericPrice - b.specs.numericPrice);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.specs.numericPrice - a.specs.numericPrice);
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sortedProducts;
  }
};

/**
 * Obtiene valores únicos para los filtros
 */
export const getUniqueFilterValues = (products) => {
  const values = {
    processorBrands: new Set(),
    ramOptions: new Set(),
    screenSizes: new Set(),
    priceRanges: [
      { value: '0-600', label: 'Menos de $600' },
      { value: '600-900', label: '$600 - $900' },
      { value: '900-1200', label: '$900 - $1200' },
      { value: '1200-1500', label: '$1200 - $1500' },
      { value: '1500-2000', label: '$1500 - $2000' },
      { value: '2000-', label: 'Más de $2000' }
    ]
  };
  
  products.forEach(product => {
    const specs = product.specs;
    
    if (specs.processor.brand) values.processorBrands.add(specs.processor.brand);
    if (specs.ram) values.ramOptions.add(specs.ram);
    if (specs.screenSize) {
      if (specs.screenSize < 15) values.screenSizes.add('14"');
      else if (specs.screenSize < 16) values.screenSizes.add('15.6"');
      else values.screenSizes.add('16"+');
    }
  });
  
  return {
    processorBrands: Array.from(values.processorBrands).sort(),
    ramOptions: Array.from(values.ramOptions).sort((a, b) => a - b),
    screenSizes: Array.from(values.screenSizes),
    priceRanges: values.priceRanges
  };
}; 