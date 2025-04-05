import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useCosechas, useActualizarCosecha, useEliminarCosecha } from "@/hooks/cultivo/usecosecha";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";
import { EditIcon, Trash2 } from 'lucide-react';

const ListarCosechaPage: React.FC = () => {
  const [selectedCosecha, setSelectedCosecha] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: cosechas, isLoading, refetch } = useCosechas();
  const { data: cultivos } = useCultivos();
  const actualizarMutation = useActualizarCosecha();
  const eliminarMutation = useEliminarCosecha();
  const navigate = useNavigate();

  const columns = [
    { name: "Cultivo", uid: "cultivo" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Unidades de Medida", uid: "unidades_de_medida" },
    { name: "Fecha", uid: "fecha" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (cosecha: any) => {
    setSelectedCosecha(cosecha);
    setIsEditModalOpen(true);
  };

  const handleDelete = (cosecha: any) => {
    setSelectedCosecha(cosecha);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCosecha && selectedCosecha.id !== undefined) {
      eliminarMutation.mutate(selectedCosecha.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (cosechas ?? []).map((cosecha) => ({
    id: cosecha.id?.toString() || '',
    cultivo: cultivos?.find((cultivo) => cultivo.id === cosecha.id_cultivo)?.nombre || 'Sin cultivo',
    cantidad: cosecha.cantidad,
    unidades_de_medida: cosecha.unidades_de_medida,
    fecha: new Date(cosecha.fecha).toLocaleDateString(),
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(cosecha)}
        >
           <EditIcon size={22} color='black'/>
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(cosecha)}
        >
            <Trash2   size={22} color='red'/>
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Cosechas</h2>
          <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/cosecha/')} 
                        >
                        + Registrar
                        </button>
            </div>
          {isLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <>
              <Tabla columns={columns} data={transformedData} />
            </>
          )}

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Cosecha"
        onConfirm={() => {
          if (selectedCosecha && selectedCosecha.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedCosecha.id, cosecha: selectedCosecha },
              {
                onSuccess: () => {
                  setIsEditModalOpen(false);
                  refetch();
                },
              }
            );
          }
        }}
      >
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Cultivo</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCosecha?.id_cultivo || 0}
            onChange={(e) =>
              setSelectedCosecha((prev: any) => ({
                ...prev,
                id_cultivo: parseInt(e.target.value),
              }))
            }
          >
            <option value="">Seleccione un cultivo</option>
            {cultivos?.map((cultivo) => (
              <option key={cultivo.id} value={cultivo.id}>{cultivo.nombre}</option>
            ))}
          </select>
        </div>
        <ReuInput
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          type="number"
          value={selectedCosecha?.cantidad || 0}
          onChange={(e) =>
            setSelectedCosecha((prev: any) => ({
              ...prev,
              cantidad: parseFloat(e.target.value),
            }))
          }
        />
        <ReuInput
          label="Unidades de Medida"
          placeholder="Ingrese las unidades de medida"
          type="text"
          value={selectedCosecha?.unidades_de_medida || ''}
          onChange={(e) =>
            setSelectedCosecha((prev: any) => ({
              ...prev,
              unidades_de_medida: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Fecha"
          placeholder="Ingrese la fecha"
          type="date"
          value={selectedCosecha?.fecha || ''}
          onChange={(e) =>
            setSelectedCosecha((prev: any) => ({
              ...prev,
              fecha: e.target.value,
            }))
          }
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta cosecha?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListarCosechaPage;