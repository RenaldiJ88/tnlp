"use client"
import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'; // ¡IMPORTANTE: Volvemos a importar useRouter!

// Componente de enlaces de navegación
const NavLinks = ({ isProductsDropdownOpen, setProductsDropdownOpen, closeMobileMenu }) => {
    const router = useRouter(); // Inicializamos useRouter aquí

    const handleDropdownClick = () => {
        setProductsDropdownOpen(!isProductsDropdownOpen);
    }

    // Usamos router.push para la navegación entre páginas
    const handleNavLinkClick = (path) => {
        closeMobileMenu(); // Cierra el menú móvil o el desplegable
        router.push(path); // Navega a la nueva ruta
    };

    return (
        <>
            <ul className="pt-5 underline-offset-8 md:pt-14 md:pl-0 rounded-xl bg-black md:bg-transparent md:gap-x-3 lg:gap-x-2 xl:text-xl lg:text-lg md:text-sm md:grid md:grid-cols-5 font-orbitron">
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'>
                    <Link href="/#Servicios" className="text-white hover:border-b-2" onClick={closeMobileMenu}>Servicios</Link>
                </li>

                {/* Contenedor del botón y menú desplegable de Productos */}
                <div className="md:relative text-center text-white">
                    <div className='flex justify-center md:pl-0 pl-4'>
                        <button 
                            className="flex items-center" 
                            onClick={handleDropdownClick}
                            aria-label={isProductsDropdownOpen ? "Cerrar menú productos" : "Abrir menú productos"}
                            aria-expanded={isProductsDropdownOpen}
                        >
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
                        <div className="mx-auto absolute md:mt-4 bg-black text-white w-full flex-col rounded-md p-5 z-50">
                            <ul>
                                <li className='py-2'>
                                    <a onClick={() => handleNavLinkClick('/productos')} className="cursor-pointer text-[#dd40d5] font-bold" role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && handleNavLinkClick('/productos')}>🔍 Todos los productos</a>
                                </li>
                                <li className='mx-auto border-[1px] my-2 border-white w-10 xl:w-28'> </li>
                                <li className='py-2'>
                                    <Link href="/#Marcas" onClick={closeMobileMenu}>Productos en oferta</Link>
                                </li>
                                <li className='mx-auto border-[1px] my-2 border-white w-10 xl:w-28'> </li>
                                <li className='py-2'>
                                    <a onClick={() => handleNavLinkClick('/EquiposGamer')} className="cursor-pointer" role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && handleNavLinkClick('/EquiposGamer')}>Equipos Gamer</a>
                                </li>
                                <li className='mx-auto border-[1px] my-2 border-white w-10 xl:w-28'> </li>
                                <li className='py-2'>
                                    <a onClick={() => handleNavLinkClick('/EquiposOffice')} className="cursor-pointer" role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && handleNavLinkClick('/EquiposOffice')}>Equipos Office</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                {/* Links a IDs en la misma página, pueden mantener el Link normal con onClick directo */}
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Nosotros" className="text-white hover:border-b-2" onClick={closeMobileMenu}>Nosotros</Link></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Map" className="text-white hover:border-b-2" onClick={closeMobileMenu}>Contacto</Link></li>
                <li className='text-lg md:text-sm lg:text-lg font-bold pb-5 text-center md:font-bold md:pb-0'><Link href="/#Faq" className="text-white hover:border-b-2" onClick={closeMobileMenu}>FAQ</Link></li>
            </ul>
        </>
    );
};

// --- COMPONENTE Navbar (MANEJA EL ESTADO isProductsDropdownOpen Y CLICK OUTSIDE) ---
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

    // useEffect para detectar clics fuera del desplegable
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el clic no fue dentro del menú desplegable, lo cierra.
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProductsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav ref={dropdownRef} className="opacity-100 gap-1 grid md:grid-cols-2 bg-transparent h-20 w-full absolute top-0 z-50">
            <a className="ml-16 sm:ml-20 md:ml-28" href="/" aria-label="Ir a inicio"><img src="/img/logotnlp.png" alt="Tu Notebook LP - Logo" className='w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[180px] xl:h-[180px] mx-auto md:mx-2' /></a>

            {/* Versión de escritorio */}
            <div className='hidden md:grid'>
                <NavLinks
                    isProductsDropdownOpen={isProductsDropdownOpen}
                    setProductsDropdownOpen={setProductsDropdownOpen}
                    closeMobileMenu={closeAllMenus}
                />
            </div>

            {/* Botón de menú hamburguesa para móvil */}
            <div className="space-y-2 grid pt-14 pl-6 sm:pl-10 absolute md:hidden">
                <button 
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X color="white"/> : <Menu color='white'/>}
                </button>
            </div>

            {/* Menú móvil desplegado. Ahora también se posiciona ABSOLUTO pero justo debajo del navbar fijo */}
            {isMobileMenuOpen && (
                <div className="absolute top-20 left-0 w-full md:hidden bg-black z-40"> {/* Ajusta top-20 para que empiece debajo del navbar fijo */}
                    <NavLinks
                        isProductsDropdownOpen={isProductsDropdownOpen}
                        setProductsDropdownOpen={setProductsDropdownOpen}
                        closeMobileMenu={closeAllMenus}
                    />
                </div>
            )}
        </nav>
    );
};

export default Navbar;