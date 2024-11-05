"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import data from '../data/products.json';

const Office = () => {
    const productosData = data.productos;
    const imageURL = "img/carrousel-equipos/office-desk.png";
    const imageURLTablet = "img/carrousel-equipos/office-tab.png";
    const imageURLMobile = "img/carrousel-equipos/office-cel.png";
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

                <div
                    id="home"
                    className="h-screen md:h-[860px] bg-cover bg-center flex items-center flex-col p-5 w-auto "
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                >
                    <h2 className="text-white uppercase font-bold text-[27px] md:text-4xl pt-10 mx-auto font-orbitron">Equipos Office</h2>
                </div>
            </section>
            <section className='flex flex-col justify-center bg-gradient-to-b from-black-tnlp via-[#cfcfcfbb] to-black-tnlp'>

                <div className=''>
                    <ul className="flex flex-wrap justify-center px-10">
                        {productosData.map((product, index) => {
                            // Filtrar los productos por categoría "gamer" o "design"
                            if (product.categoria === '1') {
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
export default Office