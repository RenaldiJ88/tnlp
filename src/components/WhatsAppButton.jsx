"use client";

import React from 'react';
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
    const phoneNumber = "+542216767615"; // Reemplaza con tu número de teléfono

    const handleWhatsAppClick = () => {
        // Analytics tracking
        if (typeof window !== 'undefined') {
            // Google Analytics
            if (window.gtag) {
                window.gtag('event', 'whatsapp_click', {
                    product_name: 'Floating Button',
                    event_category: 'engagement',
                    event_label: 'WhatsApp Contact'
                });
            }
            
            // Microsoft Clarity
            if (window.clarity) {
                window.clarity('event', 'whatsapp_click', { location: 'floating_button' });
            }
        }
    };

    return (
        <a
            href={`https://wa.me/${phoneNumber}`}
            className="fixed md:bottom-8 md:right-8 bottom-5 right-5 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
        >
            <FaWhatsapp className='w-1/2 h-1/2'/>
        </a>
    );
};

export default WhatsAppButton;