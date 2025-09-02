
import { ShieldCheck, Shield, Gem, Laptop } from 'lucide-react';

const itemsPorQueElegirnos = [
    {
        icon: <ShieldCheck size={48} className="text-sky-500" />,
        title: "🔒 Seguridad y Excelencia en Tu Notebook La Plata 🔒",
        description: "Garantizamos la máxima seguridad y un rendimiento excepcional para tu equipo."
    },
    {
        icon: <Shield size={48} className="text-emerald-500" />,
        title: "Comprometidos con Tu Seguridad",
        description: "Tu tranquilidad es nuestra prioridad. Nos dedicamos a proteger tus datos y tu inversión."
    },
    {
        icon: <Gem size={48} className="text-violet-500" />,
        title: "Identidad y Calidad",
        description: "Ofrecemos productos y servicios que reflejan nuestra pasión por la calidad y la innovación."
    },
    {
        icon: <Laptop size={48} className="text-rose-500" />,
        title: "Notebooks NUEVAS seleccionadas",
        description: "Solo las mejores marcas y modelos, cuidadosamente seleccionados para ti."
    }
];

const PorqueElegirnos = () => {
    return (
        <section className="py-28 bg-black-tnlp font-['Inter',_sans-serif]">
            <div className="container mx-auto px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-white mb-12">
                    ¿Por Qué Elegirnos?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {itemsPorQueElegirnos.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col items-center text-center"
                        >
                            <div className="mb-5 text-center">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-3 h-20 flex items-center justify-center">
                                {item.title}
                            </h3>
                            {item.description && <p className="text-slate-600 text-sm">{item.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function App() {
    return (
        <div className="h-auto bg-black-tnlp flex flex-col items-center justify-center">
            <PorqueElegirnos />
        </div>
    );
}