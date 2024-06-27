"use client"
import { useState } from 'react'
import { Menu, X } from 'lucide-react'



const NavLinks = () => {
    return (
        <>
            <ul className="pt-5 underline-offset-8 md:py-14  md:pl-0 rounded-xl bg-black md:bg-transparent  md:gap-x-3 lg:gap-x-2 xl:text-xl lg:text-lg md:text-sm md:grid md:grid-cols-5 ">
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 mr-4 text-center md:pt-0 md:font-bold md:pb-0 '><a href="/" className="text-white hover:border-b-2">Home</a></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 mr-4 text-center md:font-bold md:pb-0'><a href="#Servicios" className="text-white hover:border-b-2">Servicios</a></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 mr-4 text-center md:font-bold md:pb-0'><a href="#" className="text-white hover:border-b-2">Productos</a></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 mr-4 text-center md:font-bold md:pb-0'><a href="#" className="text-white hover:border-b-2">Contacto</a></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 mr-4 text-center md:font-bold md:pb-0'><a href="#Nosotros" className="text-white hover:border-b-2">Nosotros</a></li>
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
        <nav className="opacity-100 gap-1 grid  md:grid-cols-2">
            <a href="/"><img src="../img/Logo.png" alt="" className='w-[140px] h-[140px] mx-auto md:mx-2' /></a>
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
