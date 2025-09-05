'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { supabase } from '../../../lib/supabase';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Cargar datos del producto
    useEffect(() => {
        const loadProduct = async () => {
            try {
                // Buscar producto por ID en Supabase
                const { data: productData, error: productError } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('id', params.id)
                    .single();
                
                if (productError || !productData) {
                    console.error('Error loading product:', productError);
                    router.push('/productos');
                    return;
                }
                
                // Mapear campos de Supabase a formato esperado
                const foundProduct = {
                    ...productData,
                    isOffer: productData.is_offer,
                    lastModified: productData.last_modified
                };
                
                setProduct(foundProduct);
                
                // Buscar productos relacionados (misma categoría)
                const { data: relatedData, error: relatedError } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('categoria', foundProduct.categoria)
                    .neq('id', foundProduct.id)
                    .limit(3);
                
                if (!relatedError && relatedData) {
                    const mappedRelated = relatedData.map(p => ({
                        ...p,
                        isOffer: p.is_offer,
                        lastModified: p.last_modified
                    }));
                    setRelatedProducts(mappedRelated);
                }
                
                // Track page view
                trackEvent('view_item', {
                    item_id: foundProduct.id,
                    item_name: foundProduct.title,
                    item_category: foundProduct.categoria,
                    value: parseFloat(foundProduct.price.replace(/[^0-9.]/g, ''))
                });
                
            } catch (error) {
                console.error('Error loading product:', error);
                router.push('/productos');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            loadProduct();
        }
    }, [params.id, router, trackEvent]);

    const handleWhatsAppContact = () => {
        const whatsappNumber = "5492216767615";
        const message = `¡Hola! Me interesa el producto: ${product.title} - ${product.price}. ¿Podrías darme más información?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Track WhatsApp contact
        trackEvent('whatsapp_product_inquiry', {
            product_id: product.id,
            product_name: product.title,
            source: 'product_detail'
        });
        
        window.open(whatsappUrl, '_blank');
    };

    const handleRelatedProductClick = (relatedProduct) => {
        trackEvent('view_item', {
            item_id: relatedProduct.id,
            item_name: relatedProduct.title,
            source: 'related_products'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh] pt-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dd40d5]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <div className="container mx-auto px-4 py-20 pt-40 text-center">
                    <h1 className="text-2xl font-orbitron font-bold text-white mb-4">Producto no encontrado</h1>
                    <Link href="/productos" className="text-[#dd40d5] hover:text-white font-orbitron transition-colors">
                        Volver a productos
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8 pt-40">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-300 font-orbitron">
                        <li><Link href="/" className="hover:text-[#dd40d5] transition-colors">Inicio</Link></li>
                        <li className="text-gray-500">/</li>
                        <li><Link href="/productos" className="hover:text-[#dd40d5] transition-colors">Equipos</Link></li>
                        <li className="text-gray-500">/</li>
                        <li className="text-[#dd40d5] font-medium">{product.title}</li>
                    </ol>
                </nav>

                {/* Producto Principal */}
                <motion.div 
                    className="bg-[#1F1F1F] rounded-2xl border border-gray-800 overflow-hidden mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Imagen del producto */}
                        <div className="relative">
                            <div className="relative w-full h-80 bg-black rounded-xl overflow-hidden flex items-center justify-center">
                                <Image
                                    src={product.image.startsWith('/') ? product.image : `/${product.image}`}
                                    alt={product.title}
                                    width={400}
                                    height={300}
                                    className="object-contain max-w-[350px] max-h-[250px]"
                                    quality={90}
                                    priority
                                />
                            </div>
                            
                            {/* Badge de oferta */}
                            {product.isOffer === 1 && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                                    OFERTA
                                </div>
                            )}
                        </div>

                        {/* Información del producto */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
                                    {product.title}
                                </h1>
                                
                                <div className="flex items-center space-x-4 mb-6">
                                    <span className="text-4xl font-orbitron font-bold text-[#dd40d5]">
                                        {product.price}
                                    </span>
                                    {product.isOffer === 1 && (
                                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                            Precio especial
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="bg-black rounded-xl p-6 border border-gray-700">
                                <h3 className="text-lg font-orbitron font-semibold text-white mb-3">
                                    Especificaciones técnicas
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Características destacadas */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-orbitron font-semibold text-white">
                                    Características destacadas
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center space-x-2 text-[#dd40d5]">
                                        <span className="text-lg">✓</span>
                                        <span className="text-sm">Garantía incluida</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[#dd40d5]">
                                        <span className="text-lg">✓</span>
                                        <span className="text-sm">Entrega rápida</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[#dd40d5]">
                                        <span className="text-lg">✓</span>
                                        <span className="text-sm">Soporte técnico</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[#dd40d5]">
                                        <span className="text-lg">✓</span>
                                        <span className="text-sm">Instalación gratis</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="space-y-4 pt-6">
                                <motion.button
                                    onClick={handleWhatsAppContact}
                                    className="w-full bg-[#dd40d5] hover:bg-white hover:text-[#dd40d5] text-white font-orbitron font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-lg">📱</span>
                                    <span>Consultar por WhatsApp</span>
                                </motion.button>
                                
                                <div className="flex justify-center">
                                    <button className="bg-black border border-[#dd40d5] hover:bg-[#dd40d5] text-white font-orbitron font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                                        Comparar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Productos relacionados */}
                {relatedProducts.length > 0 && (
                    <motion.section 
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                            Productos relacionados
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <motion.div
                                    key={relatedProduct.id}
                                    className="bg-[#1F1F1F] rounded-xl border border-gray-800 overflow-hidden hover:border-[#dd40d5] transition-all duration-300"
                                    whileHover={{ y: -5 }}
                                >
                                    <Link 
                                        href={`/productos/${relatedProduct.id}`}
                                        onClick={() => handleRelatedProductClick(relatedProduct)}
                                    >
                                        <div className="relative h-48 bg-black flex items-center justify-center p-4">
                                            <Image
                                                src={relatedProduct.image.startsWith('/') ? relatedProduct.image : `/${relatedProduct.image}`}
                                                alt={relatedProduct.title}
                                                width={200}
                                                height={150}
                                                className="object-contain max-w-[180px] max-h-[130px]"
                                                quality={75}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-orbitron font-semibold text-white mb-2 line-clamp-2">
                                                {relatedProduct.title}
                                            </h3>
                                            <p className="text-lg font-orbitron font-bold text-[#dd40d5]">
                                                {relatedProduct.price}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Información adicional */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="bg-[#1F1F1F] rounded-xl border border-gray-800 p-6 text-center">
                        <div className="text-2xl mb-3">🇺🇸</div>
                        <h3 className="font-orbitron font-semibold text-white mb-2">Equipos traídos de EEUU</h3>
                        <p className="text-gray-300 text-sm">Calidad y tecnología americana</p>
                    </div>
                    
                    <div className="bg-[#1F1F1F] rounded-xl border border-gray-800 p-6 text-center">
                        <div className="text-2xl mb-3">🛡️</div>
                        <h3 className="font-orbitron font-semibold text-white mb-2">Garantía</h3>
                        <p className="text-gray-300 text-sm">6 meses de garantía oficial</p>
                    </div>
                    
                    <div className="bg-[#1F1F1F] rounded-xl border border-gray-800 p-6 text-center">
                        <div className="text-2xl mb-3">🔧</div>
                        <h3 className="font-orbitron font-semibold text-white mb-2">Soporte técnico</h3>
                        <p className="text-gray-300 text-sm">Asistencia técnica personalizada</p>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}