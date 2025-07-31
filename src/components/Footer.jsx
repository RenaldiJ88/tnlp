"use client"; // Necesario para componentes interactivos de React en Next.js

import React from 'react';
import Image from 'next/image';
import Link from "next/link"
import { FaInstagram, FaFacebookSquare, FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { PiMapPinPlusFill } from "react-icons/pi";
import { motion } from "framer-motion"; // <-- Importamos motion

// Componente SVG para Instagram (se mantiene igual)
const InstagramIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.272.058 2.166.29 2.913.588.763.305 1.38.72 1.996 1.337.617.616.992 1.216 1.336 1.995.29.747.508 1.64.566 2.912.057 1.266.07 1.646.07 4.85s-.013 3.584-.07 4.85c-.058 1.272-.29 2.166-.588 2.913-.305.763-.72 1.38-1.337 1.996-.616.617-1.216.992-1.995 1.336-.747.29-1.64.508-2.912.566-1.266.057-1.646.07-4.85.07s-3.204-.013-4.85-.07c-1.272-.058-2.166-.29-2.913-.588-.763-.305-1.38-.72-1.996-1.337C2.617 19.384 2.24 18.784 1.9 18.005c-.29-.747-.508-1.64-.566-2.912C1.276 13.826 1.263 13.446 1.263 10.15s.013-3.584.07-4.85c.058-1.272.29-2.166.588-2.913.305-.763.72-1.38 1.337-1.996.616-.617 1.216-.992 1.995-1.336.747-.29 1.64-.508 2.912-.566C8.416 2.175 8.796 2.163 12 2.163m0-1.001C8.73 1.162 8.303 1.175 7.035 1.233c-1.328.06-2.38.293-3.226.623-.87.337-1.622.807-2.322 1.508C.786 4.065.317 4.817.027 5.713c-.33 1.008-.563 2.06-.623 3.226C-0.65 10.203-.663 10.63-.663 12s.013 1.797.07 3.065c.06 1.328.293 2.38.623 3.226.337.87.807 1.622 1.508 2.322s1.452.97 2.322 1.26c1.008.33 2.06.563 3.226.623 1.268.057 1.695.07 4.963.07s3.695-.013 4.963-.07c1.328-.06 2.38-.293 3.226-.623.87-.337 1.622-.807 2.322-1.508s1.452-.97 2.322-1.26c1.008-.33 2.06-.563 3.226-.623C15.697 1.175 15.27 1.162 12 1.162z"/>
        <path d="M12 7.162c-2.663 0-4.838 2.175-4.838 4.838s2.175 4.838 4.838 4.838 4.838-2.175 4.838-4.838S14.663 7.162 12 7.162zm0 7.677c-1.56 0-2.838-1.278-2.838-2.838S10.44 9 12 9s2.838 1.278 2.838 2.838-1.278 2.838-2.838 2.838z"/>
        <circle cx="16.838" cy="7.162" r="1.15"/>
    </svg>
);

// Componente SVG para Facebook (se mantiene igual)
const FacebookIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
    </svg>
);

// Componente SVG para WhatsApp (se mantiene igual)
const WhatsAppIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2 22l5.25-1.38c1.41.79 3.02 1.22 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.88 13.38c-.27.53-1.35.94-1.85 1.03-.5.09-1.02.18-1.54.18-.52 0-1.35-.18-2.04-.46-.98-.36-2.04-.91-2.92-1.88s-1.52-1.94-1.88-2.92c-.27-.68-.46-1.52-.46-2.04s.09-.93.18-1.54c.09-.5.5-1.58 1.03-1.85.36-.27.78-.46 1.2-.46.42 0 .78.09 1.05.18.27.09.46.27.64.46.18.18.36.36.46.55.09.18.18.36.18.55v.18c0 .18-.09.36-.18.55l-.36.82c-.09.18-.18.36-.27.46-.09.09-.18.18-.36.18h-.18c-.09 0-.18-.09-.27-.18l-.36-.36c-.09-.09-.18-.18-.27-.18-.09 0-.18.09-.27.18l-.55.64c-.18.18-.36.36-.46.55-.09.18-.18.36-.18.55s.09.36.18.55l.55.64c.18.18.36.36.46.55.09.18.18.36.18.55s-.09.36-.18.55l-.36.82c-.09.18-.18.36-.27.46-.09.09-.18.18-.36.18h-.18c-.09 0-.18-.09-.27-.18l-.36-.36c-.09-.09-.18-.18-.27-.18-.09 0-.18.09-.27.18l-.55.64c-.18.18-.36.36-.46.55-.09.18-.18.36-.18.55s.09.36.18.55l.55.64c.18.18.36.36.46.55.09.18.18.36.18.55s-.09.36-.18.55l-.36.82c-.09.18-.18.36-.27.46-.09.09-.18.18-.36.18h-.18c-.09 0-.18-.09-.27-.18l-.36-.36c-.09-.09-.18-.18-.27-.18-.09 0-.18.09-.27.18l-.55.64c-.18.18-.36.36-.46.55-.09.18-.18.36-.18.55s.09.36.18.55z"/>
    </svg>
);

