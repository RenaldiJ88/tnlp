"use client"; // Indica que este es un componente de cliente

import Image from "next/image";
import Link from "next/link";
// Importamos motion y los hooks necesarios para el scroll y transformaciones
import { motion, useScroll, useTransform } from "framer-motion"; 

const Home = () => {
    let imgFon ='./img/home/img-home.jpg'; // Variable para la imagen de fondo

    // 1. Variantes de animación para el contenedor del texto (h1 y p)
    const containerVariants = {
        hidden: { opacity: 0 }, // El contenedor inicia invisible
        visible: {
            opacity: 1, // Se vuelve visible
            transition: {
                staggerChildren: 0.3 // Los hijos (h1 y p) se animarán con un retraso de 0.3 segundos entre sí
            }
        }
    };

    // 2. Variantes de animación para los ítems de texto (h1 y p)
    const itemVariants = {
        hidden: { opacity: 0, y: 20 }, // Inicia invisible y 20px hacia abajo
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } // Termina visible en su posición original
    };

    // 3. Variantes de animación para la imagen de la laptop
    const laptopImageVariants = {
        hidden: { opacity: 0, scale: 0.95 }, // Inicia invisible y ligeramente más pequeña
        visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut", delay: 0.5 } } // Termina visible y en tamaño normal, con un pequeño retraso
    };

    // 4. Variantes de animación para el botón "Comprar Ahora"
    const buttonVariants = {
        hidden: { opacity: 0 }, // Solo fade-in, sin desplazamiento vertical inicial
        visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut", delay: 1.2 } } // Aparece con un retraso mayor para ir al final de la secuencia
    };

    // 5. Hooks de Framer Motion para el efecto Parallax del fondo
    const { scrollYProgress } = useScroll(); // Obtiene el progreso de scroll vertical del documento (de 0 a 1)
    // Mapea el progreso de scroll a un rango de movimiento vertical del fondo
    // Ajustado a -150% para que el efecto sea claramente visible
    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]); 

    return (
    // ¡CAMBIO CLAVE AQUÍ!: Cambiado pt-16 a pt-20 para compensar la altura del Navbar fijo.
    // Esto asegura que tu contenido inicie justo debajo del Navbar.
    <div className="relative flex flex-col h-screen items-center justify-end pt-20 pb-10 md:pb-12 " >
        {/* Contenedor del fondo con la imagen de galaxia, el linear-gradient y el efecto parallax */}
        <motion.div 
            className="absolute top-0 h-full w-full bg-cover bg-center flex-col lg:flex-row flex img-full" 
            style={{ 
                // Degradado ajustado para una transición más suave de transparente a negro en la parte inferior
                backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(26,26,26,0.8) 90%, #1A1A1A 100%), url(${imgFon})`,
                y: yBackground // Aplicamos el movimiento vertical del parallax
            }}
        >
            {/* Contenedor del texto (h1 y p) con animaciones de entrada. Eliminado bg-opacity-50. */}
            <motion.div 
                className="container pt-[15%] md:pt-[25%] lg:pt-[35%] xl:pt-[15%] 2xl:pt-[25%] 3xl:pt-[20%]  2xl:pl-0 mx-auto flex-col items-center relative" // ¡bg-opacity-50 eliminado!
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Título animado */}
                <motion.h1 
                    className="flex justify-center text-center text-[45px] sm:text-[55px] md:text-[50px] xl:text-[60px] 2xl:text-[75px] 3xl:text-[85px] font-orbitron mt-20 w-full"
                    variants={itemVariants}
                >
                    <span className="bg-clip-text text-white">
                        Expertos en Notebooks
                    </span>
                </motion.h1>
                {/* Párrafo animado */}
                <motion.p 
                    className="text-center text-white mx-[5px] text-xl lg:text-3xl 2xl:px-24 3xl:px-36 font-roboto"
                    variants={itemVariants}
                >
                    Llevamos hasta vos notebooks seleccionadas, exclusivas para gaming, de diseño alta gama y de office únicas. Porque sabemos que buscás lo mejor en tecnología.
                </motion.p>
            </motion.div>

            {/* Contenedor de la imagen de la laptop con animación de entrada */}
            <div className="relative flex justify-center">
                <motion.div
                    variants={laptopImageVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:w-[900px] lg:h-[500px] lg:mt-44 xl:w-[950px] xl:h-[570px] my-auto xl:mt-32 2xl:w-[1000px] 2xl:h-[600px] 3xl:w-[1100px] 3xl:h-[700px] 2xl:mt-36"
                >
                    <Image
                        src="/img/home/note-home.png"
                        width={400}
                        height={400}
                        alt={"notebook"}
                        className="w-full h-full object-contain"
                    />
                </motion.div>
            </div>
        </motion.div> 

        {/* Contenedor del botón "Comprar Ahora" con animación de entrada y espaciado inferior ajustado */}
        <motion.div 
            className="relative flex justify-center place-items-end mb-5"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
        >
            <button className="bg-[#FFFFFF] opacity-40 text-black font-bold py-2 px-4 lg:py-3 lg:px-9 lg:text-xl border-[#dd40d5] border-2 border-solid rounded-xl font-orbitron 
                    transition-all duration-300 ease-in-out // Transición suave para los efectos hover
                    hover:text-white hover:bg-transparent // Efectos de hover de texto y fondo
                    hover:scale-105 // Nuevo: Escala sutilmente al pasar el ratón (quitado hover:w/h)
                    hover:shadow-lg hover:shadow-[#dd40d5] // Nuevo: Aumenta la sombra y le da un color
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