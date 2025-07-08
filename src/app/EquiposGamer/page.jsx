// pages/EquiposGamer/page.jsx
import React from 'react';
import Navbar from '@/components/Navbar';
import DetailGamer from '@/components/DetailGamer';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const EquiposGamer = () => {

    return (
        <div className='bg-black'>
            {/* CAMBIO CLAVE AQUÍ: Navbar ahora es fixed, z-50, w-full, bg-transparent, y AHORA CON H-20 */}
            <nav className="top-0 left-0 z-50 w-full bg-transparent h-20 absolute"> {/* AÑADIDO h-20 */}
                <Navbar />
            </nav>
            {/* El mt-20 empuja DetailGamer por debajo del Navbar fixed */}
            <DetailGamer className="mt-20" /> 
            <WhatsAppButton />
            <Footer />
        </div>
    );
}

export default EquiposGamer;