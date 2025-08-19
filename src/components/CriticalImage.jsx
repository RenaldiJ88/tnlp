"use client";

import Image from 'next/image';

const CriticalImage = ({ src, alt, width, height, className = "", sizes, ...props }) => {
  // Convertir automáticamente a AVIF para máxima compresión
  const avifSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
  
  return (
    <Image
      src={avifSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={true}
      quality={55}
      placeholder="empty"
      loading="eager"
      fetchPriority="high"
      {...props}
    />
  );
};

export default CriticalImage;
