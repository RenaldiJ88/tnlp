"use client"; // Necesario para componentes interactivos de React en Next.js

import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';
import Image from 'next/image';
import { motion, useScroll, useTransform } from "framer-motion";

const Office = () => {
    const [productosData, setProductosData] = useState([]);
    const heroSectionRef = useRef(null);

    // Cargar productos office desde Supabase
    useEffect(() => {
        const loadOfficeProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('categoria', 'office')
                    .order('id', { ascending: true });
                
                if (error) {
                    console.error('Error loading office products:', error);
                    setProductosData([]);
                } else {
                    console.log('🔍 Office - Productos encontrados:', data.length);
                    console.log('🔍 Office - Datos crudos de Supabase:', data.slice(0, 3));
                    console.log('🔍 Office - Primeros 3 productos:', data.slice(0, 3).map(p => ({ id: p.id, title: p.title, categoria: p.categoria })));
                    
                    // Mapear campos de Supabase a formato esperado
                    const mappedProducts = data.map(product => ({
                        ...product,
                        isOffer: product.is_offer,
                        lastModified: product.last_modified
                    }));
                    console.log('🔍 Office - Productos mapeados:', mappedProducts.slice(0, 3));
                    setProductosData(mappedProducts);
                }
            } catch (error) {
                console.error('Error loading office products:', error);
                setProductosData([]);
            }
        };

        loadOfficeProducts();
    }, []);

    // Imágenes específicas para la cabecera de Equipos Office
    const backgroundImageURL = "/img/carrousel-equipos/bg-office.jpg"; // Fondo para Office
    const laptopOffice1 = "/img/carrousel-equipos/6.png"; // Laptop de oficina 1
    const laptopOffice2 = "/img/carrousel-equipos/7.png"; // Laptop de oficina 2
    // Asumo que los logos de AMD e Intel son los mismos que en la sección Gamer
    const amdLogo = "/img/carrousel-equipos/amd_logo.png";
    const intelLogo = "/img/carrousel-equipos/intel_logo.png";

    // --- VARIANTES DE ANIMACIÓN (LAS MISMAS QUE EN GAMER) ---
    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const laptopGroupVariants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.3 } }
    };

    const singleLaptopVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

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

    // --- PARALLAX PARA EL BACKGROUND ---
    const { scrollYProgress } = useScroll({
        target: heroSectionRef,
        offset: ["start end", "end start"]
    });

    const yBackgroundParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div>
            <section className=''>
                <div ref={heroSectionRef} className='relative flex flex-col md:h-screen items-center justify-end pt-16 pb-10 md:pb-12 overflow-hidden'> 
                    
                    {/* Background image con parallax */}
                    <motion.div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center" 
                        style={{ 
                            backgroundImage: `url(${backgroundImageURL})`, // Fondo específico de Office
                            y: yBackgroundParallax 
                        }}
                    />

                    {/* --- CONTENIDO DE LA CABECERA (título, laptops, logos) - REPLICADO DE DETAILGAMER.JSX --- */}
                    {/* El pt-24 es la compensación clave para el Navbar. */}
                    <div className="relative z-10  flex-col items-center justify-center w-full max-w-5xl pt-24"> 
                        {/* Título */}
                        <motion.h2 
                            className="text-white text-center uppercase font-bold text-[27px] md:text-4xl lg:text-5xl font-orbitron" 
                            variants={titleVariants} 
                            initial="hidden"
                            animate="visible" 
                        >
                            Equipos Office
                        </motion.h2>

                        {/* --- CONTENEDOR DE LOS GRUPOS LAPTOP + LOGO --- */}
                        <div className="flex flex-col sm:flex-row justify-center items-center w-full space-x-8 lg:space-x-16 gap-x-40"> 
                            {/* Grupo Laptop 1 (izquierda) + Logo AMD */}
                            <motion.div 
                                variants={laptopGroupVariants} 
                                initial="hidden" 
                                animate="visible" 
                                className="flex flex-col items-center w-[45%] max-w-[500px] sm:w-[40%] sm:max-w-[550px]" 
                            >
                                <motion.div variants={singleLaptopVariants}>
                                    {/* Imagen de laptop de Office 1 */}
                                    <Image 
                                      src={laptopOffice1} 
                                      width={550} 
                                      height={343} 
                                      alt="Office Laptop 1" 
                                      className="rounded-lg w-full h-auto" 
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                                      quality={80}
                                      loading="lazy"
                                    /> 
                                </motion.div>
                                <motion.div variants={singleLogoVariants} className=""> 
                                    <Image 
                                      src={amdLogo} 
                                      width={120} 
                                      height={120} 
                                      alt="AMD Logo" 
                                      className="w-auto h-auto" 
                                      sizes="120px"
                                      quality={85}
                                      loading="lazy"
                                    /> 
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
                                    {/* Imagen de laptop de Office 2 */}
                                    <Image 
                                      src={laptopOffice2} 
                                      width={550} 
                                      height={343} 
                                      alt="Office Laptop 2" 
                                      className="rounded-lg w-full h-auto" 
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                                      quality={80}
                                      loading="lazy"
                                    />
                                </motion.div>
                                <motion.div variants={singleLogoVariants} className=""> 
                                    <Image 
                                      src={intelLogo} 
                                      width={120} 
                                      height={120} 
                                      alt="Intel Logo" 
                                      className="w-auto h-auto" 
                                      sizes="120px"
                                      quality={85}
                                      loading="lazy"
                                    /> 
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de listado de productos */}
            <section className='flex flex-col justify-center bg-gradient-to-b from-black-tnlp via-[#cfcfcfbb] to-black-tnlp'>
                <motion.div 
                    variants={containerCardsVariants} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, amount: 0.05 }} 
                >
                    <ul className="flex flex-wrap justify-center px-10">
                        {console.log('🔍 Office - Renderizando productos:', productosData.length)}
                        {productosData.length === 0 ? (
                            <div className="text-white text-center py-10">
                                <p>No se encontraron productos office</p>
                                <p>Productos cargados: {productosData.length}</p>
                            </div>
                        ) : (
                            productosData.map((product, index) => {
                                console.log('🔍 Office - Renderizando producto:', index, product.title);
                                // Mostrar todos los productos ya que ya están filtrados por categoría office
                                return (
                                    <motion.li 
                                        key={product.id || index} 
                                        className="px-5"
                                        variants={itemCardVariants}
                                    >
                                        <div className='w-80 m-12 flex '>
                                            <ProductCard
                                                id={product.id}
                                                title={product.title}
                                                image={product.image}
                                                description={product.description}
                                                price={product.price}
                                                isOffer={product.isOffer === 1}
                                                categoria={product.categoria}
                                            />
                                        </div>
                                    </motion.li>
                                );
                            })
                        )}
                    </ul>
                </motion.div>
            </section>
        </div>
    );
}

export default Office;