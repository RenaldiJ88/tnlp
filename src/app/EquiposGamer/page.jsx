// pages/EquiposGamer/page.jsx
import React from 'react';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import dynamic from 'next/dynamic';

const DetailGamer = dynamic(() => import('@/components/DetailGamer'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const EquiposGamer = () => {

    return (
        <div className='bg-black'>
            <Navbar />
            <DetailGamer /> 
            <WhatsAppButton />
            <Footer />
        </div>
    );
}

export default EquiposGamer;