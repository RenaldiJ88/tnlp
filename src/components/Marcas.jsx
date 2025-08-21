'use client'
import React from 'react';
import Image from "next/image";
import Ticker from 'framer-motion-ticker';

const image1 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800799/tnlp/tickers/marcas/Asus%20Celeste.png';
const image2 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800802/tnlp/tickers/marcas/Dell%20Celeste.png';
const image3 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800797/tnlp/tickers/marcas/Acer%20Blanco.png';
const image4 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800822/tnlp/tickers/marcas/MSI.png';
const image5 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800809/tnlp/tickers/marcas/HP%20Celeste.png';
const image6 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800817/tnlp/tickers/marcas/Lenovo%20Blanco.png';




function Marcas() {
    const images = [ image1, image2, image3, image4, image5, image6 ];
    return (
        <section className='bg-black-tnlp' id="Marcas" aria-label="Marcas">
            <Ticker duration={30} direction={-1} className='flex '>
                {images.map((item, index) => (
                    <div key={index} className="w-20 md:w-36 mx-10 pt-4 my-auto">
                        <Image
                            src={item}
                            alt={`Marca ${index + 1}`}
                            width={150}
                            height={100}
                            className="w-full h-auto object-contain"
                            sizes="(max-width: 480px) 80px, (max-width: 768px) 120px, 150px"
                            quality={70}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                    </div>

                ))}
            </Ticker>
        </section>
    );
}
export default Marcas;