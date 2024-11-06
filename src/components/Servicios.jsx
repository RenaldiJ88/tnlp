import React from "react";
import ServiceCard from './ServiceCard';
import data from '../data/services.json';

const Servicios = () => {
  const serviciosData = data.servicios;    
  return (
    <div className="bg-cover bg-center h-auto xl:h-full" style={{backgroundColor:'#1A1A1A'}}>
      <div id="Servicios" className="container py-16 mx-auto">
        <p className="mx-auto mb-10 font-bold text-center text-[40px] xl:text-[42px] text-white font-orbitron">
          SERVICIOS
        </p>
        <div className="flex flex-wrap justify-center  w-full">
          {serviciosData.map((servicio, index) => (
            <div key={index} className="my-5 md:mx-32">
              <ServiceCard             
                title={servicio.categoria}
                description={servicio.descripcion}
                imgService={servicio.imgService}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Servicios;
