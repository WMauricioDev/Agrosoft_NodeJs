// src/pages/ListaResiduoPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { Residuo } from '../../types/cultivo/Residuos';
import { useResiduos, useActualizarResiduo, useEliminarResiduo } from '../../hooks/cultivo/useResiduo';
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla';
import { EditIcon, Trash2 } from 'lucide-react';
import { useCosechas } from '@/hooks/cultivo/usecosecha';
import { useTipoResiduos } from '@/hooks/cultivo/useTipoResiduo';
import { addToast } from '@heroui/react';

const ListaResiduoPage: React.FC = () => {
  const [selectedResiduo, setSelectedResiduo] = useState<Residuo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: residuos, isLoading, refetch } = useResiduos();
  const { data: cosechas } = useCosechas();
  const { data: tiposResiduos } = useTipoResiduos();
  const actualizarMutation = useActualizarResiduo();
  const eliminarMutation = useEliminarResiduo();
  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Cantidad', uid: 'cantidad' },
    { name: 'Fecha', uid: 'fecha' },
    { name: 'Tipo Residuo', uid: 'tipoResiduo' },
    { name: 'Cosecha', uid: 'cosecha' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (residuo: Residuo) => {
    setSelectedResiduo(residuo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (residuo: Residuo) => {
    setSelectedResiduo(residuo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmEdit = () => {
    if (selectedResiduo && selectedResiduo.id !== undefined) {
      if (!selectedResiduo.nombre) {
        addToast({
          title: "Error",
          description: "El nombre es obligatorio",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      if (!selectedResiduo.id_cosecha_id) {
        addToast({
          title: "Error",
          description: "Seleccione una cosecha",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      if (!selectedResiduo.id_tipo_residuo_id) {
        addToast({
          title: "Error",
          description: "Seleccione un tipo de residuo",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      if (!selectedResiduo.fecha) {
        addToast({
          title: "Error",
          description: "La fecha es obligatoria",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      if (selectedResiduo.cantidad <= 0) {
        addToast({
          title: "Error",
          description: "La cantidad debe ser mayor a 0",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      actualizarMutation.mutate(
        { id: selectedResiduo.id as number, residuo: selectedResiduo },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            refetch();
          },
        }
      );
    }
  };

  const handleConfirmDelete = () => {
    if (selectedResiduo && selectedResiduo.id !== undefined) {
      eliminarMutation.mutate(selectedResiduo.id as number, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (residuos ?? []).map((residuo) => {
    const cosecha = cosechas?.find(c => c.id === residuo.id_cosecha_id);
    const cosechaNombre = cosecha ? `Cultivo ID: ${cosecha.id_cultivo_id} - Fecha: ${cosecha.fecha}` : 'Desconocido';
    const tipoResiduoNombre = tiposResiduos?.find(t => t.id === residuo.id_tipo_residuo_id)?.nombre || 'Desconocido';

    return {
      id: residuo.id?.toString() || '',
      nombre: residuo.nombre,
      descripcion: residuo.descripcion,
      cosecha: cosechaNombre,
      cantidad: residuo.cantidad,
      fecha: residuo.fecha,
      tipoResiduo: tipoResiduoNombre,
      acciones: (
        <>
          <button
            className="text-green-500 hover:underline mr-2"
            onClick={() => handleEdit(residuo)}
          >
            <EditIcon size={22} color='black'/>
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => handleDelete(residuo)}
          >
            <Trash2 size={22} color='red'/>
          </button>
        </>
      ),
    };
  });

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Residuos Registrados</h2>
      <div className="mb-2 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/cultivo/residuo')}
        >
          + Registrar
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <Tabla columns={columns} data={transformedData} />
      )}

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Residuo"
        onConfirm={handleConfirmEdit}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={selectedResiduo?.nombre || ''}
          onChange={(e) =>
            setSelectedResiduo((prev) => ({
              ...prev!,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={selectedResiduo?.descripcion || ''}
          onChange={(e) =>
            setSelectedResiduo((prev) => ({
              ...prev!,
              descripcion: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Fecha"
          placeholder="Seleccione la fecha"
          type="date"
          value={selectedResiduo?.fecha || ''}
          onChange={(e) =>
            setSelectedResiduo((prev) => ({
              ...prev!,
              fecha: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          type="number"
          value={selectedResiduo?.cantidad.toString() || ''}
          onChange={(e) =>
            setSelectedResiduo((prev) => ({
              ...prev!,
              cantidad: Number(e.target.value) || 0,
            }))
          }
        />
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">Cosecha</label>
          <select
            value={selectedResiduo?.id_cosecha_id || ''}
            onChange={(e) =>
              setSelectedResiduo((prev) => ({
                ...prev!,
                id_cosecha_id: Number(e.target.value) || 0,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione una cosecha</option>
            {cosechas?.map((cosecha) => (
              <option key={cosecha.id} value={cosecha.id}>
                Cultivo ID: {cosecha.id_cultivo_id} - Fecha: {cosecha.fecha}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700">Tipo de Residuo</label>
          <select
            value={selectedResiduo?.id_tipo_residuo_id || ''}
            onChange={(e) =>
              setSelectedResiduo((prev) => ({
                ...prev!,
                id_tipo_residuo_id: Number(e.target.value) || 0,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un tipo de residuo</option>
            {tiposResiduos?.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este residuo?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaResiduoPage;