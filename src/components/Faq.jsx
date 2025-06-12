"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Datos de las FAQs
// Se extrajeron de la información proporcionada por el usuario
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

// Componente para un solo item de FAQ
// Maneja su propio estado de apertura/cierre
function FaqItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className="border-b border-gray-700 py-6">
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
            {isOpen && (
                <dd className="mt-4 pr-12">
                    {/* Usamos whitespace-pre-line para respetar los saltos de línea en las respuestas */}
                    <p className="text-base leading-relaxed text-gray-300 whitespace-pre-line">{answer}</p>
                </dd>
            )}
        </div>
    );
}

// Componente principal de la página de FAQs
export default function FaqPage() {
    // Estado para rastrear qué pregunta está actualmente abierta
    // Solo una pregunta puede estar abierta a la vez
    const [openFaqId, setOpenFaqId] = useState(null);

    // Función para manejar el clic en una pregunta
    const handleToggle = (id) => {
        // Si la pregunta clickeada ya está abierta, la cerramos (null)
        // Si no, la abrimos estableciendo su id
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <div className="bg-black-tnlp text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8" id='Faq'>
            <div className="mx-auto max-w-3xl">
                {/* Título y subtítulo de la sección de FAQs */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 sm:text-5xl lg:text-6xl font-orbitron">
                        🧠 TNLP – FAQs Institucionales
                    </h1>
                    <p className="mt-4 text-xl text-gray-300">
                        Nuestra visión, nuestros valores y por qué hacemos lo que hacemos.
                    </p>
                </div>

                {/* Lista de preguntas y respuestas */}
                <dl className="space-y-2">
                    {faqData.map((faq) => (
                        <FaqItem
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openFaqId === faq.id} // La pregunta está abierta si su id coincide con openFaqId
                            onToggle={() => handleToggle(faq.id)} // Pasa la función para manejar el clic
                        />
                    ))}
                </dl>
            </div>
        </div>
    );
}
