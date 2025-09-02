"use client"; 

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWhatsAppLink } from "../hooks/whatsappUtils"; 

const ProductCard = ({ id, title, image, description, price, isOffer = false, categoria, en_stock = true }) => {
    const whatsAppLink = getWhatsAppLink(title, price);


    const handleProductClick = () => {
        if (typeof window !== 'undefined') {

            if (window.gtag) {
                window.gtag('event', 'view_item', {
                    item_name: title,
                    item_category: isOffer ? 'Offer Products' : 'Products',
                    value: parseFloat(price.replace(/[^0-9.-]/g, '')) || 0,
                    currency: 'ARS'
                });
            }
            

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


            {/* Badges de oferta y stock */}
            <div className="absolute top-2 right-2 z-10 space-y-1">
                {isOffer && (
                    <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        OFERTA
                    </div>
                )}
                {en_stock === false && (
                    <div className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        SIN STOCK
                    </div>
                )}
            </div>

            <div className="text-center mb-3"> 
                <h3 className="font-orbitron text-white text-lg font-bold">
                    {title}
                </h3>
            </div>

            <div className="relative w-full h-40 mb-3 flex-shrink-0">
                <Image
                    src={`https://res.cloudinary.com/dkj7padnu/image/upload/f_auto,q_60,w_400,h_300,c_fit/tnlp/${isOffer ? 'products-offer' : 'products'}/${image.replace('img/products/', '').replace('img/products/office/', 'office/').replace('img/products-offer/', '')}`}
                    alt={title}
                    fill
                    sizes="(max-width: 480px) 250px, (max-width: 768px) 320px, (max-width: 1200px) 380px, 340px"
                    className="rounded-md object-contain"
                    quality={60}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AThI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                href={`/productos/${id}`}
                className="mt-4 px-6 py-2 bg-[#dd40d5] text-white font-bold rounded-full hover:bg-white hover:text-[#dd40d5] transition-all duration-300 ease-in-out flex items-center justify-center space-x-2"
                onClick={(e) => {
                    e.stopPropagation();
                    if (typeof window !== 'undefined') {

                        if (window.gtag) {
                            window.gtag('event', 'view_item', {
                                item_id: id,
                                item_name: title,
                                item_category: categoria || (isOffer ? 'Offer Products' : 'Products'),
                                value: parseFloat(price.replace(/[^0-9.-]/g, '')) || 0,
                                currency: 'USD',
                                event_category: 'ecommerce',
                                event_label: 'Product Detail View'
                            });
                        }
                        
            
                        if (window.clarity) {
                            window.clarity('event', 'product_detail_view', { 
                                product_id: id,
                                product: title, 
                                price: price,
                                is_offer: isOffer,
                                source: 'product_card'
                            });
                        }
                    }
                }}
            >
                <span>👁️</span>
                <span>Ver más</span>
            </Link>
        </div>
    );
};

export default ProductCard;