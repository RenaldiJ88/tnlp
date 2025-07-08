"use client"
import { useState, useEffect, useRef } from 'react' // Importamos useEffect y useRef
import { Menu, X } from 'lucide-react'
import Link from "next/link"
// Eliminamos la importación de useRouter, ya no es necesaria

const NavLinks = ({ isProductsDropdownOpen, setProductsDropdownOpen, closeMobileMenu }) => {
    // NavLinks ya NO tiene currentPathname como prop.

    const handleDropdownClick = () => {
        setProductsDropdownOpen(!isProductsDropdownOpen); 
    }

    // No hay useEffect aquí. Toda la lógica de cierre se gestiona en Navbar.

    return (
        <>
        <ul className="pt-5 underline-offset-8 md:pt-14  md:pl-0 rounded-xl bg-black md:bg-transparent md:gap-x-3 lg:gap-x-2 xl:text-xl lg:text-lg md:text-sm md:grid md:grid-cols-5 font-orbitron">
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Servicios" className="text-white hover:border-b-2" onClick={closeMobileMenu}>Servicios</Link></li>
                
                {/* Contenedor del botón y menú desplegable de Productos */}
                <div className="md:relative text-center text-white  ">
                    <div className='flex justify-center md:pl-0 pl-4'>
                        <button className="flex items-center" onClick={handleDropdownClick}>
                        <p className="border-b-2 border-transparent text-lg md:text-sm lg:text-lg font-bold md:hover:border-white ">Productos</p>
                        {isProductsDropdownOpen ?
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

                    {isProductsDropdownOpen && (
                        <div className=" mx-auto absolute md:mt-4 bg-black text-white w-full flex-col rounded-md p-5">
                            <ul>
                                {/* Aseguramos que cada Link cierre también el menú móvil y el desplegable */}
                                <Link href="/#Marcas" onClick={closeMobileMenu}><li>Productos en oferta</li></Link>
                                <li className='mx-auto border-[1px] my-2 border-white w-10 xl:w-28'> </li>
                                <Link href="/EquiposGamer" onClick={closeMobileMenu}><li className='py-2'>Equipos Gamer</li></Link>
                                <li className='mx-auto border-[1px] my-2 border-white w-10 xl:w-28'> </li>
                                <Link href="/EquiposOffice" onClick={closeMobileMenu}><li>Equipos Office</li></Link>
                            </ul>

                        </div>
                    )}
                </div>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Nosotros" className="text-white hover:border-b-2" onClick={closeMobileMenu}>Nosotros</Link></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Map" className="text-white hover:border-b-2" onClick={closeMobileMenu}>Contacto</Link></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Faq" className="text-white hover:border-b-2" onClick={closeMobileMenu}>FAQ</Link></li>
            </ul>
        </> 
    );
};

// --- COMPONENTE Navbar (AHORA MANEJA EL ESTADO isProductsDropdownOpen CON CLICK OUTSIDE) ---
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductsDropdownOpen, setProductsDropdownOpen] = useState(false); // Estado del desplegable de Productos
    const dropdownRef = useRef(null); // Referencia para detectar clics fuera del desplegable

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setProductsDropdownOpen(false); // Cierra el desplegable de Productos al abrir/cerrar menú móvil
    };

    const closeAllMenus = () => { // Función para cerrar ambos menús (móvil y desplegable de Productos)
        setIsMobileMenuOpen(false);
        setProductsDropdownOpen(false);
    };

    // --- NUEVO CÓDIGO: useEffect para detectar clics fuera del desplegable ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el clic no fue dentro del menú desplegable, lo cierra.
            // Esto incluye clics en el resto de la página o en otros elementos del Navbar.
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProductsDropdownOpen(false);
            }
        };

        // Añadir el event listener al documento cuando el componente se monta
        document.addEventListener('mousedown', handleClickOutside);

        // Limpiar el event listener cuando el componente se desmonte
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Se ejecuta una sola vez al montar

    // Eliminamos la lógica de router.events.on('routeChangeStart') de aquí
    // currentPathname ya no es necesario

    return (
        <>
            {/* El nav principal ahora tiene la referencia para el click outside y una altura fija */}
            <nav ref={dropdownRef} className="opacity-100 gap-1 grid md:grid-cols-2 bg-transparent h-20"> {/* AÑADIDO h-20 */}
                <a className="ml-28" href="/"><img src="/img/logotnlp.png" alt="" className='w-[140px] h-[140px] lg:w-[180px] xl:h-[180px] mx-auto md:mx-2' /></a>
                
                {/* Versión de escritorio */}
                <div className='hidden md:grid'>
                    <NavLinks 
                        isProductsDropdownOpen={isProductsDropdownOpen} 
                        setProductsDropdownOpen={setProductsDropdownOpen} 
                        closeMobileMenu={closeAllMenus} 
                        // currentPathname ya no se pasa aquí
                    />
                </div>
                
                {/* Botón de menú hamburguesa para móvil */}
                <div className="space-y-2 grid pt-14 pl-6 sm:pl-10 absolute md:hidden">
                    <button onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <X color="white"/> : <Menu color='white'/>}
                    </button>
                </div>
            </nav>
            
            {/* Menú móvil desplegado */}
            {isMobileMenuOpen && (
                <div>
                    <NavLinks 
                        isProductsDropdownOpen={isProductsDropdownOpen} 
                        setProductsDropdownOpen={setProductsDropdownOpen} 
                        closeMobileMenu={closeAllMenus} 
                        // currentPathname ya no se pasa aquí
                    />
                </div>
            )}
        </>
    );
};

export default Navbar;