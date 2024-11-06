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
    <div className="rounded-lg shadow-lg w-[300px] h-auto bg-gradient-to-b from-gray-200 to-gray-300 overflow-hidden  ">
      <div className="relative w-full h-[220px]">
        <Image src={`/${imgService}`} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h3 className="text-gray-900 text-lg font-bold uppercase font-orbitron">
          {title}
        </h3>
        <p className={`text-gray-700  font-roboto  font-semibold text-sm transition-all duration-500 ${isExpanded ? 'min-h-[220px]' : 'max-h-20 overflow-hidden'}`}>
          {description}
        </p>
        <button onClick={toggleReadMore} className="text-[#dd40d5] text-sm mt-2 font-orbitron no-underline hover:underline">
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      </div>
      <div className="bg-black">
          <Link target="_blank" rel="noopener noreferrer" href={"https://wa.me/5492216767615"}>
        <div className="bg-[#dd40d5] hover:opacity-80 opacity-60 h-[50px] flex items-center justify-center">
            <p className="text-black  text-custom-lg  uppercase tracking-wider font-orbitron">
              Consulta
            </p>
      </div>
          </Link>
        </div>
    </div>
  );
};

export default ServiceCard;
