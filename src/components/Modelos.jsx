'use client'
import React from 'react';
import Image from "next/image";
import Ticker from 'framer-motion-ticker';

const image1 = '/img/tickers/modelos/alienware-ticker-2.png';
const image2 = '/img/tickers/modelos/rog-strix-ticker-2.png';
const image3 = '/img/tickers/modelos/nitro-ticker.png';
const image4 = '/img/tickers/modelos/omen-ticker-3.png';
const image5 = '/img/tickers/modelos/ideapad-ticker.png';
const image6 = '/img/tickers/modelos/katana-ticker.png';
const image7 = '/img/tickers/modelos/tuf-ticker.png';

function Modelos() {
    const images = [ image1, image2, image3, image4, image5, image6, image7 ];
    return (
        <div className='bg-black-tnlp'>
            <Ticker duration={35} direction={1} className='flex my-auto'>
                {images.map((item, index) => (
                    <div key={index} className="w-36 md:w-52 mx-5 pb-4 my-auto">
                        <Image
                            src={item}
                            alt={`Image ${index}`}
                            width={125}
                            height={125}
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