"use client";

import Image from 'next/image';

const CriticalImage = ({ src, alt, width, height, className = "", sizes, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={true}
      quality={75}
      placeholder="empty"
      loading="eager"
      fetchPriority="high"
      {...props}
    />
  );
};

export default CriticalImage;
