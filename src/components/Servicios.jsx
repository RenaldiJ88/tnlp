import React from "react";
import ServiceCard from './ServiceCard';
import data from '../data/services.json';

const Servicios = () => {
  const serviciosData = data.servicios;    
  return (
    <div className="bg-cover bg-center h-auto xl:h-[100vh]" style={{backgroundColor:'#1A1A1A'}}>
      <div id="productos" className="container py-16 mx-auto">
        <p className="mx-auto font-bold text-center text-[40px] xl:text-[42px] text-white">
          SERVICIOS
        </p>
        <div className="flex flex-wrap justify-center">
          {serviciosData.map((servicio, index) => (
            <div key={index} className="my-5 xl:my-16 mx-8">
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
