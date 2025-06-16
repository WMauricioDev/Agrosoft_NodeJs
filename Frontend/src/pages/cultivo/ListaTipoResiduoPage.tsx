import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { TipoResiduo } from '../../types/cultivo/TipoResiduo';
import { useTipoResiduos, useActualizarTipoResiduo, useEliminarTipoResiduo } from '../../hooks/cultivo/useTipoResiduo';
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla'; 
import { EditIcon, Trash2 } from 'lucide-react';
import { addToast } from '@heroui/react';

const ListaTipoResiduoPage: React.FC = () => {
  const [selectedTipoResiduo, setSelectedTipoResiduo] = useState<TipoResiduo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: tipoResiduos, isLoading, refetch } = useTipoResiduos();
  const actualizarMutation = useActualizarTipoResiduo();
  const eliminarMutation = useEliminarTipoResiduo();
  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (tipoResiduo: TipoResiduo) => {
    setSelectedTipoResiduo(tipoResiduo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (tipoResiduo: TipoResiduo) => {
    setSelectedTipoResiduo(tipoResiduo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmEdit = () => {
    if (selectedTipoResiduo && selectedTipoResiduo.id !== undefined) {
      if (!selectedTipoResiduo.nombre) {
        addToast({
          title: "Error",
          description: "El nombre es obligatorio",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      actualizarMutation.mutate(
        { id: selectedTipoResiduo.id as number, tipoResiduo: selectedTipoResiduo },
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
    if (selectedTipoResiduo && selectedTipoResiduo.id !== undefined) {
      eliminarMutation.mutate(selectedTipoResiduo.id as number, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (tipoResiduos ?? []).map((tipoResiduo) => ({
    id: tipoResiduo.id?.toString() || '',
    nombre: tipoResiduo.nombre,
    descripcion: tipoResiduo.descripcion || 'Sin descripción',
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(tipoResiduo)}
        >
          <EditIcon size={22} color='black'/>
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(tipoResiduo)}
        >
          <Trash2 size={22} color='red'/>
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Tipos de Residuos Registrados</h2>
      <div className="mb-2 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/cultivo/tiporesiduo')} // Corregido a la ruta correcta
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
        title="Editar Tipo de Residuo" // Corregido el título
        onConfirm={handleConfirmEdit}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={selectedTipoResiduo?.nombre || ''}
          onChange={(e) =>
            setSelectedTipoResiduo((prev) => ({
              ...prev!,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={selectedTipoResiduo?.descripcion || ''}
          onChange={(e) =>
            setSelectedTipoResiduo((prev) => ({
              ...prev!,
              descripcion: e.target.value,
            }))
          }
        />
      </ReuModal>
  
      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este tipo de residuo?"  
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaTipoResiduoPage;