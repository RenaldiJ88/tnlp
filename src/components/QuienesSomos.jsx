"use client"; // Necesario para componentes interactivos de React en Next.js

import React from 'react';
import Image from 'next/image';
import { motion } from "framer-motion"; // <-- Importamos motion

const QuienesSomos = () => {

    // --- VARIANTES DE ANIMACIÓN ---
    // Variantes para el título
    const titleVariants = {
        hidden: { opacity: 0, y: 50 }, // Inicia invisible y 50px hacia abajo
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } // Termina visible en su posición original
    };

    // Variantes para el bloque de texto (párrafo)
    const textBlockVariants = {
        hidden: { opacity: 0, y: 50 }, // Inicia invisible y 50px hacia abajo
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } } // Pequeño retraso
    };

    // Variantes para la imagen lateral
    const imageVariants = {
        hidden: { opacity: 0, x: 50 }, // Aparece desde la derecha (eje X)
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } } // Retraso mayor
    };

    // Variantes para el botón
    const buttonVariants = {
        hidden: { opacity: 0, y: 50 }, // Similar al texto
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.6 } } // Retraso para que aparezca después del texto
    };

    return (
        <>
            <div id='Nosotros' className="bg-black-tnlp text-white flex flex-col lg:flex-row">
                <div className="w-full flex flex-col justify-center pb-10 ">
                    {/* Título animado */}
                    <motion.h2 
                        className="font-bold text-4xl text-center my-8 font-orbitron"
                        variants={titleVariants} // Aplicamos las variantes
                        initial="hidden"          // Estado inicial
                        whileInView="visible"     // Animar cuando esté en la vista
                        viewport={{ once: true, amount: 0.5 }} // Se anima al 50% visible, una sola vez
                    >
                        ¿Que es Tu Notebook LP?
                    </motion.h2>

                    {/* Párrafo animado */}
                    <motion.p 
                        className="font-roboto text-pretty lg:text-xl mx-auto mb-10 lg:mb-5 max-w-[300px] md:max-w-[650px] text-center"
                        variants={textBlockVariants} // Aplicamos las variantes
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        Tu Notebook LP es mucho más que una tienda de tecnología: es una experiencia personalizada de principio a fin. 
                        <br/>Nos especializamos en la venta de notebooks seleccionadas de alta gama y en brindar un servicio técnico especializado con foco en el detalle, la calidad y la transparencia. Desde el primer contacto por WhatsApp, acompañamos al usuario con asesoramiento profesional para ayudarlo a elegir el equipo ideal según sus necesidades reales. Al entregar cada notebook —ya sea nueva o reparada— sumamos un manual de Buen Uso y Costumbres, pensado para prevenir problemas comunes y extender la vida útil del equipo.
                        Mantenemos un contacto cercano y postventa activo, ofreciendo soporte continuo, soluciones a medida y el respaldo técnico que solo una atención especializada y humana puede brindar. 
                        <br/>En Tu Notebook LP, creemos en hacer las cosas bien, con compromiso real y excelencia en cada etapa del proceso.</motion.p>
                    
                    {/* BOTÓN "Saber Más" - Diseño unificado con el botón "Comprar Ahora" */}
                    <motion.button 
                        className="bg-[#FFFFFF] opacity-40 text-black font-bold py-2 px-4 lg:py-3 lg:px-9 lg:text-xl border-[#dd40d5] border-2 border-solid rounded-xl font-orbitron 
                                   transition-all duration-300 ease-in-out // Transición suave para los efectos hover
                                   hover:text-white hover:bg-transparent // Efectos de hover de texto y fondo
                                   hover:scale-105 // Nuevo: Escala sutilmente al pasar el ratón (quitado hover:w/h)
                                   hover:shadow-lg hover:shadow-[#dd40d5] // Nuevo: Aumenta la sombra y le da un color
                                   mx-auto mt-3" // Mantener el centrado y margen superior
                        variants={buttonVariants} // Aplicamos las variantes de entrada del botón
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >Saber Más</motion.button>
                </div>
                
                {/* Contenedor de la imagen lateral animado */}
                <motion.div 
                    className="w-auto flex justify-center items-center mx-[15px] md:mr-32 my-10 rounded-sm "
                    variants={imageVariants} // Aplicamos las variantes
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <Image 
                        src="/img/quienes-somos/quienes-somos2.jpeg"
                        width={1024}
                        height={1500}
                        alt="Foto-QuienesSomos"
                        className='my-auto rounded-3xl'
                    />
                </motion.div>
            </div>
        </>
    )
}

export default QuienesSomos