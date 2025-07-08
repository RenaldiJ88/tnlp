// pages/EquiposOffice/page.jsx (o como sea el archivo de tu vista)
import React from 'react';
import Navbar from '@/components/Navbar';
import Office from '@/components/Office';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const EquiposOffice = () => {

    return (
        <div className='bg-black'>
            {/* CAMBIO CLAVE AQUÍ: De 'absolute' a 'fixed' */}
            {/* El Navbar ahora estará fijo en la parte superior y siempre visible */}
            <nav className="top-0 left-0 z-50 w-full bg-transparent h-20 absolute"> {/* Cambiado de div con absolute a nav con fixed */}
                <Navbar />
            </nav>
            {/* El mt-20 empuja Office por debajo del Navbar fixed */}
            <Office className="mt-20" />
            <WhatsAppButton />
            <Footer />
        </div>
    );
}

export default EquiposOffice;