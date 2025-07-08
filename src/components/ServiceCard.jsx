"use client";

import React, { useState, useRef, useEffect } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; 

// Las itemVariants ya no se definen aquí, se definen en Servicios.jsx

const ServiceCard = ({ title, description, imgService }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null); 
  
  // Define la altura inicial cuando el texto está colapsado (ej. 80px para max-h-20)
  // Asegúrate que esta altura es suficiente para mostrar las primeras líneas del texto.
  const COLLAPSED_HEIGHT = 80; // Correspondiente a max-h-20 de Tailwind

  // Estado para guardar la altura real del contenido cuando está expandido
  const [fullContentHeight, setFullContentHeight] = useState(COLLAPSED_HEIGHT); // Inicializamos con la altura colapsada

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  // useEffect para medir la altura real del contenido expandido
  useEffect(() => {
    if (contentRef.current) {
      // Cuando isExpanded es true, capturamos la altura completa del scroll.
      // Cuando isExpanded es false, volvemos a la altura colapsada para la animación.
      setFullContentHeight(isExpanded ? contentRef.current.scrollHeight : COLLAPSED_HEIGHT);
    }
  }, [isExpanded, description]); // Ejecutar cuando isExpanded cambia o la descripción (si es dinámica)

  return (
    <motion.div 
        className="rounded-lg shadow-lg w-[350px] h-auto bg-gradient-to-b from-gray-200 to-gray-300 overflow-hidden 
                   transition-all duration-300 ease-in-out 
                   hover:scale-103 
                   hover:shadow-xl hover:shadow-[#dd40d5] 
                   cursor-pointer 
                  "
    >
      <div className="relative w-full h-[220px] mb-5">
        <Image src={`/${imgService}`} alt={title} width={350} height={240}/>
      </div>
      <div className="p-4">
        <h3 className="text-gray-900 text-xl font-bold uppercase font-orbitron pb-3 text-center">
          {title}
        </h3>
        
        {/* MODIFICACIÓN CLAVE AQUÍ: Usamos initial y animate con las alturas calculadas */}
        <motion.div
          className="overflow-hidden" // Mantener overflow-hidden aquí
          initial={{ height: COLLAPSED_HEIGHT }} // Inicia siempre con la altura colapsada
          animate={{ height: isExpanded ? fullContentHeight : COLLAPSED_HEIGHT }} // Anima entre fullContentHeight y COLLAPSED_HEIGHT
          transition={{ duration: 0.5, ease: "easeOut" }} // Duración y easing para la animación de altura
        >
          <p ref={contentRef} // Adjuntar la referencia al párrafo para medir su altura
             className={`text-gray-700 text-justify font-roboto font-semibold text-sm`} 
             // Eliminar cualquier clase de max-height/min-height de aquí, el motion.div controla la altura
          >
            {description}
          </p>
        </motion.div>

        <button onClick={toggleReadMore} className="text-[#dd40d5] text-sm mt-2 font-orbitron no-underline hover:underline">
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      </div>
      <div className="bg-black">
          <Link target="_blank" rel="noopener noreferrer" href={"https://wa.me/5492216767615"}>
        <div className="bg-[#dd40d5] hover:opacity-80 opacity-60 h-[50px] flex items-center justify-center">
            <p className="text-black font-bold uppercase tracking-wider font-orbitron">
              Consulta
            </p>
      </div>
          </Link>
        </div>
    </motion.div>
  );
};

export default ServiceCard;