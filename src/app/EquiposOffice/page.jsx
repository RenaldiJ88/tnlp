// pages/EquiposOffice/page.jsx (o como sea el archivo de tu vista)
import React from 'react';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import dynamic from 'next/dynamic';

const Office = dynamic(() => import('../../components/Office'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

const EquiposOffice = () => {

    return (
        <div className='bg-black'>
            <Navbar />
            <Office />
            <WhatsAppButton />
            <Footer />
        </div>
    );
}

export default EquiposOffice;