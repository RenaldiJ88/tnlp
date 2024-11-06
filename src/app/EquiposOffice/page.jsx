import React from 'react';
import Navbar from '@/components/Navbar'
import Office from '@/components/Office'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton';

const EquiposOffice = () => {

    return (
        <div className='bg-black'>
            <div className="absolute left-2/4 z-10 w-full -translate-x-2/4">
            <Navbar />
            </div>
            <Office />
            <WhatsAppButton />
            <Footer />
        </div>

    );X
}

export default EquiposOffice
