import React from 'react';
import Modelos from '../components/Modelos';
import Marcas from '../components/Marcas';
import QuienesSomos from '../components/QuienesSomos';
import Map from '../components/Map';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
        <title>ASD</title>
          <Marcas />
          <Modelos />
          <QuienesSomos />
          <Map />
          <Footer />
    </main>
  );
}
