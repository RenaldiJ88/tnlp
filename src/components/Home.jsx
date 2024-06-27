import Image from "next/image";

const Home = () => {
    let imgFon ='./img/home/img-home.jpg';
    return (
    <div className="relative flex flex-col h-screen items-center justify-end pt-16 pb-10 md:pb-12 " >
        <div className="absolute top-0 h-full w-full bg-cover bg-center flex-col lg:flex-row flex " style={{ backgroundImage: `url(${imgFon})` }}>
        <div className=" container pt-[30%] sm:pt-[25%] md:pt-[18%] lg:pt-[35%] xl:pt-[30%] 2xl:pt-[25%] 3xl:pt-[20%] md:pl-10 2xl:pl-0 mx-auto flex-col bg-opacity-50 items-center relative">
                <h1 className=" flex justify-center text-center font-extrabold text-[45px] sm:text-[55px]  xl:text-[65px] 2xl:text-[75px] 3xl:text-[85px]">
                    <span className=" bg-clip-text text-white">
                        TU NOTEBOOK LP
                    </span>
                </h1>
                <p className="text-center text-white mt-3 text-xl xl:text-2xl px-6 md:px-8 2xl:px-24 3xl:px-36">Bienvenidos al epicentro de la innovación en computadoras. Descubrí nuestra selección exclusiva de equipos alta gama para oficina, diseño y gaming.</p>
        </div>
        <div className="relative flex  justify-center ">
            <Image
                src="/img/home/note-home.png"
                width={450}
                height={450}
                alt={"notebook"}
                className="lg:w-[900px] lg:h-[500px] lg:mt-44 xl:w-[950px] xl:h-[570px] xl:mt-48 2xl:w-[1000px] 2xl:h-[600px] 3xl:w-[1100px] 3xl:h-[700px] 2xl:mt-36"
            />
        </div>
        </div> 
        <div className="relative flex justify-center place-items-end lg:mb-5 3xl:mb-20">
            <button className="bg-[#FFFFFF] opacity-20  text-black font-bold  py-2 px-4 lg:py-3 lg:px-9 lg:text-xl border-[#dd40d5] border-2 border-solid rounded-xl hover:text-white hover:bg-[#dd40d5] hover:border-[#ff96fa]">INGRESAR</button>
        </div>    
    </div>
)
}

export default Home
