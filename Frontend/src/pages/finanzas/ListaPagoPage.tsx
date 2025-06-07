import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { Pago } from '@/types/finanzas/Pago';
import { usePagos, useEliminarPago } from '@/hooks/finanzas/usePago';
import ReuModal from '@/components/globales/ReuModal';
import Tabla from '@/components/globales/Tabla'; 
import { Trash2, Eye } from 'lucide-react';

const ListaPagosPage: React.FC = () => {
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: pagos, isLoading, refetch } = usePagos();
  const eliminarMutation = useEliminarPago();
  const navigate = useNavigate();

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'Período', uid: 'periodo' },
    { name: 'Horas Trabajadas', uid: 'horas' },
    { name: 'Total', uid: 'total' },
    { name: 'Usuario', uid: 'nombre_usuario' }, 
    { name: 'Fecha Cálculo', uid: 'fecha_calculo' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleViewDetails = (pago: Pago) => {
    setSelectedPago(pago);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (pago: Pago) => {
    setSelectedPago(pago);
    setIsDeleteModalOpen(true);
  };
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  

  const handleConfirmDelete = () => {
    if (selectedPago && selectedPago.id !== undefined) {
      eliminarMutation.mutate(selectedPago.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const transformedData = (pagos ?? []).map((pago) => ({
    id: pago.id?.toString() || '',
    periodo: `${formatDate(pago.fecha_inicio)} - ${formatDate(pago.fecha_fin)}`,
    horas: `${pago.horas_trabajadas} hrs`,
    total: formatMoney(pago.total_pago), 
    fecha_calculo: formatDateTime(pago.fecha_calculo || ''),
    nombre_usuario: pago.usuario_nombre, 
    acciones: (
      <div className="flex space-x-2">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => handleViewDetails(pago)}
        >
          <Eye size={20} />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDelete(pago)}
        >
          <Trash2 size={20} />
        </button>
      </div>
    ),
  }));

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Historial de Pagos</h2>
      
      <div className="mb-6 flex justify-between items-center">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/finanzas/pago')}
        >
          + Calcular Nuevo Pago
        </button>
      </div>
  
      {isLoading ? (
        <p className="text-gray-600">Cargando pagos...</p>
      ) : (
        <Tabla 
          columns={columns} 
          data={transformedData} 
        />
      )}
  
      <ReuModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        title={`Detalles del Pago #${selectedPago?.id}`}
        size="lg"
      >
        {selectedPago && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Período</p>
                <p className="font-medium">
                  {formatDate(selectedPago.fecha_inicio)} - {formatDate(selectedPago.fecha_fin)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Horas Trabajadas</p>
                <p className="font-medium">{selectedPago.horas_trabajadas} hrs</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Jornales</p>
                <p className="font-medium">{selectedPago.jornales}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Total a Pagar</p>
                <p className="font-medium text-green-600">{formatMoney(selectedPago.total_pago)}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Fecha de Cálculo</p>
                <p className="font-medium">{formatDateTime(selectedPago.fecha_calculo || '')}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Actividades incluidas</p>
              <p className="font-medium">{selectedPago.actividades.length} actividades</p>
            </div>
          </div>
        )}
      </ReuModal>
  
      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este pago?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible. Se eliminará el registro de pago #{selectedPago?.id}.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaPagosPage;