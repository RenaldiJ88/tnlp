import React from 'react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../components/Home'), {
  loading: () => <div className="min-h-screen bg-black-tnlp" />,
});
const Servicios = dynamic(() => import('../components/Servicios'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-black-tnlp" />
});
const Marcas = dynamic(() => import('../components/Marcas'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-black-tnlp" />
});
const Productos = dynamic(() => import('../components/Productos'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-black-tnlp" />
});
const Modelos = dynamic(() => import('../components/Modelos'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-black-tnlp" />
});
const QuienesSomos = dynamic(() => import('../components/QuienesSomos'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-black-tnlp" />
});
const Faq = dynamic(() => import('../components/Faq'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-black-tnlp" />
});
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-black-tnlp" />
});
const Footer = dynamic(() => import('../components/Footer'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-black-tnlp" />
});

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