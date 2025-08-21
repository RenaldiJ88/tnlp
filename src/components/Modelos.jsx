'use client'
import React from 'react';
import Image from "next/image";
import Ticker from 'framer-motion-ticker';

const image1 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800824/tnlp/tickers/modelos/alienware-ticker-2.png';
const image2 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800903/tnlp/tickers/modelos/rog-strix-ticker-2.png';
const image3 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800895/tnlp/tickers/modelos/nitro-ticker.png';
const image4 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800898/tnlp/tickers/modelos/omen-ticker-3.png';
const image5 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800829/tnlp/tickers/modelos/ideapad-ticker.png';
const image6 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800853/tnlp/tickers/modelos/katana-ticker.png';
const image7 = 'https://res.cloudinary.com/dkj7padnu/image/upload/v1755800929/tnlp/tickers/modelos/tuf-ticker.png';

function Modelos() {
    const images = [ image1, image2, image3, image4, image5, image6, image7 ];
    return (
        <div className='bg-black-tnlp'>
            <Ticker duration={35} direction={1} className='flex my-auto'>
                {images.map((item, index) => (
                    <div key={index} className="w-36 md:w-52 mx-5 pb-4 my-auto">
                        <Image
                            src={item}
                            alt={`Modelo ${index + 1}`}
                            width={200}
                            height={125}
                            className="w-full h-auto object-contain"
                            sizes="(max-width: 480px) 150px, (max-width: 768px) 180px, 200px"
                            quality={70}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                    </div>

                ))}
            </Ticker>
        </div>
    );
}
export default Modelos;