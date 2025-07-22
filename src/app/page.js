import React from 'react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../components/Home'), {
  preload: 'viewport',
});
const Servicios = dynamic(() => import('../components/Servicios'), { ssr: false });
const Marcas = dynamic(() => import('../components/Marcas'), { ssr: false });
const Productos = dynamic(() => import('../components/Productos'), { ssr: false });
const Modelos = dynamic(() => import('../components/Modelos'), { ssr: false });
const QuienesSomos = dynamic(() => import('../components/QuienesSomos'), { ssr: false });
const Faq = dynamic(() => import('../components/Faq'), { ssr: false });
const Map = dynamic(() => import('../components/Map'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

export default function Page() {
  return (
    <div className="bg-black-tnlp">
      <Navbar />
      <Home />
      <Servicios />
      <Marcas />
      <Productos />
      <Modelos />
      <QuienesSomos />
      <Faq />
      <Map />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}