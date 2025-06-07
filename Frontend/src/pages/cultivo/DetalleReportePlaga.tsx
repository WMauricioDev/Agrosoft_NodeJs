import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useReportePlaga } from "@/hooks/cultivo/useReportePlaga";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

const DetalleReportePlaga: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: reporte, isLoading } = useReportePlaga(Number(id));
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!reporte) {
    return <div>Reporte no encontrado</div>;
  }

  const getEstadoIcon = () => {
    switch (reporte.estado) {
      case 'PE':
        return <Clock className="text-yellow-500" size={24} />;
      case 'RE':
        return <AlertCircle className="text-blue-500" size={24} />;
      case 'AT':
        return <CheckCircle className="text-green-500" size={24} />;
      default:
        return null;
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Detalle del Reporte #{reporte.id}</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Volver
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Información General</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Usuario:</span> {reporte.usuario.username}</p>
                <p><span className="font-medium">Fecha:</span> {new Date(reporte.fecha_reporte).toLocaleString()}</p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Estado:</span> 
                  {getEstadoIcon()}
                  {reporte.estado === 'PE' && 'Pendiente'}
                  {reporte.estado === 'RE' && 'Revisado'}
                  {reporte.estado === 'AT' && 'Atendido'}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Ubicación y Plaga</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Bancal:</span> {reporte.bancal.nombre}</p>
                <p><span className="font-medium">Ubicación:</span> {reporte.bancal.ubicacion}</p>
                <p><span className="font-medium">Plaga:</span> {reporte.plaga.nombre}</p>
                <p><span className="font-medium">Descripción plaga:</span> {reporte.plaga.descripcion}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Observaciones</h2>
            <p className="bg-gray-50 p-4 rounded-lg">{reporte.observaciones}</p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DetalleReportePlaga;