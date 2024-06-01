import React from 'react';
import Image from 'next/image';
import Link from "next/link"
import { FaInstagram, FaFacebookSquare, FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { PiMapPinPlusFill } from "react-icons/pi";

const Footer = () => {
    return (
        <>
            <div id="container" className='bg-black-tnlp h-30 text-white'>
                <div className='flex place-between'>
                    <div id="logo_footer" className="flex my-auto">
                        <Link href="#home">
                            <Image
                                src="/img/TN_Logo_PNG.png"
                                width={175}
                                height={175}
                                alt="Logo-Footer"
                            />
                        </Link>
                    </div>
                    <div id="social_media_i" className="flex flex-row my-10 pr-3 md:pr-10 ">
                        <div id="i_facebook">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaFacebookSquare className="text-xl mr-3 hover:text-blue-500" />
                            </Link>
                        </div>
                        <div id="i_whatsapp">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaWhatsapp className="text-xl mr-3 hover:text-green-500" />
                            </Link>
                        </div>
                        
                        <div id="i_instagram">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaInstagram className="text-xl mr-3 hover:text-red-500" />
                            </Link>
                        </div>
                        <div>
                            <div className="flex items-center">
                                <PiMapPinPlusFill className="mr-2 text-blue-500" />
                                <p>Bueno Aires, La Plata,  calle 56 Nº1621</p>
                            </div>
                            <div className="flex items-center">
                                <FaWhatsapp className="mr-2 text-blue-500" />
                                <p>221 557 9087</p>
                            </div>
                            <div className="flex items-center">
                                <IoMdMail className="mr-2 text-blue-500" />
                                <p>tunotebook@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Footer