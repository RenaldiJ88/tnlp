"use client"
import React from 'react'
import Navbar from '@/components/Navbar'
import DetailGamer from '@/components/DetailGamer'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

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

export default EquiposGamer