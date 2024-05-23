import React from "react";
import Image from "next/image";
import Link from "next/link";
const ProductCard = ({ title, image, description, price }) => {
    return (
        <>
            <section className="rounded-3xl bg-black-tnlp ">
                <article>
                    <div className="h-14 content-end ">
                        <p className="text-white text-center font-semibold uppercase text-lg">{title}</p>
                    </div>
                    <div className="rounded-t-large flex justify-center px-8">
                        <Image
                            src={`/${image}`}
                            alt={description}
                            width={300}
                            height={150}
                        />
                    </div>

                    <div className="">
                        <p className="pt-2 px-8 text-white text-sm font-semibold uppercase">{description}</p>
                        <p className="py-1 text-white leading-snug text-center font-bold">{price}</p>
                    </div>
                </article>
                <article className="text-center">
                    <div className="h-10  w-full bg-pink-tnlp hover:bg-pink-hover-tnlp text-black rounded-3xl font-bold uppercase  hover:duration-200 ">
                        <p className="pt-2">Comprar</p>
                    </div>
                </article>
            </section>
        </>
    )
}

export default ProductCard