"use client"
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { swiffyslider } from 'swiffy-slider';
import "swiffy-slider/css";
import { motion } from "framer-motion";

const Productos = () => {
    const [productosData, setProductosData] = useState([]);
    const [itemShowClass, setItemShowClass] = useState("slider-item-show3");


    useEffect(() => {
        const loadOfferProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('is_offer', 1)
                    .order('id', { ascending: true });
                
                if (error) {
                    console.error('Error loading offer products:', error);
                    setProductosData([]);
                } else {
                    const mappedProducts = data.map(product => ({
                        ...product,
                        isOffer: product.is_offer,
                        lastModified: product.last_modified
                    }));
                    setProductosData(mappedProducts);
                }
            } catch (error) {
                console.error('Error loading offer products:', error);
                setProductosData([]);
            }
        };

        loadOfferProducts();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 720) {
                setItemShowClass("slider-item-show1");
            } else if (screenWidth >= 990 && screenWidth < 1280) {
                setItemShowClass("slider-item-show2");
            } else if (screenWidth >= 1289) {
                setItemShowClass("slider-item-show4");
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.swiffyslider = swiffyslider;
            window.swiffyslider.init()
        }
    }, []);

    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const containerCardsVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <>
            <section  className='flex flex-col justify-center bg-gradient-to-b from-black-tnlp via-[#cfcfcfbb] to-black-tnlp'>
                <div id="productos">
                    <motion.h2 
                        className="text-white uppercase font-bold text-[40px] xl:text-[42px] text-center pt-10 font-orbitron"
                        variants={titleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        Productos
                    </motion.h2>
                </div>
                
                <motion.div 
                    className={`swiffy-slider ${itemShowClass} slider-nav-round slider-nav-dark slider-nav-autohide slider-item-nogap slider-indicators-round slider-nav-animation`}
                    variants={containerCardsVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <ul className="slider-container">
                        {productosData.map((products) => (
                            <motion.li 
                                key={products.id} 
                                className="slide-visible"
                                variants={itemCardVariants}
                            >
                                <div  className='my-12 flex justify-center'>
                                    <ProductCard
                                        id={products.id}
                                        title={products.title}
                                        image={products.image}
                                        description={products.description}
                                        price={products.price}
                                        isOffer={products.isOffer === 1}
                                        categoria={products.categoria}
                                    />
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                    <button type="button" className="slider-nav" aria-label="Go left"></button>
                    <button type="button" className="slider-nav slider-nav-next" aria-label="Go left"></button>

                    <div className="slider-indicators !static mt-2">
                        <button className="active" aria-label="Go to slide"></button>
                        <button aria-label="Go to slide"></button>
                        <button aria-label="Go to slide"></button>
                        <button aria-label="Go to slide"></button>
                        <button aria-label="Go to slide"></button>
                        <button aria-label="Go to slide"></button>
                        <button aria-label="Go to slide"></button>
                        <button aria-label="Go to slide"></button>
                    </div>
                </motion.div>
            </section >
        </>
    )
}

export default Productos