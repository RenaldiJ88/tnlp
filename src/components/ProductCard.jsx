
const ProductCard = (title, imgProduct, description, price) => {
    return (
        <>
            <section className="w-72 sm:w-96 max-h-full h-[500px] bg-c_cromatik_cardService text-c_cromatik_descService flex flex-col m-auto rounded-large justify-between">
                <article>
                    <h3 className="text-center font-semibold font-montserrat text-3xl mt-5">{title}</h3>
                    <Image
                        src={`/${imgProduct}`}
                        alt={description}
                        width={450}
                        height={150}
                        className="rounded-t-large"
                    />
                    <div className="text-center">
                        <h5 className="mt-5 text-c_cromatik_catService text-xl font-montserrat font-semibold">{description}</h5>
                        <p className="leading-snug font-montserrat">{price}</p>
                    </div>
                </article>
                <article className="text-center">
                    <div className="flex flex-col items-center">
                        <button className="bg-c_cromatik hover:bg-c_cromatik_btnh text-white sm:w-1/4 md:w-1/4 lg:w-1/4 rounded-lg p-2 mb-5 shadow-gray-400 shadow-md font-semibold">
                            <Link href="#contacto">
                                Consultas
                            </Link>
                        </button>
                    </div>
                </article>
            </section>
        </>
    )
}

export default ProductCard