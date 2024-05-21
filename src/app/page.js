import React from 'react';
import Productos from '../components/Productos';
import Modelos from '../components/Modelos';
import Marcas from '../components/Marcas';
import Map from '../components/Map';
import Footer from '../components/Footer';


export default function Home() {
  return (
    <main>
        <titulo>ASD</titulo>
          <Productos />
          <Marcas />
          <Modelos />
          <Map />
          <Footer />
    </main>
  );
}
