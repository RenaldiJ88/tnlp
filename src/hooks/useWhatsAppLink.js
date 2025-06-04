// hooks/useWhatsAppLink.js
import { useCallback } from 'react';

const useWhatsAppLink = (productTitle, productPrice) => {
    const generateWhatsAppLink = useCallback(() => {
        const phoneNumber = '5492216767615'; // Tu número de WhatsApp
        const message = `¡Hola! Me interesa el producto: ${productTitle} - ${productPrice}. Por favor, dame más información.`;
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    }, [productTitle, productPrice]);

    return generateWhatsAppLink;
};

export default useWhatsAppLink;