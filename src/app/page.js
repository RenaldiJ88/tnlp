import React from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import Servicios from '../components/Servicios';
import Productos from '../components/Productos';
import Modelos from '../components/Modelos';
import Marcas from '../components/Marcas';
import QuienesSomos from '../components/QuienesSomos';
import Faq from '../components/Faq.jsx';
import PorqueEleginos from '../components/PorqueEleginos'
import Map from '../components/Map';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <div className="bg-black-tnlp">
      <div className="absolute left-2/4 z-10 w-full -translate-x-2/4">
        <Navbar/>
      </div>
          <Home />
          <Servicios />
          <Marcas />
          <Productos />
          <Modelos />
          <QuienesSomos />
          <Faq/>
          <Map />
          <WhatsAppButton /> 
          <Footer />
    </div>
  );
}
