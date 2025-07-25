export const getWhatsAppLink = (productName, price) => {
    const message = encodeURIComponent(
        `¡Hola! Estoy interesado en el producto "${productName}" que vi en la web. Su precio es de $${price}. ¿Podrían darme más información?`
    );
    return `https://wa.me/5492215235555?text=${message}`;
};
