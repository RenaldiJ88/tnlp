"use client"
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Link from "next/link"


const NavLinks = () => {
    const [isOpen, setIsOpen] = useState(false); // menu cerrado
    const [isDisplayed, setIsDisplayed] = useState(false); // menu desplegado

    const handleClick = () => {
        setIsOpen(!isOpen) // valor opuesto
    }

    const handleDropdown = () => {
        setIsDisplayed(!isDisplayed) // valor opuesto
    }
    return (
        <>
        <ul className="pt-5 underline-offset-8 md:pt-14  md:pl-0 rounded-xl bg-black md:bg-transparent md:gap-x-3 lg:gap-x-2 xl:text-xl lg:text-lg md:text-sm md:grid md:grid-cols-4 font-orbitron">
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Servicios" className="text-white hover:border-b-2">Servicios</Link></li>
                <div className="md:relative text-center text-white  ">
                    <div className='flex justify-center md:pl-0 pl-4'>
                        <button className="flex items-center" onClick={handleDropdown}>
                        <p className="border-b-4 border-transparent text-lg md:text-sm lg:text-lg font-bold md:hover:border-white ">Productos</p>
                        {isDisplayed ?
                            (
                                <svg className=" w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 5 4-4 4 4" />
                                </svg>
                            ) : (
                                <svg className=" w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            )
                        }

                    </button>
                    </div>

                    {isDisplayed && (
                        <div className=" mx-auto absolute md:mt-6 bg-black text-white w-full flex-col rounded-md p-5">
                            <ul className=''>
                                <Link href="/#Marcas"><li>Productos en oferta</li></Link>
                                <li className='mx-auto border-[1px] mt-2 border-white w-10 xl:w-28'> </li>
                                <Link href="/EquiposGamer"><li className='py-2'>Equipos Gamer</li></Link>
                                <li className='mx-auto border-[1px] mb-2 border-white w-10 xl:w-28'> </li>
                                <Link href="/EquiposOffice"><li>Equipos Office</li></Link>
                            </ul>

                        </div>
                    )}
                </div>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5  text-center md:font-bold md:pb-0'><Link href="/#Nosotros" className="text-white hover:border-b-2">Nosotros</Link></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5  text-center md:font-bold md:pb-0'><Link href="/#Map" className="text-white hover:border-b-2">Contacto</Link></li>
            </ul>
        </> 
    )
}

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    const toggleNavbar = () => {
        setIsOpen(!isOpen)
    }

return (
    <>
        <nav className="opacity-100 gap-1 grid  md:grid-cols-2 bg-transparent">
            <a className="ml-28" href="/"><img src="/img/logo.png" alt="" className='w-[150px] h-[150px] lg:w-[180px] xl:h-[180px]   mx-auto md:mx-2' /></a>
            <div className='hidden md:grid'>
                <NavLinks/>
            </div>
            
            <div className="space-y-2 grid pt-14 pl-6 sm:pl-10 absolute md:hidden">
                <button onClick={toggleNavbar}>
                    {isOpen ? <X color="white"/> : <Menu color='white'/>}
                </button>
            </div>
        </nav>
        {isOpen && (
            <div>
                <NavLinks/>
            </div>
        )}
    </>
)
}

export default Navbar
