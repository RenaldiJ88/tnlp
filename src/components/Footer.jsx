import React from 'react';
import Imagen from 'next/image';
import Link from "next/link"
import { FaInstagram } from "react-icons/fa";
import { LuFacebook } from "react-icons/lu";
const Footer = () => {
    return (
        <>
            <div id="container" className='bg-black h-30'>
                <h1 className='text-white grid place-items-center'>Este es el Footer</h1>
                <div className='grid place-items-center'>
                    <div id="social_media_i" className="flex flex-row my-10 pr-3 md:pr-10 ">
                        <div id="i_facebook">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <LuFacebook className="text-xl mr-3 text-white hover:text-blue-500" />
                            </Link>
                        </div>
                        <div id="i_instagram">
                            <Link target='_blank' rel="noopener noreferrer" href={'#'}>
                                <FaInstagram className="text-xl mr-3 text-white hover:text-red-500" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Footer