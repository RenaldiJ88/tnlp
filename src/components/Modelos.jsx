'use client'
import React from 'react';
import Image from "next/image";
import Ticker from 'framer-motion-ticker';

const image1 = '/img/tickers/Modelos/alienware-ticker-2.png';
const image2 = '/img/tickers/Modelos/rog-strix-ticker-2.png';
const image3 = '/img/tickers/Modelos/nitro-ticker.png';
const image4 = '/img/tickers/Modelos/omen-ticker-3.png';
const image5 = '/img/tickers/Modelos/ideapad-ticker.png';
const image6 = '/img/tickers/Modelos/katana-ticker.png';
const image7 = '/img/tickers/Modelos/tuf-ticker.png';

function Modelos() {
    const images = [ image1, image2, image3, image4, image5, image6, image7 ];
    return (
        <div className='bg-black-tnlp '>
            <Ticker duration={15} direction={1} className='flex my-auto'>
                {images.map((item, index) => (
                    <div key={index} className="w-36 md:w-52 mx-5 py-4 my-auto">
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
export default Modelos;