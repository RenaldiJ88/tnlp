import ProductCard from './ProductCard';
import data from '../data/products.json';
import { useState, useEffect } from 'react';
import { SwiffySlider } from 'swiffy-slider';
import "swiffy-slider/css";

const Productos = () => {
    const productosData = data.productos;
    const [itemShowClass, setItemShowClass] = useState("slider-item-show4");

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 990) {
                setItemShowClass("slider-item-show2");
            } else if (screenWidth >= 990 && screenWidth < 1280) {
                setItemShowClass("slider-item-show2");
            } else if (screenWidth >= 1024 && screenWidth < 1920) {
                setItemShowClass("slider-item-show3");
            } else {
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
            <section>
                <div>
                    <h2 className="text-black uppercase font-bold text-3xl text-center">Productos</h2>
                </div>
                <div className={`swiffy-slider ${itemShowClass} slider-nav-round slider-nav-visible slider-indicators-outside slider-indicators-round slider-indicators-dark slider-nav-animation slider-nav-animation-fadein slider-item-first-visible`}>
        <ul className="slider-container py-4">
          {productosData.map((products, index) => (
            <div key={index}>
              <li className="slide-visible">
                <ProductCard
                  categoria={products.title}
                  imgService={products.imgProduct}
                  descripcion={products.description}
                  precio={products.price} 
                />
              </li>
            </div>
          ))}
        </ul>
        <button type="button" className="slider-nav" aria-label="Go left"></button>
        <button type="button" className="slider-nav slider-nav-next" aria-label="Go left"></button>
        <div className="slider-indicators !static mt-5">
          <button className="active" aria-label="Go to slide"></button>
          <button aria-label="Go to slide"></button>
          <button aria-label="Go to slide"></button>
          <button aria-label="Go to slide"></button>
          <button aria-label="Go to slide"></button>
        </div>
      </div>
            </section>

        </>
    )
}

export default Productos