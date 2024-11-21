import React from 'react';
import Image from 'next/image';
import Link from "next/link"
import { FaInstagram, FaFacebookSquare, FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { PiMapPinPlusFill } from "react-icons/pi";

const Footer = () => {
    return (
        <>
            <div id="container" className='bg-black-tnlp h-30 text-white '>
                <div className='flex justify-between items-center ml-10'>
                    <div id="logo_footer" className="mr-4">
                        <Link href="#home">
                            <Image
                                src="/img/logotnlp.png"
                                width={150}
                                height={150}
                                alt="Logo-Footer"
                            />
                        </Link>
                    </div>
                    <div id="social_media_i" className="mx-auto hidden md:block my-10 pr-3 md:pr-10 text-sm md:text-md font-roboto items-center">
                            <ul>
                                <li><Link href="/#Home" className="text-white hover:border-b-2">Home</Link></li>
                                <li><Link href="/#Servicios" className="text-white hover:border-b-2">Servicios</Link></li>
                                <li><Link href="/#Servicios" className="text-white hover:border-b-2">Productos</Link></li>
                                <li><Link href="/#Nosotros" className="text-white hover:border-b-2">Nosotros</Link></li>
                                <li><Link href="/#Map" className="text-white hover:border-b-2">Contacto</Link></li>
                            </ul>
                    </div>
                    <div id="social_media_i" className="mx-auto my-10 pr-3 md:pr-10 text-sm md:text-md font-roboto">
                        <div className="flex items-center">
                            <PiMapPinPlusFill className="mr-2 text-blue-500 " />
                            <p>Bueno Aires, La Plata,  Calle 56 Nº 1621</p>
                        </div>
                        <div className="flex items-center">
                            <FaWhatsapp className="mr-2 text-blue-500" />
                            <p>221 676 7615</p>
                        </div>
                        <div className="flex items-center">
                            <IoMdMail className="mr-2 text-blue-500" />
                            <p>tunotebook@gmail.com</p>
                        </div>
                    </div>
                    <div className='flex md:mr-10 mb-10'>
                        <div id="i_facebook">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaFacebookSquare className="text-2xl md:text-3xl mr-3 hover:text-blue-500" />
                            </Link>
                        </div>
                        <div id="i_whatsapp">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaWhatsapp className="text-2xl md:text-3xl mr-3 hover:text-green-500" />
                            </Link>
                        </div>
                        <div id="i_instagram">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaInstagram className="text-2xl md:text-3xl mr-3 hover:text-red-900" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Footer