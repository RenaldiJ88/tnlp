"use client";

import Image from "next/image";
import Link from "next/link";
import CriticalImage from "./CriticalImage";
import { motion, useScroll, useTransform } from "framer-motion"; 

const Home = () => {
    const imgFon = '/img/home/img-home.jpg';


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };


    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };


    const laptopImageVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut", delay: 0.5 } }
    };


    const buttonVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut", delay: 1.2 } }
    };


    const { scrollYProgress } = useScroll();
    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]); 

    return (

    <div className="relative flex flex-col h-screen items-center justify-end pt-20 pb-10 md:pb-12" >

        <motion.div 
            className="absolute top-0 h-full w-full bg-cover bg-center flex-col lg:flex-row flex img-full" 
            style={{ 

                backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(26,26,26,0.8) 90%, #1A1A1A 100%), url(${imgFon})`,
                y: yBackground
            }}
        >

            <motion.div 
                className="container pt-[15%] md:pt-[25%] lg:pt-[35%] xl:pt-[15%] 2xl:pt-[25%] 3xl:pt-[20%]  2xl:pl-0 mx-auto flex-col items-center relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                <motion.h1 
                    className="flex justify-center text-center text-[45px] sm:text-[55px] md:text-[50px] xl:text-[60px] 2xl:text-[75px] 3xl:text-[85px] font-orbitron mt-20 w-full"
                    variants={itemVariants}
                >
                    <span className="bg-clip-text text-white">
                        Expertos en Notebooks
                    </span>
                </motion.h1>

                <motion.p 
                    className="text-center text-white mx-[5px] text-xl lg:text-3xl 2xl:px-24 3xl:px-36 font-roboto"
                    variants={itemVariants}
                >
                    Llevamos hasta vos notebooks seleccionadas, exclusivas para gaming, de diseño alta gama y de office únicas. Porque sabemos que buscás lo mejor en tecnología.
                </motion.p>
            </motion.div>


            <div className="relative flex justify-center">
                <motion.div
                    variants={laptopImageVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-[280px] h-[200px] sm:w-[350px] sm:h-[250px] md:w-[400px] md:h-[300px] lg:w-[900px] lg:h-[500px] lg:mt-44 xl:w-[950px] xl:h-[570px] my-auto xl:mt-32 2xl:w-[1000px] 2xl:h-[600px] 3xl:w-[1100px] 3xl:h-[700px] 2xl:mt-36"
                >
                    <CriticalImage
                        src="/img/home/note-home.webp"
                        width={1100}
                        height={700}
                        alt="notebook gaming de alta gama"
                        className="w-full h-full object-contain"
                        sizes="(max-width: 480px) 280px, (max-width: 768px) 350px, (max-width: 1024px) 400px, (max-width: 1280px) 900px, (max-width: 1536px) 950px, 1100px"
                    />
                </motion.div>
            </div>
        </motion.div> 


        <motion.div 
            className="relative flex justify-center place-items-end mb-5 z-10"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
        >
            <button className="bg-[#FFFFFF] opacity-40 text-black font-bold py-3 px-6 text-sm sm:py-3 sm:px-8 sm:text-base lg:py-3 lg:px-9 lg:text-xl border-[#dd40d5] border-2 border-solid rounded-xl font-orbitron 
                    transition-all duration-300 ease-in-out 
                    hover:text-white hover:bg-transparent 
                    hover:scale-105 
                    hover:shadow-lg hover:shadow-[#dd40d5]
                ">
                <Link
                    target='_blank' 
                    rel="noopener noreferrer"
                    href={"https://wa.me/5492216767615"}>Comprar Ahora</Link>
            </button>
        </motion.div>    
    </div>
)
}

export default Home;