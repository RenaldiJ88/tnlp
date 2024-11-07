"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import data from '../data/products.json';

const DetailGamer = () => {
    const productosData = data.productos;
    const imageURL = "img/carrousel-equipos/portada_gamer_desktop.png";
    const imageURLTablet = "img/carrousel-equipos/portada_gamer_tablet.png";
    const imageURLMobile = "img/carrousel-equipos/portada_gamer_celu.png";
    const [backgroundImage, setBackgroundImage] = useState(imageURL);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 767) {
                setBackgroundImage(imageURLMobile);
            } else if (window.innerWidth <= 1023) {
                setBackgroundImage(imageURLTablet);
            } else {
                setBackgroundImage(imageURL);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [imageURL, imageURLMobile, imageURLTablet]);
    return (
        <div>
            <section className=' '>
            <div id="home" className='relative flex flex-col h-screen items-center justify-end pt-16 pb-10 md:pb-12'>
                    
                    <div className="absolute top-0 h-full w-full bg-cover bg-center flex items-center flex-col p-5" style={{ backgroundImage: `url(${backgroundImage})` }}>

                    <h2 className=" text-white text-center uppercase font-bold text-[27px] pt-28 lg:pt-20 xl:pt-24 2xl:pt-40 md:text-4xl font-orbitron">Equipos Gamer y Design</h2>
                    </div>
                
                </div>
            </section>
            <section className='flex flex-col justify-center bg-gradient-to-b from-black-tnlp via-[#cfcfcfbb] to-black-tnlp'>

                <div className=''>
                    <ul className="flex flex-wrap justify-center px-10">
                        {productosData.map((product, index) => {
                            // Filtrar los productos por categoría "gamer" o "design"
                            if (product.categoria === '2' || product.categoria === '3') {
                                return (
                                    <li key={index} className="px-5">
                                        <div className='w-80 m-12 flex '>
                                            <ProductCard
                                                title={product.title}
                                                image={product.image}
                                                description={product.description}
                                                price={product.price}
                                            />
                                        </div>
                                    </li>
                                );
                            } else {
                                return null; // No renderizar el producto si no cumple con la categoría deseada
                            }
                        })}
                    </ul>
                </div>
            </section>
        </div>
    );
}
export default DetailGamer