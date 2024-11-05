"use client"
import ProductCard from './ProductCard';
import data from '../data/products-offer.json';
import { useState, useEffect } from 'react';
import { swiffyslider } from 'swiffy-slider';
import "swiffy-slider/css";

const Productos = () => {
    const productosData = data.productosOffer;
    const [itemShowClass, setItemShowClass] = useState("slider-item-show3");

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 720) {
                setItemShowClass("slider-item-show3");
            } else if (screenWidth >= 990 && screenWidth < 1280) {
                setItemShowClass("slider-item-show3");
            } else if (screenWidth >= 1024 && screenWidth < 1920) {
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

    return (
        <>
            <section  className='flex flex-col justify-center bg-gradient-to-b from-black-tnlp via-[#cfcfcfbb] to-black-tnlp'>
                <div id="productos">
                    <h2 className="text-white uppercase font-bold text-[40px] xl:text-[42px] text-center pt-14 font-orbitron">Productos</h2>
                </div>
                <div className={`swiffy-slider ${itemShowClass}
                                slider-nav-round 
                                slider-nav-dark
                                slider-nav-autohide
                                slider-item-nogap 
                                slider-indicators-round  
                                slider-nav-animation
                                `}>
                    <ul className="slider-container">
                        {productosData.map((products, index) => (
                            <li className="slide-visible ">
                                <div key={index} className='my-12 flex justify-center'>
                                    <ProductCard
                                        title={products.title}
                                        image={products.image}
                                        description={products.description}
                                        price={products.price}
                                    />
                                </div>
                            </li>
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
                    </div>
                </div>
            </section >

        </>
    )
}

export default Productos