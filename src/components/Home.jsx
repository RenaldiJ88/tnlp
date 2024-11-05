import Image from "next/image";
import Link from "next/link";

const Home = () => {
    let imgFon ='./img/home/Img-Home.jpg';
    return (
    <div className="relative flex flex-col h-screen items-center justify-end pt-16 pb-10 md:pb-12 " >
        <div className="absolute top-0 h-full w-full bg-cover bg-center flex-col lg:flex-row flex img-full" style={{ backgroundImage: `url(${imgFon})` }}>
        <div className=" container pt-[20%] md:pt-[18%] lg:pt-[35%] xl:pt-[30%] 2xl:pt-[25%] 3xl:pt-[20%] md:pl-10 2xl:pl-0 mx-auto flex-col bg-opacity-50 items-center relative">
                <h1 className=" flex justify-center text-center  text-[45px] sm:text-[55px]  xl:text-[60px] 2xl:text-[75px] 3xl:text-[85px] font-orbitron mt-20 md:m-[20px] w-full">
                    <span className=" bg-clip-text text-white">
                        Expertos en notebooks
                    </span>
                </h1>
                <p className="text-center text-white mt-3 mx-auto ml-[5px] text-xl lg:text-2xl  2xl:px-24 3xl:px-36 font-roboto">Llevamos hasta vos notebooks seleccionadas, exclusivas para gaming, de diseño alta gama y de office únicas. Porque sabemos que buscás lo mejor en tecnología.</p>
        </div>
        <div className="relative flex  justify-center ">
            <Image
                src="/img/home/note-home.png"
                width={450}
                height={450}
                alt={"notebook"}
                className="lg:w-[900px] lg:h-[500px] lg:mt-44 xl:w-[950px] xl:h-[570px] my-auto xl:mt-48 2xl:w-[1000px] 2xl:h-[600px] 3xl:w-[1100px] 3xl:h-[700px] 2xl:mt-36"
            />
        </div>
        </div> 
        <div className="relative flex justify-center place-items-end mb-10 sm:mb-0 xl:mb-16 2xl:mb-10 3xl:mb-20">
            <button className="bg-[#FFFFFF] opacity-20  text-black font-bold  py-2 px-4 lg:py-3 lg:px-9 lg:text-xl border-[#dd40d5] border-2 border-solid rounded-xl hover:text-white hover:bg-transparent hover:w-[260px] hover:h-[60px] font-orbitron">
                <Link
                    target='_blank' 
                    rel="noopener noreferrer"
                    href={"https://wa.me/5492216767615"}>Comprar Ahora</Link>
            </button>
        </div>    
    </div>
)
}

export default Home