// Componente SVG para Email (se mantiene igual)
const MailIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
);

// Componente SVG para MapPin (se mantiene igual)
const MapPinIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);

// --- NUEVAS VARIANTES DE ANIMACIÓN ---
// Variantes para el contenedor principal (footer)
const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1 // Retraso entre la aparición de las columnas
        }
    }
};

// Variantes para cada columna individual
const columnVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Variantes para la sección de copyright
const copyrightVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } }
};


const Footer = () => {
    return (
        // El footer principal será el motion.footer que se anima al entrar en vista
        <motion.footer 
            className='bg-black-tnlp text-white w-full py-12 px-4 sm:px-6 lg:px-4'
            variants={footerVariants} // Aplicamos las variantes al footer
            initial="hidden"          // Estado inicial: oculto
            whileInView="visible"     // Animar a 'visible' cuando esté en la vista
            viewport={{ once: true, amount: 0.2 }} // Una vez y cuando el 20% del elemento esté visible
        >
            <div className='container '>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 '>

                    {/* Logo Section */}
                    <motion.div 
                        className="flex flex-col items-center md:items-center"
                        variants={columnVariants} // Aplica variantes de columna
                    >
                        <a href="/#home" className="mb-4">
                            <Image
                                src="/img/logotnlp.png" 
                                width={150}
                                height={150}
                                alt="Logo TuNotebookLaPlata"
                                className="h-auto"
                            />
                        </a>
                        <p className="text-lg text-gray-400 text-center ml-10">
                            Especialistas en notebooks y servicio técnico.
                        </p>
                    </motion.div>

                    {/* Navigation Links Section */}
                    <motion.div 
                        className="text-center md:text-center"
                        variants={columnVariants} // Aplica variantes de columna
                    >
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Navegación</h3>
                        <ul className="space-y-2">
                            <li><a href="/#Home" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Home</a></li>
                            <li><a href="/#Servicios" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Servicios</a></li>
                            <li><a href="/#Productos" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Productos</a></li>
                            <li><a href="/#Nosotros" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Nosotros</a></li>
                            <li><a href="/#Map" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">Contacto</a></li>
                        </ul>
                    </motion.div>

                    {/* Contact Info Section */}
                    <motion.div 
                        className="text-center md:text-center"
                        variants={columnVariants} // Aplica variantes de columna
                    >
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Contacto</h3>
                        <ul className="space-y-3 text-gray-300 ml-14">
                            <li className="flex items-center justify-center md:justify-start">
                                <MapPinIcon className="mr-3 text-xl text-blue-400 flex-shrink-0 w-5 h-5" />
                                <span>Calle 56 Nº 1621, La Plata, Buenos Aires</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                <WhatsAppIcon className="mr-3 text-xl text-blue-400 flex-shrink-0 w-5 h-5" />
                                <a href="tel:+542216767615" className="hover:text-blue-400 transition-colors duration-300">221 676 7615</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                <MailIcon className="mr-3 text-xl text-blue-400 flex-shrink-0 w-5 h-5" />
                                <a href="mailto:tunotebook@gmail.com" className="hover:text-blue-400 transition-colors duration-300">tunotebook@gmail.com</a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Social Media Section */}
                    <motion.div 
                        className="text-center "
                        variants={columnVariants} // Aplica variantes de columna
                    >
                        <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Seguínos</h3>
                        <div className='flex justify-center md:justify-center space-x-4'>
                            <a target='_blank' rel="noopener noreferrer" href={'https://www.instagram.com/tunotebooklp/'} aria-label="Instagram">
                                <InstagramIcon className="text-3xl text-gray-300 hover:text-pink-500 transition-colors duration-300 w-7 h-7" />
                            </a>
                            <a target='_blank' rel="noopener noreferrer" href={'https://www.facebook.com/notebooklp/'} aria-label="Facebook">
                                <FacebookIcon className="text-3xl text-gray-300 hover:text-blue-600 transition-colors duration-300 w-7 h-7" />
                            </a>
                            {/* Puedes añadir más iconos sociales aquí */}
                        </div>
                    </motion.div>
                </div>

                {/* Copyright Section */}
                <motion.div 
                    className="mt-10 pt-8 border-t border-gray-700 text-center text-sm text-gray-500"
                    variants={copyrightVariants} // Aplica variantes de copyright
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <p>&copy; {new Date().getFullYear()} TuNotebookLaPlata. Todos los derechos reservados.</p>
                    <p className="mt-1">Diseñado con <span role="img" aria-label="corazón">❤</span> por TNLP</p> 
                </motion.div>
            </div>
        </motion.footer>
    );
}
export default Footer;