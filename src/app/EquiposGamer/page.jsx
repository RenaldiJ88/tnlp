"use client"
import React from 'react'
import Navbar from '@/components/Navbar'
import DetailGamer from '@/components/DetailGamer'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const EquiposGamer = () => {

    return (
        <div className='bg-black'>
            <div className="absolute left-2/4 z-10 w-full -translate-x-2/4">
                <Navbar/>
            </div>
            <DetailGamer />
            <WhatsAppButton />
            <Footer />
        </div>
    );
}

export default EquiposGamer