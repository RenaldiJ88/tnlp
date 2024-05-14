import React from 'react';
import Modelos from '../components/Modelos';
import Marcas from '../components/Marcas';
import Map from '../components/Map';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
        <titulo>ASD</titulo>
          <Marcas />
          <Modelos />
          <Map />
          <Footer />
    </main>
  );
}
