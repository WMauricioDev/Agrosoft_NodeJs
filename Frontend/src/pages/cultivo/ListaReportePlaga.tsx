import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useReportesPlaga, useActualizarEstadoReporte } from "@/hooks/cultivo/useReportePlaga";
import Tabla from "@/components/globales/Tabla";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import ReuModal from "@/components/globales/ReuModal";

const ListaReportePlaga: React.FC = () => {
  const { data: reportes, isLoading } = useReportesPlaga();
  const [selectedReporte, setSelectedReporte] = useState<number | null>(null);
  const [action, setAction] = useState<"RE" | "AT" | null>(null);
  const mutation = useActualizarEstadoReporte();
  const navigate = useNavigate();

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Usuario", uid: "usuario" },
    { name: "Bancal", uid: "bancal" },
    { name: "Plaga", uid: "plaga" },
    { name: "Estado", uid: "estado" },
    { name: "Fecha", uid: "fecha" },
    { name: "Acciones", uid: "acciones" },
  ];

  const transformedData = reportes?.map((reporte) => ({
    id: reporte.id.toString(),
    usuario: reporte.usuario.username,
    bancal: reporte.bancal.nombre,
    plaga: reporte.plaga.nombre,
    estado: (
      <div className="flex items-center gap-1">
        {reporte.estado === 'PE' && <Clock className="text-yellow-500" size={18} />}
        {reporte.estado === 'RE' && <AlertCircle className="text-blue-500" size={18} />}
        {reporte.estado === 'AT' && <CheckCircle className="text-green-500" size={18} />}
        <span>
          {reporte.estado === 'PE' && 'Pendiente'}
          {reporte.estado === 'RE' && 'Revisado'}
          {reporte.estado === 'AT' && 'Atendido'}
        </span>
      </div>
    ),
    fecha: new Date(reporte.fecha_reporte).toLocaleDateString(),
    acciones: (
      <div className="flex gap-2">
        {reporte.estado === 'PE' && (
          <button
            onClick={() => {
              setSelectedReporte(reporte.id);
              setAction("RE");
            }}
            className="text-blue-500 hover:underline text-sm"
          >
            Revisar
          </button>
        )}
        {reporte.estado === 'RE' && (
          <button
            onClick={() => {
              setSelectedReporte(reporte.id);
              setAction("AT");
            }}
            className="text-green-500 hover:underline text-sm"
          >
            Atender
          </button>
        )}
        <button
          onClick={() => navigate(`/cultivo/detallereporteplaga/${reporte.id}`)}
          className="text-gray-600 hover:underline text-sm"
        >
          Detalles
        </button>
      </div>
    ),
  })) || [];

  const handleConfirmAction = () => {
    if (selectedReporte && action) {
      mutation.mutate(
        { id: selectedReporte, estado: action },
        {
          onSuccess: () => {
            setSelectedReporte(null);
            setAction(null);
          },
        }
      );
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reportes de Plagas</h1>
      </div>
      <div className="mb-6 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/cultivo/reportarplaga')}
        >
          + Nuevo Reporte

        </button>
      </div>

     

      {isLoading ? (
        <div className="text-center py-8">Cargando reportes...</div>
      ) : reportes?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay reportes registrados
        </div>
      ) : (
        <Tabla 
          columns={columns} 
          data={transformedData} 
        />
      )}

      <ReuModal
        isOpen={!!action}
        onOpenChange={(open) => !open && setAction(null)}
        title={`Confirmar ${action === 'RE' ? 'revisión' : 'atención'}`}
        onConfirm={handleConfirmAction}
        confirmText={action === 'RE' ? 'Marcar como Revisado' : 'Marcar como Atendido'}
        cancelText="Cancelar"
      >
        <p className="text-gray-700">
          ¿Estás seguro que deseas marcar este reporte como{' '}
          <span className="font-semibold">
            {action === 'RE' ? 'revisado' : 'atendido'}
          </span>?
        </p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaReportePlaga;