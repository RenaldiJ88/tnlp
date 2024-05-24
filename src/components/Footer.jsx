
import React from 'react';
import Imagen from 'next/image';
import Link from "next/link"
import { FaInstagram } from "react-icons/fa";
import { LuFacebook } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
const Footer = () => {
    return (
        <>
            <div id="container" className='bg-black h-30'>
                <div className='flex justify-center'>
                    <div id="logo" className='text-white flex flex-row '>
                        <p>LOGO</p>
                    </div>
                    <div id="social_media_i" className="flex flex-row my-10 pr-3 md:pr-10 text-white">
                        <div id="i_facebook">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <LuFacebook/>
                            </Link>
                        </div>
                        <div id="i_facebook">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                            <FaWhatsapp />
                            </Link>
                        </div>
                        
                        <div id="i_instagram">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaInstagram />
                                
                            </Link>
                        </div>
                        <div id="contacto" className=''>
                            <p>Bueno Aires, La Plata,  calle 56 Nº1621</p>
                            <p>221 557 9087</p>
                            <p>tunotebook@gmail.com</p>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Footer