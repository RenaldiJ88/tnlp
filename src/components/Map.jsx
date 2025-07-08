"use client"; // Necesario para componentes interactivos de React en Next.js

import React from 'react';
import { motion } from "framer-motion"; // <-- Importamos motion

const Map = () => {

    // --- VARIANTES DE ANIMACIÓN ---
    // Variantes para el iframe del mapa
    const mapVariants = {
        hidden: { opacity: 0, x: -50 }, // Inicia invisible y 50px a la izquierda
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } // Termina visible en su posición
    };

    // Variantes para el input y botón del formulario de suscripción
    const formVariants = {
        hidden: { opacity: 0, x: 50 }, // Inicia invisible y 50px a la derecha
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.3 } } // Pequeño retraso
    };

    return (
        <div className='h-auto md:h-[278px] w-full bg-black-tnlp flex flex-col md:flex-row ' id='Map'>
            {/* Contenedor del mapa animado */}
            {/* CAMBIO: Añadimos max-w-lg y mx-auto para asegurar ancho máximo y centrado */}
            <motion.div 
                className='md:w-[50%] my-auto max-w-lg mx-auto' // <-- Añadido max-w-lg y mx-auto
                variants={mapVariants} // Aplicamos las variantes
                initial="hidden"          // Estado inicial
                whileInView="visible"     // Animar cuando esté en la vista
                viewport={{ once: true, amount: 0.5 }} // Se anima al 50% visible, una sola vez
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.783621305636!2d-57.969308923404824!3d-34.936963275175565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e87ecf8f4f17%3A0x140b90b52b9e37f!2sC.%2056%201621%2C%20B1900%20BLM%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1715637290242!5m2!1ses-419!2sar" // *** RECUERDA VERIFICAR Y ACTUALIZAR ESTA URL CON TU URL REAL DE EMBEBIDO DE GOOGLE MAPS ***
                    // CAMBIO: w-full para que el iframe ocupe todo el ancho de su contenedor (max-w-lg)
                    className='w-full h-[246px] rounded-3xl' // <-- Cambiado w-[82%] y mx-auto por w-full
                    loading='lazy'
                    referrerPolicy="no-referrer-when-downgrade"
                >
                </iframe>
            </motion.div>
            
            {/* Contenedor del formulario animado */}
            <motion.div 
                className='w-[82%] md:w-[50%] mx-auto my-auto py-10 md:py-0'
                variants={formVariants} // Aplicamos las variantes
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className='flex flex-row justify-center md:justify-start mr-4'>
                    <input type="text" className='h-8 mt-2 rounded-md w-[80%] md:w-[60%] md:ml-16 font-roboto' placeholder="Ingrese su mail para promociones" />
                    
                    {/* Botón "Enviar" - Unificado con el diseño de los otros botones */}
                    <button className="bg-[#FFFFFF] opacity-40 text-black font-bold py-2 px-4 lg:py-3 lg:px-9 lg:text-xl border-[#dd40d5] border-2 border-solid rounded-xl font-orbitron 
                                transition-all duration-300 ease-in-out 
                                hover:text-white hover:bg-transparent 
                                hover:scale-105 
                                hover:shadow-lg hover:shadow-[#dd40d5] 
                                w-40 text-center ml-5 "> 
                        Enviar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default Map