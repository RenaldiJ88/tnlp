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

    // MÁXIMO DIFERIDO - Solo después de primera interacción  
    const handleFirstInteraction = () => {
      setTimeout(loadClarity, 2000);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    if (document.readyState === 'complete') {
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('scroll', handleFirstInteraction);
      // Fallback después de 15s si no hay interacción
      setTimeout(loadClarity, 15000);
    } else {
      window.addEventListener('load', () => {
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('scroll', handleFirstInteraction);
        setTimeout(loadClarity, 15000);
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