"use client";

import { useEffect } from 'react';

// Hook personalizado para tracking avanzado
export const useAnalytics = () => {
  
  // Función centralizada para envío de eventos
  const trackEvent = (eventName, eventData = {}) => {
    if (typeof window === 'undefined') return;
    
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }
    
    // Microsoft Clarity
    if (window.clarity) {
      const clarityEventName = eventData.clarity_event || eventName;
      const clarityData = { ...eventData };
      delete clarityData.clarity_event; // Limpiar data específica de GA
      window.clarity('event', clarityEventName, clarityData);
    }
  };

  // Tracking de scroll profundo
  const trackScrollDepth = () => {
    let maxScroll = 0;
    const intervals = [25, 50, 75, 90];
    const tracked = new Set();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        intervals.forEach(interval => {
          if (scrollPercent >= interval && !tracked.has(interval)) {
            tracked.add(interval);
            trackEvent('scroll_depth', {
              event_category: 'engagement',
              event_label: `${interval}%`,
              value: interval,
              clarity_event: 'scroll_milestone'
            });
          }
        });
      }
    };

    return handleScroll;
  };

  // Tracking de tiempo en página
  const trackTimeOnPage = () => {
    const startTime = Date.now();
    const intervals = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
    const tracked = new Set();

    const checkTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      intervals.forEach(interval => {
        if (timeOnPage >= interval && !tracked.has(interval)) {
          tracked.add(interval);
          trackEvent('time_on_page', {
            event_category: 'engagement',
            event_label: `${interval}s`,
            value: interval,
            clarity_event: 'time_milestone'
          });
        }
      });
    };

    const timer = setInterval(checkTimeOnPage, 10000); // Check every 10s
    return () => clearInterval(timer);
  };

  // Tracking de clics fuera del sitio
  const trackExternalLink = (url, context = '') => {
    trackEvent('click_external_link', {
      link_url: url,
      event_category: 'outbound',
      event_label: context,
      clarity_event: 'external_click'
    });
  };

  // Tracking de filtros
  const trackFilter = (filterType, filterValue, resultsCount = 0) => {
    trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
      results_count: resultsCount,
      event_category: 'site_interaction',
      clarity_event: 'filter_interaction'
    });
  };

  // Tracking de errores de búsqueda
  const trackSearchNoResults = (searchTerm) => {
    trackEvent('search_no_results', {
      search_term: searchTerm,
      event_category: 'site_search',
      clarity_event: 'search_empty'
    });
  };

  // Auto-setup de tracking básico
  useEffect(() => {
    const scrollHandler = trackScrollDepth();
    const timeCleanup = trackTimeOnPage();
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      timeCleanup();
    };
  }, []);

  return {
    trackEvent,
    trackExternalLink,
    trackFilter,
    trackSearchNoResults
  };
};

// Funciones específicas para eventos comunes
export const analytics = {
  // Productos
  viewProduct: (productName, price, isOffer = false) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        item_name: productName,
        item_category: isOffer ? 'Offer Products' : 'Products',
        value: parseFloat(price.replace(/[^0-9.-]/g, '')) || 0,
        currency: 'ARS'
      });
    }
    
    if (window.clarity) {
      window.clarity('event', 'product_view', { 
        product: productName, 
        price: price,
        is_offer: isOffer 
      });
    }
  },

  // WhatsApp específico para productos
  whatsappProductInquiry: (productName, price, isOffer = false) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'whatsapp_product_inquiry', {
        item_name: productName,
        item_category: isOffer ? 'Offer Products' : 'Products',
        value: parseFloat(price.replace(/[^0-9.-]/g, '')) || 0,
        currency: 'ARS',
        event_category: 'ecommerce'
      });
    }
    
    if (window.clarity) {
      window.clarity('event', 'purchase_intent', { 
        product: productName, 
        price: price,
        is_offer: isOffer,
        source: 'product_card'
      });
    }
  },

  // Servicios
  viewService: (serviceName, serviceId) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'view_service', {
        service_name: serviceName,
        service_id: serviceId,
        event_category: 'services'
      });
    }
    
    if (window.clarity) {
      window.clarity('event', 'service_click', { 
        service: serviceName, 
        service_id: serviceId
      });
    }
  },

  // WhatsApp general
  whatsappClick: (source = 'floating_button', context = '') => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: `${source} - ${context}`,
        contact_method: 'whatsapp'
      });
    }
    
    if (window.clarity) {
      window.clarity('event', 'whatsapp_click', { 
        source: source,
        context: context
      });
    }
  }
};