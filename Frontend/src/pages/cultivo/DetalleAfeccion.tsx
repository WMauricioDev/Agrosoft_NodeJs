import ReuModal from "@/components/globales/ReuModal";
import { CircleAlert, CircleCheck, CircleDot, CircleX } from "lucide-react";
import { AfeccionDetalle } from "@/types/cultivo/Afeccion";

interface ModalDetalleAfeccionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  afeccion: AfeccionDetalle | null;
}

export const ModalDetalleAfeccion = ({ 
  isOpen, 
  onOpenChange, 
  afeccion 
}: ModalDetalleAfeccionProps) => {
  const getEstadoIcon = () => {
    if (!afeccion) return null;
    switch (afeccion.estado) {
      case 'AC': return <CircleDot className="text-orange-500" size={24} />;
      case 'ST': return <CircleCheck className="text-green-500" size={24} />;
      case 'EC': return <CircleAlert className="text-blue-500" size={24} />;
      case 'EL': return <CircleX className="text-red-500" size={24} />;
      default: return null;
    }
  };

  const getGravedadClass = () => {
    if (!afeccion) return '';
    switch (afeccion.gravedad) {
      case 'G': return 'bg-red-100 text-red-800';
      case 'M': return 'bg-yellow-100 text-yellow-800';
      case 'L': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Detalles de ${afeccion?.nombre || 'Afección'}`}
      size="lg"
    >
      {afeccion && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Información General</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Estado:</span> 
                  <span className="flex items-center gap-2">
                    {getEstadoIcon()}
                    {afeccion.estado === 'AC' && 'Activa'}
                    {afeccion.estado === 'ST' && 'Estable'}
                    {afeccion.estado === 'EC' && 'En Control'}
                    {afeccion.estado === 'EL' && 'Eliminada'}
                  </span>
                </p>
                <p><span className="font-medium">Gravedad:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getGravedadClass()}`}>
                    {afeccion.gravedad === 'L' && 'Leve'}
                    {afeccion.gravedad === 'M' && 'Moderada'}
                    {afeccion.gravedad === 'G' && 'Grave'}
                  </span>
                </p>
                <p><span className="font-medium">Fecha Detección:</span> 
                  {new Date(afeccion.fecha_deteccion).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Ubicación</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Cultivo:</span> {afeccion.cultivo.nombre}</p>
                <p><span className="font-medium">Bancal:</span> {afeccion.bancal.nombre}</p>
                <p><span className="font-medium">Ubicación:</span> {afeccion.bancal.ubicacion}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Plaga</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">{afeccion.plaga.nombre}</h3>
              <p className="text-gray-600">{afeccion.plaga.descripcion}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{afeccion.descripcion}</p>
            </div>
          </div>

          {afeccion.reporte && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Reporte Asociado</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p><span className="font-medium">Reportado por:</span> {afeccion.reporte.usuario}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </ReuModal>
  );
};