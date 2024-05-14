import React from 'react';
import Imagen from 'next/image';

const Map = () => {
    return (
        <div className='h-auto md:h-[278px] w-full bg-black-tnlp flex flex-col md:flex-row '>
            <div className='md:w-[50%] my-auto'>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.783621305636!2d-57.969308923404824!3d-34.936963275175565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e87ecf8f4f17%3A0x140b90b52b9e37f!2sC.%2056%201621%2C%20B1900%20BLM%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1715637290242!5m2!1ses-419!2sar"
                    className='w-[82%] md:w-[85%] h-[246px] mx-auto  rounded-3xl '
                    loading='lazy'
                    referrerPolicy="no-referrer-when-downgrade"
                >
                </iframe>
            </div>
            <div className='w-[82%] md:w-[50%] mx-auto my-auto py-10 md:py-0'>
                <div className='flex flex-row justify-center md:justify-start'>
                    <input type="text" className='h-8 rounded-md w-[80%] md:w-[60%] md:ml-16' placeholder="  Suscribase para promociones" />
                    <button type="submit"  className='text-white bg-pink-500 rounded-md h-8 ml-3 w-14 text-center'>
                        Enviar
                    </button>
                </div>
                
            </div>
        </div>
    );
}
export default Map
/* md:w-[14%] lg:w-[10%] xl:w-[7%] */