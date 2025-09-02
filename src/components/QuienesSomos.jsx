"use client";

import Image from 'next/image';
import { motion } from "framer-motion";

const QuienesSomos = () => {
    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const textBlockVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.6 } }
    };

    return (
        <>
            <div id='Nosotros' className="bg-black-tnlp text-white flex flex-col lg:flex-row">
                <div className="w-full flex flex-col justify-center pb-10 ">
                    <motion.h2 
                        className="font-bold text-4xl text-center my-8 font-orbitron"
                        variants={titleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        ¿Que es Tu Notebook LP?
                    </motion.h2>

                    <motion.p 
                        className="font-roboto text-pretty lg:text-xl mx-auto mb-10 lg:mb-5 max-w-[300px] md:max-w-[650px] text-center"
                        variants={textBlockVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        Tu Notebook LP es mucho más que una tienda de tecnología: es una experiencia personalizada de principio a fin. 
                        <br/>Nos especializamos en la venta de notebooks seleccionadas de alta gama y en brindar un servicio técnico especializado con foco en el detalle, la calidad y la transparencia. Desde el primer contacto por WhatsApp, acompañamos al usuario con asesoramiento profesional para ayudarlo a elegir el equipo ideal según sus necesidades reales. Al entregar cada notebook —ya sea nueva o reparada— sumamos un manual de Buen Uso y Costumbres, pensado para prevenir problemas comunes y extender la vida útil del equipo.
                        Mantenemos un contacto cercano y postventa activo, ofreciendo soporte continuo, soluciones a medida y el respaldo técnico que solo una atención especializada y humana puede brindar. 
                        <br/>En Tu Notebook LP, creemos en hacer las cosas bien, con compromiso real y excelencia en cada etapa del proceso.</motion.p>
                    
                    <motion.button 
                        className="bg-[#FFFFFF] opacity-40 text-black font-bold py-2 px-4 lg:py-3 lg:px-9 lg:text-xl border-[#dd40d5] border-2 border-solid rounded-xl font-orbitron 
                                   transition-all duration-300 ease-in-out
                                   hover:text-white hover:bg-transparent
                                   hover:scale-105
                                   hover:shadow-lg hover:shadow-[#dd40d5]
                                   mx-auto mt-3"
                        variants={buttonVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >Saber Más</motion.button>
                </div>
                
                <motion.div 
                    className="w-auto flex justify-center items-center mx-[15px] md:mr-32 my-10 rounded-sm "
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <Image 
                        src="/img/quienes-somos/quienes-somos2.jpeg"
                        width={1024}
                        height={1500}
                        alt="Foto-QuienesSomos"
                        className="my-auto rounded-3xl w-full h-auto"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1024px"
                        quality={85}
                        loading="lazy"
                    />
                </motion.div>
            </div>
        </>
    )
}

export default QuienesSomos