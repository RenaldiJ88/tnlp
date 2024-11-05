import React from 'react';
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
    const phoneNumber = "+542216767615"; // Reemplaza con tu número de teléfono

    return (
        <a
            href={`https://wa.me/${phoneNumber}`}
            className="fixed bottom-8 right-8 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
            target="_blank"
            rel="noopener noreferrer"
        >
            <FaWhatsapp className='w-1/2 h-1/2'/>
        </a>
    );
};

export default WhatsAppButton;