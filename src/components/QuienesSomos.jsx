import React from 'react'
import Image from 'next/image'


const QuienesSomos = () => {

    return (
        <>
            <div id='Nosotros' className="bg-black-tnlp text-white flex flex-col lg:flex-row">
                <div className="w-full flex flex-col justify-center pb-10 ">
                    <h2 className=" font-bold text-4xl text-center my-8 font-orbitron">¿Quiénes somos?</h2>
                    <p className="font-roboto text-pretty lg:text-xl mx-auto mb-10 lg:mb-5 max-w-[300px] md:max-w-[650px] text-center">En Tu Notebook La Plata nos apasiona acercarte lo mejor en tecnología.
                    Seleccionamos notebooks de alta gama, gaming y equipos exclusivos bajo los más altos estándares de calidad. Importamos directamente de EE.UU., garantizando productos de primera
                    clase con stock permanente, entrega inmediata y respaldo con garantía oficial y adicional. <br/>
                    <br/>
                    Nuestra misión es brindarte una experiencia completa: desde asesoramiento personalizado hasta un servicio postventa impecable, con soluciones a medida que incluyen mantenimiento, 
                    upgrades, y reparaciones. Nos especializamos en atender a gamers, profesionales creativos, estudiantes y todo aquel que busque rendimiento superior y diseño elegante. <br/>
                    <br/>   
                    Creemos en la excelencia y la cercanía con nuestros clientes. Por eso, quienes confían en nosotros no solo llevan un equipo de primer nivel, sino también la tranquilidad de saber
                    que cuentan con soporte técnico continuo para mantener su equipo siempre al máximo. En cada paso, buscamos superar tus expectativas y ser tu aliado tecnológico de confianza.</p>
                    <button className="bg-[#ffffff] opacity-40 py-2 px-4 rounded-xl w-80 text-center mt-3 mx-auto text-black  font-bold border-[#dd40d5] border-2 border-solid hover:text-white hover:bg-[#dd40d5] hover:border-[#ff96fa] font-orbitron">Saber Más</button>
                </div>
                <div className="w-auto flex justify-center items-center width-[300px] mx-[15px] md:mr-32 my-10 rounded-sm ">
                    <Image 
                    src="/img/quienes-somos/quienes-somos2.avif"
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