"use client";  // Esto indica que el componente se debe ejecutar en el cliente

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ServiceCard = ({ title, description, imgService }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg shadow-lg w-[350px] h-auto bg-gradient-to-b from-gray-200 to-gray-300 overflow-hidden">
      <div className="relative w-full h-[220px]">
        <Image src={`/${imgService}`} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h3 className="text-gray-900 text-lg font-bold uppercase">
          {title}
        </h3>
        <p className={`text-gray-700 font-light text-sm transition-all duration-500 ${isExpanded ? 'max-h-full' : 'max-h-20 overflow-hidden'}`}>
          {description}
        </p>
        <button onClick={toggleReadMore} className="text-purple-700 text-sm mt-2">
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      </div>
      <div className="bg-purple-900 h-[60px] flex items-center justify-center">
        <Link target="_blank" rel="noopener noreferrer" href={""}>
          <p className="text-white text-custom-lg font-light uppercase tracking-wider">
            Consulta
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
