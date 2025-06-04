import React from 'react'
import Image from 'next/image'


const QuienesSomos = () => {

    return (
        <>
            <div id='Nosotros' className="bg-black-tnlp text-white flex flex-col lg:flex-row">
                <div className="w-full flex flex-col justify-center pb-10 ">
                    <h2 className=" font-bold text-4xl text-center my-8 font-orbitron">¿Que es Tu Notebook LP?</h2>
                    <p className="font-roboto text-pretty lg:text-xl mx-auto mb-10 lg:mb-5 max-w-[300px] md:max-w-[650px] text-center">Tu Notebook LP es mucho más que una tienda de tecnología: es una experiencia personalizada de principio a fin. 
                        <br/>Nos especializamos en la venta de notebooks seleccionadas de alta gama y en brindar un servicio técnico especializado con foco en el detalle, la calidad y la transparencia. Desde el primer contacto por WhatsApp, acompañamos al usuario con asesoramiento profesional para ayudarlo a elegir el equipo ideal según sus necesidades reales. Al entregar cada notebook —ya sea nueva o reparada— sumamos un manual de Buen Uso y Costumbres, pensado para prevenir problemas comunes y extender la vida útil del equipo.
                        Mantenemos un contacto cercano y postventa activo, ofreciendo soporte continuo, soluciones a medida y el respaldo técnico que solo una atención especializada y humana puede brindar. 
                        <br/>En Tu Notebook LP, creemos en hacer las cosas bien, con compromiso real y excelencia en cada etapa del proceso.</p>
                    <button className="bg-[#ffffff] opacity-40 py-2 px-4 rounded-xl w-80 text-center mt-3 mx-auto text-black  font-bold border-[#dd40d5] border-2 border-solid hover:text-white hover:bg-[#dd40d5] hover:border-[#ff96fa] font-orbitron">Saber Más</button>
                </div>
                <div className="w-auto flex justify-center items-center width-[300px] mx-[15px] md:mr-32 my-10 rounded-sm ">
                    <Image 
                    src="/img/quienes-somos/quienes-somos2.jpeg"
                    width={1024}
                    height={1500}
                    alt="Foto-QuienesSomos"
                    className='my-auto rounded-3xl'
                    />
                </div>
            </div>
        </>

    )
}

export default QuienesSomos