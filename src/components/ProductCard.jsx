import React from "react";
import Image from "next/image";
import Link from "next/link";
const ProductCard = ({ title, image, description, price }) => {
    return (
        <>
            <section className="w-72 sm:w-96 max-h-full h-[500px] rounded-3xl bg-black-tnlp m-auto flex flex-col justify-between">
                <article>
                    <div className="h-14 content-end ">
                        <p className="text-white text-center font-semibold uppercase text-lg">{title}</p>
                    </div>
                    <div className="rounded-t-large flex justify-center">
                        <Image
                            src={`/${image}`}
                            alt={description}
                            width={300}
                            height={150}
                        />
                    </div>

                    <div className="">
                        <p className="pt-2 pl-5 text-white text-xl font-semibold uppercase">{description}</p>
                        <p className="text-white leading-snug text-center font-bold">{price}</p>
                    </div>
                </article>
                <article className="text-center">
                    <div className="h-10 w-full bg-pink-tnlp hover:bg-pink-hover-tnlp text-black rounded-3xl font-bold uppercase ">
                        <p className="pt-2">Comprar</p>
                    </div>
                </article>
            </section>
        </>
    )
}

export default ProductCard