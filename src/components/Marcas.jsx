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
        <div className='bg-black-tnlp'>
            <Ticker duration={15} direction={-1} className='flex '>
                {images.map((item, index) => (
                    <div key={index} className="w-20 md:w-36 mx-10 py-4 my-auto">
                        <Image
                            src={item}
                            alt={`Image ${index}`}
                            width={100}
                            height={100}
                            className=''
                            style={{
                                backgroundColor: item,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        />
                    </div>

                ))}
            </Ticker>
        </div>
    );
}
export default Marcas;