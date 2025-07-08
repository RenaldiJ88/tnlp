"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react'; // <-- Importamos Brain
import { motion } from "framer-motion"; // <-- Importamos motion

// Datos de las FAQs
const faqData = [
    {
        id: 1,
        question: "¿Qué notebook me conviene para estudiar, trabajar o jugar?",
        answer: "Depende del uso que le vayas a dar. No es lo mismo una notebook para uso de hogar u oficina a una para gaming o diseño. Te asesoramos según tus necesidades reales, sin venderte de más."
    },
    {
        id: 2,
        question: "¿Qué tengo que mirar en una notebook antes de comprar?",
        answer: "Hay cinco puntos clave que deberías revisar: Procesador (CPU): es el cerebro del equipo. Cuanto más potente, más rápido y fluido funciona todo. Memoria RAM: permite abrir varias tareas a la vez sin que se trabe. Ideal mínimo 8GB para uso general, más si vas a jugar o editar. Disco SSD: hace que todo cargue mucho más rápido. Ahí se almacena el sistema operativo, tus fotos, videos, documentos y programas. Mucho mejor que un disco duro tradicional. Placa gráfica (GPU): puede venir de dos formas: integrada al procesador (ideal para tareas básicas o de oficina), o dedicada, que es mucho más potente y necesaria para jugar, editar o usar software 3D. Pantalla: buscá buena resolución (Full HD o más) y tecnología IPS. Para gaming o diseño, fijate también la frecuencia de refresco (144Hz es ideal)."
    },
    {
        id: 3,
        question: "¿Tienen notebooks en stock?",
        answer: "Sí. Solo publicamos modelos disponibles. Si ves una publicación, podés comprarla o consultarnos directamente"
    },
    {
        id: 4,
        question: "¿Qué garantía tienen los equipos?",
        answer: "Todas las notebooks nuevas vienen con garantía oficial de 6 meses, y además sumás el respaldo técnico de Tu Notebook La Plata, que te acompaña postventa."
    },
    {
        id: 5,
        question: "¿Aceptan pagos en pesos o dólares?",
        answer: "Sí. Podés pagar en pesos o en dólares billete (blue). No usamos transferencia ni tarjetas para ventas de notebooks, solo medios físicos."
    },
    {
        id: 6,
        question: "¿Hacen envíos? ¿Solo trabajan en La Plata?",
        answer: "Realizamos entregas en La Plata y alrededores. Si estás más lejos, consultanos y vemos la mejor forma de enviártela."
    },
    {
        id: 7,
        question: "¿Las notebooks vienen listas para usar?",
        answer: "Sí. Todos los equipos se entregan con sistema operativo listo para usar. Una vez que la prendés, deberás hacer la configuración inicial en privado, ya que se ingresan datos personales. Ese proceso toma entre 45 minutos y una hora, mientras el sistema reconoce el hardware y termina de preparar el entorno."
    },
    {
        id: 8,
        question: "¿Puedo pedir mejoras? (RAM, SSD, etc.)",
        answer: "Claro. Podemos mejorar o ampliar componentes antes de entregártela. Te explicamos cada opción para que el equipo se ajuste a lo que necesitás."
    },
    {
        id: 9,
        question: "¿Toman notebooks usadas como parte de pago?",
        answer: "Sí, pero deben cumplir ciertos requisitos. Aceptamos equipos que estén en buen estado físico y funcional, con placa gráfica dedicada, o notebooks de oficina modernas (últimas generaciones). Antes de aprobar la toma, nuestro servicio técnico realiza una revisión completa para validar el estado real del equipo."
    }
];

// --- NUEVAS VARIANTES DE ANIMACIÓN ---
// Variantes para el título principal de FAQs
const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Variantes para el contenedor de la lista de FAQs (para escalonar la aparición)
const containerFaqItemsVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1 // Cada FaqItem aparecerá con un retraso de 0.1s
        }
    }
};

// Variantes para cada FaqItem individual
const itemFaqVariants = {
    hidden: { opacity: 0, y: 30 }, // Un desplazamiento más pequeño para ítems de lista
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};


// Componente para un solo item de FAQ
function FaqItem({ question, answer, isOpen, onToggle, variants }) { // <-- Recibe las variants
    return (
        // motion.div para animar cada ítem de FAQ
        <motion.div 
            className="border-b border-gray-700 py-6"
            variants={variants} // Aplicamos las variants recibidas
        >
            <dt>
                <button
                    onClick={onToggle}
                    className="flex w-full items-start justify-between text-left text-gray-200 focus:outline-none"
                    aria-expanded={isOpen}
                >
                    <span className="text-lg md:text-xl font-semibold font-orbitron">{question}</span>
                    <span className="ml-6 flex h-7 items-center">
                        {isOpen ? (
                            <ChevronUp className="h-6 w-6 text-blue-400" aria-hidden="true" />
                        ) : (
                            <ChevronDown className="h-6 w-6 text-gray-400" aria-hidden="true" />
                        )}
                    </span>
                </button>
            </dt>
            {/* Animación de apertura/cierre de la respuesta. Similar a ServiceCard "Ver más" */}
            <motion.dd 
                initial={{ height: 0, opacity: 0 }} // Inicia colapsada y transparente
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} // Anima a auto/0 y opacidad
                transition={{ duration: 0.5, ease: "easeOut" }} // Transición más rápida para click
                className="mt-4 pr-12 overflow-hidden" // Oculta el desbordamiento durante la animación
            >
                <p className="text-base leading-relaxed text-gray-300 whitespace-pre-line">{answer}</p>
            </motion.dd>
        </motion.div>
    );
}

// Componente principal de la página de FAQs
export default function FaqPage() {
    const [openFaqId, setOpenFaqId] = useState(null);

    const handleToggle = (id) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <div className="bg-black-tnlp text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8" id='Faq'>
            <div className="mx-auto max-w-3xl">
                {/* Animamos el título principal de la sección de FAQs */}
                <motion.div
                    className="text-center mb-12"
                    variants={titleVariants} // Aplicamos las variantes del título
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }} // Se anima al 50% visible, una sola vez
                >
                    {/* Añadimos el icono Brain y el título */}
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-orbitron">
                        <Brain size={56} className="inline-block mr-4 text-purple-400 align-middle" /> {/* Icono de cerebro */}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                             TNLP – FAQs Institucionales
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-300">
                        Nuestra visión, nuestros valores y por qué hacemos lo que hacemos.
                    </p>
                </motion.div>

                {/* Lista de preguntas y respuestas animada */}
                <motion.dl 
                    className="space-y-2"
                    variants={containerFaqItemsVariants} // Aplicamos las variantes del contenedor para el stagger
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // Se anima al 20% visible, una sola vez
                >
                    {faqData.map((faq) => (
                        <FaqItem
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openFaqId === faq.id}
                            onToggle={() => handleToggle(faq.id)}
                            variants={itemFaqVariants} // Pasamos las variantes a cada FaqItem
                        />
                    ))}
                </motion.dl>
            </div>
        </div>
    );
}