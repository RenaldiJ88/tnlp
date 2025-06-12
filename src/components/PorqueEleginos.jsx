import React from 'react';
import { ShieldCheck, Shield, Gem, Laptop } from 'lucide-react';

// Datos para la sección "Por Qué Elegirnos"
const itemsPorQueElegirnos = [
    {
        // Usamos el ícono ShieldCheck de lucide-react para "Seguridad y Excelencia"
        // Se le aplica un color azul cielo y un tamaño de 48px
        icon: <ShieldCheck size={48} className="text-sky-500" />,
        // Título proporcionado por el usuario, incluyendo emojis
        title: "🔒 Seguridad y Excelencia en Tu Notebook La Plata 🔒",
        // Descripción opcional, comentada por ahora para mantenerlo simple según el pedido inicial
        description: "Garantizamos la máxima seguridad y un rendimiento excepcional para tu equipo."
    },
    {
        // Usamos el ícono Shield para "Comprometidos con Tu Seguridad"
        // Se le aplica un color esmeralda y un tamaño de 48px
        icon: <Shield size={48} className="text-emerald-500" />,
        title: "🛡️ Comprometidos con Tu Seguridad 🛡️",
        description: "Tu tranquilidad es nuestra prioridad. Nos dedicamos a proteger tus datos y tu inversión."
    },
    {
        // Usamos el ícono Gem para "Identidad y Calidad"
        // Se le aplica un color violeta y un tamaño de 48px
        icon: <Gem size={48} className="text-violet-500" />,
        title: "✨ Identidad y Calidad ✨",
        description: "Ofrecemos productos y servicios que reflejan nuestra pasión por la calidad y la innovación."
    },
    {
        // Usamos el ícono Laptop para "Notebooks NUEVAS seleccionadas"
        // Se le aplica un color rosa y un tamaño de 48px
        icon: <Laptop size={48} className="text-rose-500" />,
        title: "💻 Notebooks NUEVAS seleccionadas ⚡️",
        description: "Solo las mejores marcas y modelos, cuidadosamente seleccionados para ti."
    }
];

// Componente funcional PorqueElegirnos
const PorqueElegirnos = () => {
    return (
        // Sección principal con padding vertical y fondo personalizado 'bg-black-tnlp'
        <section className="py-28 bg-black-tnlp font-['Inter',_sans-serif]">
            {/* Contenedor principal centrado y con padding horizontal */}
            <div className="container mx-auto px-6 lg:px-8">
                {/* Título de la sección, ahora con texto blanco para contraste */}
                <h2 className="text-4xl font-bold text-center text-white mb-12">
                    ¿Por Qué Elegirnos?
                </h2>
                {/* Grid para mostrar los ítems. Se ajusta el número de columnas según el tamaño de la pantalla */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Iteramos sobre los ítems para crear una tarjeta para cada uno */}
                    {itemsPorQueElegirnos.map((item, index) => (
                        <div
                            key={index}
                            // Estilo de la tarjeta: fondo blanco, padding, esquinas redondeadas, sombra, efectos de transición al pasar el mouse
                            // Los textos dentro de la tarjeta seguirán siendo oscuros ya que el fondo de la tarjeta es blanco.
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col items-center text-center"
                        >
                            {/* Contenedor del ícono */}
                            <div className="mb-5 text-center">
                                {item.icon}
                            </div>
                            {/* Título del ítem, se mantiene el color oscuro ya que el fondo de la tarjeta es blanco */}
                            <h3 className="text-xl font-semibold text-slate-700 mb-3 h-20 flex items-center justify-center">
                                {item.title}
                            </h3>
                            {/* Descripción del ítem (actualmente comentada) */}
                            {item.description && <p className="text-slate-600 text-sm">{item.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Componente principal App que renderiza PorqueElegirnos
// Este es el componente que se exporta por defecto
export default function App() {
    return (
        // Contenedor principal de la aplicación, centrado y con altura mínima de pantalla.
        // Se cambia el fondo general de la app a bg-black-tnlp para que coincida si es necesario,
        // o se puede mantener bg-slate-50 si solo la sección debe ser oscura.
        // Por ahora, mantendré el fondo de la app claro, y solo la sección PorqueElegirnos oscura.
        <div className="h-auto bg-black-tnlp flex flex-col items-center justify-center">
            <PorqueElegirnos />
        </div>
    );
}