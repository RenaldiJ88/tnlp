"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Configuración de Google Analytics
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Cargar GA de forma diferida - no bloquear el renderizado inicial
    const loadGA = () => {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.defer = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    // Cargar después del contenido crítico
    if (document.readyState === 'complete') {
      setTimeout(loadGA, 500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(loadGA, 500);
      });
    }

    return () => {
      const scripts = document.querySelectorAll(`script[src*="googletagmanager"]`);
      scripts.forEach(script => script.remove());
    };
  }, []);

  // Trackear cambios de página
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname]);

  return null;
}

// Funciones de tracking simplificadas - usar directamente window.gtag en los componentes 