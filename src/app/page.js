import React from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import Modelos from '../components/Modelos';
import Marcas from '../components/Marcas';
import Map from '../components/Map';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <div>
      <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
        <Navbar/>
      </div>
          <Home />
          <Marcas />
          <Modelos />
          <Map />
          <Footer />
    </div>
  );
}
