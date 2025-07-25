// ProductCard.jsx
"use client"; 

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWhatsAppLink } from "../hooks/whatsappUtils"; 

const ProductCard = ({ title, image, description, price }) => {
    const whatsAppLink = getWhatsAppLink(title, price); 

    return (
        <div className="relative border-2 border-solid border-[#dd40d5] rounded-xl flex flex-col justify-between items-center bg-[#1F1F1F]
                    w-full max-w-xs mx-auto p-3 
                    md:w-80 md:p-5 
                    hover:shadow-lg hover:shadow-[#dd40d5] transition-all duration-300 ease-in-out">

            <div className="text-center mb-3"> 
                <h3 className="font-orbitron text-white text-lg font-bold">
                    {title}
                </h3>
            </div>

            <div className="relative w-full h-40 mb-3 flex-shrink-0">
                <Image
                    src={`/${image}`} 
                    alt={title}
                    layout="fill" 
                    objectFit="contain" 
                    className="rounded-md"
                />
            </div>

            <div className="flex-grow flex flex-col justify-start mb-3 overflow-hidden">
                <p className="font-roboto text-sm text-center line-clamp-3 text-[#d6d6d6]">
                    {description}
                </p>
            </div>

            <div className="mt-auto">
                <p className="font-orbitron text-white text-xl font-bold">
                    ${price}
                </p>
            </div>

            <Link 
                href={whatsAppLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 px-6 py-2 bg-[#dd40d5] text-white font-bold rounded-full hover:bg-white hover:text-[#dd40d5] transition-all duration-300 ease-in-out"
            >
                Comprar
            </Link>
        </div>
    );
};

export default ProductCard;