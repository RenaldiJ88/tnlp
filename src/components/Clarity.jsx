"use client";

import { useEffect } from 'react';

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function MicrosoftClarity() {
  useEffect(() => {
    if (!CLARITY_PROJECT_ID) return;

    // Cargar Clarity de forma diferida - después de que la página se haya cargado
    const loadClarity = () => {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.defer=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `;
      document.head.appendChild(script);
    };

    // Cargar después de que el contenido crítico haya terminado - delay más agresivo
    if (document.readyState === 'complete') {
      setTimeout(loadClarity, 5000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(loadClarity, 5000);
      });
    }

    return () => {
      const scripts = document.querySelectorAll('script[src*="clarity.ms"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return null;
}

// Funciones de tracking simplificadas - usar directamente window.clarity en los componentes 