import React from 'react'
import Image from 'next/image'


const QuienesSomos = () => {

    return (
        <>
            <div className="bg-black-tnlp text-white flex">
                <div className="w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl text-center mb-3">¿Quiénes somos?</h2>
                    <p className="text-pretty w-2/5 mx-auto">Somos una empresa con más de 5 años en el mercado. Importando de EEUU los mejores equipos para nuestros clientes. Donde consiguen elevar sus skills y poder ser más competitivos a nivel profesional.</p>
                    <button className="text-white bg-pink-500 rounded-md h-6 w-60 text-center mt-3 mx-auto">Saber Más</button>
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