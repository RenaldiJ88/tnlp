"use client";

import { useEffect } from 'react';

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function MicrosoftClarity() {
  useEffect(() => {
    if (!CLARITY_PROJECT_ID) return;

    // Script de Microsoft Clarity
    const script = document.createElement('script');
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
    `;
    document.head.appendChild(script);

    return () => {
      // Cleanup al desmontar
      const scripts = document.querySelectorAll('script[src*="clarity.ms"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return null;
}

// Funciones de tracking simplificadas - usar directamente window.clarity en los componentes 