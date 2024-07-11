import React from 'react'
import Image from 'next/image'


const QuienesSomos = () => {

    return (
        <>
            <div className="bg-black-tnlp text-white flex">
                <div className="w-1/2 flex flex-col justify-center">
                    <h2 className="font-exo font-bold text-3xl text-center mb-3">¿Quiénes somos?</h2>
                    <p className="font-exo text-pretty w-2/5 mx-auto">Somos una empresa con más de 5 años en el mercado. Importando de EEUU los mejores equipos para nuestros clientes. Donde consiguen elevar sus skills y poder ser más competitivos a nivel profesional.</p>
                    <button className="bg-[#ffffff] opacity-20 py-2 px-4 rounded-xl text-black font-bold border-[#dd40d5] border-2 border-solid w-80 text-center mt-3 mx-auto  hover:text-white hover:bg-[#dd40d5] hover:border-[#ff96fa]">Saber Más</button>
                </div>
                <div className="w-1/2 flex justify-center items-center">
                    <Image 
                    src="/img/quienes-somos/qs.jpg"
                    width={1024}
                    height={683}
                    alt="Foto-QuienesSomos"
                    className='my-auto'
                    />
                </div>
            </div>
        </>

    )
}

export default QuienesSomos