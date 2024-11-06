import React from 'react';

const Map = () => {
    return (
        <div className='h-auto md:h-[278px] w-full bg-black-tnlp flex flex-col md:flex-row ' id='Map'>
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
                <div className='flex flex-row justify-center md:justify-start mr-4'>
                    <input type="text" className='h-8 mt-2 rounded-md w-[80%] md:w-[60%] md:ml-16 font-roboto' placeholder=" Ingrese su mail para promociones" />
                    <button className="bg-[#ffffff] opacity-20 py-2 px-4 rounded-xl text-black font-bold border-[#dd40d5] border-2 border-solid w-40 text-center  ml-5  hover:text-white hover:bg-[#dd40d5] hover:border-[#ff96fa] font-orbitron">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Map