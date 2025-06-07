import { useState } from "react";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import DefaultLayout from "@/layouts/default";
import { TrazabilidadItem } from '@/types/cultivo/Trazabilidad';
import { useTrazabilidad } from "@/hooks/cultivo/useTrazabilidad";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { GiWheat, GiPlantSeed, GiWaterDrop } from "react-icons/gi";
import { MdEventNote, MdOutlinePestControl, MdOutlineScience } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa";
import { BsDropletFill } from "react-icons/bs";

export const TrazabilidadCosecha = () => {
  const [selectedCultivo, setSelectedCultivo] = useState<number | null>(null);

  const { data: cultivos, isLoading: isLoadingCultivos } = useCultivos();

  const { data: trazabilidad, isLoading: isLoadingTrazabilidad } = useTrazabilidad(selectedCultivo ?? 0, !!selectedCultivo);

  const handleCultivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCultivo(Number(e.target.value));
  };

  const getColorByType = (type: string) => {
    const colors = {
      "Cosecha": "#10cc52", 
      "Siembra": "#e91e63", 
      "Riego": "#2196F3", 
      "Fertilización": "#9c27b0", 
      "Control de Plagas": "#ff9800", 
      "Muestreo": "#009688", 
      "Inspección": "#795548",
      "default": "#607d8b" 
    };

    return colors[type as keyof typeof colors] || colors.default;
  };

  const getIconByType = (type: string) => {
    const icons = {
      "Cosecha": <GiWheat size={20} />,
      "Siembra": <GiPlantSeed size={20} />,
      "Riego": <BsDropletFill size={20} />,
      "Fertilización": <GiWaterDrop size={20} />,
      "Control de Plagas": <MdOutlinePestControl size={20} />,
      "Muestreo": <MdOutlineScience size={20} />,
      "Inspección": <FaClipboardCheck size={20} />,
      "default": <MdEventNote size={20} />
    };

    return icons[type as keyof typeof icons] || icons.default;
  };
  
  const formatContent = (item: TrazabilidadItem) => {
    const commonContent = (
      <>
        <h3 className="vertical-timeline-element-title font-bold text-lg mb-1">{item.tipo}</h3>
        <p className="text-sm opacity-90 mb-1">
          <span className="font-semibold">Fecha:</span> {new Date(item.fecha).toLocaleDateString()}
        </p>
      </>
    );

    switch(item.tipo) {
      case "Cosecha":
        return (
          <div>
            {commonContent}
            <p className="text-sm opacity-90">
              <span className="font-semibold">Cantidad:</span> {item.datos.cantidad} kg
            </p>
            {item.datos.calidad && (
              <p className="text-sm opacity-90">
                <span className="font-semibold">Calidad:</span> {item.datos.calidad}
              </p>
            )}
          </div>
        );
   
   
      default:
        return (
          <div>
            {commonContent}
            {Object.entries(item.datos).map(([key, value]) => (
              <p key={key} className="text-sm opacity-90">
                <span className="font-semibold">{key}:</span> {String(value)}
              </p>
            ))}
          </div>
        );
    }
  };

  return (
    <DefaultLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Trazabilidad de Cultivos</h1>
        
        <div className="mb-8 max-w-md">
          <label htmlFor="cultivo-select" className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar cultivo
          </label>
          <select
            id="cultivo-select"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            onChange={handleCultivoChange}
            value={selectedCultivo || ""}
            disabled={isLoadingCultivos}
          >
            <option value="">Selecciona un cultivo</option>
            {cultivos?.map((cultivo) => (
              <option key={cultivo.id} value={cultivo.id}>
                {cultivo.nombre} (ID: {cultivo.id})
              </option>
            ))}
          </select>
          {isLoadingCultivos && (
            <p className="mt-2 text-sm text-gray-500 animate-pulse">Cargando cultivos...</p>
          )}
        </div>
        
        {isLoadingTrazabilidad && selectedCultivo && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {trazabilidad && (
            <VerticalTimeline 
              layout="2-columns" 
              lineColor="#e0e0e0"
              animate={true}
              className="!p-0"
            >
              {trazabilidad.map((item, index) => {
                const color = getColorByType(item.tipo);
                const position = index % 2 === 0 ? "left" : "right";
                
                return (
                  <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element--work"
                    contentStyle={{ 
                      background: color, 
                      color: '#fff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      borderRadius: '0.5rem',
                      marginBottom: '2rem'
                    }}
                    contentArrowStyle={{ 
                      borderRight: position === "right" ? `7px solid ${color}` : "none",
                      borderLeft: position === "left" ? `7px solid ${color}` : "none"
                    }}
                    date={new Date(item.fecha).toLocaleDateString()}
                    dateClassName="text-gray-600 font-medium"
                    iconStyle={{ 
                      background: color, 
                      color: '#fff',
                      boxShadow: `0 0 0 4px ${color}, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05)`
                    }}
                    icon={getIconByType(item.tipo)}
                    position={position}
                  >
                    {formatContent(item)}
                  </VerticalTimelineElement>
                );
              })}
            </VerticalTimeline>
        )}
        
        {!selectedCultivo && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Selecciona un cultivo del menú desplegable para visualizar su historial de trazabilidad.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {selectedCultivo && !isLoadingTrazabilidad && (!trazabilidad || trazabilidad.length === 0) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No se encontraron registros de trazabilidad para el cultivo seleccionado.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};