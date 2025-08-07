'use client'
import React from 'react';
import Image from "next/image";
import Ticker from 'framer-motion-ticker';

const image1 = '/img/tickers/marcas/Asus Celeste.png';
const image2 = '/img/tickers/marcas/Dell Celeste.png';
const image3 = '/img/tickers/marcas/Acer Blanco.png';
const image4 = '/img/tickers/marcas/MSI.png';
const image5 = '/img/tickers/marcas/HP Celeste.png';
const image6 = '/img/tickers/marcas/Lenovo Blanco.png';




function Marcas() {
    const images = [ image1, image2, image3, image4, image5, image6 ];
    return (
        <div className='bg-black-tnlp' id="Marcas">
            <Ticker duration={30} direction={-1} className='flex '>
                {images.map((item, index) => (
                    <div key={index} className="w-20 md:w-36 mx-10 pt-4 my-auto">
                        <Image
                            src={item}
                            alt={`Marca ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-auto object-contain"
                            sizes="(max-width: 768px) 100vw, 150px"
                            quality={70}
                            loading="lazy"
                        />
                    </div>

                ))}
            </Ticker>
        </div>
    );
}
export default Marcas;