"use client"; // Necesario para componentes interactivos de React en Next.js

import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import data from '../data/products-unified.json';
import Image from 'next/image';
import { motion, useScroll, useTransform } from "framer-motion";

const DetailGamer = () => {
    const productosData = data.productos;
    const heroSectionRef = useRef(null);

    const backgroundImageURL = "/img/carrousel-equipos/bg-gamer.png";

    // --- VARIANTES DE ANIMACIÓN ---
    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    // Variantes para los GRUPOS de Laptop + Logo
    const laptopGroupVariants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.3 } }
    };

    // Variantes para cada laptop individual dentro del grupo (opcional, para un stagger interno)
    const singleLaptopVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Variantes para cada logo individual dentro del grupo (opcional, para un stagger interno)
    const singleLogoVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", delay: 0.2 } }
    };

    const itemCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const containerCardsVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // --- PARALLAX SUTIL PARA EL BACKGROUND DE LA CABECERA ---
    const { scrollYProgress } = useScroll({
        target: heroSectionRef,
        offset: ["start end", "end start"]
    });

    const yBackgroundParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div>
            <section className=''>
                {/* --- CONTENEDOR PRINCIPAL DE LA CABECERA (COPIADO DE HOME.JSX) --- */}
                <div ref={heroSectionRef} className='relative flex flex-col md:h-screen items-center justify-end pt-16 pb-10 md:pb-12 overflow-hidden'> 
                    
                    {/* Background image con parallax */}
                    <motion.div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center" 
                        style={{ 
                            backgroundImage: `url(${backgroundImageURL})`,
                            y: yBackgroundParallax 
                        }}
                    />

                    
                    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl pt-24"> 
                        {/* Título */}
                        <motion.h2 
                            className="text-white text-center uppercase font-bold text-[27px] md:text-4xl lg:text-5xl font-orbitron" 
                            variants={titleVariants} 
                            initial="hidden"
                            animate="visible"
                        >
                            Equipos Gamer y Design
                        </motion.h2>

                        {/* --- CONTENEDOR DE LOS GRUPOS LAPTOP + LOGO (FLEX) --- */}
                        <div className="flex flex-col sm:flex-row justify-center items-center w-full space-x-8 lg:space-x-16 gap-x-40"> 
                            {/* Grupo Laptop 1 (izquierda) + Logo AMD */}
                            <motion.div 
                                variants={laptopGroupVariants} 
                                initial="hidden" 
                                animate="visible" 
                                className="flex flex-col items-center w-[45%] max-w-[500px] sm:w-[40%] sm:max-w-[550px]" 
                            >
                                <motion.div variants={singleLaptopVariants}>
                                    <Image src="/img/carrousel-equipos/4.png" width={550} height={343} alt="Gaming Laptop 1" className="rounded-lg" /> 
                                </motion.div>
                                {/* CAMBIO: ELIMINADO mb-24 */}
                                <motion.div variants={singleLogoVariants} className=""> 
                                    <Image src="/img/carrousel-equipos/amd_logo.png" width={150} height={150} alt="AMD Logo" className='' /> 
                                </motion.div>
                            </motion.div>

                            {/* Grupo Laptop 2 (derecha) + Logo Intel */}
                            <motion.div 
                                variants={laptopGroupVariants} 
                                initial="hidden" 
                                animate="visible" 
                                transition={{ delay: 0.5 }} 
                                className="flex flex-col items-center w-[45%] max-w-[500px] sm:w-[40%] sm:max-w-[550px]" 
                            >
                                <motion.div variants={singleLaptopVariants}>
                                    <Image src="/img/carrousel-equipos/5.png" width={550} height={343} alt="Gaming Laptop 2" className="rounded-lg" />
                                </motion.div>
                                
                                <motion.div variants={singleLogoVariants} className=""> 
                                    <Image src="/img/carrousel-equipos/intel_logo.png" width={130} height={130} alt="Intel Logo" className='mb-6' /> 
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='flex flex-col justify-center bg-gradient-to-b from-black-tnlp via-[#cfcfcfbb] to-black-tnlp'>
                <motion.div 
                    variants={containerCardsVariants} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, amount: 0.05 }} 
                >
                    <ul className="flex flex-wrap justify-center px-10">
                        {productosData.map((product, index) => {
                            if (product.categoria === '2' || product.categoria === '3') {
                                return (
                                                                    <motion.li 
                                    key={index} 
                                    className="px-5"
                                    variants={itemCardVariants}
                                >
                                    <div className='w-80 m-12 flex '>
                                        <ProductCard
                                            title={product.title}
                                            image={product.image}
                                            description={product.description}
                                            price={product.price}
                                            isOffer={product.isOffer === 1}
                                        />
                                    </div>
                                </motion.li>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ul>
                </motion.div>
            </section>
        </div>
    );
}

export default DetailGamer;