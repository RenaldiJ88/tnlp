import React from 'react';
import Productos from '../components/Productos';
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
          <Productos />
          <Modelos />
          <QuienesSomos />
          <Map />
          <Footer />
    </main>
  );
}
