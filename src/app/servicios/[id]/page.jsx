"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import WhatsAppButton from '../../../components/WhatsAppButton';
import servicesData from '../../../data/services.json';

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const serviceId = parseInt(params.id);
  
  // Buscar el servicio por ID
  const service = servicesData.servicios.find(s => s.id === serviceId);
  
  if (!service) {
    return (
      <div className="bg-black-tnlp">
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Servicio no encontrado</h1>
            <Link href="/#Servicios" className="text-[#dd40d5] hover:underline">
              Volver a servicios
            </Link>
          </div>
        </div>
        <WhatsAppButton />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black-tnlp">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header con imagen grande */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image 
          src={`/${service.imgService}`}
          alt={service.categoria}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white text-center font-orbitron"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {service.categoria}
          </motion.h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Descripción del servicio */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#dd40d5] mb-6 font-orbitron">
              Descripción del Servicio
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed font-roboto text-justify">
              {service.descripcion}
            </p>
          </div>

          {/* Sección de características o beneficios */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 font-orbitron">
              ¿Por qué elegir este servicio?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-[#dd40d5] font-semibold mb-2">• Profesionalismo</h4>
                <p className="text-gray-300 text-sm">Técnicos especializados con años de experiencia</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-[#dd40d5] font-semibold mb-2">• Calidad garantizada</h4>
                <p className="text-gray-300 text-sm">Trabajamos con los mejores estándares de calidad</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-[#dd40d5] font-semibold mb-2">• Precios competitivos</h4>
                <p className="text-gray-300 text-sm">Ofrecemos los mejores precios del mercado</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-[#dd40d5] font-semibold mb-2">• Atención personalizada</h4>
                <p className="text-gray-300 text-sm">Cada cliente recibe un trato personalizado</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="https://wa.me/5492216767615"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#dd40d5] hover:bg-[#b8359f] text-black font-bold py-3 px-8 rounded-lg transition-colors duration-300 font-orbitron uppercase tracking-wider"
            >
              Consultar por WhatsApp
            </Link>
            <button 
              onClick={() => {
                // Forzar navegación completa para cargar todas las imágenes
                window.location.href = '/#Servicios';
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 font-orbitron uppercase tracking-wider"
            >
              Ver todos los servicios
            </button>
          </div>
        </motion.div>
      </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default ServiceDetailPage; 