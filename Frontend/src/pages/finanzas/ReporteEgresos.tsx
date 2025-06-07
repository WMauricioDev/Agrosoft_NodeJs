import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useReportePagoDetalle } from "@/hooks/finanzas/useReporteEgresos";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

const DetalleReportePago: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: reporte, isLoading } = useReportePagoDetalle(Number(id));
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!reporte) {
    return <div>Reporte no encontrado</div>;
  }

  const getEstadoIcon = () => {
    switch (reporte.estado) {
      case 'PE': // Pendiente
        return <Clock className="text-yellow-500" size={24} />;
      case 'RE': // Revisado
        return <AlertCircle className="text-blue-500" size={24} />;
      case 'AT': // Atendido
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
                <p><span className="font-medium">Correo electrónico:</span> {reporte.usuario.email}</p>
                <p><span className="font-medium">Fecha de pago:</span> {new Date(reporte.fecha_pago).toLocaleString()}</p>
                <p><span className="font-medium">Mes:</span> {reporte.mes}</p>
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
              <h2 className="text-lg font-semibold mb-2">Salario</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Descripción:</span> {reporte.salario.descripcion}</p>
                <p><span className="font-medium">Valor:</span> ${reporte.salario.valor.toFixed(2)}</p>
                <p><span className="font-medium">Total pago:</span> ${reporte.total_pago.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Actividades</h2>
            <div className="space-y-3">
              {reporte.actividades.map((actividad) => (
                <p key={actividad.id}>
                  <span className="font-medium">Actividad:</span> {actividad.nombre}
                </p>
              ))}
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

export default DetalleReportePago;
