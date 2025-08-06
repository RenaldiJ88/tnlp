// ProductCard.jsx
"use client"; 

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWhatsAppLink } from "../hooks/whatsappUtils"; 

const ProductCard = ({ title, image, description, price, isOffer = false }) => {
    const whatsAppLink = getWhatsAppLink(title, price);

    // Tracking para clicks en productos
    const handleProductClick = () => {
        if (typeof window !== 'undefined') {
            // Google Analytics
            if (window.gtag) {
                window.gtag('event', 'view_item', {
                    item_name: title,
                    item_category: isOffer ? 'Offer Products' : 'Products',
                    value: parseFloat(price.replace(/[^0-9.-]/g, '')) || 0,
                    currency: 'ARS'
                });
            }
            
            // Microsoft Clarity
            if (window.clarity) {
                window.clarity('event', 'product_view', { 
                    product: title, 
                    price: price,
                    is_offer: isOffer 
                });
            }
        }
    }; 

    return (
        <div 
            className="relative border-2 border-solid border-[#dd40d5] rounded-xl flex flex-col justify-between items-center bg-[#1F1F1F]
                    w-full max-w-xs mx-auto p-3 
                    md:w-80 md:p-5 
                    hover:shadow-lg hover:shadow-[#dd40d5] transition-all duration-300 ease-in-out cursor-pointer"
            onClick={handleProductClick}
        >

            {/* Etiqueta de oferta */}
            {isOffer && (
                <div className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    OFERTA
                </div>
            )}

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
                    {price}
                </p>
            </div>

            <Link 
                href={whatsAppLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 px-6 py-2 bg-[#dd40d5] text-white font-bold rounded-full hover:bg-white hover:text-[#dd40d5] transition-all duration-300 ease-in-out"
                onClick={(e) => {
                    e.stopPropagation(); // Evitar doble tracking del div padre
                    if (typeof window !== 'undefined') {
                        // Google Analytics - Evento de alta conversión
                        if (window.gtag) {
                            window.gtag('event', 'whatsapp_product_inquiry', {
                                item_name: title,
                                item_category: isOffer ? 'Offer Products' : 'Products',
                                value: parseFloat(price.replace(/[^0-9.-]/g, '')) || 0,
                                currency: 'ARS',
                                event_category: 'ecommerce',
                                event_label: 'Product Purchase Intent'
                            });
                        }
                        
                        // Microsoft Clarity
                        if (window.clarity) {
                            window.clarity('event', 'purchase_intent', { 
                                product: title, 
                                price: price,
                                is_offer: isOffer,
                                source: 'product_card'
                            });
                        }
                    }
                }}
            >
                Comprar
            </Link>
        </div>
    );
};

export default ProductCard;