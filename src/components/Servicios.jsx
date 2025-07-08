"use client";

import React from "react";
import ServiceCard from './ServiceCard';
import data from '../data/services.json';
import { motion } from "framer-motion";

const Servicios = () => {
  const serviciosData = data.servicios;    

  // Variantes para el título "SERVICIOS"
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Variantes para el contenedor de las ServiceCard (para escalonar la aparición)
  const containerCardsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // Cada ServiceCard aparecerá con un retraso de 0.2s
      }
    }
  };

  // ¡¡¡AHORA DEFINIMOS itemVariants AQUÍ EN Servicios.jsx!!!
  const itemVariants = {
    hidden: { opacity: 0, y: 50 }, // Inicia invisible y 50px hacia abajo
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } // Termina visible y en su posición original
  };

  return (
    <div className="bg-cover bg-center h-auto xl:h-full" style={{backgroundColor:'#1A1A1A'}}>
      <div id="Servicios" className="container py-5 mx-auto">
        <motion.p 
          className="mx-auto mb-10 font-bold text-center text-[40px] xl:text-[42px] text-white font-orbitron"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          SERVICIOS
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center w-full"
          variants={containerCardsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {serviciosData.map((servicio, index) => (
            <motion.div 
              key={index} 
              className="my-5 md:mx-10"
              variants={itemVariants} // Ahora itemVariants está definida aquí
            >
              <ServiceCard             
                title={servicio.categoria}
                description={servicio.descripcion}
                imgService={servicio.imgService}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Servicios;