import React from "react";
import Image from "next/image";
import Link from "next/link";
import useWhatsAppLink from "../hooks/useWhatsAppLink"; // Ajusta la ruta si es necesario

const ProductCard = ({ title, image, description, price }) => {
    const getWhatsAppLink = useWhatsAppLink(title, price); // Usa el custom hook
    return (
        <>
            <section className="rounded-3xl bg-black-tnlp w-[300px] h-auto ">
                <article className="">
                    <div className="h-14 content-end ">
                        <p className="text-white text-center font-semibold uppercase text-lg font-orbitron py-3">{title}</p>
                    </div>
                    <div className="rounded-t-large flex justify-center px-5 h-[200px] bg-white rounded-xl mx-3">
                        <Image
                            src={`/${image}`}
                            alt={description}
                            width={250}
                            height={150}
                        />
                    </div>

                    <div className="">
                        <p className="pt-5 px-7 mb-3 text-white text-sm text-justify uppercase font-roboto h-[105px]">{description}</p>
                        <p className="py-1 text-white leading-snug text-center font-bold text-[20px] font-roboto">{price}</p>
                    </div>
                </article>
                <article className="text-center">
                    <div className="h-10  w-[50%] mx-auto mt-1 mb-5 bg-[#dd40d5] opacity-60 hover:opacity-80 text-black rounded-3xl font-bold uppercase font-orbitron hover:duration-200 ">
                        <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={getWhatsAppLink()} // Usa la función del hook aquí
                        >
                        <p className="pt-2">Comprar</p>
                        </Link>
                    </div>
                </article>
            </section>
        </>
    )
}

export default ProductCard